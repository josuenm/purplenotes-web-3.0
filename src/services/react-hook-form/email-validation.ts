import * as yup from "yup";

export const EmailInfoSchema = yup
  .object({
    email: yup.string().email("Email is invalid").required("Email is require"),
  })
  .required();

export type EmailInfoData = yup.InferType<typeof EmailInfoSchema>;
