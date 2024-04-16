import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import RegisterScreen from "./RegisterScreen";
import LoginScreen from "./LoginScreen";
import HomeScreen from "./HomeScreen";
export default function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <View style={styles.container}>
      {showLogin ? (
        <LoginScreen toggleScreen={() => setShowLogin(false)} />
      ) : (
        <RegisterScreen toggleScreen={() => setShowLogin(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
