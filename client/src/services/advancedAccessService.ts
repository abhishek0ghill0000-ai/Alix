import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit'; // npx expo install react-native-chart-kit react-native-svg

const BACKEND_URL = 'https://alix-renderer.com';
const screenWidth = 320;

const AdvancedAccessScreen = () => {
  const router = useRouter();
  const [data, setData] = useState({
    callTimeToday: '2h 15m',
    callTimeWeekly: '12h 40m',
    callCount: 156,
    screenTime: '4h 22m',
    location: 'Delhi, IN (Manual check)',
    linkActive: true,
    accessCode: '',
  });
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    fetchAccessData();
  }, []);

  const fetchAccessData = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/advanced-access`);
      const stats = await res.json();
      setData(stats);
    } catch (e) {
      // Mock data
    }
  };

  const generateAccessCode = () => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    setData({ ...data, accessCode: code });
    // Send code via backend (email/SMS)
    Alert.alert('Code Generated', code);
  };

  const unlink = () => {
    setData({ ...data, linkActive: false });
    Alert.alert('Unlinked');
  };

  const checkLocation = () => {
    setShowLocationModal(true);
    // Fetch latest manual location from DB
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{ data: [20, 45, 28, 80, 99, 65] }],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Advanced Access</Text>
        <TouchableOpacity onPress={() => setShowCodeModal(true)}>
          <Icon name="share" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {data.linkActive ? (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📞 Call Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{data.callTimeToday}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{data.callTimeWeekly}</Text>
                <Text style={styles.statLabel}>Weekly</Text>
              </View>
            </View>
            <Text style={styles.statBig}>Calls: {data.callCount}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📱 Screen Time</Text>
            <Text style={styles.statValue}>{data.screenTime}</Text>
            <LineChart
              data={chartData}
              width={screenWidth}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <TouchableOpacity style={styles.locationBtn} onPress={checkLocation}>
            <Icon name="location-on" size={20} color="#fff" />
            <Text style={styles.locationText}>{data.location}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.unlinkBtn} onPress={unlink}>
            <Text style={styles.unlinkText}>🔒 Unlink Access</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.inactive}>
          <Icon name="lock" size={80} color="#ccc" />
          <Text style={styles.inactiveText}>No Active Access Link</Text>
        </View>
      )}
    </ScrollView>

    {/* Access Code Modal */}
    <Modal visible={showCodeModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Share Access Link</Text>
          <Text style={styles.accessCode}>{data.accessCode || 'Generate code'}</Text>
          <TouchableOpacity style={styles.generateBtn} onPress={generateAccessCode}>
            <Text style={styles.generateText}>Generate New Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowCodeModal(false)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    {/* Location Modal */}
    <Modal visible={showLocationModal} transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Current Location</Text>
          <Text style={styles.locationDetail}>Lat: 28.6139° N</Text>
          <Text style={styles.locationDetail}>Lng: 77.2090° E</Text>
          <Text style={styles.locationDetail}>Delhi, India</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowLocationModal(false)}
          >
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#007AFF',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 14, color: '#666' },
  statBig: { fontSize: 32, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  chart: { marginVertical: 8, borderRadius: 16 },
  locationBtn: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  locationText: { color: '#fff', fontSize: 16, marginLeft: 12, flex: 1 },
  unlinkBtn: {
    backgroundColor: '#FF3B30',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  unlinkText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  inactive: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inactiveText: { fontSize: 18, color: '#666', marginTop: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  accessCode: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    letterSpacing: 4,
  },
  generateBtn: {
    backgroundColor: '#34C759',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  generateText: { color: '#fff', fontWeight: '600' },
  closeBtn: {
    backgroundColor: '#ddd',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  closeText: { color: '#333', fontWeight: '600' },
  locationDetail: { fontSize: 16, color: '#666', marginBottom: 4 },
});

export default AdvancedAccessScreen;