import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface talkATiveState {
  contentToggle: boolean;
  createGroupForm: boolean;
  searchbarToggle: boolean;
  userProfileToggle: boolean;
  handleGroupForm: "create" | "edit";
  onlineUsers: string[];
}

const initialState: talkATiveState = {
  contentToggle: true,
  createGroupForm: false,
  searchbarToggle: false,
  userProfileToggle: false,
  handleGroupForm: "create",
  onlineUsers: [],
};

export const talkATiveSlice = createSlice({
  name: "talkATive",
  initialState,
  reducers: {
    setContentToggle: (state, action: PayloadAction<boolean>) => {
      state.contentToggle = action.payload;
    },
    setCreateGroupForm: (state, action: PayloadAction<boolean>) => {
      state.createGroupForm = action.payload;
    },
    setSearchbarToggle: (state, action: PayloadAction<boolean>) => {
      state.searchbarToggle = action.payload;
    },
    setUserProfileToggle: (state, action: PayloadAction<boolean>) => {
      state.userProfileToggle = action.payload;
    },
    setHandleGroupForm: (state, action: PayloadAction<"create" | "edit">) => {
      state.handleGroupForm = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  setContentToggle,
  setCreateGroupForm,
  setSearchbarToggle,
  setUserProfileToggle,
  setHandleGroupForm,
  setOnlineUsers,
} = talkATiveSlice.actions;

export default talkATiveSlice.reducer;
