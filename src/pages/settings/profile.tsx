import { NormalButton } from "@/components/button";
import { HeaderWithBackButton } from "@/components/header";
import { Input } from "@/components/input";
import { SettingsModal } from "@/components/settings-modal";
import { useGlobalTools } from "@/contexts/global-tools-conext";
import { userApi } from "@/services/axios/user-api";
import {
  BasicInfoData,
  EditBasicInfoSchema,
} from "@/services/react-hook-form/basic-info-validation";
import {
  PasswordInfoData,
  passwordInfoSchema,
} from "@/services/react-hook-form/password-validation";
import { getUser, removeUser, saveUser } from "@/utils/helpers";
import { Dialog, Transition } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface DeleteAccountProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function UserEdit() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <>
      <HeaderWithBackButton />

      <div className="py-5">
        <SettingsModal className="flex flex-col gap-8">
          <EditBasicData />
          <EditPassword />
          <div className="flex flex-col gap-5">
            <h4 className="text-2xl font-bold">Delete my account</h4>
            <p className="text-orange-500">
              DANGER: we are not responsible for this action, you will not be
              able to reverse this action, think carefully before deleting your
              account
            </p>

            <NormalButton
              className="max-w-[150px] w-full bg-red-500"
              onClick={openModal}
            >
              Delete account
            </NormalButton>
          </div>
          <DeleteAccountModal isOpen={isOpen} closeModal={closeModal} />
        </SettingsModal>
      </div>
    </>
  );
}

function EditBasicData() {
  const [isLoading, setIsLoading] = useState(false);
  const { successNotification } = useGlobalTools();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoData>({
    resolver: yupResolver(EditBasicInfoSchema),
    defaultValues: useMemo(() => {
      if (typeof window === "undefined") {
        return {
          name: "",
          email: "",
        };
      }

      const user = JSON.parse(
        localStorage.getItem("purplenotes.user") as string
      );

      return {
        name: user.name,
        email: user.email,
      };
    }, []),
  });

  const submit = async (data: BasicInfoData) => {
    const user = getUser();
    if (user.name === data.name && user.email === data.email) {
      return;
    }

    setIsLoading(true);
    const res = await userApi.updateBasicInfo(data);

    switch (res.status) {
      case 200:
        saveUser(res.data);
        successNotification("Basic info edited successfully");
        break;
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-5 border-b border-b-neutral-700 pb-8"
    >
      <h4 className="text-2xl font-bold">Basic info</h4>
      <div className="flex flex-col gap-1 max-w-[400px]">
        <label htmlFor="name">Name:</label>
        <Input
          name="name"
          id="name"
          placeholder="Type your name"
          register={register("name")}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1 max-w-[400px]">
        <label htmlFor="email">Email:</label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Type your email"
          register={register("email")}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <NormalButton className="max-w-[150px] w-full" disabled={isLoading}>
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
            </svg>
            Loading...
          </>
        ) : (
          "Save"
        )}
      </NormalButton>
    </form>
  );
}

function EditPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { successNotification } = useGlobalTools();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PasswordInfoData>({
    resolver: yupResolver(passwordInfoSchema),
  });

  const submit = async (data: PasswordInfoData) => {
    setIsLoading(true);
    const res = await userApi.updatePassword(data);

    switch (res.status) {
      case 200:
        setValue("password", "");
        setValue("passwordConfirmation", "");
        successNotification("Password edited successfully");
        break;
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-5 border-b border-b-neutral-700 pb-8"
    >
      <h4 className="text-2xl font-bold">Password</h4>
      <div className="flex flex-col gap-1 max-w-[400px]">
        <label htmlFor="password">Password:</label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Type your password"
          register={register("password")}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 max-w-[400px]">
        <label htmlFor="passwordConfirmation">Password confirmation:</label>
        <Input
          type="password"
          name="passwordConfirmation"
          id="passwordConfirmation"
          placeholder="Type your password again"
          register={register("passwordConfirmation")}
        />
        {errors.passwordConfirmation && (
          <p className="text-red-500">{errors.passwordConfirmation.message}</p>
        )}
      </div>

      <NormalButton className="max-w-[150px] w-full">
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
            </svg>
            Loading...
          </>
        ) : (
          "Save"
        )}
      </NormalButton>
    </form>
  );
}

function DeleteAccountModal({ isOpen, closeModal }: DeleteAccountProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function deleteNote() {
    setIsLoading(true);
    const res = await userApi.deleteAccount({ password });

    switch (res.status) {
      case 201:
        removeUser();
        router.push("/sign-in");
        break;
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
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
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
                      to recover the acccount!
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
                        "Delete my account"
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
