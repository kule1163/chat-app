import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, StatusTypes } from "../types";
import { sendMessage, getMessages } from "./asyncThunks";

export interface MessageSlice {
  getMessagesStatus: StatusTypes;
  status: StatusTypes;
  messages: Message[];
  errorMessage: any;
}

const initialState: MessageSlice = {
  getMessagesStatus: "idle",
  status: "idle",
  messages: [] as Message[],
  errorMessage: null,
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },

    setMessageStatus: (state, action: PayloadAction<StatusTypes>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    //sendMessage
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = "pending";
        state.errorMessage = "";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = [...state.messages, action.payload];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.payload;
      });
    //getMessages
    builder
      .addCase(getMessages.pending, (state) => {
        state.getMessagesStatus = "pending";
        state.errorMessage = "";
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.getMessagesStatus = "succeeded";
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.getMessagesStatus = "failed";
        state.errorMessage = action.payload;
      });
  },
});

export const { setMessages, setMessageStatus } = messageSlice.actions;

export default messageSlice.reducer;
