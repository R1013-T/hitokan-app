import { useEffect } from "react";
import { useState } from "react";
import styles from "./Input.module.scss";

import { MdOutlineArrowBackIosNew } from "react-icons/md";

interface Props {
  changeSignUpState: Function;
  changePassword: Function;
  changeUserName: Function;
}

const AfterAuth = (props: Props) => {
  const [ngFlag, setNgFlag] = useState(true);
  const [ngMsg, setNgMsg] = useState("パスワードを入力してください。");

  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const [inputState, setInputState] = useState("password");
  const [inputValue, setInputValue] = useState("");
  const [inputLabel, setInputLabel] = useState("パスワード");
  const [inputPlaceholder, setInputPlaceholder] = useState("Password");
  const [inputType, setInputType] = useState("password");
  const [inputMove, setInputMove] = useState("");

  const handleNext = () => {
    if (ngFlag) return;
    move("next");
    switch (inputState) {
      case "password":
        setInputState("passwordConfirm");
        break;
      case "passwordConfirm":
        setInputState("userName");
        break;
      case "userName":
        break;
    }
  };
  const handleBack = () => {
    move("back");
    switch (inputState) {
      case "password":
        break;
      case "passwordConfirm":
        setInputState("password");
        break;
      case "userName":
        setInputState("passwordConfirm");
        break;
    }
  };

  const checkPassword = (password: string) => {
    console.log(password);
    setNgFlag(true);
    const okRegex = /^(?=\d{0,99}[a-z])(?=[a-z]{0,99}\d)[a-z\d]{8,100}$/i;
    const numRegex = /[0-9]/;
    const AtZRegex = /[A-Z]/;
    const atzRegex = /[a-z]/;
    if (!password) {
      setNgMsg("パスワードを入力してください。");
    } else if (password.length < 8) {
      setNgMsg("８文字以上入力してください。");
    } else if (okRegex.test(password)) {
      setNgFlag(false);
      setNgMsg("ok");
    } else if (!AtZRegex.test(password)) {
      setNgMsg("大文字 を一文字以上入力してください。");
    } else if (!atzRegex.test(password)) {
      setNgMsg("小文字 を一文字以上入力してください。");
    } else if (!numRegex.test(password)) {
      setNgMsg("数字 を一文字以上入力してください。");
    } else {
      setNgMsg("使用出来ない文字が入力されています。");
    }
  };

  const checkPasswordConfirm = (passwordConfirm: string) => {};

  const checkUserName = (userName: string) => {};

  const move = (move: string) => {
    switch (move) {
      case "back":
        if (inputState === "password") return;
        setInputMove("back");
        break;
      case "next":
        if (inputState === "userName") return;
        setInputMove("next");
        break;
    }
    setTimeout(() => {
      setInputMove("");
      setNgFlag(true);
    }, 500);
  };

  useEffect(() => {
    switch (inputState) {
      case "password":
        checkPassword(inputValue);
        break;
      case "passwordConfirm":
        checkPasswordConfirm(inputValue);
        break;
      case "userName":
        checkUserName(inputValue);
        break;
    }
  }, [inputValue]);

  useEffect(() => {
    switch (inputState) {
      case "password":
        setInputLabel("パスワード");
        setInputPlaceholder("Password");
        setInputType("password");
        break;
      case "passwordConfirm":
        setInputLabel("パスワード（確認）");
        setInputPlaceholder("Password Confirm");
        setInputType("password");
        break;
      case "userName":
        setInputLabel("ユーザーネーム");
        setInputPlaceholder("userName");
        setInputType("text");
        break;
    }
  }, [inputState]);

  return (
    <div className={styles.container}>
      <form className={styles.after}>
        <div
          className={`${styles.inner} ${
            inputMove === "next" ? styles.next : ""
          } ${inputMove === "back" ? styles.back : ""}`}
        >
          <p>{inputLabel}を入力してください。</p>

          <label htmlFor="input">{inputLabel}</label>
          <input
            id="input"
            type={inputType}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            autoComplete="off"
          />
          <p className={styles.attention}>{ngMsg}</p>
        </div>

        <button
          type="button"
          className={`${styles.backButton} ${
            inputState === "password" ? styles.hidden : ""
          }`}
          onClick={handleBack}
        >
          <MdOutlineArrowBackIosNew className={styles.back} />
          Back
        </button>
        <button
          type="button"
          className={`${styles.continue} ${ngFlag ? styles.ng : ""}`}
          onClick={handleNext}
        >
          Next
          <MdOutlineArrowBackIosNew className={styles.next} />
        </button>
      </form>
    </div>
  );
};

export default AfterAuth;
