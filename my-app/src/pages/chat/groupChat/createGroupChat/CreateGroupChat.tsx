import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import React, { memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import NestedInput from "../../../../components/reacthookform/nestedInputs/NestedInput";
import { createGroupChat } from "../../../../features/chat/asyncThunks";
import AddUser from "../addUser/AddUser";
import GroupUser from "../groupUser/GroupUser";
import Header from "../header/Header";
import { schema } from "./FormValidation";
import "./styles.scss";
import io from "socket.io-client";
import { ENDPOINT } from "../../../../config/config";

const socket = io(ENDPOINT);

interface Inputs {
  chatName: string;
}

const CreateGroupChat = () => {
  const methods = useForm<Inputs>({ resolver: yupResolver(schema) });
  const dispatch = useAppDispatch();
  const { toAddUsers, status } = useAppSelector((state) => state.chat);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { chatName } = data;

    const formData = new FormData();

    formData.append("chatName", chatName);
    toAddUsers.forEach((user) => formData.append("users[]", user._id));

    if (status === "succeeded") {
      methods.reset();
    }

    dispatch(createGroupChat({ formData, socket }));
  };

  return (
    <div className="g-toggle-box">
      <FormProvider {...methods}>
        <form
          className="g-toggle-form form"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Header header="Create Group Chat" />
          <NestedInput
            label="Chat Name"
            name="chatName"
            type="text"
            errorMessage={methods.formState.errors.chatName?.message}
          />
          <GroupUser />
          <AddUser />
          <div className="form-button">
            <Button type="submit" color="primary" variant="contained">
              create chat
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default memo(CreateGroupChat);
