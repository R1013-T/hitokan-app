import styles from "./SignUp.module.scss";
import CenterImage from "../CenterImage";
import BeforeAuthInput from "./input/BeforeAuth";
import AfterAuthInput from "./input/AfterAuth";
import Confirm from "./confirm/Confirm";
import Loading from "~/Loading";

import { useState } from "react";
import { Head } from "next/document";

interface Props {
  changeAuthState: Function;
}

const SignUp = (props: Props) => {
  const [signUpState, setSignUpState] = useState("beforeAuthInput");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const changeSignUpState = (state: string) => {
    setSignUpState(state);
  };
  const changeIsLoading = (state: boolean) => {
    setIsLoading(state);
  };
  const changeEmail = (email: string) => {
    setEmail(email);
  };

  return (
    <div className={styles.container}>
      
      {isLoading ? <Loading /> : ""}
      <CenterImage />
      <main>
        <p className={styles.title}>CREATE YOUR ACCOUNT</p>
        {signUpState === "beforeAuthInput" ? (
          <BeforeAuthInput
            changeEmail={changeEmail}
            changeSignUpState={changeSignUpState}
          />
        ) : (
          ""
        )}
        {signUpState === "AfterAuthInput" ? <AfterAuthInput /> : ""}
        {signUpState === "confirm" ? (
          <Confirm
            email={email}
            password={password}
            userName={userName}
            changeIsLoading={changeIsLoading}
            changeSignUpState={changeSignUpState}
          />
        ) : (
          ""
        )}
        <button
          className={styles.changeSignIn}
          onClick={() => props.changeAuthState("signin")}
        >
          Already have your account?
        </button>
      </main>
    </div>
  );
};

export default SignUp;
