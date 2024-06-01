import { Audio } from "expo-av";
import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const MusicPlayer = () => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../assets/audios/BG.mp3"));
    setSound(sound);
  };

  useEffect(() => {
    loadSound();

    return sound ? () => sound.unloadAsync() : undefined;
  }, []);

  const playPause = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const stop = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.musicControls}>
      <TouchableOpacity onPress={playPause} style={styles.button}>
        <FontAwesome5 name={isPlaying ? "pause-circle" : "play-circle"} size={50} color="#DAA520" />
      </TouchableOpacity>
      <TouchableOpacity onPress={stop} style={styles.button}>
        <FontAwesome name="stop-circle" size={50} color="#DAA520" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  musicControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 10,
    marginVertical: 10,
  },
  button: {
    padding: 10,
  },
});

export default MusicPlayer;
