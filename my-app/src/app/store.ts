/// <reference types="redux-persist" />
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import messageReducer from "../features/message/messageSlice";
import chatReducer from "../features/chat/chatSlice";
import talkATiveReducer from "../features/talkATive/talkATiveSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "redux";
import sessionStorage from "redux-persist/es/storage/session";

const persistConfig = {
  key: "root",
  storage: sessionStorage,
  whitelist: [],
};
const authPersistConfig = {
  key: "auth",
  storage: sessionStorage,
  whitelist: ["user", "isLogin"],
};

const reducers = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  chat: chatReducer,
  message: messageReducer,
  talkATive: talkATiveReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
