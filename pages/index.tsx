import Header from "~/Header";
import styles from "../styles/Home.module.scss";
import Auth from "~/auth/Top";
import SignUp from "~/auth/signup/SignUp";
import SignIn from "~/auth/signin/SignIn";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { auth } from "lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter();

  const [authState, setAuthState] = useState("top");

  const changeAuthState = (state: string) => {
    setAuthState(state);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/main/View");
      }
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          {authState === "top" ? (
            <Auth changeAuthState={changeAuthState} />
          ) : (
            ""
          )}
          {authState === "signup" ? (
            <SignUp
              centerImageDir={1}
              email=""
              signUpState="beforeAuthInput"
              changeAuthState={changeAuthState}
            />
          ) : (
            ""
          )}
          {authState === "signin" ? (
            <SignIn
              changeAuthState={changeAuthState}
            />
          ) : (
            ""
          )}
        </main>
      </div>
    </div>
  );
}
