import React from "react";
import { Typography } from "@mui/material";
import { AiOutlineSearch } from "react-icons/ai";
import { CgLogOut } from "react-icons/cg";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setSearchbarToggle } from "../../features/talkATive/talkATiveSlice";
import Notifications from "./notifications/Notifications";
import "./styles.scss";
import Avatar from "@mui/joy/Avatar";
import { persistor } from "../../index";
import { handleOnlineStatu } from "../../features/auth/ayncThunks";
import io from "socket.io-client";
import { ENDPOINT } from "../../config/config";

const socket = io(ENDPOINT);

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);

  return (
    <div className="navbar-container">
      <div
        onClick={() => dispatch(setSearchbarToggle(true))}
        className="search-box"
        data-testid="search-box"
      >
        <AiOutlineSearch size={40} />
        <Typography className="text">Search User</Typography>
      </div>
      <Typography className="header">Talk-A-Tive</Typography>
      <div className="features-box">
        <div style={{ height: "100%" }}>
          <Notifications />
        </div>

        <Avatar alt="Remy Sharp" src={user?.profilePhoto.url} />

        <div
          onClick={() => {
            if (user) {
              const formData = new FormData();
              formData.append("email", user.email);
              formData.append("statu", "offline");
              dispatch(handleOnlineStatu({ formData, socket }));
            }
            sessionStorage.clear();
            persistor.purge();
            window.location.href = "https://batu-chatapp.herokuapp.com/login";
          }}
          data-testid="logout"
          style={{ pointerEvents: `${status === "pending" ? "none" : "all"}` }}
        >
          <CgLogOut cursor="pointer" size={30} color="#c62828" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
