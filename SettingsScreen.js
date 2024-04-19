import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { signOut, auth } from "./firebaseConfig";
import { useAuth } from "./AuthContext";

const { width } = Dimensions.get("window");

const SettingsOption = ({ title, iconName, iconType }) => {
  const Icon = iconType === "FontAwesome" ? FontAwesome : iconType === "AntDesign" ? AntDesign : MaterialCommunityIcons;

  return (
    <TouchableOpacity style={styles.option}>
      <Icon name={iconName} size={24} color="#DAA520" style={styles.optionIcon} />
      <Text style={styles.optionText}>{title}</Text>
      <AntDesign name="right" size={24} color="#c7c7c7" />
    </TouchableOpacity>
  );
};

const SettingsScreen = () => {
  const { setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.content}>
          <SettingsOption title="Música" iconName="music" iconType="FontAwesome" />
          <SettingsOption title="Notificaciones" iconName="bells" iconType="AntDesign" />
          <SettingsOption title="Cuenta" iconName="account" iconType="MaterialCommunityIcons" />
          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color="#DAA520" style={styles.optionIcon} />
            <Text style={styles.optionText}>Cerrar sesión</Text>
            <AntDesign name="right" size={24} color="#c7c7c7" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(20, 20, 20, 0.85)",
    width,
  },
  content: {
    flex: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DAA520",
    backgroundColor: "#000",
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    color: "#FFF",
  },
});

export default SettingsScreen;
