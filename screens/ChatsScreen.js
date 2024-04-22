import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Dimensions } from "react-native";
import { useAuth } from "../contexts/AuthContext";

const { width } = Dimensions.get("window");

const adminId = "403JDsD1jsY2zJogoREPI3xpoMc2";
// Componente para cada item del chat
const ChatItem = ({ name, lastMessage, timestamp, avatar, seen, unreadCount, navigation, id, userId }) => (
  <TouchableOpacity
    style={styles.chatItem}
    onPress={() =>
      navigation.navigate("ChatDetail", {
        chatId: id,
        userId,
      })
    }
  >
    <Image source={avatar} style={styles.avatar} />
    <View style={styles.chatInfo}>
      <Text style={[styles.chatName, unreadCount > 0 && styles.chatNameActive]}>{name}</Text>
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
      {seen && !unreadCount && <Image source={require("../assets/images/check.png")} style={styles.seenIcon} />}
    </View>
  </TouchableOpacity>
);

// Pantalla principal de chats
const ChatsScreen = ({ navigation }) => {
  const { user } = useAuth();

  if (!user) {
    return <Text>Cargando usuario o no autenticado...</Text>;
  }

  const chatWithAdmin = {
    id: adminId,
    name: "Admin Notifications",
    lastMessage: "Notificaciones de la plataforma",
    timestamp: "Just Now",
    avatar: require("../assets/images/Avatar_3.png"),
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={[chatWithAdmin]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate("ChatDetail", {
                chatId: item.id,
                userId: user.uid,
              })
            }
          >
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

// Estilos
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: "#DAA520",
    borderBottomWidth: 1,
    backgroundColor: "#000",
    borderRadius: 8,
    marginVertical: 4,
    elevation: 3,
    shadowColor: "#DAA520",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
    marginRight: 10,
  },
  chatName: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#FFF",
  },
  lastMessage: {
    fontSize: 15,
    color: "#c7c7c7",
    marginTop: 3,
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
