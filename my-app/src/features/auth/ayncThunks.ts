import { createAsyncThunk } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import { Socket } from "socket.io-client";
import { persistor } from "../..";
import { RootState } from "../../app/store";
import { AuthServices } from "../../services/authServices";
import { handleUserStatu } from "../chat/chatSlice";
import { NavigateProps, Notification } from "../types";
import { setOldSocketId, setSocketConnection, setSocketId } from "./authSlice";

const authServices = new AuthServices();

export const register = createAsyncThunk(
  "auth/register",
  async ({ formData, navigate }: NavigateProps, thunkAPI) => {
    try {
      const res = await authServices.register(formData);

      navigate("/chat");

      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

interface LoginProps extends NavigateProps {
  socket: Socket;
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ formData, navigate, socket }: LoginProps, thunkAPI) => {
    try {
      const res = await authServices.login(formData);

      thunkAPI.dispatch(getNotifications(res.data._id));
      thunkAPI.dispatch(handleUserStatu(res.data));

      if (res.data.isOnline) {
        socket.emit("handle close", res.data);
      }

      socket.emit("handle online", res.data);

      navigate("/chat");

      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

interface GetUsersProps {
  keyword: string;
  navigate: NavigateFunction;
}

export const getUsers = createAsyncThunk(
  "auth/getUsers",
  async ({ keyword, navigate }: GetUsersProps, thunkAPI) => {
    try {
      const res = await authServices.getUsers(keyword);

      /* navigate(`/chat?keyword=${keyword}`); */

      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export interface SetNotificationsProps {
  id: string;
  formData: FormData;
}

export const getNotifications = createAsyncThunk(
  "auth/getNotifications",
  async (id: string, thunkAPI) => {
    try {
      const res = await authServices.getNotifications(id);

      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export interface SetNotificationProps {
  formData: FormData;
  messageId: string;
}

export const setNotification = createAsyncThunk(
  "auth/setNotification",
  async (formData: FormData, thunkAPI) => {
    try {
      const store = thunkAPI.getState() as RootState;
      const token = store.auth.user?.token;

      if (token) {
        const res = await authServices.setNotification(formData, token);
        const notification = res.data as Notification;

        if (store.chat.currentChat?._id !== notification.message.chat._id) {
          return res.data as Notification;
        }
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removeNotification = createAsyncThunk(
  "auth/removeNotification",
  async (formData: FormData, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;

      if (token) {
        const res = await authServices.removeNotification(formData, token);

        return res.data as string;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

interface HandleOnlineStatu {
  formData: FormData;
  socket: Socket;
}

export const handleOnlineStatu = createAsyncThunk(
  "auth/handleOnlineStatu",
  async ({ formData, socket }: HandleOnlineStatu, thunkAPI) => {
    try {
      const res = await authServices.handleOnlineStatu(formData);

      socket.emit("handle online", res.data);

      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
