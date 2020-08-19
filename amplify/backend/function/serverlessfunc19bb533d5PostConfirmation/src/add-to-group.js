/* eslint-disable-line */ const aws = require("aws-sdk");

// Trigger: Cognito sign-up event
// Description: If email of new user signing-up is in admin array, then add to admin user group, otherwise do nothing.
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
    // check to see if admin group exists, if not create the group
    try {
      await cognitoProvider.getGroup(groupParams).promise(); // oh, such nice clean code. I love it
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
