import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Button,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Constants and Helpers
const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

// Components
const BingoBall = ({ number, color, isActive, onPress, size }) => {
  const scale = new Animated.Value(1);
  const handlePress = () => {
    Animated.spring(scale, {
      toValue: isActive ? 1 : 1.1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };
  return (
    <TouchableOpacity
      onPress={() => onPress(number)}
      onPressIn={handlePress}
      onPressOut={() => scale.setValue(1)}
    >
      <Animated.View
        style={[
          styles.bingoBallContainer,
          {
            transform: [{ scale }],
            shadowColor: isActive ? color : "#ccc",
            width: size,
            height: size,
          },
        ]}
      >
        <View
          style={[
            styles.bingoBall,
            {
              borderColor: color,
              opacity: isActive ? 1 : 0.5,
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: size / 10,
            },
          ]}
        >
          <Text style={[styles.bingoBallText, { fontSize: size / 3 }]}>
            {number}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
const BingoCard = ({ numbers }) => (
  <View style={styles.bingoCardContainer}>
    {numbers.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.bingoRow}>
        {row.map((number, cellIndex) => (
          <Text key={cellIndex} style={styles.bingoCell}>
            {number}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

const NumberRows = ({ numbers, color, size, toggleNumber, activeNumbers }) => (
  <View style={styles.numberRow}>
    {numbers.map((number) => (
      <BingoBall
        key={number}
        number={number}
        color={color}
        isActive={activeNumbers.has(number)}
        onPress={toggleNumber}
        size={size}
      />
    ))}
  </View>
);

const HomeScreen = () => {
  const [activeNumbers, setActiveNumbers] = useState(new Set());
  const [currentNumber, setCurrentNumber] = useState(null);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [quantity, setQuantity] = useState(1);
  const [bingoCards, setBingoCards] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleNumber = (number) => {
    const newActiveNumbers = new Set(activeNumbers);
    newActiveNumbers.has(number)
      ? newActiveNumbers.delete(number)
      : newActiveNumbers.add(number);
    setActiveNumbers(newActiveNumbers);
    setCurrentNumber(number);
  };
  const generateBingoNumbers = () => {
    let cardNumbers = [];
    for (let row = 0; row < 3; row++) {
      let rowNumbers = [];
      for (let col = 0; col < 9; col++) {
        rowNumbers.push(Math.floor(Math.random() * 90) + 1); // Genera números al azar
      }
      cardNumbers.push(rowNumbers);
    }
    return cardNumbers;
  };

  const generateBingoCards = (quantity) => {
    const newCards = Array.from({ length: quantity }, generateBingoNumbers);
    setBingoCards(newCards);
  };
  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === "+" ? prev + 1 : Math.max(prev - 1, 1)));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.currentAndPastContainer}>
        <BingoBall
          number={currentNumber || "-"}
          color="#ffb74d"
          isActive={true}
          onPress={() => {}}
          size={60}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pastNumbersContainer}
        >
          {Array.from(activeNumbers).map((number) => (
            <BingoBall
              key={number}
              number={number}
              color="#ccc"
              isActive={true}
              onPress={() => {}}
              size={30}
            />
          ))}
        </ScrollView>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.horizontalContainer}>
          <NumberRows
            numbers={numbers.slice(0, 30)}
            color="#e57373"
            size={50}
            toggleNumber={toggleNumber}
            activeNumbers={activeNumbers}
          />
          <NumberRows
            numbers={numbers.slice(30, 60)}
            color="#64b5f6"
            size={50}
            toggleNumber={toggleNumber}
            activeNumbers={activeNumbers}
          />
          <NumberRows
            numbers={numbers.slice(60, 90)}
            color="#81c784"
            size={50}
            toggleNumber={toggleNumber}
            activeNumbers={activeNumbers}
          />
        </View>
      </ScrollView>
      <View style={styles.bottomSection}>
        <TextInput
          style={styles.input}
          value={quantity.toString()}
          onChangeText={(text) => setQuantity(Number(text))}
          keyboardType="number-pad"
        />
        <View style={styles.buttonWrapper}>
          <Button title="-" onPress={() => handleQuantityChange("-")} />
          <Button title="+" onPress={() => handleQuantityChange("+")} />
        </View>
        <Button
          title="Generate Cards"
          onPress={() => generateBingoCards(quantity)}
          color="#DAA520"
        />
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>User: John Doe</Text>
        <Text style={styles.userInfoText}>Time: {currentTime}</Text>
        <Text style={styles.userInfoText}>BINGO</Text>
      </View>
      <ScrollView vertical showsHorizontalScrollIndicator={false}>
        {bingoCards.map((cardNumbers, index) => (
          <BingoCard key={index} numbers={cardNumbers} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(20, 20, 20, 0.85)",
  },
  horizontalContainer: {
    flexDirection: "column",
  },
  numberRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  bingoBallContainer: {
    margin: 8,
    elevation: 6,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 1 },
  },
  bingoBall: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  bingoBallText: {
    color: "black",
    fontWeight: "bold",
  },
  currentAndPastContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  pastNumbersContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#DAA520",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: 50,
    height: 40,
    backgroundColor: "#fff",
    textAlign: "center",
    marginRight: 10,
  },
  buttonWrapper: {
    flexDirection: "row",
    marginRight: 10,
  },
  cardsContainer: {
    flexDirection: "column",
    padding: 10,
  },
  cardsInnerContainer: {
    flexDirection: "column",
  },
  bingoCardContainer: {
    flexDirection: "column", // Modificado para distribución vertical
    backgroundColor: "white",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bingoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bingoCell: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "grey",
    textAlign: "center",
    lineHeight: 32,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});

export default HomeScreen;
