import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { sendMessage, listenForMessages } from "../services/ChatService";
import { format, parseISO } from "date-fns";

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
          readableDate: msg.timestamp
            ? format(parseISO(msg.timestamp.toDate().toISOString()), "PPPppp")
            : "Fecha no disponible",
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
      />
      {isUserAdmin && (
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Escribe un mensaje..." value={text} onChangeText={setText} />
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
    backgroundColor: "#F0F0F0",
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  ownMessage: {
    backgroundColor: "#DCF8C6",
    marginLeft: "auto",
  },
  receivedMessage: {
    backgroundColor: "#FFFFFF",
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#007BFF",
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#FFFFFF",
  },
});

export default ChatDetailScreen;
