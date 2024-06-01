import React from "react";
import { TouchableOpacity, Animated, View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styles from "../../styles/styles";

const BingoBall = ({ number, color, isActive, onPress, size, isAdmin }) => {
  const scale = new Animated.Value(1);

  return (
    <TouchableOpacity
      onPress={() => isAdmin && onPress(number)}
      onPressIn={() => Animated.spring(scale, { toValue: 1.1, friction: 4, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
      disabled={!isAdmin}
    >
      <Animated.View
        style={[
          styles.bingoBallContainer,
          { transform: [{ scale }], shadowColor: isActive ? color : "#ccc", width: size, height: size },
        ]}
      >
        <LinearGradient
          colors={[color, "#eee"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.bingoBall,
            {
              borderColor: color,
              opacity: isActive ? 1 : 0.5,
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: size / 15,
            },
          ]}
        >
          <View
            style={[
              styles.innerCircle,
              {
                borderRadius: size / 2 - size / 15,
                width: size - size / 5,
                height: size - size / 5,
                borderWidth: size / 30,
                borderColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text style={[styles.bingoBallText, { fontSize: size / 3 }]}>{number}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default BingoBall;
