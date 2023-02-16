import { getUser } from "@/utils/helpers";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { NormalButton, SoftButton } from "./button";

export function AccountConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) return;
    setIsOpen(!user.accountConfirmation.isConfirmed);
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  return (
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
                    It looks like you haven't confirmed your account yet. Click
                    outside the modal if you want to do this later
                  </p>
                </div>
                <div className="mt-4 flex justify-end gap-2 mt-8">
                  <NormalButton className="px-5">
                    I already confirmed
                  </NormalButton>
                  <SoftButton className="px-5">Resend</SoftButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
