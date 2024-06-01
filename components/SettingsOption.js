import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SettingsOption = ({ title, iconName, iconType, onPress }) => {
  const Icon = iconType === "FontAwesome" ? FontAwesome : iconType === "AntDesign" ? AntDesign : MaterialCommunityIcons;

  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <Icon name={iconName} size={24} color="#DAA520" style={styles.optionIcon} />
      <Text style={styles.optionText}>{title}</Text>
      <AntDesign name="right" size={24} color="#c7c7c7" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    backgroundColor: "#1F1F1F",
    borderRadius: 10,
    marginVertical: 6,
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    color: "#FFF",
  },
});

export default SettingsOption;
