import { NormalButton } from "@/components/button";
import { HeaderWithBackButton } from "@/components/header";
import { Input } from "@/components/input";
import { useGlobalTools } from "@/contexts/global-tools-conext";
import { noteApi } from "@/services/axios/note-api";
import { NoteProps } from "@/types/note-props";
import { Dialog, Transition } from "@headlessui/react";
import { format, isAfter, parseISO } from "date-fns";
import parse from "html-react-parser";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import nookies from "nookies";
import React, { Fragment, useEffect, useState } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PageProps {
  note: undefined | NoteProps;
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { id } = ctx.query;

  if (typeof id !== "string")
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };

  const token = nookies.get(ctx)["purplenotes.token"];

  let res;
  if (token) {
    res = await noteApi.getMyNote(id, token);
  } else {
    res = await noteApi.getNote(id);
  }

  switch (res.status) {
    case 200:
      return {
        props: {
          note: res.data,
        },
      };

    case 401:
      return {
        props: {
          note: null,
        },
      };

    default:
      return {
        props: {
          note: null,
        },
      };
  }
}

export default function Note({ note }: PageProps) {
  const { errorNotification } = useGlobalTools();
  const router = useRouter();

  useEffect(() => {
    if (!note) {
      router.push("/");
      errorNotification("You do not have permission to read this note");
    }
  }, []);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const openDeleteModal = () => setDeleteModal(true);

  const formatTitle = (value: string, max: number) => {
    return value.length > max ? value.slice(0, max) + "..." : value;
  };

  return (
    <>
      <Head>
        <title>
          {note
            ? formatTitle(note.title, 10) + " - Purple Notes"
            : "Selected Note - Purple Notes"}
        </title>
      </Head>
      <HeaderWithBackButton />

      {note && (
        <div className="safe-area">
          <DeleteNoteModal isOpen={deleteModal} setIsOpen={setDeleteModal} />

          <BottomNavigation openDeleteModal={openDeleteModal} />

          <main className="mt-12 mb-20">
            <div className="mb-20">
              <div className="text-sm mt-2 -translate-x-2 flex flex-col md:flex-row gap-2 mb-2 md:mb-0">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md w-fit">
                  <strong>created at:</strong>{" "}
                  {format(
                    parseISO(note.createdAt),
                    "MM/dd/yyyy hh:mm aaaaa'm'"
                  )}
                </span>
                {!isAfter(
                  parseISO(note.updatedAt),
                  parseISO(note.createdAt)
                ) ? null : (
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-md w-fit">
                    <strong>updated at:</strong>{" "}
                    {format(
                      parseISO(note.updatedAt),
                      "dd/MM/yyyy hh:mm aaaaa'm'"
                    )}
                  </span>
                )}
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md w-fit">
                  <strong>privacy:</strong>{" "}
                  {note.privacy ? "private" : "free to read"}
                </span>
              </div>
              <h1 className="text-2xl">{note.title}</h1>
            </div>
            {parse(note.body)}
          </main>
        </div>
      )}
    </>
  );
}

function BottomNavigation({
  openDeleteModal,
}: {
  openDeleteModal: () => void;
}) {
  const router = useRouter();
  const { id } = router.query;
  const token = nookies.get()["purplenotes.token"] || undefined;

  if (!token) <></>;
  return (
    <div className="fixed right-2/4 translate-x-2/4 bottom-12 bg-neutral-800 p-1 rounded-full grid grid-cols-2">
      <Link
        href={`/${id}/edit`}
        className="px-2 py-1 rounded-full hover:bg-primary text-center"
      >
        Edit
      </Link>
      <button
        className="px-2 py-1 rounded-full hover:bg-primary"
        onClick={openDeleteModal}
      >
        Delete
      </button>
    </div>
  );
}

function DeleteNoteModal({ isOpen, setIsOpen }: DeleteModalProps) {
  const router = useRouter();
  const { id } = router.query;
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  async function deleteNote() {
    if (typeof id !== "string") return router.push("/dashboard");
    setIsLoading(true);
    const res = await noteApi.deleteNote(id, password);

    switch (res.status) {
      case 201:
        router.push("/dashboard");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setPassword("");
  }, [isOpen]);

  if (!isOpen) return <></>;
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6"
                  >
                    Are you sure?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p>
                      Enter your password below to proceed. You will not be able
                      to recover the note!
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-1">
                    <label className="text-sm" htmlFor="password">
                      Password:
                    </label>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Type your password"
                    />

                    <NormalButton
                      type="button"
                      className="!bg-red-500 mt-2 self-end"
                      onClick={deleteNote}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
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
                          </svg>{" "}
                          Loading...
                        </>
                      ) : (
                        "Delete my note"
                      )}
                    </NormalButton>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
