import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Vibration, StyleSheet } from "react-native";
import ProgressBar from "./ProgressBar";
import styles from "../../styles/styles";

const ModalRules = ({ isModalVisible, setIsModalVisible, rules, setRules, progress, setProgress }) => {
  const handleSetProgress = (value) => {
    if (value >= 0 && value <= 100) setProgress(value);
  };

  const handleIncrement = (value) => {
    handleSetProgress(progress + value);
    Vibration.vibrate(50);
  };

  const handleDecrement = (value) => {
    handleSetProgress(progress - value);
    Vibration.vibrate(50);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(!isModalVisible)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Selecciona las Reglas</Text>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Cantidad de Líneas para Ganar</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="number-pad"
              value={rules.lines.toString()}
              onChangeText={(text) => setRules((prev) => ({ ...prev, lines: parseInt(text) || 0 }))}
            />
            <Text style={styles.modalLabel}>Cantidad de Bingos para Ganar</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="number-pad"
              value={rules.bingos.toString()}
              onChangeText={(text) => setRules((prev) => ({ ...prev, bingos: parseInt(text) || 0 }))}
            />

            <Text style={styles.modalLabel}>Progreso de la barra ({progress}%)</Text>
            <View style={styles.progressAdjustmentContainer}>
              <TouchableOpacity style={styles.adjustButton} onPress={() => handleDecrement(5)}>
                <Text style={styles.buttonText}>-5%</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adjustButton} onPress={() => handleDecrement(1)}>
                <Text style={styles.buttonText}>-1%</Text>
              </TouchableOpacity>
              <View style={styles.progressValueContainer}>
                <Text style={styles.progressValueText}>{progress}%</Text>
              </View>
              <TouchableOpacity style={styles.adjustButton} onPress={() => handleIncrement(1)}>
                <Text style={styles.buttonText}>+1%</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adjustButton} onPress={() => handleIncrement(5)}>
                <Text style={styles.buttonText}>+5%</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickAdjustmentContainer}>
              <TouchableOpacity style={styles.adjustButton} onPress={() => handleSetProgress(0)}>
                <Text style={styles.buttonText}>0%</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adjustButton} onPress={() => handleSetProgress(25)}>
                <Text style={styles.buttonText}>25%</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adjustButton} onPress={() => handleSetProgress(50)}>
                <Text style={styles.buttonText}>50%</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adjustButton} onPress={() => handleSetProgress(75)}>
                <Text style={styles.buttonText}>75%</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adjustButton} onPress={() => handleSetProgress(100)}>
                <Text style={styles.buttonText}>100%</Text>
              </TouchableOpacity>
            </View>

            <ProgressBar progress={progress} />

            <TouchableOpacity style={styles.okButton} onPress={() => setIsModalVisible(!isModalVisible)}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalRules;
