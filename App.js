import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./LoginScreen";
import Navigation from "./Navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return <NavigationContainer>{isAuthenticated ? <Navigation /> : <LoginScreen />}</NavigationContainer>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
