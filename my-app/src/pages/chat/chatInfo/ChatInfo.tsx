import React, { memo, useEffect, useMemo } from "react";
import { Button, Typography } from "@mui/material";
import { AiOutlinePlus } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  setContentToggle,
  setCreateGroupForm,
  setHandleGroupForm,
} from "../../../features/talkATive/talkATiveSlice";
import "./styles.scss";
import {
  getGuest,
  getSender,
  handleDeletedChat,
  handleLatestMessage,
} from "../../../config/ChatLogic";
import { setCurrentChat } from "../../../features/chat/chatSlice";
import { fetchChats } from "../../../features/chat/asyncThunks";
import Spinner from "../../../components/spinner/Spinner";
import { removeNotification } from "../../../features/auth/ayncThunks";
import { io } from "socket.io-client";
import { RiRadioButtonLine } from "react-icons/ri";

const ChatInfo = () => {
  const dispatch = useAppDispatch();

  const { chats, fetchChatsStatus } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchChats());
  }, []);

  const memoizedChats = useMemo(() => {
    return (
      <>
        {user &&
          chats.map(
            (item) =>
              handleDeletedChat(item.deletedInfo, user)?.isVisible && (
                <div
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("chatId", item._id);

                    dispatch(setContentToggle(false));
                    dispatch(setCurrentChat(item));
                    dispatch(removeNotification(formData));
                  }}
                  key={item._id}
                  className="last-message-box"
                >
                  {!item.isGroupChat && (
                    <div className="user-statu">
                      <RiRadioButtonLine
                        size={20}
                        color={
                          getGuest({ users: item.users, loggedUser: user })
                            .isOnline
                            ? "green"
                            : "red"
                        }
                      />
                    </div>
                  )}
                  <div className="g-chat-user-box">
                    <Typography className="g-username">
                      {item.isGroupChat
                        ? item.chatName
                        : getSender({ loggedUser: user, users: item.users })}
                    </Typography>
                    {handleLatestMessage(item.latestMessage, user)?.message && (
                      <div
                        data-testid={
                          handleLatestMessage(item.latestMessage, user)?.message
                            ?.content
                        }
                        className="g-footer-box"
                      >
                        {handleDeletedChat(item.deletedInfo, user)
                          ?.isVisibleLatestMessage && (
                          <div data-testid="latest-message">
                            <Typography>
                              <span className="g-span">
                                {
                                  handleLatestMessage(item.latestMessage, user)
                                    ?.message?.sender
                                }
                                :
                              </span>{" "}
                              {
                                handleLatestMessage(item.latestMessage, user)
                                  ?.message?.content
                              }
                            </Typography>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
          )}
      </>
    );
  }, [chats, user]);

  return (
    <>
      {user && (
        <>
          <div className="chat-g-header-box">
            <Typography className="chat-g-header">My Chats</Typography>
            <div data-testid="new-group-chat">
              <Button
                onClick={() => {
                  dispatch(setCreateGroupForm(true));
                  dispatch(setHandleGroupForm("create"));
                }}
                size="small"
                variant="contained"
                endIcon={<AiOutlinePlus />}
              >
                new group chat
              </Button>
            </div>
          </div>
          <div className="last-message-container">
            {fetchChatsStatus === "pending" ? (
              <div className="g-spinner-box">
                <Spinner />
              </div>
            ) : (
              <> {memoizedChats}</>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default memo(ChatInfo);
