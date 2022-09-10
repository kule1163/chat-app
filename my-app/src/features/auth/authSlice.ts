import {
  createSlice,
  createDraftSafeSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import { persistor } from "../..";
import { StatusTypes, User, Notification } from "../types";
import {
  register,
  login,
  getUsers,
  getNotifications,
  setNotification,
  removeNotification,
} from "./ayncThunks";

export interface AuthState {
  status: StatusTypes;
  user: User | null;
  searchUsers: User[];
  message: any;
  isLogin: boolean;
  notifications: Notification[];
  socketId: string;
  oldSocketId: string;
  socketConnection: boolean;
}

export const initialState: AuthState = {
  status: "idle",
  user: null,
  searchUsers: [] as User[],
  message: null,
  isLogin: false,
  notifications: [] as Notification[],
  socketId: "",
  oldSocketId: "",
  socketConnection: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = [...state.notifications, action.payload];
    },
    removeFromNotifications: (state, action) => {
      state.notifications = state.notifications.filter(
        (item) => item.chat !== action.payload
      );
    },
    setSocketConnection: (state, action: PayloadAction<boolean>) => {
      state.socketConnection = action.payload;
    },
    setSocketId: (state, action: PayloadAction<string>) => {
      state.socketId = action.payload;
    },
    setOldSocketId: (state, action: PayloadAction<string>) => {
      state.socketId = action.payload;
    },
    resetSearchUsers: (state, action) => {
      state.searchUsers = [];
    },
    resetAuthMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    //register
    builder
      .addCase(register.pending, (state) => {
        state.status = "pending";
        state.message = "";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLogin = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload;
      });
    //login
    builder
      .addCase(login.pending, (state) => {
        state.status = "pending";
        state.message = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLogin = true;
        state.user = action.payload;
        sessionStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload;
      });
    //getUsers
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = "pending";
        state.message = "";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchUsers = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload;
      });
    //getNotifications
    builder
      .addCase(getNotifications.pending, (state) => {
        state.status = "pending";
        state.message = "";
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.notifications = action.payload;
        }
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload;
      });
    //setNotification
    builder
      .addCase(setNotification.pending, (state) => {
        state.status = "pending";
        state.message = "";
      })
      .addCase(setNotification.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.notifications = [...state.notifications, action.payload];
        }
      })
      .addCase(setNotification.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload;
      });
    //removeNotification
    builder
      .addCase(removeNotification.pending, (state) => {
        state.status = "pending";
        state.message = "";
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.notifications = state.notifications.filter(
            (item) => item.message.chat._id !== action.payload
          );
        }
      })
      .addCase(removeNotification.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload;
      });
  },
});

const selectSelf = (state: AuthState) => state;
export const draftSafeSelector = createDraftSafeSelector(
  selectSelf,
  (state) => state
);

export const {
  removeFromNotifications,
  setNotifications,
  resetSearchUsers,
  resetAuthMessage,
  setSocketConnection,
  setSocketId,
  setOldSocketId,
} = authSlice.actions;

export default authSlice.reducer;
