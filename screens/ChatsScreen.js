import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, FlatList, Text, View, Dimensions, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { listenForMessages, markMessagesAsSeen } from "../services/ChatService";
import ChatItem from "../components/ChatItem";

const { width } = Dimensions.get("window");

const adminId = "M39g19sRQ5Qj6vpPtPHdjHOChjG2";

const ChatsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const listener = listenForMessages(adminId, (messages) => {
      const chatData = {
        id: adminId,
        name: "Admin Notifications",
        lastMessage: messages.length > 0 ? messages[0].text : "No messages yet",
        timestamp:
          messages.length > 0 && messages[0].timestamp
            ? new Date(messages[0].timestamp.seconds * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Just Now",
        avatar: require("../assets/images/Avatar_3.png"),
      };
      setChats([chatData]);
      setLoading(false);
    });

    return () => listener();
  }, [user]);

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" color="#DAA520" />;
  }

  const handleChatPress = async (chatId, userId) => {
    try {
      await markMessagesAsSeen(chatId, user.uid);
      navigation.navigate("ChatDetail", {
        chatId,
        userId,
      });
    } catch (err) {
      console.error("Error navigating to chat detail: ", err);
      setError("There was an issue navigating to chat detail. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <ChatItem
            name={item.name}
            lastMessage={item.lastMessage}
            timestamp={item.timestamp}
            avatar={item.avatar}
            onPress={() => handleChatPress(item.id, user.uid)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1F1F1F",
    width,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    backgroundColor: "#2C2C2C",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

export default ChatsScreen;
