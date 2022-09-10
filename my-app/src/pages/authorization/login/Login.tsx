import React, { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./FormValidation";
import { SubmitHandler } from "react-hook-form";
import NestedInput from "../../../components/reacthookform/nestedInputs/NestedInput";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { login } from "../../../features/auth/ayncThunks";
import { AsyncButton } from "../../../components/styledComponents/styledComponents";
import Spinner from "../../../components/spinner/Spinner";
import {
  mdSpinner,
  whiteSpinner,
} from "../../../components/spinner/spinnerVeriable";
import { resetAuthMessage } from "../../../features/auth/authSlice";
import io from "socket.io-client";
import { ENDPOINT } from "../../../config/config";

const socket = io(ENDPOINT);

interface Inputs {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { status, message } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const methods = useForm<Inputs>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { email, password } = data;

    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);

    dispatch(login({ formData, navigate, socket }));
  };

  return (
    <div className="authorization-container">
      <div className="authorization-box">
        <FormProvider {...methods}>
          <form className="form-box" onSubmit={methods.handleSubmit(onSubmit)}>
            <Typography className="form-header">Sing in</Typography>

            <NestedInput
              name="email"
              errorMessage={methods.formState.errors?.email?.message}
              label="email"
              type="text"
            />
            <NestedInput
              name="password"
              label="password"
              errorMessage={methods.formState.errors?.password?.message}
              type="password"
            />

            <AsyncButton
              status={status}
              color="primary"
              type="submit"
              variant="contained"
            >
              {status === "pending" ? (
                <Spinner color={whiteSpinner} size={mdSpinner} />
              ) : (
                "sign in"
              )}
            </AsyncButton>
            {message && <Typography color="error">* {message}</Typography>}
            <Typography>
              Don't have an account?{" "}
              <span
                onClick={() => {
                  navigate("/");
                  dispatch(resetAuthMessage());
                }}
                className="form-span"
              >
                Sign up
              </span>
            </Typography>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Login;
