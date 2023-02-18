import { LoadingScreen } from "@/components/loading-screen";
import GlobalToolsContextProvider from "@/contexts/global-tools-conext";
import "@/styles/app.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalToolsContextProvider>
      <LoadingScreen />
      <Component {...pageProps} />
    </GlobalToolsContextProvider>
  );
}
