import React, { memo, useEffect, useState } from "react";
import "./sass/main.scss";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/authorization/register/Register";
import Login from "./pages/authorization/login/Login";
import Chat from "./pages/chat/Chat";
import BackgroundImage from "./assets/background.png";
import { useAppDispatch } from "./app/hooks";
import { handleOnlineStatu } from "./features/auth/ayncThunks";
import { persistor } from ".";
import io from "socket.io-client";
import { ENDPOINT } from "./config/config";

const socket = io(ENDPOINT);

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on("user disconnect", (email) => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("statu", "offline");
      dispatch(handleOnlineStatu({ formData, socket }));
    });

    return () => {
      socket.off("user disconnect");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("reconnection", (email) => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("statu", "online");
      dispatch(handleOnlineStatu({ formData, socket }));
    });

    return () => {
      socket.off("reconnection");
    };
  }, [socket]);

  return (
    <div
      className="app"
      style={{
        position: "relative",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default memo(App);
