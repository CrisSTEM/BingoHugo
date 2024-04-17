import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "./HomeScreen";
import MessageScreen from "./MessageScreen";
import SettingsScreen from "./SettingsScreen";

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000",
    borderTopColor: "#e0e0e0",
    borderTopWidth: 1,
    shadowOffset: { height: -2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 50,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  headerStyle: {
    backgroundColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#DAA520",
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Home: "home",
              Messages: "message",
              Account: "account",
            };
            return (
              <MaterialCommunityIcons
                name={icons[route.name]}
                size={size}
                color={color}
              />
            );
          },
          tabBarStyle: styles.tabBar, // Use tabBarStyle here
          tabBarActiveTintColor: "#DAA520",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: {
            fontWeight: "bold",
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Messages" component={MessageScreen} />
        <Tab.Screen name="Account" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
