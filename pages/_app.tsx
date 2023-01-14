import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "lib/firebase";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/main");
      }
    });
  });

  return <Component {...pageProps} />;
}
