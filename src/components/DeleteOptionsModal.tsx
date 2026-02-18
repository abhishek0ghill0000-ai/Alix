// src/components/DeleteOptionsModal.js
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const DeleteOptionsModal = ({ visible, onClose, onOptionSelect }) => {
  const options = [
    { label: "Delete after view", value: "afterView" },
    { label: "Delete after 24 hours", value: "after24h" },
    { label: "Delete after 2 days", value: "after2d" },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.option}
              onPress={() => {
                onOptionSelect(option.value);
                onClose();
              }}
            >
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    minWidth: 200,
  },
  option: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  cancel: { paddingVertical: 10, marginTop: 10, alignItems: "center" },
});

export default DeleteOptionsModal;
