import axios from "axios";

export const httpAuth = axios.create({
  baseURL: "/auth",
  headers: { "Content-Type": "multipart/form-data" },
});

export const httpChat = axios.create({
  baseURL: "/chat",
  headers: { "Content-Type": "multipart/form-data" },
});

export const httpMessage = axios.create({
  baseURL: "/message",
  headers: { "Content-Type": "multipart/form-data" },
});
