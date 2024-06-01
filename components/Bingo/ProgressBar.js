import React from "react";
import { View } from "react-native";
import styles from "../../styles/styles";

const ProgressBar = ({ progress }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${progress}%` }]} />
  </View>
);

export default ProgressBar;
