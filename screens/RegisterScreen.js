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
import { auth, createUserWithEmailAndPassword, firestore } from "../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const { width } = Dimensions.get("window");

function RegisterScreen({ onRegistrationSuccess, toggleScreen }) {
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
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    createUserWithEmailAndPassword(auth, email.trim(), password.trim())
      .then((userCredential) => {
        const userRef = doc(firestore, "users", userCredential.user.uid);
        setDoc(userRef, {
          username: username,
          email: userCredential.user.email,
        })
          .then(() => {
            console.log("Usuario registrado en Firestore con éxito");
            onRegistrationSuccess();
          })
          .catch((error) => {
            console.error("Error al registrar usuario en Firestore:", error);
          });
      })
      .catch((error) => {
        console.error("Error al registrar usuario:", error);
        Alert.alert("Registro Fallido", error.message);
      });
  };

  return (
    <ImageBackground source={require("../assets/images/Fondo.webp")} style={styles.backgroundImage} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <MaterialCommunityIcons name="account-plus-outline" size={50} color="#DAA520" />
          <Text style={styles.title}>Registrate en Hugo Bingo!</Text>
          <View style={styles.inputContainer}>
            <AntDesign name="user" size={24} color="#FFD700" style={styles.iconStyle} />
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Nombre de Usuario"
              placeholderTextColor="#c7c7c7"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={24} color="#FFD700" style={styles.iconStyle} />
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Correo Electrónico"
              keyboardType="email-address"
              placeholderTextColor="#c7c7c7"
            />
          </View>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={24} color="#FFD700" style={styles.iconStyle} />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Contraseña"
              secureTextEntry
              placeholderTextColor="#c7c7c7"
            />
          </View>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={24} color="#FFD700" style={styles.iconStyle} />
            <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              placeholder="Confirmar Contraseña"
              secureTextEntry
              placeholderTextColor="#c7c7c7"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={toggleScreen}>
              <Text style={styles.buttonText}>Volver al inicio de sesión</Text>
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
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#DAA520",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#DAA520",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#DAA520",
    borderRadius: 10,
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: "100%",
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
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  loginButton: {
    paddingVertical: 15,
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#800000",
    alignItems: "center",
    elevation: 5,
    marginRight: 10,
  },
  registerButton: {
    paddingVertical: 15,
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#DAA520",
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextLogin: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
