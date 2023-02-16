import * as yup from "yup";

export const schema = yup.object({
  name: yup
    .string()
    .min(1, "Name must be at least 1 character")
    .max(80, "Name cannot have more than 80 characters")
    .required("Name is required"),
  email: yup.string().email("Email is invalid").required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(80, "Password cannot have more than 80 characters")
    .required("Password is required"),

  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must be the same"),
});

export type SignUpData = yup.InferType<
  Omit<typeof schema, "passwordConfirmation">
>;
