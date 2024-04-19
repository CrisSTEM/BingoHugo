import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  ImageBackground,
  Dimensions,
  Easing,
} from "react-native";
import { FontAwesome, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, createUserWithEmailAndPassword } from "./firebaseConfig";

const { width } = Dimensions.get("window");

function RegisterScreen({ toggleScreen }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.elastic(2),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = () => {
    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    createUserWithEmailAndPassword(auth, email.trim(), password.trim())
      .then((userCredential) => {
        console.log("Usuario registrado:", userCredential.user);
        // Aquí podrías redirigir al usuario o actualizar el estado de la UI
      })
      .catch((error) => {
        console.error("Error al registrar usuario:", error);
        Alert.alert("Error al registrar usuario", error.message);
      });
  };

  return (
    <ImageBackground source={require("./assets/images/Fondo.webp")} style={styles.backgroundImage} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <MaterialCommunityIcons name="account-plus-outline" size={50} color="#DAA520" />
          <Text style={styles.title}>Registrate en Hugo Bingo!</Text>
          <View style={styles.inputContainer}>
            <AntDesign name="user" size={20} color="#FFD700" style={styles.iconStyle} />
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Username"
              placeholderTextColor="#c7c7c7"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={20} color="#FFD700" style={styles.iconStyle} />
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#c7c7c7"
            />
          </View>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#FFD700" style={styles.iconStyle} />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#c7c7c7"
            />
          </View>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#FFD700" style={styles.iconStyle} />
            <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              placeholder="Confirm Password"
              secureTextEntry
              placeholderTextColor="#c7c7c7"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={toggleScreen}>
              <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width,
    height: "100%",
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    padding: 20,
    alignItems: "center",
    backgroundColor: "rgba(20, 20, 20, 0.85)",
    borderRadius: 10,
    elevation: 10,
    shadowColor: "#DAA520",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#DAA520",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#DAA520",
    borderRadius: 10,
    backgroundColor: "#000",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  iconStyle: {
    marginRight: 10,
    width: 30,
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    color: "#FFF",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  loginButton: {
    paddingVertical: 12,
    flex: 1,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#800000",
    alignItems: "center",
  },
  registerButton: {
    paddingVertical: 12,
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#DAA520",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
