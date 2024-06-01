import React, { useRef, useEffect } from "react";
import { View, Animated, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styles from "../../styles/styles";

const ProgressBar = ({ progress }) => {
  const animatedWidth = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const interpolateWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBar, { width: interpolateWidth }]}>
        <LinearGradient
          colors={["#4CAF50", "#8BC34A", "#CDDC39"]}
          style={styles.progressBarGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.progressTextContainer}>
          <Text style={[styles.progressText, { color: progress > 20 ? "#333" : "#FFF" }]}>{Math.round(progress)}%</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default ProgressBar;
