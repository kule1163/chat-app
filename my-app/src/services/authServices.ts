import { httpAuth } from "../httpCommon/httpCommon";

export class AuthServices {
  register = (formData: FormData) => {
    return httpAuth.post("/", formData);
  };
  login = (formData: FormData) => {
    return httpAuth.post("/login", formData);
  };
  handleOnlineStatu = (formData: FormData) => {
    return httpAuth.post("/online-statu", formData);
  };
  getUsers = (keyword: string) => {
    return httpAuth.get(`/?keyword=${keyword}`);
  };
  getNotifications = (id: string) => {
    return httpAuth.get(`/user/${id}`);
  };

  setNotification = (formData: FormData, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return httpAuth.post(`/notification`, formData, config);
  };
  removeNotification = (formData: FormData, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return httpAuth.post(`/remove-notification`, formData, config);
  };
}
