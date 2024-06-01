import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "../../styles/styles";

const ModalRules = ({ isModalVisible, setIsModalVisible, rules, setRules, progress, setProgress }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(!isModalVisible)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Selecciona las Reglas</Text>
          <Text>Cantidad de Líneas para Ganar</Text>
          <TextInput
            style={styles.modalInput}
            keyboardType="number-pad"
            value={rules.lines.toString()}
            onChangeText={(text) => setRules((prev) => ({ ...prev, lines: parseInt(text) || 0 }))}
          />
          <Text>Cantidad de Bingos para Ganar</Text>
          <TextInput
            style={styles.modalInput}
            keyboardType="number-pad"
            value={rules.bingos.toString()}
            onChangeText={(text) => setRules((prev) => ({ ...prev, bingos: parseInt(text) || 0 }))}
          />
          <Text>Progreso de la barra</Text>
          <TextInput
            style={styles.modalInput}
            keyboardType="number-pad"
            value={progress.toString()}
            onChangeText={(text) => setProgress(Number(text))}
          />
          <TouchableOpacity style={styles.okButton} onPress={() => setIsModalVisible(!isModalVisible)}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalRules;
