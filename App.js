import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthNavigator from "./navigation/AuthNavigator";
import Navigation from "./navigation/Navigation";

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
