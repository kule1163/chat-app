import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth";
import chatRoute from "./routes/chat";
import messageRoute from "./routes/message";
import { Server, Socket } from "socket.io";
import { Chat, User } from "../my-app/src/features/types";
import axios from "axios";
import path from "path";

const app = express();

dotenv.config();

app.use(
  "/uploads/profilePhotos",
  express.static(__dirname + "/uploads/profilePhotos")
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../my-app/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../my-app/build/index.html"));
  });
}

const CONNETION_URL = process.env.MONGODB_URI;
const PORT = 5000;

interface OnlineUser {
  id: string;
  email: string;
  token: string;
  socketId: string;
}

let onlineUsers: OnlineUser[] = [];

if (CONNETION_URL) {
  mongoose
    .connect(CONNETION_URL)
    .then(() => {
      const server = app.listen(PORT, () =>
        console.log(`server is listening ${PORT}`)
      );
      const io = new Server(server, {
        pingTimeout: 60000,
        cors: {
          origin: "http://localhost:3000",
        },
      });

      io.on("connection", (socket) => {
        console.log("Connected to socket.io");

        socket.on("setup", (userData) => {
          if (userData) {
            socket.emit("connected", socket.id);

            socket.join(userData._id);

            const currentUser = onlineUsers.find(
              (item) => item.id === userData._id
            );

            if (!currentUser) {
              onlineUsers.push({
                email: userData.email,
                socketId: socket.id,
                id: userData._id,
                token: userData.token,
              });
            } else {
              currentUser.socketId = socket.id;
            }

            socket.broadcast.emit("reconnection", userData.email);
          }
        });

        socket.on("handle close", (user) => {
          const currentUser = onlineUsers.find((item) => item.id === user._id);

          if (currentUser) {
            socket.broadcast.emit("dont allow", currentUser);
          }
        });

        socket.on("disconnect", async () => {
          if (onlineUsers.length === 1) {
            try {
              await axios.post("http://localhost:5000/auth/online-statu", {
                email: onlineUsers[0].email,
                statu: "offline",
              });

              onlineUsers = onlineUsers.filter(
                (item) => item.socketId !== socket.id
              );
              onlineUsers = onlineUsers.filter(
                (item) => item.socketId !== socket.id
              );
            } catch (error) {
              console.log(error);
            }
          } else {
            const currentUser = onlineUsers.find(
              (item) => item.socketId === socket.id
            );
            if (currentUser) {
              socket.broadcast.emit("user disconnect", currentUser.email);
              onlineUsers = onlineUsers.filter(
                (item) => item.socketId !== socket.id
              );
              onlineUsers = onlineUsers.filter(
                (item) => item.socketId !== socket.id
              );
            }
          }
        });

        socket.on("handle online", (user: User) => {
          socket.broadcast.emit("user statu", user);
        });

        socket.on("join chat", (room) => {
          socket.join(room);
        });
        socket.on("typing", (room) => {
          socket.in(room._id).emit("typing", room._id);
        });
        socket.on("stop typing", (room) =>
          socket.in(room._id).emit("stop typing")
        );

        socket.on("new message", (newMessageRecieved) => {
          var chat: Chat = newMessageRecieved.chat;
          if (!chat.users) return console.log("chat.users not defined");

          chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
          });
        });
        interface AccessChatProps {
          chat: Chat;
          sender: string;
        }
        socket.on("access chat", ({ chat, sender }: AccessChatProps) => {
          if (chat && sender) {
            chat.users.forEach((user) => {
              if (user._id == sender) return;

              socket.broadcast.to(user._id).emit("get chat", chat);
            });
          }
        });
      });
    })
    .catch((err) => console.log(err.message));
}
