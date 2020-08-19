/* eslint-disable-line */ const aws = require("aws-sdk");

// Trigger: Cognito sign-up event
// Function: assign new user to permissions group based on email. If email is in adminEmail list, then add to admin group, otherwise
exports.handler = async (event, context, callback) => {
  const cognitoProvider = new aws.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18",
  });

  // default to non-admin
  let isAdmin = false;
  const adminEmails = ["noxidwebdev@gmail.com"];

  // If user is in adminEmails set isAdmin to true
  if (adminEmails.indexOf(event.request.userAttributes.email) !== -1) {
    isAdmin = true;
  }

  // get user pool id from cognito sign up event
  const groupParams = {
    UserPoolId: event.userPoolId,
  };

  const userParams = {
    UserPoolId: event.userPoolId,
    Username: event.userName,
  };

  if (isAdmin) {
    groupParams.GroupName = "Admin";
    userParams.GroupName = "Admin";
    // check to see if group exists, if not create the group
    try {
      await cognitoProvider.getGroup(groupParams).promise();
    } catch (e) {
      await cognitoProvider.createGroup(groupParams).promise();
    }

    // if user is admin, add to admin group
    try {
      await cognitoProvider.adminAddUserToGroup(userParams).promise();
      callback(null, event);
    } catch (error) {
      callback(error);
    }
  } else {
    callback(null, event);
  }
};

// Docs
// This lambda is triggered whenever someone successfully signs up to
