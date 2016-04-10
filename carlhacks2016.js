var messages = new Mongo.Collection("messages");
var twilioRawIn = new Mongo.Collection("twilio");

Router.route('/', {
  template: 'home'
});


if (Meteor.isClient) {
  Session.setDefault("viewing","+14157696292");
  // counter starts at 0

  // Template.hello.helpers({
  //   counter: function () {
  //     return Session.get('counter');
  //   }
  // });

  // Template.hello.events({
  //   'click button': function () {
  //     // increment the counter when button is clicked
  //     Session.set('counter', Session.get('counter') + 1);
  //   }
  // });

  Template.home.events({
    'input submit': function(){
      Meteor.call("sendMessage", 'testnumber','abc');
    },
    '.contact click': function(e) {
      Session.set('viewing', this.from);
    }
  });

  Template.home.helpers({
    'messageList': function() {
      var unique = _.uniq(messages.find({}, {
          sort: {ts: -1}, fields: {from: true}
      }).fetch().map(function(x) {
          return x.from;
      }), true);
      console.log(unique);
      return unique;
    },
    'messages': function(){
      var msgs = messages.find({
        from: Session.get("viewing"),
        to: Meteor.user().profile.number
      });
      console.log(msgs);
      return msgs;
    },
    'fromme': function(number){
      return number == Meteor.user().profile.number;
    }
  });

}

if (Meteor.isServer) {
  var twilio = Twilio("AC1c3377000a5ea017e093307f6cf3ff9a", "be8a76e896f0606e071f11e723ee45e5");
  Router.configure({
      // options go here
  });
  Meteor.startup(function () {
    Meteor.methods({

            sendMessage: function(usernumber, tonumber, text) {
              twilio.sendSms({
                to:tonumber, // Any number Twilio can deliver to
                from: usernumber, // A number you bought from Twilio and can use for outbound communication
                body: text // body of the SMS message
              }, function(err, responseData) { //this function is executed when a response is received from Twilio
                if (!err) { // "err" is an error received during the request, if any
                  // "responseData" is a JavaScript object containing data received from Twilio.
                  // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                  // http://www.twilio.com/docs/api/rest/sending-sms#example-1
                  console.log(responseData.from); // outputs "+14506667788"
                  console.log(responseData.body); // outputs "word to your mother."
                }
              });
            },
        });
  });

  Router.route('/api/twiml/sms', {where: 'server'}).post(function() {
      var rawIn = this.request.body;
      if (Object.prototype.toString.call(rawIn) == "[object Object]") {
          twilioRawIn.insert(rawIn);
      }

      var messageText = rawIn.Body;
      var toIn = rawIn.To;
      var fromIn = rawIn.From;

      messages.insert({
        'to': toIn,
        'from': fromIn,
        'text': messageText
      });

      // var xml = '<Response><Sms>Thank you for submitting your question!</Sms></Response>';
      var xml = '<Response></Response>';
      return [200];
  });
}

