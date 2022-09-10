import { createAsyncThunk } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { RootState } from "../../app/store";
import { ChatServices } from "../../services/chatServices";
import {
  setContentToggle,
  setCreateGroupForm,
} from "../talkATive/talkATiveSlice";
import { Chat } from "../types";
import { resetAddToUsers, setCurrentChat } from "./chatSlice";

const chatSevices = new ChatServices();

interface AccessChatProps {
  formData: FormData;
  socket: Socket;
}

export const accessChat = createAsyncThunk(
  "chat/accessChat",
  async ({ formData, socket }: AccessChatProps, thunkAPI) => {
    try {
      const store = thunkAPI.getState() as RootState;
      const user = store.auth.user;
      const token = user?.token;

      if (user && token) {
        const res = await chatSevices.accessChat({ formData, token });

        socket.emit("access chat", { chat: res.data, sender: user._id });

        return res.data as Chat;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;

      if (token) {
        const res = await chatSevices.fetchChats(token);

        return res.data;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createGroupChat = createAsyncThunk(
  "chat/createGroupChat",
  async ({ formData, socket }: AccessChatProps, thunkAPI) => {
    try {
      const store = thunkAPI.getState() as RootState;
      const user = store.auth.user;
      const token = user?.token;

      if (token) {
        const res = await chatSevices.createGroupChat({ formData, token });

        thunkAPI.dispatch(resetAddToUsers());
        thunkAPI.dispatch(setCreateGroupForm(false));

        socket.emit("access chat", { chat: res.data, sender: user._id });

        return res.data;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const renameGroup = createAsyncThunk(
  "chat/renameGroup",
  async (formData: FormData, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;

      if (token) {
        const res = await chatSevices.renameGroup({ formData, token });

        return res.data as Chat;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addToChat = createAsyncThunk(
  "chat/addToChat",
  async (formData: FormData, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;

      if (token) {
        const res = await chatSevices.addToChat({ formData, token });

        return res.data as Chat;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removeFromChat = createAsyncThunk(
  "chat/removeFromChat",
  async (formData: FormData, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;

      if (token) {
        const res = await chatSevices.removeFromChat({ formData, token });

        return res.data as Chat;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (formData: FormData, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;

      if (token) {
        const res = await chatSevices.deleteChat({ formData, token });

        thunkAPI.dispatch(setContentToggle(true));
        thunkAPI.dispatch(setCurrentChat(null));

        return res.data as Chat;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
