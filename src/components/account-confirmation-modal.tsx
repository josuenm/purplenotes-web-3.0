import { userApi } from "@/services/axios/user-api";
import { getUser, saveUser } from "@/utils/helpers";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { NormalButton, SoftButton } from "./button";

export function AccountConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) return;
    setIsOpen(!user.accountConfirmation.isConfirmed);
  }, []);

  const closeModal = () => setIsOpen(false);

  const checkConfirmation = async () => {
    setIsLoading(true);
    const res = await userApi.getAccountConfirmation();

    switch (res.status) {
      case 200:
        const isConfirmed = res.data.isConfirmed;
        if (isConfirmed) {
          const user = getUser();
          saveUser({ ...user, accountConfirmation: res.data });
          closeModal();
          return;
        }
        toast.error("Account not confirmed", {
          autoClose: 3000,
        });
        break;
    }
    setIsLoading(false);
  };

  const resend = async () => {
    setIsLoading(true);
    const res = await userApi.sendAccountConfirmation();

    switch (res.status) {
      case 200:
        toast.success(
          "Check your email, I sent you an email to confirm your account",
          {
            autoClose: 3000,
          }
        );
        break;

      default:
        toast.error("Something wrong, try again", {
          autoClose: 3000,
        });
        break;
    }
    setIsLoading(false);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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

          <ToastContainer theme="dark" />
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
                    className="text-2xl font-medium leading-6 text-primary mb-3"
                  >
                    Confirm your account
                  </Dialog.Title>
                  <div className="mt-2">
                    <p>
                      It looks like you haven't confirmed your account yet.
                      Click outside the modal if you want to do this later
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end gap-2 mt-8">
                    <NormalButton
                      className="px-5"
                      onClick={checkConfirmation}
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
                          </svg>
                          Loading...
                        </>
                      ) : (
                        "I already confirmed"
                      )}
                    </NormalButton>
                    <SoftButton
                      className="px-5"
                      disabled={isLoading}
                      onClick={resend}
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
                          </svg>
                          Loading...
                        </>
                      ) : (
                        "Resend"
                      )}
                    </SoftButton>
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
