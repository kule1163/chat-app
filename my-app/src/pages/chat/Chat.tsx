import React, { memo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Navbar from "../../components/navbar/Navbar";
import Searchbar from "../../components/search/Search";
import ChatInfo from "./chatInfo/ChatInfo";
import GroupChat from "./groupChat/GroupChat";
import { ChatInfoBox, TextingBox } from "./styledComponents";
import "./styles.scss";
import TextingContainer from "./Texting/TextingContainer";
import UserProfile from "./userProfile/UserProfile";
import io from "socket.io-client";
import { User } from "../../features/types";
import { handleUserStatu } from "../../features/chat/chatSlice";
import { ENDPOINT } from "../../config/config";
import { persistor } from "../..";
import { handleOnlineStatu } from "../../features/auth/ayncThunks";

const socket = io(ENDPOINT);

const Chat = () => {
  const dispatch = useAppDispatch();

  const [socketConnection, setSocketConnection] = useState<boolean>(false);

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnection(true));
    return () => {
      socket.off("connected");
    };
  });

  useEffect(() => {
    socket.on("dont allow", (decodedUser) => {
      if (user && user.token === decodedUser.token) {
        sessionStorage.clear();
        persistor.purge();
        window.location.href = "http://localhost:3000/login";
      }
    });
    return () => {
      socket.off("dont allow");
    };
  });

  const { contentToggle, searchbarToggle, userProfileToggle, createGroupForm } =
    useAppSelector((state) => state.talkATive);

  useEffect(() => {
    socket.on("user statu", (user: User) => {
      dispatch(handleUserStatu(user));
    });

    return () => {
      socket.off("user statu");
    };
  });

  return (
    <>
      <div className="chat-container">
        <Navbar />
        {userProfileToggle && <UserProfile />}
        {createGroupForm && <GroupChat />}
        {searchbarToggle && <Searchbar />}
        <div className="chat-box">
          <div className="features-box">
            <ChatInfoBox contentToggle={contentToggle}>
              <div className="chat-info-box-md">
                <ChatInfo />
              </div>
            </ChatInfoBox>
            <TextingBox contentToggle={contentToggle}>
              <div className="texting-container-box-md">
                <TextingContainer socketConnection={socketConnection} />
              </div>
            </TextingBox>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Chat);
