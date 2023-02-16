import nookies from "nookies";
import { BasicInfoData } from "../react-hook-form/basic-info-validation";
import { EmailInfoData } from "../react-hook-form/email-validation";
import { PasswordInfoData } from "../react-hook-form/password-validation";
import { SignInData } from "../react-hook-form/sign-in-validation";
import { SignUpData } from "../react-hook-form/sign-up-validation";
import { api } from "./api";

export const userApi = {
  signIn: async (data: SignInData) => {
    return await api.post("/user/sign-in", data).catch((res) => res.response);
  },

  signUp: async (data: SignUpData) => {
    return await api.post("/user/sign-up", data).catch((res) => res.response);
  },

  updateBasicInfo: async (data: BasicInfoData) => {
    return await api
      .put("/user/basic-info", data, {
        headers: {
          authorization: `Baerer ${nookies.get()["purplenotes.token"]}`,
        },
      })
      .catch((res) => res.response);
  },

  updatePassword: async (data: PasswordInfoData) => {
    return await api
      .put("/user/password", data, {
        headers: {
          authorization: `Baerer ${nookies.get()["purplenotes.token"]}`,
        },
      })
      .catch((res) => res.response);
  },

  deleteAccount: async (data: PasswordInfoData) => {
    return await api
      .delete("/user", {
        data,
        headers: {
          authorization: `Baerer ${nookies.get()["purplenotes.token"]}`,
        },
      })
      .catch((res) => res.response);
  },

  sendPasswordRecovery: async (data: EmailInfoData) => {
    return await api
      .post("/user/password-recovery", data)
      .catch((res) => res.response);
  },
};
