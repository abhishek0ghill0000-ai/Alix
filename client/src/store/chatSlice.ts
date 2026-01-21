import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BACKEND_URL = 'https://alix-renderer.com';

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: number;
  read: boolean;
}

interface Chat {
  id: string;
  friendUniqueId: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = { chats: [], currentChat: null, loading: false, error: null };

export const fetchChats = createAsyncThunk('chat/fetchChats', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/chats`, {
      headers: { Authorization: `Bearer ${await AsyncStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Fetch chats failed');
    return await response.json();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ chatId, text }: { chatId: string; text: string }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await AsyncStorage.getItem('token')}` },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Send failed');
    return await response.json();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<Chat>) => { state.currentChat = action.payload; },
    addMessage: (state, action: PayloadAction<Message>) => {
      if (state.currentChat?.id === action.payload.chatId) {
        state.currentChat.messages.push(action.payload);
      }
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Optimistic update
        state.loading = false;
      });
  },
});

export const { setCurrentChat, addMessage, clearError } = chatSlice.actions;
export default chatSlice.reducer;