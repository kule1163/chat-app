import axios from "axios";

export const httpAuth = axios.create({
  baseURL: "http://localhost:5000/auth",
});

export const httpChat = axios.create({
  baseURL: "http://localhost:5000/chat",
});

export const httpMessage = axios.create({
  baseURL: "http://localhost:5000/message",
});
