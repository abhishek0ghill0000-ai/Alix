import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ChatListItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name || 'User'}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage || 'No message'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessage: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
});

export default ChatListItem;
