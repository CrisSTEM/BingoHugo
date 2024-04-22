import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth } from "../config/firebaseConfig";

// Constants and Helpers
const TOTAL_NUMBERS = 90;
const numbers = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);
const adminId = "403JDsD1jsY2zJogoREPI3xpoMc2";

// BingoBall component
const BingoBall = ({ number, color, isActive, onPress, size, isAdmin }) => {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    scale.setValue(1);
  };

  return (
    <TouchableOpacity
      onPress={() => isAdmin && onPress(number)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!isAdmin}
    >
      <Animated.View
        style={[
          styles.bingoBallContainer,
          { transform: [{ scale }], shadowColor: isActive ? color : "#ccc", width: size, height: size },
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
          <Text style={[styles.bingoBallText, { fontSize: size / 3 }]}>{number}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
const BingoCell = ({ number, isActive }) => {
  return (
    <View style={[styles.bingoCell, { backgroundColor: isActive ? "#ffcc00" : "rgba(255,255,255,0.9)" }]}>
      <Text style={styles.bingoCellText}>{number}</Text>
    </View>
  );
};
// BingoCard component
const BingoCard = ({ numbers, activeNumbers }) => (
  <View style={styles.bingoCardContainer}>
    {numbers.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.bingoRow}>
        {row.map((number, cellIndex) => (
          <BingoCell key={cellIndex} number={number} isActive={activeNumbers.has(number)} />
        ))}
      </View>
    ))}
  </View>
);

// NumberRows component
const NumberRows = ({ numbers, color, size, toggleNumber, activeNumbers, isAdmin }) => (
  <View style={styles.numberRow}>
    {numbers.map(
      (
        number // Asegurarse de que la slicción del arreglo numbers se haga correctamente en el renderizado padre para 18 items
      ) => (
        <BingoBall
          key={number}
          number={number}
          color={color}
          isActive={activeNumbers.has(number)}
          onPress={toggleNumber}
          size={size} // Tamaño reducido configurado en la parte del renderizado
          isAdmin={isAdmin}
        />
      )
    )}
  </View>
);

// HomeScreen component
const HomeScreen = () => {
  const [activeNumbers, setActiveNumbers] = useState(new Set());
  const [currentNumber, setCurrentNumber] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [quantity, setQuantity] = useState(1);
  const [bingoCards, setBingoCards] = useState([]);
  const [winningStatus, setWinningStatus] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rules, setRules] = useState({ lines: 1, bingos: 1 });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    setIsAdmin(userId === adminId);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    checkForBingoOrLine();
  }, [activeNumbers, bingoCards]);

  const checkForBingoOrLine = () => {
    bingoCards.forEach((card, cardIndex) => {
      let lineCount = 0;
      let bingoCount = 0;
      card.forEach((row) => {
        const isLine = row.every((cell) => activeNumbers.has(cell) || cell === null);
        if (isLine) {
          lineCount++;
        }
      });

      const isBingo = card
        .flat()
        .filter((val) => val !== null)
        .every((cell) => activeNumbers.has(cell));
      if (isBingo) {
        bingoCount = 15;
      }

      if (bingoCount === 15) {
        setWinningStatus(`Cartón ${cardIndex + 1} ha hecho BINGO!`);
      } else if (lineCount > 0) {
        setWinningStatus(`Cartón ${cardIndex + 1} ha hecho ${lineCount} líneas!`);
      }
    });
  };

  const handleRulesChange = (type, value) => {
    setRules((prevRules) => ({ ...prevRules, [type]: value }));
  };
  const toggleNumber = (number) => {
    const newActiveNumbers = new Set(activeNumbers);
    if (newActiveNumbers.has(number)) {
      newActiveNumbers.delete(number);
    } else {
      newActiveNumbers.add(number);
    }
    setActiveNumbers(newActiveNumbers);
    setCurrentNumber(number);
  };

  const generateBingoNumbers = () => {
    let cardNumbers = Array(3)
      .fill(null)
      .map(() => Array(9).fill(null));

    const numbers = Array.from({ length: 9 }, (_, i) => Array.from({ length: 10 }, (__, k) => i * 10 + k + 1));

    numbers.forEach((colNumbers, colIndex) => {
      colNumbers.sort(() => Math.random() - 0.5);

      const selectedNumbers = colNumbers.slice(0, 3).sort((a, b) => a - b);

      let filledPositions = [];
      while (filledPositions.length < 3) {
        let position = Math.floor(Math.random() * 3);
        if (!filledPositions.includes(position)) {
          filledPositions.push(position);
        }
      }

      filledPositions.forEach((position, index) => {
        cardNumbers[position][colIndex] = selectedNumbers[index];
      });
    });

    // Selección aleatoria de 12 posiciones para vaciar
    let positionsToClear = [];
    while (positionsToClear.length < 12) {
      let randomRow = Math.floor(Math.random() * 3);
      let randomCol = Math.floor(Math.random() * 9);
      let pos = randomRow * 9 + randomCol;
      if (!positionsToClear.includes(pos)) {
        positionsToClear.push(pos);
      }
    }

    // Vaciar las posiciones seleccionadas
    positionsToClear.forEach((pos) => {
      let row = Math.floor(pos / 9);
      let col = pos % 9;
      cardNumbers[row][col] = null;
    });

    // Recolectar todos los números restantes
    let remainingNumbers = [];
    for (let col = 0; col < 9; col++) {
      for (let row = 0; row < 3; row++) {
        if (cardNumbers[row][col] !== null) {
          remainingNumbers.push(cardNumbers[row][col]);
        }
      }
    }

    remainingNumbers.sort((a, b) => a - b);

    // Reasignar los números ordenados al cartón siguiendo el nuevo orden vertical
    let index = 0;
    for (let col = 0; col < 9; col++) {
      for (let row = 0; row < 3; row++) {
        if (cardNumbers[row][col] !== null) {
          cardNumbers[row][col] = remainingNumbers[index++];
        }
      }
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(!isModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Selecciona las Reglas</Text>

              {/* Entrada para cantidad de líneas */}
              <Text>Cantidad de Líneas para Ganar</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="number-pad"
                value={rules.lines.toString()}
                onChangeText={(text) => handleRulesChange("lines", parseInt(text) || 0)}
              />

              {/* Entrada para cantidad de Bingos */}
              <Text>Cantidad de Bingos para Ganar</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="number-pad"
                value={rules.bingos.toString()}
                onChangeText={(text) => handleRulesChange("bingos", parseInt(text) || 0)}
              />

              <TouchableOpacity style={styles.okButton} onPress={() => setIsModalVisible(!isModalVisible)}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horizontalContainer}>
            <NumberRows
              numbers={numbers.slice(0, 18)}
              color="#e57373"
              size={40} // Nueva configuración de tamaño más pequeño
              toggleNumber={toggleNumber}
              activeNumbers={activeNumbers}
              isAdmin={isAdmin}
            />
            <NumberRows
              numbers={numbers.slice(18, 36)}
              color="#64b5f6"
              size={40} // Nueva configuración de tamaño más pequeño
              toggleNumber={toggleNumber}
              activeNumbers={activeNumbers}
              isAdmin={isAdmin}
            />
            <NumberRows
              numbers={numbers.slice(36, 54)}
              color="#81c784"
              size={40} // Nueva configuración de tamaño más pequeño
              toggleNumber={toggleNumber}
              activeNumbers={activeNumbers}
              isAdmin={isAdmin}
            />
            <NumberRows
              numbers={numbers.slice(54, 72)}
              color="#81c784"
              size={40} // Nueva configuración de tamaño más pequeño
              toggleNumber={toggleNumber}
              activeNumbers={activeNumbers}
              isAdmin={isAdmin}
            />
            <NumberRows
              numbers={numbers.slice(72, 90)}
              color="#81c784"
              size={40} // Nueva configuración de tamaño más pequeño
              toggleNumber={toggleNumber}
              activeNumbers={activeNumbers}
              isAdmin={isAdmin}
            />
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
            <Text style={styles.generateButtonText}>Comprar cartones </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>{winningStatus}</Text>
        </View>
      </ScrollView>
      <View style={styles.fixedBingoCardSection}>
        <View style={styles.fixedBingoCardSection}></View>
        <ScrollView vertical showsVerticalScrollIndicator={false}>
          {bingoCards.map((cardNumbers, index) => (
            <BingoCard key={index} numbers={cardNumbers} activeNumbers={activeNumbers} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Styles
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
    marginVertical: 2,
  },
  bingoBallContainer: {
    margin: 4,
    elevation: 6,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 1 },
  },
  bingoBall: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
  },
  bingoBallText: {
    fontSize: 14,
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
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#DAA520",
    borderRadius: 25,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 1 },
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  generateButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bingoCardContainer: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    margin: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
  bingoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  bingoCell: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: "grey",
    textAlign: "center",
    lineHeight: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  fixedBingoCardSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  scrollableContent: {
    flex: 1,
    marginBottom: 50,
  },
  input: {
    width: 60,
    height: 40,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#fff",
    borderRadius: 25,
    color: "#333",
    marginHorizontal: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 1 },
    elevation: 4,
  },
  bingoCell: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 35,
    alignItems: "stretch",
    justifyContent: "center",
    marginTop: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 5,
    paddingLeft: 10,
  },
  okButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  openButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: "center",
    marginTop: 20,
  },
  openButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomeScreen;
