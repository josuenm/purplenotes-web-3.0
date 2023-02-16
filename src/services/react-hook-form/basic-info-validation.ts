import * as yup from "yup";

export const EditBasicInfoSchema = yup
  .object({
    name: yup
      .string()
      .min(1, "Name must be at least 1 character")
      .max(80, "Name cannot have more than 80 characters")
      .required("Name is required"),

    email: yup.string().email("Email is invalid").required("Email is require"),
  })
  .required();

export type BasicInfoData = yup.InferType<typeof EditBasicInfoSchema>;
