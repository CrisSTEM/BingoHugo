import React from "react";
import { View } from "react-native";
import BingoBall from "./BingoBall";
import styles from "../../styles/styles";

const NumberRows = ({ numbers, color, toggleNumber, activeNumbers, isAdmin }) => (
  <View style={styles.numberRow}>
    {numbers.map((number) => (
      <BingoBall
        key={number}
        number={number}
        color={color}
        isActive={activeNumbers.has(number)}
        onPress={toggleNumber}
        size={30}
        isAdmin={isAdmin}
      />
    ))}
  </View>
);

export default NumberRows;
