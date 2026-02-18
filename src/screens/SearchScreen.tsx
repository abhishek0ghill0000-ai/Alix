// screens/SearchScreen.js - **COMPLETE WORKING VERSION**

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import SearchBar from "../components/SearchBar";
import UserCard from "../components/UserCard";
import FilterModal from "../components/FilterModal";
import { searchUsers } from "../services/api";

const SearchScreen = () => {
  const navigation = useNavigation();

  // search state
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // filter states - individual for FilterModal
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [distance, setDistance] = useState(15);
  const [gender, setGender] = useState("both");
  const [activeFilter, setActiveFilter] = useState("location");

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Simple Instagram-style username search
  const simpleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await searchUsers({ query: query.trim() });
      setUsers(result.users || result);
    } catch (err) {
      console.log("Simple search error:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter 1: Location filter (country/state/city + gender)
  const applyLocationFilter = async () => {
    setLoading(true);
    setError(null);

    try {
      const body = {
        location: {
          country: country || undefined,
          state: state || undefined,
          city: city || undefined,
        },
        gender: gender !== "both" ? gender : undefined,
      };

      const result = await searchUsers(body);
      setUsers(result.users || result);
    } catch (err) {
      console.log("Location filter error:", err);
      setError("Location filter failed.");
    } finally {
      setLoading(false);
      setIsFilterModalVisible(false);
    }
  };

  // Filter 2: Nearby filter (distance + gender) - NO lat/long input
  const applyNearbyFilter = async () => {
    setLoading(true);
    setError(null);

    try {
      const body = {
        distance,
        gender: gender !== "both" ? gender : undefined,
      };

      const response = await fetch("https://alix-api.onrender.com/api/search/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      setUsers(result.users || []);
    } catch (err) {
      console.log("Nearby filter error:", err);
      setError("Nearby filter failed.");
    } finally {
      setLoading(false);
      setIsFilterModalVisible(false);
    }
  };

  // Search bar handler
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (text.trim().length >= 2) {
      simpleSearch(text);
    } else {
      setUsers([]);
    }
  };

  // Filter modal handlers
  const openFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalVisible(false);
  };

  const selectLocationFilter = () => {
    setActiveFilter("location");
  };

  const selectNearbyFilter = () => {
    setActiveFilter("nearby");
  };

  const renderUser = ({ item }) => (
    <UserCard
      user={item}
      onPress={() => {
        navigation.navigate("ProfileScreen", { userId: item._id });
      }}
    />
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="small" color="#000" />
          <Text style={styles.emptyText}>Searching users...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No users found. Try searching by username or use filters.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top bar with search + 3-dot */}
      <View style={styles.topBar}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search by username..."
        />
        <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
          <Entypo name="dots-three-vertical" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Users list */}
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal - PERFECTLY INTEGRATED */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={closeFilterModal}
        activeFilter={activeFilter}
        country={country}
        onCountryChange={setCountry}
        state={state}
        onStateChange={setState}
        city={city}
        onCityChange={setCity}
        distance={distance}
        onDistanceChange={setDistance}
        gender={gender}
        onGenderChange={setGender}
        onApplyLocation={applyLocationFilter}
        onApplyNearby={applyNearbyFilter}
        onSelectLocation={selectLocationFilter}
        onSelectNearby={selectNearbyFilter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterButton: {
    marginLeft: 8,
    padding: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default SearchScreen;
