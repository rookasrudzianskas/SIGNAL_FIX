const aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
  // event event.request.userAttributes.sub
  // insert code to be executed by your lambda trigger
  //save a new user into DynamoDB

  callback(null, event);
};
