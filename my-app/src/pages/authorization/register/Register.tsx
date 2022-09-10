import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./FormValidation";
import NestedInput from "../../../components/reacthookform/nestedInputs/NestedInput";
import { Typography } from "@mui/material";
import InputError from "../../../components/reacthookform/inputError/InputError";
import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { register } from "../../../features/auth/ayncThunks";
import Spinner from "../../../components/spinner/Spinner";
import { AsyncButton } from "../../../components/styledComponents/styledComponents";
import {
  mdSpinner,
  whiteSpinner,
} from "../../../components/spinner/spinnerVeriable";
import { resetAuthMessage } from "../../../features/auth/authSlice";

interface Inputs {
  fullName: string;
  email: string;
  password: string;
  password2: string;
  file: FileList;
}

const Register = () => {
  const dispatch = useAppDispatch();
  const { status, message } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  const methods = useForm<Inputs>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { email, file, fullName, password, password2 } = data;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("fullName", fullName);
    formData.append("password", password);
    formData.append("profilePhoto", file[0]);

    dispatch(register({ formData, navigate }));
  };

  return (
    <div className="authorization-container">
      <div className="authorization-box">
        <FormProvider {...methods}>
          <form className="form-box" onSubmit={methods.handleSubmit(onSubmit)}>
            <Typography className="form-header">Sing Up</Typography>
            <div className="icon-box">
              <BsPersonCircle size={40} />
            </div>
            <div className="input-box">
              <input type="file" {...methods.register("file")} />
              <InputError
                errorMessage={methods.formState.errors?.file?.message}
              />
            </div>
            <NestedInput
              name="fullName"
              errorMessage={methods.formState.errors?.fullName?.message}
              label="fullname"
              type="text"
            />
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
            <NestedInput
              name="password2"
              label="password confirm"
              errorMessage={methods.formState.errors?.password2?.message}
              type="password"
            />
            <AsyncButton
              status={status}
              sx={{ positon: "relative" }}
              color="primary"
              type="submit"
              variant="contained"
            >
              {status === "pending" ? (
                <Spinner color={whiteSpinner} size={mdSpinner} />
              ) : (
                "register"
              )}
            </AsyncButton>
            {message && <Typography color="error">* {message}</Typography>}
            <Typography>
              Already have an account?{" "}
              <span
                onClick={() => {
                  navigate("/login");
                  dispatch(resetAuthMessage());
                }}
                className="form-span"
              >
                Sign In
              </span>
            </Typography>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Register;
