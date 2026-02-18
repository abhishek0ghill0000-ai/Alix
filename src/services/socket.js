// src/services/socket.js - **ChatScreen के लिए PERFECT**

import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - same as API (Render backend)
const SOCKET_BASE_URL = 'https://alix-api.onrender.com';

// Socket instance with auth token
export const socket = io(SOCKET_BASE_URL, {
  autoConnect: false, // Manual connect for better control
  transports: ['websocket'], // React Native के लिए reliable
  timeout: 10000,
});

// Socket connection with JWT auth
export const connectSocket = async (userId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    
    if (token && !socket.connected) {
      socket.auth = { token }; // Socket.io auth
      socket.connect();
    }
  } catch (error) {
    console.log('Socket connection error:', error);
  }
};

// Socket disconnect
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// ===== CHATSCREEN के लिए Socket Events =====

// Message events
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Socket disconnected');
});

socket.on('connect_error', (error) => {
  console.log('Socket connect error:', error.message);
});

// Real-time message events
socket.on('messageReceived', (message) => {
  console.log('📨 New message:', message);
});

socket.on('messageRead', (data) => {
  console.log('👁️ Message read:', data);
});

// Typing indicator
socket.on('typing', (data) => {
  console.log('⌨️ Typing:', data);
});

socket.on('stopTyping', (data) => {
  console.log('⏹️ Stop typing:', data);
});

// Call events
socket.on('callInitiated', (callData) => {
  console.log('📞 Incoming call:', callData);
});

socket.on('callAccepted', (callData) => {
  console.log('✅ Call accepted:', callData);
});

socket.on('callEnded', (callData) => {
  console.log('📴 Call ended:', callData);
});

// ===== Helper functions =====

// Send message via socket (real-time)
export const emitMessage = (data) => {
  socket.emit('sendMessage', data);
};

// Typing indicator emit
export const emitTyping = (data) => {
  socket.emit('typing', data);
};

export const emitStopTyping = (data) => {
  socket.emit('stopTyping', data);
};

// Call events emit
export const emitCallInitiated = (data) => {
  socket.emit('callInitiated', data);
};

export const emitCallAccepted = (data) => {
  socket.emit('callAccepted', data);
};

export const emitCallEnded = (data) => {
  socket.emit('callEnded', data);
};

export default socket;
