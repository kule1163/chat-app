import { Typography } from "@mui/material";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./styles.scss";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { removeToAddUsers } from "../../../../features/chat/chatSlice";

const GroupUser = () => {
  const dispatch = useAppDispatch();
  const { toAddUsers } = useAppSelector((state) => state.chat);

  const handleClick = (userId: string) => {
    dispatch(removeToAddUsers(userId));
  };

  return (
    <div className="group-user-container">
      {toAddUsers.map((item) => (
        <div
          onClick={() => handleClick(item._id)}
          key={item._id}
          className="group-user-box"
        >
          <Typography className="name-text">{item.fullName}</Typography>
          <AiOutlineClose size={15} />
        </div>
      ))}
    </div>
  );
};

export default GroupUser;
