/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Alexa = require('alexa-sdk');
const request = require('request');

const APP_ID = 'amzn1.ask.skill.253295b7-33d8-413b-abbe-2c8e3795d972';

const REASON_URL = `https://s3.ap-south-1.amazonaws.com/idontlikework/wfh-reasons.json`;

const SKILL_NAME = 'I Dont Like Work';
const HELP_MESSAGE = 'Ask me for a reason to work from home';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Have a great day!';

const handlers = {
  LaunchRequest: function() {
    this.emit('GetNewReasonIntent');
  },
  LaunchIntent: function() {
    this.emit('GetNewReasonIntent');
  },
  GetNewReasonIntent: function() {
    request(REASON_URL, (err, response, body) => {
      const reasons = JSON.parse(body);

      const reasonCount = reasons.length;
      const randomReasonIndex = Math.floor(Math.random() * reasonCount);

      const reason = reasons[randomReasonIndex].text;

      const responseText = `Here is your reason: ${reason}`;
      this.response.cardRenderer(SKILL_NAME, responseText);
      this.response.speak(responseText);
      this.emit(':responseReady');
    });
  },
  AnotherReason: function() {
    this.emit('GetNewReasonIntent');
  },
  'AMAZON.HelpIntent': function() {
    const speechOutput = HELP_MESSAGE;
    const reprompt = HELP_REPROMPT;

    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },
};

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
