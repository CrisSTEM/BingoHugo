import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { signOut, auth } from "../config/firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import MusicPlayer from "../components/MusicPlayer";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseConfig";
import { updateProfile } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import defaultAvatar from "./assets/images/avatar.png";
const { width, height } = Dimensions.get("window");

const SettingsOption = ({ title, iconName, iconType, onPress }) => {
  const Icon = iconType === "FontAwesome" ? FontAwesome : iconType === "AntDesign" ? AntDesign : MaterialCommunityIcons;
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <Icon name={iconName} size={24} color="#DAA520" style={styles.optionIcon} />
      <Text style={styles.optionText}>{title}</Text>
      <AntDesign name="right" size={24} color="#c7c7c7" />
    </TouchableOpacity>
  );
};

const ModalView = ({ toggle, currentUser, pickImage }) => {
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
          <Text style={styles.userInfoText}>
            <FontAwesome name="user" size={16} /> Nombre: {currentUser.displayName}
          </Text>
          <Text style={styles.userInfoText}>
            <MaterialCommunityIcons name="email" size={16} /> Correo: {currentUser.email}
          </Text>
          <Text style={styles.userInfoText}>
            <MaterialCommunityIcons name="calendar-clock" size={16} /> Fecha de Creación: {currentUser.creationTime}
          </Text>
        </View>

        <TouchableOpacity style={styles.buttonClose} onPress={toggle}>
          <Text style={styles.textStyle}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SettingsScreen = () => {
  const { setIsAuthenticated } = useAuth();
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          creationTime: user.metadata.creationTime,
        });
        setImage(user.photoURL ? { uri: user.photoURL } : defaultAvatar);
      } else {
        setCurrentUser(null);
        setImage(defaultAvatar);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleAccountModal = () => {
    setShowAccountModal(!showAccountModal);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access the gallery is required.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (pickerResult.cancelled) {
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      const uri = pickerResult.assets[0].uri;
      handleUpload(uri);
    }
  };

  const handleUpload = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileRef = ref(storage, `userprofile/${currentUser.uid}`);
      await uploadBytes(fileRef, blob);
      const photoURL = await getDownloadURL(fileRef);

      updateProfile(auth.currentUser, { photoURL }).then(() => {
        setCurrentUser({ ...currentUser, photoURL });
        setImage({ uri: photoURL });
      });
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Failed to upload image. Please verify your connection and URL format.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.content}>
          <SettingsOption
            title="Música"
            iconName="music"
            iconType="FontAwesome"
            onPress={() => setShowMusicPlayer(!showMusicPlayer)}
          />
          {showMusicPlayer && <MusicPlayer />}
          <SettingsOption
            title="Cuenta"
            iconName="account"
            iconType="MaterialCommunityIcons"
            onPress={toggleAccountModal}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={showAccountModal}
            onRequestClose={toggleAccountModal}
          >
            <ModalView toggle={toggleAccountModal} currentUser={currentUser} pickImage={pickImage} />
          </Modal>
          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color="#DAA520" style={styles.optionIcon} />
            <Text style={styles.optionText}>Cerrar sesión</Text>
            <AntDesign name="right" size={24} color="#c7c7c7" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(20, 20, 20, 0.85)",
    width,
  },
  content: {
    flex: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DAA520",
    backgroundColor: "#000",
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    color: "#FFF",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
    color: "#2196F3",
    fontSize: 16,
    marginTop: 10,
  },
  userInfo: {
    width: "100%",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  userInfoText: {
    fontSize: 18,
    marginVertical: 5,
    marginLeft: 10,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
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

export default SettingsScreen;