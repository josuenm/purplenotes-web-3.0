import * as yup from "yup";

export const passwordInfoSchema = yup.object({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(80, "Password cannot have more than 80 characters")
    .required("Password is required"),

  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must be the same"),
});

export type PasswordInfoData = yup.InferType<typeof passwordInfoSchema>;
