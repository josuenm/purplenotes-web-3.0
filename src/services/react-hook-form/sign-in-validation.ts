import * as yup from "yup";

export const schema = yup
  .object({
    email: yup.string().email("Email is invalid").required("Email is required"),

    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(80, "Password cannot have more than 80 characters"),
  })
  .required();

export type SignInData = yup.InferType<typeof schema>;
