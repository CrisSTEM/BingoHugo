import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/styles";

const BingoCell = ({ number, isActive, style }) => (
  <View style={[styles.bingoCell, style, { backgroundColor: isActive ? "#ffcc00" : "rgba(255,255,255,0.9)" }]}>
    <Text style={styles.bingoCellText}>{number}</Text>
  </View>
);

export default BingoCell;
