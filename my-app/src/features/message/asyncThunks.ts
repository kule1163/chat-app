import { createAsyncThunk } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { RootState } from "../../app/store";
import { MessageServices } from "../../services/messageServices";
import { UseFormReset } from "react-hook-form";
import { Inputs } from "../../pages/chat/Texting/TextingContainer";
import { Message } from "../types";
import { modifedChat } from "../chat/chatSlice";
import { setNotification } from "../auth/ayncThunks";

const messageServices = new MessageServices();

interface SendMessageProps {
  formData: FormData;
  socket: Socket;
  reset: UseFormReset<Inputs>;
}

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ formData, socket, reset }: SendMessageProps, thunkAPI) => {
    try {
      const store = thunkAPI.getState() as RootState;
      const token = store.auth.user?.token;

      if (token) {
        const res = await messageServices.sendMessage({ formData, token });

        const message = res.data as Message;
        const store = thunkAPI.getState() as RootState;

        socket.emit("new message", res.data);
        thunkAPI.dispatch(modifedChat(res.data));

        if (store.chat.currentChat && store.auth.user) {
          const offlineUsers = store.chat.currentChat?.users.filter(
            (item) => item.isOnline === false
          );

          const filteredUsers = offlineUsers.filter(
            (item) => item._id !== store.auth.user?._id
          );

          const notiFormData = new FormData();

          filteredUsers.forEach((item) =>
            notiFormData.append("users[]", item._id)
          );
          notiFormData.append("chatId", message.chat._id);
          notiFormData.append("messageId", message._id);

          thunkAPI.dispatch(setNotification(notiFormData));
        }

        reset();

        return res.data;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

interface GetMessagesProps {
  chatId: string;
  socket: Socket;
}

export const getMessages = createAsyncThunk(
  "message/getMessages",
  async ({ chatId, socket }: GetMessagesProps, thunkAPI) => {
    try {
      const user = (thunkAPI.getState() as RootState).auth.user?._id;

      if (user) {
        const res = await messageServices.getMessages(chatId, user);

        socket.emit("join chat", chatId);

        return res.data;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
