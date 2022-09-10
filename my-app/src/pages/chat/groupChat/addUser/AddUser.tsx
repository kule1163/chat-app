import { TextField, Button, Typography } from "@mui/material";
import React, { useState, useRef, memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import UserInfoBox from "../../../../components/userInfoBox/UserInfoBox";
import { getUsers } from "../../../../features/auth/ayncThunks";
import { addToChat } from "../../../../features/chat/asyncThunks";
import "./styles.scss";

const AddUser = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const ref = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useState<string>("");

  const { searchUsers } = useAppSelector((state) => state.auth);
  const { handleGroupForm } = useAppSelector((state) => state.talkATive);
  const { message, currentChat, toAddUsers } = useAppSelector(
    (state) => state.chat
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    if (currentChat) {
      toAddUsers.forEach((user) => formData.append("users[]", user._id));
      formData.append("chatId", currentChat?._id);

      dispatch(addToChat(formData));
    }
  };

  const momorizedSearchUsers = useMemo(() => {
    return (
      <>
        {searchValue &&
          searchUsers.map((item) => (
            <UserInfoBox
              setSearchValue={setSearchValue}
              features="add-user"
              key={item._id}
              user={item}
            />
          ))}
      </>
    );
  }, [searchUsers]);

  return (
    <form onSubmit={handleSubmit} className="add-user-container">
      <div className="g-create-group-form">
        <div className="input-box ">
          <TextField
            className="g-create-group-input"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              e.target.value &&
                dispatch(getUsers({ keyword: e.target.value, navigate }));
            }}
            fullWidth
            size="small"
            type="text"
            label="add-user"
            name="add-user"
          />
          {message.length > 0 && (
            <Typography className="error-text">* {message}</Typography>
          )}
        </div>
        {handleGroupForm === "edit" && (
          <div
            data-testid="add-user-button"
            onClick={() => ref.current && ref.current?.click()}
          >
            <Button className="g-create-group-button" variant="contained">
              add
            </Button>
          </div>
        )}
      </div>
      <>{momorizedSearchUsers}</>
      {handleGroupForm === "edit" && (
        <input ref={ref} style={{ display: "none" }} type="submit" />
      )}
    </form>
  );
};

export default memo(AddUser);
