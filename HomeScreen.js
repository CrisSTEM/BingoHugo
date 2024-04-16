import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";

const numbers = [...Array(90).keys()].map((i) => i + 1);

const BingoBall = ({ number, color, isActive, onPress, size }) => {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(number)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.bingoBallContainer,
          { transform: [{ scale }] },
          { shadowColor: isActive ? color : "#ccc" },
          { width: size + 10, height: size + 10 },
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

const App = () => {
  const [activeNumbers, setActiveNumbers] = useState(new Set());
  const [currentNumber, setCurrentNumber] = useState(null);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleNumber = (number) => {
    setCurrentNumber(number);
    const newActiveNumbers = new Set(activeNumbers);
    if (newActiveNumbers.has(number)) {
      newActiveNumbers.delete(number);
    } else {
      newActiveNumbers.add(number);
    }
    setActiveNumbers(newActiveNumbers);
  };

  const renderRow = (rowNumbers, color) => (
    <View style={styles.numberRow}>
      {rowNumbers.map((number) => (
        <BingoBall
          key={number}
          number={number}
          color={color}
          isActive={activeNumbers.has(number)}
          onPress={toggleNumber}
          size={75}
        />
      ))}
    </View>
  );

  const renderPastNumbers = () => (
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
          size={40}
        />
      ))}
    </ScrollView>
  );

  const renderUserInfo = () => (
    <View style={styles.userInfoContainer}>
      <Text style={styles.userInfoText}>User: John Doe</Text>
      <Text style={styles.userInfoText}>Time: {currentTime}</Text>
      <Text style={styles.userInfoText}>BINGO</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.currentAndPastContainer}>
        <BingoBall
          number={currentNumber || "-"}
          color="#ffb74d"
          isActive={true}
          onPress={() => {}}
          size={100}
        />
        {renderPastNumbers()}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.horizontalContainer}>
          {renderRow(numbers.slice(0, 30), "#e57373")}
          {renderRow(numbers.slice(30, 60), "#64b5f6")}
          {renderRow(numbers.slice(60, 90), "#81c784")}
        </View>
      </ScrollView>
      {renderUserInfo()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#f0f0f0",
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
  },
});

export default App;
