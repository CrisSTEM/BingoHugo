import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatDetailScreen from "../screens/ChatDetailScreen";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();
const ChatStack = createStackNavigator();

function ChatStackScreen() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="ChatList" component={ChatScreen} options={{ headerShown: false }} />
      <ChatStack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ headerShown: false }} />
    </ChatStack.Navigator>
  );
}

function Navigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerTitleAlign: "center",
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home-circle",
            Messages: "message",
            Account: "account-circle",
          };
          return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#DAA520",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Messages" component={ChatStackScreen} />
      <Tab.Screen name="Account" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000",
    borderTopColor: "#000",
    borderTopWidth: 1,
    height: 60,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  tabBarLabel: {
    fontWeight: "600",
    fontSize: 12,
  },
  headerStyle: {
    backgroundColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#DAA520",
  },
});

export default Navigation;
