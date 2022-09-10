import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sessionStorageGetUser } from "../../config/config";
import { Chat, Message, StatusTypes, User } from "../types";
import {
  accessChat,
  fetchChats,
  removeFromChat,
  renameGroup,
  addToChat,
  deleteChat,
  createGroupChat,
} from "./asyncThunks";

export interface ChatState {
  status: StatusTypes;
  fetchChatsStatus: StatusTypes;
  chats: Chat[];
  currentChat: Chat | null;
  message: any;
  toAddUsers: User[];
  createChatStatus: StatusTypes;
}

export const initialState: ChatState = {
  status: "idle",
  fetchChatsStatus: "idle",
  chats: [] as Chat[],
  currentChat: null,
  message: null,
  toAddUsers: [] as User[],
  createChatStatus: "idle",
};

const user = sessionStorageGetUser();

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setToAddUsers: (state, action: PayloadAction<User>) => {
      const currentUser = state.toAddUsers.find(
        (item) => item._id === action.payload._id
      );
      if (!currentUser) {
        state.toAddUsers = [...state.toAddUsers, action.payload];
      }
    },
    modifedChat: (state, action: PayloadAction<Message>) => {
      state.chats = state.chats.map((item) => {
        const message = action.payload;
        if (item._id === message.chat._id) {
          return message.chat;
        } else {
          return item;
        }
      });
    },
    resetToAddUser: (state) => {
      state.toAddUsers = [];
    },
    removeToAddUsers: (state, action: PayloadAction<string>) => {
      state.toAddUsers = state.toAddUsers.filter(
        (item) => item._id !== action.payload
      );
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    resetAddToUsers: (state) => {
      state.toAddUsers = [];
    },
    addToChats: (state, action: PayloadAction<Chat>) => {
      let currentChat = state.chats.find(
        (item) => item._id === action.payload._id
      );
      if (currentChat) {
        currentChat = action.payload;
      } else {
        state.chats = [...state.chats, action.payload];
      }
    },
    handleUserStatu: (state, action: PayloadAction<User>) => {
      state.chats = state.chats.reduce((acc, chat) => {
        return [
          ...acc,
          {
            ...chat,
            users: chat.users.map((user) => {
              if (user._id === action.payload._id) {
                return { ...user, isOnline: action.payload.isOnline };
              } else {
                return user;
              }
            }),
          },
        ];
      }, [] as Chat[]);
      if (state.currentChat) {
        state.currentChat.users = state.currentChat.users.map((item) => {
          if (item._id === action.payload._id) {
            return { ...item, isOnline: action.payload.isOnline };
          } else {
            return item;
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    //accessChat
    builder
      .addCase(accessChat.pending, (state) => {
        state.status = "pending";
        state.message = "";
      })
      .addCase(accessChat.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          console.log("aaaaaaaaaaaa", action.payload);

          state.currentChat = action.payload;
          const currentItem = state.chats.find(
            (item) => item._id === action.payload?._id
          );

          if (!currentItem) {
            state.chats = [...state.chats, action.payload];
          } else {
            state.chats = state.chats.map((item) => {
              if (item._id === action.payload?._id) {
                return { ...item, deletedInfo: action.payload?.deletedInfo };
              } else {
                return item;
              }
            });
          }
        }
      })
      .addCase(accessChat.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload;
      });
    //fetchChats
    builder
      .addCase(fetchChats.pending, (state) => {
        state.fetchChatsStatus = "pending";
        state.message = "";
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.fetchChatsStatus = "succeeded";
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.fetchChatsStatus = "failed";
        state.message = action.payload;
      });
    //renameGroup
    builder
      .addCase(renameGroup.pending, (state) => {
        state.createChatStatus = "pending";
        state.message = "";
      })
      .addCase(renameGroup.fulfilled, (state, action) => {
        state.createChatStatus = "succeeded";
        if (action.payload) {
          state.chats = state.chats.map((item) =>
            item._id === action.payload?._id ? (item = action.payload) : item
          );
          if (state.currentChat) {
            state.currentChat = action.payload;
          }
        }
      })
      .addCase(renameGroup.rejected, (state, action) => {
        state.createChatStatus = "failed";
        state.message = action.payload;
      });
    //addToChat
    builder
      .addCase(addToChat.pending, (state) => {
        state.createChatStatus = "pending";
        state.message = "";
      })
      .addCase(addToChat.fulfilled, (state, action) => {
        state.createChatStatus = "succeeded";
        if (action.payload) {
          state.chats = state.chats.map((item) =>
            item._id === action.payload?._id ? (item = action.payload) : item
          );
          if (state.currentChat) {
            state.currentChat = action.payload;
          }
        }
      })
      .addCase(addToChat.rejected, (state, action) => {
        state.createChatStatus = "failed";
        state.message = action.payload;
      });
    //removeFromChat
    builder
      .addCase(removeFromChat.pending, (state) => {
        state.createChatStatus = "pending";
        state.message = "";
      })
      .addCase(removeFromChat.fulfilled, (state, action) => {
        state.createChatStatus = "succeeded";
        if (action.payload) {
          state.currentChat = action.payload;
        }
      })
      .addCase(removeFromChat.rejected, (state, action) => {
        state.createChatStatus = "failed";
        state.message = action.payload;
      });

    //deleteChat
    builder
      .addCase(deleteChat.pending, (state) => {
        state.status = "pending";
        state.message = "";
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.chats = state.chats.map((item) => {
            if (item._id === action.payload?._id) {
              return { ...item, deletedInfo: action.payload?.deletedInfo };
            } else {
              return item;
            }
          });
        }
      })

      .addCase(deleteChat.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload;
      });
    //createGroupChat
    builder
      .addCase(createGroupChat.pending, (state) => {
        state.createChatStatus = "pending";
        state.message = "";
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        state.createChatStatus = "succeeded";
        state.chats = [...state.chats, action.payload];
      })
      .addCase(createGroupChat.rejected, (state, action) => {
        state.createChatStatus = "failed";
        state.message = action.payload;
      });
  },
});

const selectCurrentChat = (currentChat: Chat) => currentChat;

export const draftCurrentUser = createSelector(
  selectCurrentChat,
  (currentChat) => {
    console.log(currentChat);

    return (
      currentChat &&
      currentChat.users &&
      currentChat.users.find((item) => item._id === user._id)
    );
  }
);

export const {
  setToAddUsers,
  removeToAddUsers,
  setCurrentChat,
  resetAddToUsers,
  resetToAddUser,
  modifedChat,
  addToChats,
  handleUserStatu,
} = chatSlice.actions;

export default chatSlice.reducer;
