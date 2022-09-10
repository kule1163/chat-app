import { Typography, Button } from "@mui/material";
import React, { useMemo } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { removeFromChat } from "../../../../features/chat/asyncThunks";
import AddUser from "../addUser/AddUser";
import GroupUser from "../groupUser/GroupUser";
import EditForm from "./editForm/EditForm";
import "./styles.scss";
import Image from "../../../../assets/signup.jpg";
import Header from "../header/Header";

const EditGroupChat = () => {
  const dispatch = useAppDispatch();
  const { currentChat } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);

  const formData = new FormData();

  if (currentChat && user) {
    formData.append("chatId", currentChat?._id);
    formData.append("userId", user._id);
  }

  const handleRemoveUser = (id: string) => {
    const formData = new FormData();
    if (currentChat) {
      formData.append("chatId", currentChat?._id);
      formData.append("userId", id);

      dispatch(removeFromChat(formData));
    }
  };

  const memorizedGroupMembers = useMemo(() => {
    return (
      <>
        {currentChat &&
          currentChat.users
            .filter((item) => item._id !== user?._id)
            .map((item) => (
              <div key={item._id} className="user-box">
                <div key={item._id} className="single-user-box">
                  <img src={Image} />
                  <Typography className="name-text">{item.fullName}</Typography>
                </div>
                {currentChat.isGroupChat &&
                  user?._id === currentChat.groupAdmin._id && (
                    <div
                      data-testid={`${item.email}-remove`}
                      onClick={() => handleRemoveUser(item._id)}
                      className="icon-box"
                    >
                      <AiOutlineClose color="red" cursor="pointer" size={20} />
                    </div>
                  )}
              </div>
            ))}
      </>
    );
  }, [currentChat]);

  const memorizedAdmin = useMemo(() => {
    return (
      <>
        {currentChat && currentChat.groupAdmin._id === user?._id && (
          <div className="admin-skills-box">
            <EditForm />
            <GroupUser />
            <AddUser />
          </div>
        )}
      </>
    );
  }, [currentChat]);

  return (
    <>
      {currentChat && (
        <div className="edit-group-chat-container g-toggle-box">
          <Header header={currentChat.chatName} />
          <div className="users-container">
            <Typography className="header">Group Members</Typography>
            <>{memorizedGroupMembers}</>
          </div>
          <>{memorizedAdmin}</>
          <div data-testid="leave-button" className="leave-button">
            <Button
              onClick={() => dispatch(removeFromChat(formData))}
              color="error"
              variant="contained"
            >
              leave group
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditGroupChat;
