import { httpMessage } from "../httpCommon/httpCommon";
import { TokenFormDataProps } from "./types";

export class MessageServices {
  sendMessage = ({ formData, token }: TokenFormDataProps) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return httpMessage.post("/", formData, config);
  };

  getMessages = (chatId: string, userId: string) => {
    return httpMessage.get(`/${chatId}/${userId}`);
  };
}
