import { createContext, ReactNode, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProviderProps {
  children: ReactNode | ReactNode[];
}

interface ContextProps {
  successNotification: (msg: string) => void;
  warningNotification: (msg: string) => void;
  errorNotification: (msg: string) => void;
}

const Context = createContext({} as ContextProps);

export default function ContextProvider({ children }: ProviderProps) {
  const errorNotification = (msg: string) =>
    toast.error(msg, {
      autoClose: 2000,
    });
  const successNotification = (msg: string) =>
    toast.success(msg, {
      autoClose: 2000,
    });
  const warningNotification = (msg: string) =>
    toast.warning(msg, {
      autoClose: 2000,
    });

  return (
    <Context.Provider
      value={{
        successNotification,
        errorNotification,
        warningNotification,
      }}
    >
      <ToastContainer theme="dark" />
      {children}
    </Context.Provider>
  );
}

export const useGlobalTools = () => useContext(Context);
