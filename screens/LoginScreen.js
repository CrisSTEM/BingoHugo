import React, { useState, useEffect } from "react";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  ImageBackground,
  Dimensions,
  Easing,
} from "react-native";
import { FontAwesome, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

const { width } = Dimensions.get("window");

function LoginScreen({ toggleScreen, registrationSuccess }) {
  useEffect(() => {
    if (registrationSuccess) {
      Alert.alert("Registro Exitoso", "¡Tu cuenta ha sido creada con éxito!");
    }
  }, [registrationSuccess]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0);
  const { setIsAuthenticated } = useAuth();

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

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Los campos de correo electrónico y contraseña no pueden estar vacíos.");
      return;
    }
    signInWithEmailAndPassword(auth, email.trim(), password.trim())
      .then((userCredential) => {
        Alert.alert("Inicio de Sesión Exitoso", "¡Has iniciado sesión exitosamente!");
        setIsAuthenticated(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert("Error de Inicio de Sesión", errorMessage);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ImageBackground
        source={require("../assets/images/Fondo.webp")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <MaterialCommunityIcons name="numeric-8-circle-outline" size={60} color="#DAA520" />
            <Text style={styles.title}>¡Bienvenido a Hugo Bingo!</Text>
            <View style={styles.inputContainer}>
              <AntDesign name="user" size={24} color="#FFD700" style={styles.iconStyle} />
              <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#c7c7c7"
                keyboardType="email-address"
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.registerButton} onPress={toggleScreen}>
                <Text style={styles.buttonTextRegister}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
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
  buttonTextRegister: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
