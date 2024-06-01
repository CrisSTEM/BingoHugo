import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import defaultAvatar from "../assets/images/avatar.png";

const ModalView = ({ toggle, currentUser, pickImage, updateUsername }) => {
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser?.displayName || "");

  if (!currentUser) {
    return (
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          <Image
            source={currentUser.photoURL ? { uri: currentUser.photoURL } : defaultAvatar}
            style={styles.profilePic}
          />
          <Text style={styles.changePhotoText}>Cambiar Foto</Text>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          {editing ? (
            <TextInput
              style={styles.input}
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Introduce tu nuevo nombre"
            />
          ) : (
            <Text style={styles.userInfoText}>
              <FontAwesome name="user" size={16} /> Nombre: {currentUser.displayName}
            </Text>
          )}
          <Text style={styles.userInfoText}>
            <MaterialCommunityIcons name="email" size={16} /> Correo: {currentUser.email}
          </Text>
          <Text style={styles.userInfoText}>
            <MaterialCommunityIcons name="calendar-clock" size={16} /> Fecha de Creación: {currentUser.creationTime}
          </Text>
          {editing ? (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                updateUsername(newUsername);
                setEditing(false);
              }}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.buttonClose} onPress={toggle}>
          <Text style={styles.textStyle}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#1F1F1F",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
  },
  avatarWrapper: {
    marginBottom: 20,
    alignItems: "center",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePhotoText: {
    color: "#DAA520",
    fontSize: 16,
    marginTop: 10,
  },
  userInfo: {
    width: "100%",
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 18,
    marginVertical: 5,
    color: "#DDD",
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#333",
    color: "#FFF",
    padding: 8,
    margin: 10,
    width: 240,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: "#5CB85C",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#F0AD4E",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonClose: {
    backgroundColor: "#DAA520",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ModalView;
