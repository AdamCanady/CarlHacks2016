var messages = new Mongo.Collection("messages");


if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.messages.events({
    'input submit': function(){
      Meteor.call("sendMessage", 'testnumber','abc');
    }
  });
}

var twilio = Twilio("AC353b28678df395e68b4e48c9fbf374f3", "cecdb6b1b9fc2e953347a4e53609fb62");


if (Meteor.isServer) {
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

            foo: function () {
                return 1;
            },

            bar: function () {

            // QUESTION: HOW TO CALL Meteor.methods.foo
            return 1 + foo;        

            }
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
      return [200, {"Content-Type": "text/xml"}, xml];
  });
}

