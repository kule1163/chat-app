import React, { memo, useRef, useState, useMemo, useEffect } from "react";
import "./styles.scss";
import { TextField, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUsers } from "../../features/auth/ayncThunks";
import { useNavigate } from "react-router-dom";
import UserInfoBox from "../userInfoBox/UserInfoBox";
import { AiOutlineClose } from "react-icons/ai";
import { closeSearchbar } from "../../features/config/helperReducer";

const Search = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");

  const { searchUsers } = useAppSelector((state) => state.auth);

  const ref = useRef<HTMLDivElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(getUsers({ keyword: searchValue, navigate }));
  };

  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      closeSearchbar();
    }
  };

  const memoizedSearchUsers = useMemo(() => {
    return (
      <>
        {searchUsers.map((item) => (
          <UserInfoBox features="search" key={item._id} user={item} />
        ))}
      </>
    );
  }, [searchUsers]);

  return (
    <div onClick={(e) => handleClose(e)} className="search-container">
      <div ref={ref} className="search-box">
        <div className="header-box">
          <Typography className="form-header">Search User</Typography>
          <AiOutlineClose
            onClick={() => {
              closeSearchbar();
            }}
            cursor="pointer"
            size={20}
          />
        </div>
        <form onSubmit={onSubmit} className="form">
          <TextField
            name="search"
            fullWidth
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            type="search"
            placeholder="Search by name or email"
          ></TextField>
          <Button type="submit" variant="contained" color="inherit">
            Go
          </Button>
        </form>
        <>{memoizedSearchUsers}</>
      </div>
    </div>
  );
};

export default memo(Search);
