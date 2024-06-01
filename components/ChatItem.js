import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const ChatItem = React.memo(({ name, lastMessage, timestamp, avatar, onPress }) => (
  <TouchableOpacity style={styles.chatItem} onPress={onPress}>
    <Image source={avatar} style={styles.avatar} />
    <View style={styles.chatInfo}>
      <Text style={styles.chatName}>{name}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>
        {lastMessage}
      </Text>
    </View>
    <Text style={styles.timestamp}>{timestamp}</Text>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomColor: "#4A4A4A",
    borderBottomWidth: 1,
    backgroundColor: "#333333",
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FFF",
  },
  lastMessage: {
    fontSize: 15,
    color: "#CCC",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#AAA",
    marginLeft: "auto",
  },
});

export default ChatItem;
