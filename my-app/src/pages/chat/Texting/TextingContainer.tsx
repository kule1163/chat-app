import React, { memo, useEffect, useState, useMemo } from "react";
import { IconButton, TextField, Typography } from "@mui/material";
import "./styles.scss";
import { AiFillEye } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsArrowLeftSquare } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  setContentToggle,
  setCreateGroupForm,
  setHandleGroupForm,
  setUserProfileToggle,
} from "../../../features/talkATive/talkATiveSlice";
import {
  getMessages,
  sendMessage,
} from "../../../features/message/asyncThunks";
import {
  getSender,
  isInGroup,
  isLastMessage,
  isSameSender,
} from "../../../config/ChatLogic";
import { setMessages } from "../../../features/message/messageSlice";
import TypingAnimation from "../../../components/lottie/TypingAnimation";
import { deleteChat } from "../../../features/chat/asyncThunks";
import {
  addToChats,
  modifedChat,
  setCurrentChat,
} from "../../../features/chat/chatSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import useScrollToBottom from "../../../config/hooks/useScrollToBottom";
import { Chat, Message } from "../../../features/types";
import { setNotification } from "../../../features/auth/ayncThunks";
import Spinner from "../../../components/spinner/Spinner";
import io from "socket.io-client";
import { ENDPOINT } from "../../../config/config";

const socket = io(ENDPOINT);

export interface Inputs {
  message: string;
}

interface Props {
  socketConnection: boolean;
}

const TextingContainer = ({ socketConnection }: Props) => {
  const dispatch = useAppDispatch();
  const { user, notifications, status } = useAppSelector((state) => state.auth);
  const { currentChat } = useAppSelector((state) => state.chat);
  const { messages, getMessagesStatus } = useAppSelector(
    (state) => state.message
  );

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [gg, setGg] = useState<string>("");
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const { register, handleSubmit, reset } = useForm<Inputs>();

  const ref = useScrollToBottom({ dep: messages });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { message } = data;

    const formData = new FormData();

    if (currentChat) {
      formData.append("content", message);
      formData.append("chatId", currentChat._id);
      currentChat.users.forEach((item) => formData.append("users[]", item._id));
      socket.emit("stop typing", currentChat);
      setTyping(false);

      dispatch(sendMessage({ formData, socket, reset }));
    }
  };

  useEffect(() => {
    socket.on("get chat", (chat: Chat) => {
      dispatch(addToChats(chat));
    });

    return () => {
      socket.off("get chat");
    };
  });

  useEffect(() => {
    socket.on("typing", (roomId: string) => {
      setIsTyping(true);
      setGg(roomId);
    });
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    if (currentChat) {
      const formData = new FormData();
      formData.append("chatId", currentChat._id);

      dispatch(getMessages({ chatId: currentChat._id, socket }));
      socket.emit("setup", user);
    }
  }, [currentChat?._id]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved: Message) => {
      if (
        currentChat === null || // if chat is not selected or doesn't match current chat
        currentChat._id !== newMessageRecieved.chat._id
      ) {
        if (
          !notifications.includes({
            message: newMessageRecieved,
            chat: newMessageRecieved.chat._id,
          })
        ) {
          const formData = new FormData();

          const filteredUsers = newMessageRecieved.users.filter(
            (item) => item !== newMessageRecieved.sender._id
          );

          filteredUsers.forEach((item) => formData.append("users[]", item));
          formData.append("chatId", newMessageRecieved.chat._id);
          formData.append("messageId", newMessageRecieved._id);

          dispatch(modifedChat(newMessageRecieved));
          dispatch(setNotification(formData));
        }
      } else {
        dispatch(setMessages(newMessageRecieved));
        dispatch(modifedChat(newMessageRecieved));
      }
    });

    return () => {
      socket.off("message recieved");
    };
  });

  const handleTyping = () => {
    if (!socketConnection) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", currentChat);
    }

    clearTimeout(timer);

    const newTİmer = setTimeout(() => {
      socket.emit("stop typing", currentChat);
      setTyping(false);
    }, 3000);

    setTimer(newTİmer);
  };

  const handleDeleteChat = () => {
    const formData = new FormData();

    if (currentChat) {
      formData.append("chatId", currentChat._id);

      dispatch(deleteChat(formData));
    }
  };

  const memorizedMessages = useMemo(() => {
    return (
      <>
        {user &&
          messages.map((item, i) => (
            <div key={item._id} className="box">
              {isSameSender({
                i,
                message: item,
                messages,
                userId: user?._id,
              }) ||
              isLastMessage({
                i,
                messages,
                userId: user?._id,
              }) ? (
                <img
                  data-testid="profile-photo"
                  src={item.sender.profilePhoto.url}
                />
              ) : (
                <div className="margin-left"></div>
              )}

              <Typography
                sx={{ wordBreak: "break-word" }}
                data-testid={item.content}
                className={
                  item.sender._id === user?._id ? "user-text" : "its-text"
                }
              >
                {item.content}
              </Typography>
            </div>
          ))}
      </>
    );
  }, [messages]);

  const memorizedSender = useMemo(() => {
    return (
      <>
        {user && currentChat && (
          <Typography className="chat-g-header">
            {currentChat && gg === currentChat._id && isTyping ? (
              <div className="typing-box">
                <TypingAnimation />
              </div>
            ) : currentChat.isGroupChat ? (
              currentChat.chatName
            ) : (
              getSender({ loggedUser: user, users: currentChat.users })
            )}
          </Typography>
        )}
      </>
    );
  }, [currentChat?._id, isTyping]);

  return (
    <>
      {/*   <Typography className="no-texting">dasdasdsadsa</Typography> */}
      {getMessagesStatus === "pending" ? (
        <div className="g-spinner-box">
          <Spinner />
        </div>
      ) : (
        user &&
        currentChat && (
          <>
            <div className="chat-g-header-box">
              <div data-testid="back-icon">
                <IconButton
                  onClick={() => {
                    dispatch(setContentToggle(true));
                    dispatch(setCurrentChat(null));
                  }}
                  className="chat-g-back-icon"
                >
                  <BsArrowLeftSquare />
                </IconButton>
              </div>
              {memorizedSender}
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    pointerEvents: `${status === "pending" ? "none" : "all"}`,
                  }}
                  data-testid="delete-icon"
                >
                  <IconButton onClick={handleDeleteChat} color="error">
                    <RiDeleteBin6Line />
                  </IconButton>
                </div>
                {isInGroup(currentChat.users, user) && (
                  <div data-testid="features-icon">
                    <IconButton
                      onClick={() => {
                        if (currentChat?.isGroupChat) {
                          dispatch(setCreateGroupForm(true));
                          dispatch(setHandleGroupForm("edit"));
                        } else {
                          dispatch(setUserProfileToggle(true));
                        }
                      }}
                    >
                      <AiFillEye />
                    </IconButton>
                  </div>
                )}
              </div>
            </div>
            {currentChat && (
              <div className="texting-box">
                <div ref={ref} className="g-scrollable-box">
                  {memorizedMessages}
                </div>
                {currentChat.users.find((item) => item._id === user._id) && (
                  <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                      size="medium"
                      className="input"
                      placeholder="Enter a message..."
                      fullWidth
                      {...register("message", { onChange: handleTyping })}
                    />
                  </form>
                )}
              </div>
            )}
          </>
        )
      )}
    </>
  );
};

export default memo(TextingContainer);
