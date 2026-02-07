// src/screens/AdvancedAccessScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RootStackParamList = {
  AdvancedAccess: undefined;
  ChatScreen: { userId: string; userName: string };
};

const AdvancedAccessScreen = () => {
  const navigation = useNavigation<any>();

  const [selectedTab, setSelectedTab] = useState('vip');

  const vipFeatures = [
    { id: '1', title: 'Unlimited Video Calls', icon: 'video', active: true },
    { id: '2', title: 'Priority Matching', icon: 'star', active: true },
    { id: '3', title: 'Ad Free Experience', icon: 'no-ads', active: true },
    { id: '4', title: 'Advanced Filters', icon: 'filter', active: false },
  ];

  const premiumFeatures = [
    { id: '1', title: 'VIP Badge', icon: 'badge', active: true },
    { id: '2', title: 'Private Calls', icon: 'lock', active: true },
    { id: '3', title: 'Profile Boost', icon: 'boost', active: false },
  ];

  const renderFeature = (item: any) => (
    <View key={item.id} style={[
      styles.featureCard, 
      item.active ? styles.activeFeature : styles.inactiveFeature
    ]}>
      <Image 
        source={require(`../assets/icons/features/icon_${item.icon}.png`)} 
        style={styles.featureIcon} 
      />
      <Text style={styles.featureTitle}>{item.title}</Text>
    </View>
  );

  const quickActions = [
    { id: '1', title: 'Quick VIP (₹99)', duration: '1 Month', color: '#3B82F6' },
    { id: '2', title: 'Premium (₹299)', duration: '3 Months', color: '#10B981' },
    { id: '3', title: 'VIP Lifetime (₹999)', duration: 'Forever', color: '#F59E0B' },
  ];

  const renderQuickAction = (item: any) => (
    <TouchableOpacity key={item.id} style={[styles.quickAction, { backgroundColor: item.color }]}>
      <Text style={styles.quickActionTitle}>{item.title}</Text>
      <Text style={styles.quickActionDuration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <ScrollView style={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Advanced Access</Text>
          <Text style={styles.headerSubtitle}>Unlock premium features</Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'vip' && styles.activeTab]}
            onPress={() => setSelectedTab('vip')}
          >
            <Text style={[
              styles.tabText, 
              selectedTab === 'vip' && styles.activeTabText
            ]}>VIP</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'premium' && styles.activeTab]}
            onPress={() => setSelectedTab('premium')}
          >
            <Text style={[
              styles.tabText, 
              selectedTab === 'premium' && styles.activeTabText
            ]}>Premium</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Your Features</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.featuresList}>
              {selectedTab === 'vip' 
                ? vipFeatures.map(renderFeature)
                : premiumFeatures.map(renderFeature)
              }
            </View>
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Upgrade Now</Text>
          <View style={styles.quickActionsList}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#94A3B8',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3B82F6',
    borderRadius: 24,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  featuresList: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 140,
  },
  activeFeature: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  inactiveFeature: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    textAlign: 'center',
  },
  quickActionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  quickActionsList: {
    gap: 16,
  },
  quickAction: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickActionDuration: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
});

export default AdvancedAccessScreen;