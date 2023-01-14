import styles from "./SignUp.module.scss";
import Email from "./Email";
import AfterInput from "./AfterInput";
import { useState } from "react";
import { useEffect } from "react";
import AuthCode from "./AuthCode";

interface Props {
  changeIsLoading: Function;
}

const Wrap = (props: Props) => {
  const [authState, setAuthState] = useState<string>("email");
  const [isCover, setIsCover] = useState<boolean>(false);
  const [authCodeState, setAuthCodeState] = useState<boolean>(false);

  const [authCode, setAuthCode] = useState<string>();

  const [email, setEmail] = useState<string>("");

  const changeAuthState = (state: string) => {
    setAuthState(state);
  };
  const changeAuthCodeState = (state: boolean) => {
    setAuthCodeState(state);
  };
  const changeIsCover = (state) => {
    setIsCover(state)
  }

  const changeEmail = (email: string) => {
    if (!email) return;
    setEmail(email);
    props.changeIsLoading(true);
  };

  const createAuthCode = () => {
    let num = "";
    for (let i = 0; i < 6; i++) {
      num += Math.floor(Math.random() * 10).toString();
    }

    setAuthCode(num);
  };

  const send = async () => {
    const data = {
      email: email,
      authCode: authCode,
    };

    await fetch("/api/authCode", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 200) console.log("送信に成功しました");
    });
  };

  useEffect(() => {
    if (!email) return;

    createAuthCode();
  }, [email]);

  useEffect(() => {
    if (!authCode) return;

    send();
  }, [authCode]);

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.inner} ${
          authState === "afterInput" ? styles.afterInput : ""
        }`}
      >
        <h2>Sign Up</h2>
        {authState === "email" ? (
          <Email
            changeEmail={changeEmail}
            changeAuthState={changeAuthState}
            changeAuthCodeState={changeAuthCodeState}
          />
        ) : (
          ""
        )}
        {authState === "afterInput" ? (
          <AfterInput email={email} changeIsLoading={props.changeIsLoading} changeIsCover={changeIsCover} />
        ) : (
          ""
        )}
        {authCodeState ? (
          <AuthCode
            authCode={authCode}
            changeAuthCodeState={changeAuthCodeState}
            changeAuthState={changeAuthState}
            changeIsLoading={props.changeIsLoading}
          />
        ) : (
          ""
        )}
      </div>
      {isCover ? <div className={styles.cover}></div> : ""}
    </div>
  );
};

export default Wrap;
