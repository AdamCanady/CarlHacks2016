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
}

twilio = Twilio("AC353b28678df395e68b4e48c9fbf374f3", "cecdb6b1b9fc2e953347a4e53609fb62");


if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({

            sendMessage: function(text,number) {
              twilio.sendSms({
                to:'+16515556677', // Any number Twilio can deliver to
                from: '+14506667788', // A number you bought from Twilio and can use for outbound communication
                body: 'word to your mother.' // body of the SMS message
              }, function(err, responseData) { //this function is executed when a response is received from Twilio
                if (!err) { // "err" is an error received during the request, if any
                  // "responseData" is a JavaScript object containing data received from Twilio.
                  // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                  // http://www.twilio.com/docs/api/rest/sending-sms#example-1
                  console.log(responseData.from); // outputs "+14506667788"
                  console.log(responseData.body); // outputs "word to your mother."
                }
              });
            }

            foo: function () {
                return 1;
            },

            bar: function () {

            // QUESTION: HOW TO CALL Meteor.methods.foo
            return 1 + foo;        

            }
        });
  });
}
