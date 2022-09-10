import { store } from "../../app/store";
import { resetSearchUsers } from "../auth/authSlice";
import { resetAddToUsers } from "../chat/chatSlice";
import {
  setCreateGroupForm,
  setSearchbarToggle,
} from "../talkATive/talkATiveSlice";

export const closeCreateGroupForm = () => {
  store.dispatch(resetSearchUsers([]));
  store.dispatch(setCreateGroupForm(false));
  store.dispatch(resetAddToUsers());
};

export const closeSearchbar = () => {
  store.dispatch(resetSearchUsers([]));
  store.dispatch(setSearchbarToggle(false));
};
