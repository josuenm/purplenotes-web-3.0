import { UserProps } from "@/types/user-props";
import { getUser, removeUser } from "@/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import nookies from "nookies";
import { Fragment, HTMLAttributes, useEffect, useState } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { IoIosArrowBack, IoMdExit } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import Logo from "../../public/logo.svg";
import { SoftButton } from "./button";

interface HeaderProps extends HTMLAttributes<HTMLElement> {}

function BackButton() {
  const navigate = useRouter();

  return (
    <SoftButton className="px-5 text-primary" onClick={navigate.back}>
      <IoIosArrowBack />
      Back
    </SoftButton>
  );
}

export function HeaderWithBackButton({
  className,
  children,
  ...rest
}: HeaderProps) {
  return (
    <header {...rest} className={`w-full py-2 ${className}`}>
      <main className="safe-area flex items-center justify-between">
        <BackButton />
        {children}
      </main>
    </header>
  );
}

export function DashboardHeader({ className, ...rest }: HeaderProps) {
  const [headerIsActive, setHeaderIsActive] = useState<boolean>(false);
  const [name, setName] = useState("");

  const navigate = useRouter();

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setHeaderIsActive(true);
      } else {
        setHeaderIsActive(false);
      }
    };

    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  useEffect(() => {
    const user: UserProps | undefined = getUser();
    if (!user) return;
    setName(() =>
      user.name.length > 15 ? user.name.slice(0, 15) + "..." : user.name
    );
  }, []);

  const signOut = () => {
    removeUser();
    nookies.destroy(null, "purplenotes.token");
    navigate.push("/sign-in");
  };

  return (
    <header
      {...rest}
      className={`fixed top-0 left-0 right-0 z-10 w-full py-2 flex items-center ${
        headerIsActive &&
        "bg-neutral-600/10 backdrop-blur border-b-2 border-b-neutral-800"
      } ${className}`}
    >
      <main className="safe-area flex justify-between items-center">
        <Link href="/" className="cursor-pointer">
          <Image src={Logo} alt="Logo" className="w-8 h-8" />
        </Link>

        <Menu as="div" className="relative ml-auto">
          <div className="flex items-center gap-2">
            <Menu.Button as="div">
              <SoftButton className="px-5">
                <strong>{name}</strong>
                <BsFillPersonFill />
              </SoftButton>
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
            <Menu.Items className="absolute mt-2 right-2/4 translate-x-2/4 min-w-[150px] w-fit bg-neutral-800 p-2 rounded-md flex flex-col gap-1 text-sm">
              <Menu.Item as={Link} href="/settings/profile">
                <button
                  className={`w-full text-start py-1 px-2 rounded-md hover:bg-primary duration-200 flex items-center gap-2`}
                >
                  <IoSettingsOutline />
                  Profile
                </button>
              </Menu.Item>
              <Menu.Item as={Fragment}>
                <button
                  className={`w-full text-start py-1 px-2 rounded-md hover:bg-primary duration-200 flex items-center gap-2`}
                  onClick={signOut}
                >
                  <IoMdExit />
                  Sign out
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </main>
    </header>
  );
}
