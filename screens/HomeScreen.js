import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput, Animated, FlatList } from "react-native";
import { auth } from "../config/firebaseConfig";
import BingoBall from "../components/Bingo/BingoBall";
import BingoCard from "../components/Bingo/BingoCard";
import NumberRows from "../components/Bingo/NumberRows";
import ProgressBar from "../components/Bingo/ProgressBar";
import ModalRules from "../components/Bingo/ModalRules";
import { adminId, lineColors, numbers } from "../helpers/constants";
import { randomColor } from "../helpers/utilities";
import styles from "../styles/styles";

const HomeScreen = () => {
  const [activeNumbers, setActiveNumbers] = useState(new Set());
  const [currentNumber, setCurrentNumber] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bingoCards, setBingoCards] = useState([]);
  const [winningStatus, setWinningStatus] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rules, setRules] = useState({ lines: 1, bingos: 1 });
  const [progress, setProgress] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    setIsAdmin(auth.currentUser?.uid === adminId);
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    bingoCards.forEach((cardInfo) => {
      let lineCount = 0;
      const isBingo = cardInfo.numbers
        .flat()
        .filter((val) => val !== null)
        .every((cell) => activeNumbers.has(cell));
      if (isBingo) setWinningStatus(`Pepito ha hecho BINGO!`);

      cardInfo.numbers.forEach((row) => {
        if (row.every((cell) => activeNumbers.has(cell) || cell === null)) lineCount++;
      });
      if (lineCount > 0) setWinningStatus(`Pepito ha hecho ${lineCount} líneas!`);
    });
  }, [activeNumbers, bingoCards]);

  const toggleNumber = (number) => {
    const newActiveNumbers = new Set(activeNumbers);
    newActiveNumbers.has(number) ? newActiveNumbers.delete(number) : newActiveNumbers.add(number);
    setActiveNumbers(newActiveNumbers);
    setCurrentNumber(number);
  };

  const generateBingoNumbers = () => {
    const cardNumbers = Array.from({ length: 3 }, () => Array(9).fill(null));
    const colNumbers = Array.from({ length: 9 }, (_, i) => Array.from({ length: 10 }, (__, k) => i * 10 + k + 1));

    colNumbers.forEach((numbers, colIndex) => {
      numbers.sort(() => Math.random() - 0.5);
      const selectedNumbers = numbers.slice(0, 3).sort((a, b) => a - b);
      const filledPositions = Array(3)
        .fill()
        .map(() => Math.floor(Math.random() * 3));
      filledPositions.forEach((position, index) => {
        cardNumbers[position][colIndex] = selectedNumbers[index];
      });
    });

    const positionsToClear = Array(12)
      .fill()
      .map(() => Math.floor(Math.random() * 27));
    positionsToClear.forEach((pos) => {
      cardNumbers[Math.floor(pos / 9)][pos % 9] = null;
    });

    const backgroundColor = randomColor();

    return { numbers: cardNumbers, style: { backgroundColor } };
  };

  const generateBingoCards = (quantity) => setBingoCards(Array.from({ length: quantity }, generateBingoNumbers));

  const handleQuantityChange = (type) => setQuantity((prev) => (type === "+" ? prev + 1 : Math.max(prev - 1, 1)));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollableContent}>
        <View style={styles.currentAndPastContainer}>
          <BingoBall number={currentNumber || "-"} color="#ffb74d" isActive={true} onPress={() => {}} size={60} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pastNumbersContainer}
          >
            {Array.from(activeNumbers).map((number) => (
              <BingoBall key={number} number={number} color="#ccc" isActive={true} onPress={() => {}} size={30} />
            ))}
          </ScrollView>
          {isAdmin && (
            <TouchableOpacity style={styles.openButton} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.openButtonText}>Establecer Reglas</Text>
            </TouchableOpacity>
          )}
        </View>

        <ModalRules
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          rules={rules}
          setRules={setRules}
          progress={progress}
          setProgress={setProgress}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horizontalContainer}>
            {Array.from({ length: 7 }, (_, index) => (
              <NumberRows
                key={index}
                numbers={numbers.slice(index * 13, (index + 1) * 13)}
                color={lineColors[index]}
                toggleNumber={toggleNumber}
                activeNumbers={activeNumbers}
                isAdmin={isAdmin}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomSection}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => handleQuantityChange("-")}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={quantity.toString()}
              onChangeText={(text) => setQuantity(Number(text))}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.button} onPress={() => handleQuantityChange("+")}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.generateButton} onPress={() => generateBingoCards(quantity)}>
            <Text style={styles.generateButtonText}>Comprar cartones</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>{winningStatus}</Text>
          <ProgressBar progress={progress} />
        </View>
      </ScrollView>
      <View style={styles.fixedBingoCardSection}>
        <FlatList
          data={bingoCards}
          renderItem={({ item, index }) => (
            <Animated.View style={{ transform: [{ scale: 0.55 }], margin: -20 }}>
              <BingoCard key={index} numbers={item.numbers} activeNumbers={activeNumbers} style={item.style} />
            </Animated.View>
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ justifyContent: "center", alignItems: "center", padding: 1 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
