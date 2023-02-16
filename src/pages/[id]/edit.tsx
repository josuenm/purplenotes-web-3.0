import { HeaderWithBackButton } from "@/components/header";
import { Input } from "@/components/input";
import { noteApi } from "@/services/axios/note-api";
import { NoteProps } from "@/types/note-props";
import { Menu, Transition } from "@headlessui/react";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import nookies from "nookies";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export function getServerSideProps<GetServerSideProps>(
  ctx: GetServerSidePropsContext
) {
  const token = nookies.get(ctx)["purplenotes.token"];

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/sign-in",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "blockquote", "link"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "blockquote",
  "list",
  "bullet",
  "link",
];

export default function EditNote() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const updateRef = useRef<NodeJS.Timeout>();
  const { id } = router.query;

  let initialData: { title: string; body: string; privacy: boolean };
  const [note, setNote] = useState<NoteProps>();

  const titleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote((prev) => prev && { ...prev, title: e.target.value });
  };

  const bodyOnChange = (value: string) => {
    setNote((prev) => prev && { ...prev, body: value });
  };

  const editPrivacy = (privacy: boolean) => {
    setNote((prev) => prev && { ...prev, privacy });
  };

  const getMyNote = useCallback(async () => {
    if (typeof id !== "string") return router.push("/dashboard");

    const res = await noteApi.getMyNote(id);

    switch (res.status) {
      case 200:
        setNote(res.data);
        initialData = {
          title: res.data.title,
          body: res.data.body,
          privacy: res.data.privacy,
        };
        break;
    }
  }, []);

  useEffect(() => {
    getMyNote();
  }, []);

  useEffect(() => {
    clearTimeout(updateRef.current);
    updateRef.current = setTimeout(async () => {
      if (typeof id !== "string" || !note) return router.push("/dashboard");
      if (
        !message &&
        initialData &&
        initialData.title === note.title &&
        initialData.body === note.body &&
        initialData.privacy === note.privacy
      ) {
        return;
      }

      setMessage("Saving");
      const res = await noteApi.updateNote(id, {
        title: note.title,
        body: note?.body,
        privacy: note.privacy,
      });

      switch (res.status) {
        case 200:
          setMessage("Saved");
          break;

        default:
          setMessage("Can't save, something wrong");
          break;
      }
    }, 1000);
  }, [note]);

  return (
    <>
      <Head>
        <title>Edit note - Purple Notes</title>
      </Head>
      <HeaderWithBackButton />

      <main className="safe-area flex flex-col gap-5 py-12">
        {note && (
          <>
            <header className="w-full flex justify-center">
              <Message message={message} />
            </header>

            <section className="max-w-full md:max-w-[150px] w-full flex flex-col gap-1">
              <label htmlFor="privacy">Privacy:</label>
              <Menu as="div" className="relative">
                <div className="flex items-center gap-2">
                  <Menu.Button as={Fragment}>
                    <button className="w-full !text-start p-2 text-primary border-2 border-neutral-700 !bg-neutral-800 rounded-md flex items-center justify-between gap-1">
                      {note.privacy ? "Private" : "Free to read"}
                      <IoIosArrowDown />
                    </button>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute mt-2 right-2/4 translate-x-2/4 min-w-[150px] w-fit bg-neutral-700 p-2 rounded-md flex flex-col gap-1 text-sm">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`w-full text-start py-1 px-2 rounded-md ${
                            active ? "bg-primary" : "bg-transparent"
                          } duration-200 flex items-center justify-between gap-2`}
                          onClick={() => editPrivacy(true)}
                        >
                          Private {note.privacy && <AiOutlineCheck />}
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`w-full text-start py-1 px-2 rounded-md ${
                            active ? "bg-primary" : "bg-transparent"
                          } duration-200 flex items-center gap-2`}
                          onClick={() => editPrivacy(false)}
                        >
                          Free to read {!note.privacy && <AiOutlineCheck />}
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </section>
            <section className="max-w-full md:max-w-[450px] w-full flex flex-col gap-1">
              <label htmlFor="title">Title:</label>
              <Input
                type="text"
                name="title"
                id="title"
                value={note.title}
                onChange={titleOnChange}
              />
            </section>
            <section className="w-full flex flex-col gap-1">
              <label htmlFor="body">Body:</label>
              <ReactQuill
                placeholder="Write something..."
                theme="snow"
                value={note.body}
                onChange={bodyOnChange}
                modules={modules}
                formats={formats}
              />
            </section>
          </>
        )}
      </main>
    </>
  );
}

function Message({ message }: { message: string }) {
  let color: string;

  switch (message) {
    case "Saved":
      color = "text-green-500";
      break;

    case "Saving":
      color = "text-orange-500";
      break;

    default:
      color = "text-red-500";
      break;
  }

  return (
    <p className={`${color}`}>
      {message === "Saving" && (
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-5 h-5 mr-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
      )}
      {message === "Saved" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
          className="inline w-5 h-5 mt-1 mr-1 fill-green-500"
        >
          <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
        </svg>
      )}
      {message}
    </p>
  );
}
