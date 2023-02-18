import { NormalButton } from "@/components/button";
import { LoadingScreen } from "@/components/loading-screen";
import { useGlobalTools } from "@/contexts/global-tools-conext";
import { userApi } from "@/services/axios/user-api";
import { getUser, saveUser } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Logo from "../../../public/logo.svg";

export function getServerSideProps() {
  return {
    props: {},
  };
}

export default function ConfirmAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { errorNotification, warningNotification } = useGlobalTools();

  const getAccount = useCallback(async () => {
    setIsLoading(true);
    const res = await userApi.getAccountConfirmation();

    switch (res.status) {
      case 200:
        if (res.data.isConfirmed) {
          warningNotification("The account has already been confirmed");
          break;
        }
        if (Date.now() > new Date(res.data.expiryDate).getTime()) {
          warningNotification("Account confirmation expired");
          break;
        }
        break;

      default:
        isConfirmed && setIsConfirmed(false);
        errorNotification("Something wrong, try again");
        break;
    }
    setIsLoading(false);
  }, []);

  const confirmAccount = useCallback(async () => {
    setIsLoading(true);
    const res = await userApi.confirmAccount();

    switch (res.status) {
      case 200:
        setIsConfirmed(true);
        const user = getUser();
        saveUser({ ...user, ...res.data });
        break;

      default:
        isConfirmed && setIsConfirmed(false);
        errorNotification("Something wrong, try again");
        break;
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getAccount();
    confirmAccount();
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}

      <main className="safe-area min-h-screen flex flex-col justify-center items-center gap-3">
        <Image src={Logo} alt="logo" className="w-24 h-24" />

        {!isLoading && isConfirmed ? (
          <>
            <h2 className="text-2xl font-bold">Account confirmed</h2>
            <p>Go back to the dashboard and take your notes</p>
            <Link href="/" className="mt-8">
              <NormalButton>Back to dashboard</NormalButton>
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold">Something wrong</h2>
            <p>Reload the page to try again</p>
            <NormalButton
              onClick={() =>
                typeof window !== "undefined" && window.location.reload()
              }
            >
              Reload
            </NormalButton>
          </>
        )}
      </main>
    </>
  );
}
