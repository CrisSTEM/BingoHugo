// AuthNavigator.js

import React, { useState } from "react";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const AuthNavigator = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const showLoginScreen = () => {
    setShowLogin(true);
    setRegistrationSuccess(false);
  };

  const showRegisterScreen = () => {
    setShowLogin(false);
    setRegistrationSuccess(false);
  };

  const handleSuccess = () => {
    setRegistrationSuccess(true);
    setShowLogin(true);
  };

  return (
    <>
      {showLogin ? (
        <LoginScreen toggleScreen={showRegisterScreen} registrationSuccess={registrationSuccess} />
      ) : (
        <RegisterScreen toggleScreen={showLoginScreen} onRegistrationSuccess={handleSuccess} />
      )}
    </>
  );
};

export default AuthNavigator;
