import React from "react";
import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import InputError from "../inputError/InputError";
import io from "socket.io-client";
import { ENDPOINT } from "../../../config/config";

const socket = io(ENDPOINT);

interface NestedInputProps {
  name: string;
  label: string;
  type: string;
  errorMessage: string | undefined;
}

const NestedInput = ({ name, label, errorMessage, type }: NestedInputProps) => {
  const { register } = useFormContext();

  return (
    <div className="nested-input-container">
      <TextField
        size="small"
        variant="outlined"
        fullWidth
        label={label}
        type={type}
        error={errorMessage ? true : false}
        {...register(name)}
      />
      {errorMessage && <InputError errorMessage={errorMessage} />}
    </div>
  );
};

export default NestedInput;
