import { Typography } from "@mui/material";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useAppDispatch } from "../../../../app/hooks";
import { closeCreateGroupForm } from "../../../../features/config/helperReducer";

interface Props {
  header: string;
}

const Header = ({ header }: Props) => {
  return (
    <div className="g-toggle-header-box">
      <Typography className="g-toggle-header">{header}</Typography>
      <div
        data-testid="close-box-icon"
        onClick={() => {
          closeCreateGroupForm();
        }}
      >
        <AiOutlineClose />
      </div>
    </div>
  );
};

export default Header;
