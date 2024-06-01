import React from "react";
import { View } from "react-native";
import BingoCell from "./BingoCell";
import styles from "../../styles/styles";

const BingoCard = ({ numbers, activeNumbers, style }) => (
  <View style={[styles.bingoCardContainer, style]}>
    {numbers.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.bingoRow}>
        {row.map((number, cellIndex) => (
          <BingoCell
            key={cellIndex}
            number={number}
            isActive={activeNumbers.has(number)}
            style={{ backgroundColor: style.backgroundColor }}
          />
        ))}
      </View>
    ))}
  </View>
);

export default BingoCard;
