import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // For AsyncStorage

import authReducer from './authSlice';
import callReducer from './callSlice';
import chatReducer from './chatSlice';
import postReducer from './postSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth
};

const rootReducer = combineReducers({
  auth: authReducer,
  call: callReducer,
  chat: chatReducer,
  post: postReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

// Provider in App.tsx: <PersistGate loading={<Loading />} persistor={persistor}><Provider store={store}>...</Provider></PersistGate>