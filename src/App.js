import React, { useEffect, useState } from "react";
import "./index.css";

import "./App.css";

import Amplify, { Auth } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

import config from "./aws-exports";
Amplify.configure(config);

function App() {
  const [user, updateUser] = useState(null);

  // check for authenticated user on app mount. If user, set state
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => updateUser(user))
      .catch((err) => console.log(err));
  }, []);

  let isAdmin = false;

  if (user) {
    // get token payload from
    const {
      signInUserSession: {
        idToken: { payload },
      },
    } = user;
    // inspect payload to see if user is part of admin group
    console.log("payload: ", payload);
    if (
      payload["cognito:group"] &&
      payload["cognito:group"].includes("Admin")
    ) {
      isAdmin = true;
    }
  }

  return (
    <div className="App">
      <header>
        <h1>Hello World</h1>
        {isAdmin && <p>Welcome, Admin</p>}
      </header>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
