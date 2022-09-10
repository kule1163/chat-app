import * as yup from "yup";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

export const schema = yup.object().shape({
  fullName: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
  password2: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "Password does not match"),
  file: yup.mixed().test("fileType", "Unsuported File Format", (value) => {
    if (value.length) {
      return SUPPORTED_FORMATS.includes(value[0].type);
    } else {
      return true;
    }
  }),
});
