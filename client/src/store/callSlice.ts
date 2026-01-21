import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BACKEND_URL = 'https://alix-renderer.com';
const AGORA_TOKEN_URL = 'https://agora-node-token-server-two-renderer.onrender.com/agora-token';

interface Call {
  id: string;
  channel: string; // 'Alix' for random
  remoteUid: number;
  type: 'video' | 'voice';
  status: 'connecting' | 'connected' | 'ended';
  totalTime: number;
}

interface CallState {
  currentCall: Call | null;
  callHistory: Call[];
  adCount: number; // For AdMob every 8 random calls
  loading: boolean;
  error: string | null;
}

const initialState: CallState = {
  currentCall: null,
  callHistory: [],
  adCount: 0,
  loading: false,
  error: null,
};

export const generateAgoraToken = createAsyncThunk(
  'call/generateToken',
  async ({ channel, uid }: { channel: string; uid: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${AGORA_TOKEN_URL}/${channel}/${uid}`);
      if (!response.ok) throw new Error('Token failed');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    startCall: (state, action: PayloadAction<Partial<Call>>) => {
      state.currentCall = { id: Date.now().toString(), status: 'connecting', ...action.payload };
    },
    endCall: (state, action: PayloadAction<{ duration: number; isRandom: boolean }>) => {
      if (state.currentCall) {
        state.currentCall.status = 'ended';
        state.currentCall.totalTime = action.payload.duration;
        state.callHistory.push(state.currentCall);
        if (action.payload.isRandom) {
          state.adCount = (state.adCount + 1) % 8; // Ad after 8
        }
        state.currentCall = null;
      }
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAgoraToken.pending, (state) => { state.loading = true; })
      .addCase(generateAgoraToken.fulfilled, (state) => { state.loading = false; })
      .addCase(generateAgoraToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { startCall, endCall, clearError } = callSlice.actions;
export default callSlice.reducer;