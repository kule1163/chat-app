import React, { memo } from "react";
import { Typography } from "@mui/material";
import { User } from "../../features/types";
import { useAppDispatch } from "../../app/hooks";
import { accessChat } from "../../features/chat/asyncThunks";
import { setToAddUsers } from "../../features/chat/chatSlice";
import { setContentToggle } from "../../features/talkATive/talkATiveSlice";
import { closeSearchbar } from "../../features/config/helperReducer";
import io from "socket.io-client";
import { ENDPOINT } from "../../config/config";

const socket = io(ENDPOINT);

interface Props {
  user: User;
  features: "search" | "add-user";
  setSearchValue?: React.Dispatch<React.SetStateAction<string>>;
}

const UserInfoBox = ({ user, features, setSearchValue }: Props) => {
  const dispatch = useAppDispatch();

  const formData = new FormData();

  const handleClick = (currentUser: User) => {
    if (features === "search") {
      formData.append("userId", currentUser._id);
      dispatch(accessChat({ formData, socket }));
      dispatch(setContentToggle(false));
      closeSearchbar();
    }
    if (features === "add-user") {
      dispatch(setToAddUsers(user));
    }
  };

  return (
    <>
      <div
        data-testid={user.email}
        onClick={() => {
          handleClick(user);
          setSearchValue && setSearchValue("");
        }}
        className="g-chat-user-container"
      >
        <img className="g-user-photo" src={user.profilePhoto.url} />
        <div className="g-chat-user-box">
          <Typography sx={{ wordBreak: "break-word" }} className="g-username">
            {user.fullName}
          </Typography>
          <div className="g-footer-box">
            <Typography sx={{ wordBreak: "break-word" }}>
              <span className="g-span">Email: </span>
              {user.email}
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(UserInfoBox);
