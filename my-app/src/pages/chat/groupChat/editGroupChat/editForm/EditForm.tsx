import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { schema } from "./FormValidation";
import NestedInput from "../../../../../components/reacthookform/nestedInputs/NestedInput";
import "./styles.scss";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { renameGroup } from "../../../../../features/chat/asyncThunks";

interface chatName {
  chatName: string;
}

const EditForm = () => {
  const dispatch = useAppDispatch();
  const { currentChat } = useAppSelector((state) => state.chat);

  const methods = useForm<chatName>({
    resolver: yupResolver(schema),
  });

  const onSubmitChatname: SubmitHandler<chatName> = (data) => {
    const { chatName } = data;

    const formdata = new FormData();

    if (currentChat) {
      formdata.append("chatName", chatName);
      formdata.append("chatId", currentChat._id);

      dispatch(renameGroup(formdata));
    }
  };

  return (
    <div className="edit-form-container">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmitChatname)}
          className="g-create-group-form"
        >
          <div className="g-create-group-input">
            <NestedInput
              label="chatName"
              type="text"
              errorMessage={methods.formState.errors.chatName?.message}
              name="chatName"
            />
          </div>
          <Button
            type="submit"
            className="g-create-group-button"
            variant="contained"
          >
            update
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditForm;
