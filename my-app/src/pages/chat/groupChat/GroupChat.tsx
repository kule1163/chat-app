import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Spinner from "../../../components/spinner/Spinner";
import { closeCreateGroupForm } from "../../../features/config/helperReducer";
import { setMessageStatus } from "../../../features/message/messageSlice";
import { setCreateGroupForm } from "../../../features/talkATive/talkATiveSlice";
import CreateGroupChat from "./createGroupChat/CreateGroupChat";
import EditGroupChat from "./editGroupChat/EditGroupChat";
import "./styles.scss";

const GroupChat = () => {
  const dispatch = useAppDispatch();

  const { createChatStatus } = useAppSelector((state) => state.chat);
  const { handleGroupForm } = useAppSelector((state) => state.talkATive);

  const createRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);

  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (createRef.current && !createRef.current.contains(e.target as Node)) {
      closeCreateGroupForm();
    }
    if (editRef.current && !editRef.current.contains(e.target as Node)) {
      closeCreateGroupForm();
    }
  };

  return (
    <div
      data-testid="create-group-chat-container"
      onClick={(e) => handleClose(e)}
      className="create-group-chat-container g-toggle-container"
    >
      {createChatStatus === "pending" ? (
        <Spinner />
      ) : handleGroupForm === "create" ? (
        <div ref={createRef}>
          <CreateGroupChat />
        </div>
      ) : (
        <div ref={editRef}>
          <EditGroupChat />
        </div>
      )}
    </div>
  );
};

export default GroupChat;
