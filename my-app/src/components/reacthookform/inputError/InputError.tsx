import { Typography } from "@mui/material";
import React from "react";

interface InputErrorProps {
  errorMessage: string | undefined;
}

const InputError = ({ errorMessage }: InputErrorProps) => {
  return (
    <>
      {errorMessage && (
        <Typography className="input-error-message">
          <span>*</span>
          {errorMessage}
        </Typography>
      )}
    </>
  );
};

export default InputError;
