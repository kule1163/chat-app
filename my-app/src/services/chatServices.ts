import { httpChat } from "../httpCommon/httpCommon";
import { TokenFormDataProps } from "./types";

export class ChatServices {
  accessChat = ({ formData, token }: TokenFormDataProps) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return httpChat.post("/", formData, config);
  };
  fetchChats = (token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return httpChat.get("/fetch-chats", config);
  };
  createGroupChat = ({ formData, token }: TokenFormDataProps) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return httpChat.post("/group", formData, config);
  };
  renameGroup = ({ formData, token }: TokenFormDataProps) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return httpChat.put("/rename", formData, config);
  };
  addToChat = ({ formData, token }: TokenFormDataProps) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return httpChat.put("/add-user", formData, config);
  };
  removeFromChat = ({ formData, token }: TokenFormDataProps) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return httpChat.put("/remove-user", formData, config);
  };
  deleteChat = ({ formData, token }: TokenFormDataProps) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return httpChat.put("/delete-chat", formData, config);
  };
}
