// AuthNavigator.js

import React, { useState } from "react";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const AuthNavigator = () => {
  const [showLogin, setShowLogin] = useState(true);

  const showLoginScreen = () => setShowLogin(true);
  const showRegisterScreen = () => setShowLogin(false);

  return (
    <>
      {showLogin ? (
        <LoginScreen toggleScreen={showRegisterScreen} />
      ) : (
        <RegisterScreen toggleScreen={showLoginScreen} />
      )}
    </>
  );
};

export default AuthNavigator;
