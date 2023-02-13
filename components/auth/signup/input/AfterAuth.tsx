import { useEffect } from "react";
import { useState } from "react";
import styles from "./Input.module.scss";

import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

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
    setInputValue("");
    switch (inputState) {
      case "password":
        setPassword(inputValue);
        setInputState("passwordConfirm");
        break;
      case "passwordConfirm":
        setInputState("userName");
        break;
      case "userName":
        setUserName(inputValue);
        break;
    }
  };
  const handleBack = () => {
    move("back");
    setInputValue("");
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

  useEffect(() => {
    if (!userName) return;
    props.changePassword(password);
    props.changeUserName(userName);
    props.changeSignUpState("confirm");
  }, [userName]);

  const checkPassword = (password: string) => {
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
      setNgMsg("");
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

  const checkPasswordConfirm = (passwordConfirm: string) => {
    setNgFlag(true);
    if (!passwordConfirm) {
      setNgMsg("パスワード（確認）を入力してください。");
    } else if (password != passwordConfirm) {
      setNgMsg("パスワードと一致しません。");
    } else {
      setNgFlag(false);
      setNgMsg("");
    }
  };

  const checkUserName = (userName: string) => {
    setNgFlag(true);
    if (!userName) {
      setNgMsg("ユーザーネームを入力してください。");
    } else {
      setNgFlag(false);
      setNgMsg("");
    }
  };

  const move = (move: string) => {
    setNgFlag(true);
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

  const handleChangeInputType = () => {
    if (inputType === "text") {
      setInputType("password");
    } else {
      setInputType("text");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNext();
  };

  return (
    <div className={styles.container}>
      <form className={styles.after} onSubmit={handleSubmit}>
        <p>{inputLabel}を入力してください。</p>
        <div
          className={`${styles.inner} ${
            inputMove === "next" ? styles.next : ""
          } ${inputMove === "back" ? styles.back : ""}`}
        >
          <label htmlFor="input">{inputLabel}</label>
          <div className={styles.inputWrap}>
            <input
              id="input"
              type={inputType}
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              autoComplete="off"
            />
            {inputState === "passwordConfirm" ? (
              <div className={styles.eye} onClick={handleChangeInputType}>
                {inputType === "password" ? <VscEye /> : <VscEyeClosed />}
              </div>
            ) : (
              ""
            )}
          </div>
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
          type="submit"
          className={`${styles.continue} ${ngFlag ? styles.ng : ""}`}
        >
          Next
          <MdOutlineArrowBackIosNew className={styles.next} />
        </button>
      </form>
    </div>
  );
};

export default AfterAuth;
