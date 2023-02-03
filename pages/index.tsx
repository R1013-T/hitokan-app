import Header from "~/Header";
import styles from "../styles/Home.module.scss";
import Auth from "~/auth/Top";
import SignUp from "~/auth/signup/SignUp";
// import SignIn from "~/auth/signin/Signin";

import { useState } from "react";

export default function Home() {
  const [authState, setAuthState] = useState("top");

  const changeAuthState = (state: string) => {
    setAuthState(state);
  };

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
            <SignUp changeAuthState={changeAuthState} />
          ) : (
            ""
          )}
          {/* {authState === "signin" ? (
            <SignIn changeAuthState={changeAuthState} />
          ) : (
            ""
          )} */}
        </main>
      </div>
    </div>
  );
}
