import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const chats = [
  {
    id: "1",
    name: "Jane Roe",
    lastMessage: "Can you send the files?",
    seen: true,
    unreadCount: 0,
    timestamp: "9:40 AM",
    avatar: require("./assets/images/avatar.png"),
  },
  {
    id: "2",
    name: "John Smith",
    lastMessage: "Sure, let's do that!",
    seen: false,
    unreadCount: 1,
    timestamp: "Yesterday",
    avatar: require("./assets/images/avatar_2.webp"),
  },
  {
    id: "3",
    name: "Alex Johnson",
    lastMessage: "I'll call you later.",
    seen: false,
    unreadCount: 2,
    timestamp: "Sunday",
    avatar: require("./assets/images/Avatar_3.png"),
  },
];

const ChatItem = ({ name, lastMessage, timestamp, avatar, seen, unreadCount }) => (
  <TouchableOpacity style={styles.chatItem} onPress={() => console.log("Chat presionado")}>
    <Image source={avatar} style={styles.avatar} />
    <View style={styles.chatInfo}>
      <Text style={[styles.chatName, unreadCount > 0 ? styles.chatNameActive : null]}>{name}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>
        {lastMessage}
      </Text>
    </View>
    <View style={styles.rightSection}>
      <Text style={styles.timestamp}>{timestamp}</Text>
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCountText}>{unreadCount}</Text>
        </View>
      )}
      {seen && !unreadCount && <Image source={require("./assets/images/check.png")} style={styles.seenIcon} />}
    </View>
  </TouchableOpacity>
);

const ChatsScreen = () => {
  const renderItem = ({ item }) => <ChatItem {...item} />;
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList data={chats} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(20, 20, 20, 0.85)",
    width,
  },
  chatNameActive: {
    color: "#DAA520",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: "#DAA520",
    borderBottomWidth: 1,
    backgroundColor: "#000",
    borderRadius: 12,
    marginVertical: 5,
    elevation: 2,
    shadowColor: "#DAA520",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
    marginRight: 10,
  },
  chatName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FFF",
  },
  lastMessage: {
    fontSize: 14,
    color: "#c7c7c7",
    marginTop: 4,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  timestamp: {
    fontSize: 12,
    color: "#b0b0b0",
  },
  unreadBadge: {
    marginTop: 4,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadCountText: {
    color: "#fff",
    fontSize: 12,
  },
  seenIcon: {
    width: 20,
    height: 20,
    marginTop: 4,
  },
});

export default ChatsScreen;
