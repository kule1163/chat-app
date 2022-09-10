import React, { useRef, useState, useMemo } from "react";
import { Badge, Typography } from "@mui/material";
import "./styles.scss";
import { FaBell } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { countSameMessage, getSender } from "../../../config/ChatLogic";
import {
  setContentToggle,
  setSearchbarToggle,
} from "../../../features/talkATive/talkATiveSlice";
import { setCurrentChat } from "../../../features/chat/chatSlice";
import { removeNotification } from "../../../features/auth/ayncThunks";

const Notifications = () => {
  const [display, setDisplay] = useState<boolean>(false);
  const { user, notifications } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const refBadge = useRef<HTMLDivElement>(null);
  const refInfo = useRef<HTMLDivElement>(null);
  const refGhost = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      (refBadge.current && refBadge.current.contains(e.target as Node)) ||
      (refInfo.current && refInfo.current.contains(e.target as Node)) ||
      (refGhost.current && refGhost.current.contains(e.target as Node))
    ) {
      setDisplay(true);
    }
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      (refBadge.current && refBadge.current.contains(e.target as Node)) ||
      (refInfo.current && refInfo.current.contains(e.target as Node)) ||
      (refGhost.current && refGhost.current.contains(e.target as Node))
    ) {
      setDisplay(false);
    }
  };

  const memorizedNotifications = useMemo(() => {
    return (
      <>
        {user && notifications && notifications.length > 0 ? (
          [
            ...new Map(
              notifications?.map((item) => [item.message.sender["_id"], item])
            ).values(),
          ].map((item) => (
            <div
              data-testid={`noti-${item.message.sender.fullName}`}
              onClick={() => {
                const formData = new FormData();
                formData.append("chatId", item.message.chat._id);
                dispatch(setSearchbarToggle(false));
                dispatch(setContentToggle(false));
                dispatch(setCurrentChat(item.message.chat));
                dispatch(removeNotification(formData));
                setDisplay(false);
              }}
              key={item.message._id}
              className="text-box"
            >
              <Typography className="text">
                {item.message.chat.isGroupChat
                  ? `New Message In ${item.message.chat.chatName}`
                  : `New Message From ${getSender({
                      loggedUser: user,
                      users: item.message.chat.users,
                    })}`}{" "}
                {countSameMessage({
                  notifications,
                  sender: item.message.sender._id,
                })}
              </Typography>
            </div>
          ))
        ) : (
          <div className="text-box">
            <Typography className="text">No New Messages</Typography>
          </div>
        )}
      </>
    );
  }, [notifications, user]);

  return (
    <>
      {user && (
        <div className="notifications-container">
          <div
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            ref={refBadge}
            className="badge-box"
          >
            <Badge badgeContent={notifications?.length} color="error">
              <FaBell />
            </Badge>
          </div>
          <div
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            ref={refGhost}
            className="ghost-box"
          ></div>
          {display && (
            <div
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
              ref={refInfo}
              className="info-box"
            >
              {memorizedNotifications}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Notifications;
