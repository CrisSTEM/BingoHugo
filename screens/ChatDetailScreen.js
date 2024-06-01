import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { sendMessage, listenForMessages } from "../services/ChatService";
import { format } from "date-fns";

const ChatDetailScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { chatId, userId } = route.params;

  const adminId = "M39g19sRQ5Qj6vpPtPHdjHOChjG2";
  const isUserAdmin = userId === adminId;

  useEffect(() => {
    const unsubscribe = listenForMessages(chatId, (newMessages) =>
      setMessages(
        newMessages.map((msg) => ({
          ...msg,
          readableDate: msg.timestamp ? format(msg.timestamp.toDate(), "PPpp") : "Fecha no disponible",
        }))
      )
    );
    return () => unsubscribe();
  }, [chatId]);

  const handleSend = () => {
    if (text.trim().length > 0 && isUserAdmin) {
      sendMessage(chatId, userId, text.trim(), adminId);
      setText("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Message text={item.text} isOwnMessage={item.userId === userId} timestamp={item.readableDate} />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />
      {isUserAdmin && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const Message = ({ text, isOwnMessage, timestamp }) => (
  <View style={[styles.message, isOwnMessage ? styles.ownMessage : styles.receivedMessage]}>
    <Text style={styles.messageText}>{text}</Text>
    <Text style={styles.timestamp}>{timestamp}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  flatListContent: {
    padding: 10,
  },
  message: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    maxWidth: "80%",
  },
  ownMessage: {
    backgroundColor: "#3A3A3A",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#2A2A2A",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#FFF",
  },
  timestamp: {
    fontSize: 12,
    color: "#CCC",
    textAlign: "right",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#444",
    backgroundColor: "#2A2A2A",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    color: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#DAA520",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: "#1E1E1E",
    fontSize: 16,
  },
});

export default ChatDetailScreen;
