import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Dimensions, Modal, Alert } from "react-native";
import { format } from "date-fns";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut, auth } from "../config/firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import MusicPlayer from "../components/MusicPlayer";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, firestore } from "../config/firebaseConfig";
import { updateProfile, onAuthStateChanged } from "firebase/auth";
import defaultAvatar from "../assets/images/avatar.png";

import SettingsOption from "../components/SettingsOption";
import ModalView from "../components/ModalView";

const { width } = Dimensions.get("window");

const SettingsScreen = () => {
  const { setIsAuthenticated } = useAuth();
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({
            uid: user.uid,
            displayName: userData.username,
            email: user.email,
            photoURL: user.photoURL,
            creationTime: format(new Date(user.metadata.creationTime), "PPP"),
          });
          setImage(user.photoURL ? { uri: user.photoURL } : defaultAvatar);
        } else {
          console.log("No such document!");
        }
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
      Alert.alert("Error", "No se pudo cerrar sesión. Inténtalo de nuevo.");
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

  const updateUsername = async (newUsername) => {
    const userRef = doc(firestore, "users", currentUser.uid);
    try {
      await updateDoc(userRef, { username: newUsername });
      setCurrentUser({ ...currentUser, displayName: newUsername });
    } catch (error) {
      console.error("Error updating username: ", error);
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
            <ModalView
              toggle={toggleAccountModal}
              currentUser={currentUser}
              pickImage={pickImage}
              updateUsername={updateUsername}
            />
          </Modal>
          <SettingsOption
            title="Cerrar sesión"
            iconName="logout"
            iconType="MaterialCommunityIcons"
            onPress={handleLogout}
          />
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
});

export default SettingsScreen;
