import { UpdateNoteProps } from "@/types/note-props";
import nookies from "nookies";
import { api } from "./api";

export const noteApi = {
  getAllMyNotes: async () => {
    return await api
      .get("/note/my/all", {
        headers: {
          authorization: `Baerer ${nookies.get()["purplenotes.token"]}`,
        },
      })
      .catch((res) => res.response);
  },

  getNote: async (id: string) => {
    return await api.get(`/note/${id}`).catch((res) => res.response);
  },

  getMyNote: async (id: string, token?: string | undefined) => {
    return await api
      .get(`/note/my/${id}`, {
        headers: {
          authorization: `Baerer ${
            token || nookies.get()["purplenotes.token"]
          }`,
        },
      })
      .catch((res) => res.response);
  },

  createNote: async () => {
    const body = {
      title: "New note",
      body: "<p>New note</p>",
      privacy: true,
    };

    return api
      .post("/note/", body, {
        headers: {
          authorization: `Baerer ${nookies.get()["purplenotes.token"]}`,
        },
      })
      .catch((res) => res.response);
  },

  updateNote: async (id: string, note: UpdateNoteProps) => {
    return await api
      .put(`/note/${id}`, note, {
        headers: {
          authorization: `Baerer ${nookies.get()["purplenotes.token"]}`,
        },
      })
      .catch((res) => res.response);
  },

  deleteNote: async (id: string, password: string) => {
    const body = { password };

    return await api
      .delete(`/note/${id}`, {
        data: body,
        headers: {
          authorization: `Baerer ${nookies.get()["purplenotes.token"]}`,
        },
      })
      .catch((res) => res.response);
  },
};
