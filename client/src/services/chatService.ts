import { apiClient } from './apiClient';

export const chatService = {
  sendMessage: (chatId: string, message: string) => apiClient.post(`/chat/${chatId}/send`, { message }),
  getMessages: (chatId: string) => apiClient.get(`/chat/${chatId}`),
};