import Header from "~/Header";
import styles from "../styles/Home.module.scss";
import Auth from "~/auth/Top";
import SignUp from "~/auth/signup/SignUp";
import SignIn from "~/auth/signin/SignIn";

import { useState } from "react";

export default function Home() {
  const [authState, setAuthState] = useState("top");

  const changeAuthState = (state: string) => {
    setAuthState(state);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <img src="./images/topImage.png" alt="" className={styles.topImage} />
      </div>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          {authState === "top" ? (
            <Auth changeAuthState={changeAuthState} />
          ) : (
            ""
          )}
          {authState === "signup" ? (
            <SignUp changeAuthState={changeAuthState} />
          ) : (
            ""
          )}
          {authState === "signin" ? <SignIn /> : ""}
        </main>
      </div>
    </div>
  );
}
