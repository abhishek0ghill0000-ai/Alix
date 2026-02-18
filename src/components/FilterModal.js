// components/FilterModal.js

import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const FilterModal = ({
  visible,
  onClose,
  activeFilter,
  country,
  onCountryChange,
  state,
  onStateChange,
  city,
  onCityChange,
  distance,
  onDistanceChange,
  gender,
  onGenderChange,
  onApplyLocation,
  onApplyNearby,
  onSelectLocation,
  onSelectNearby,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Selection */}
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeFilter === "location" && styles.activeTab,
              ]}
              onPress={onSelectLocation}
            >
              <Text
                style={[
                  styles.tabText,
                  activeFilter === "location" && styles.activeTabText,
                ]}
              >
                Location Filter
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeFilter === "nearby" && styles.activeTab,
              ]}
              onPress={onSelectNearby}
            >
              <Text
                style={[
                  styles.tabText,
                  activeFilter === "nearby" && styles.activeTabText,
                ]}
              >
                Nearby Filter
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Filter 1: Location Filter (Country/State/City + Gender) */}
            {activeFilter === "location" && (
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Location Filter</Text>

                {/* Country */}
                <Text style={styles.label}>Country</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={country}
                    onValueChange={onCountryChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Country" value="" />
                    <Picker.Item label="India" value="India" />
                    <Picker.Item label="USA" value="USA" />
                  </Picker>
                </View>

                {/* State */}
                <Text style={styles.label}>State</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={state}
                    onValueChange={onStateChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select State" value="" />
                    <Picker.Item label="Delhi" value="Delhi" />
                    <Picker.Item label="Maharashtra" value="Maharashtra" />
                  </Picker>
                </View>

                {/* City */}
                <Text style={styles.label}>City</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={city}
                    onValueChange={onCityChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select City" value="" />
                    <Picker.Item label="New Delhi" value="New Delhi" />
                    <Picker.Item label="Mumbai" value="Mumbai" />
                  </Picker>
                </View>

                {/* Gender */}
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderButtons}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "male" && styles.activeGenderButton,
                    ]}
                    onPress={() => onGenderChange("male")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "male" && styles.activeGenderButtonText,
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "female" && styles.activeGenderButton,
                    ]}
                    onPress={() => onGenderChange("female")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "female" && styles.activeGenderButtonText,
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "both" && styles.activeGenderButton,
                    ]}
                    onPress={() => onGenderChange("both")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "both" && styles.activeGenderButtonText,
                      ]}
                    >
                      Both
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={onApplyLocation}
                >
                  <Text style={styles.applyButtonText}>Apply Location Filter</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Filter 2: Nearby Filter (Distance + Gender) - NO lat/long */}
            {activeFilter === "nearby" && (
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Nearby Filter</Text>

                {/* Distance */}
                <Text style={styles.label}>Distance (radius)</Text>
                <View style={styles.distanceButtons}>
                  <TouchableOpacity
                    style={[
                      styles.distanceButton,
                      distance === 5 && styles.activeDistanceButton,
                    ]}
                    onPress={() => onDistanceChange(5)}
                  >
                    <Text
                      style={[
                        styles.distanceButtonText,
                        distance === 5 && styles.activeDistanceButtonText,
                      ]}
                    >
                      5 km
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.distanceButton,
                      distance === 10 && styles.activeDistanceButton,
                    ]}
                    onPress={() => onDistanceChange(10)}
                  >
                    <Text
                      style={[
                        styles.distanceButtonText,
                        distance === 10 && styles.activeDistanceButtonText,
                      ]}
                    >
                      10 km
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.distanceButton,
                      distance === 15 && styles.activeDistanceButton,
                    ]}
                    onPress={() => onDistanceChange(15)}
                  >
                    <Text
                      style={[
                        styles.distanceButtonText,
                        distance === 15 && styles.activeDistanceButtonText,
                      ]}
                    >
                      15 km
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Gender */}
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderButtons}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "male" && styles.activeGenderButton,
                    ]}
                    onPress={() => onGenderChange("male")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "male" && styles.activeGenderButtonText,
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "female" && styles.activeGenderButton,
                    ]}
                    onPress={() => onGenderChange("female")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "female" && styles.activeGenderButtonText,
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "both" && styles.activeGenderButton,
                    ]}
                    onPress={() => onGenderChange("both")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "both" && styles.activeGenderButtonText,
                      ]}
                    >
                      Both
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={onApplyNearby}
                >
                  <Text style={styles.applyButtonText}>Apply Nearby Filter</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 16,
    color: "#007AFF",
  },
  filterTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
  },
  filterSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  genderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeGenderButton: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF10",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#666",
  },
  activeGenderButtonText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  distanceButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  distanceButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeDistanceButton: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF10",
  },
  distanceButtonText: {
    fontSize: 16,
    color: "#666",
  },
  activeDistanceButtonText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FilterModal;
