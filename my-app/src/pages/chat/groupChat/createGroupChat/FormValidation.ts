import * as yup from "yup";

export const schema = yup.object().shape({
  chatName: yup.string().required(),
});
