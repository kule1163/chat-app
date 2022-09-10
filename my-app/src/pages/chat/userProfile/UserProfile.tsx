import { Typography, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getGuest } from "../../../config/ChatLogic";
import { setUserProfileToggle } from "../../../features/talkATive/talkATiveSlice";
import { User } from "../../../features/types";
import "./styles.scss";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const [guestUser, setGuestUser] = useState<User | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  const { currentChat } = useAppSelector((state) => state.chat);

  const ref = useRef<HTMLDivElement>(null);

  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      dispatch(setUserProfileToggle(false));
    }
  };

  useEffect(() => {
    if (user && currentChat) {
      const guestUser = getGuest({
        loggedUser: user,
        users: currentChat.users,
      });

      setGuestUser(guestUser);
    }
  }, [currentChat, user]);

  return (
    <>
      {guestUser && (
        <div onClick={(e) => handleClose(e)} className="user-profile-container">
          <div ref={ref} className="user-profile-box">
            <Typography className="profile-header">
              {guestUser.fullName}
            </Typography>
            <img className="profile-photo" src={guestUser.profilePhoto.url} />
            <Typography className="email">Email: {guestUser.email}</Typography>
            <Button
              data-testid="close"
              className="button"
              size="small"
              color="inherit"
              variant="contained"
              onClick={() => dispatch(setUserProfileToggle(false))}
            >
              close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
