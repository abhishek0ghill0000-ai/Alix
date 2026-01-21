import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';

export const authService = {
  login: async (email: string, password: string) => {
    const { token } = await apiClient.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', token);
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
  },
  getToken: async () => AsyncStorage.getItem('token'),
};