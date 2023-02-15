import styles from "./SignUp.module.scss";
import CenterImage from "../CenterImage";
import BeforeAuthInput from "./input/BeforeAuth";
import AfterAuthInput from "./input/AfterAuth";
import Confirm from "./confirm/Confirm";
import Loading from "~/Loading";

import { useState } from "react";
interface Props {
  centerImageDir: number;
  email: string;
  signUpState: string;
  changeAuthState: Function;
}

const SignUp = (props: Props) => {
  const [signUpState, setSignUpState] = useState(props.signUpState);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(props.email);
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
  const changePassword = (password: string) => {
    setPassword(password);
  };
  const changeUserName = (userName: string) => {
    setUserName(userName);
  };

  return (
    <div className={styles.container}>
      {isLoading ? <Loading /> : ""}
      <CenterImage dir={props.centerImageDir} />
      <main className={`${signUpState === "confirm" ? styles.confirm : ""}`}>
        <p className={styles.title}>CREATE TO YOUR ACCOUNT</p>
        {signUpState === "beforeAuthInput" ? (
          <BeforeAuthInput
            email={email}
            changeEmail={changeEmail}
            changeSignUpState={changeSignUpState}
          />
        ) : (
          ""
        )}
        {signUpState === "AfterAuthInput" ? (
          <AfterAuthInput
            changeSignUpState={changeSignUpState}
            changePassword={changePassword}
            changeUserName={changeUserName}
          />
        ) : (
          ""
        )}
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
        {signUpState === "beforeAuthInput" ? (
          <button
            className={styles.changeSignIn}
            onClick={() => props.changeAuthState("signin")}
          >
            Already have your account?
          </button>
        ) : (
          ""
        )}
      </main>
    </div>
  );
};

export default SignUp;
