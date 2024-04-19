import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./AuthContext";
import AuthNavigator from "./AuthNavigator";
import Navigation from "./Navigation";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigation /> : <AuthNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
