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
            Home: "home",
            Messages: "message",
            Account: "account",
          };
          return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#DAA520",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
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
export default Navigation;
