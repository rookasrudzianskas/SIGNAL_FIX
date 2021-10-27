const aws = require('aws-sdk');
const ddb = new aws.DynamoDB();

exports.handler = (event, context, callback) => {
  // event event.request.userAttributes.sub
  // insert code to be executed by your lambda trigger

  if(!event?.request?.userAttributes?.sub) {
    console.log("No sub provided");
    return;
  }

  //save a new user into DynamoDB

  callback(null, event);
};
