import styles from "./Confirm.module.scss";

import { v4 as uuidv4 } from "uuid";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "lib/firebase";
import { useState } from "react";
interface Props {
  email: string;
  changeSignUpState: Function;
  changeIsLoading: Function;
  changeAuthState: Function;
}

const BeforeAuth = (props: Props) => {
  let alreadyFlag = false;
  const handleSendClick = async () => {
    props.changeIsLoading(true, "メールアドレスを確認中です", false);

    await alreadyCheckEmail();
    if (alreadyFlag) return;

    props.changeIsLoading(true, "認証メールを送信中です", false);

    const id = uuidv4();
    const authUrl = `${location.href}/auth/${id}`;

    await setFirestore(id);

    props.changeIsLoading(true, "認証メールを送信しました", true);

    handleAuthMailSend(id, authUrl);
  };

  const alreadyCheckEmail = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (doc.data().email === props.email) {
        alreadyFlag = true;
        alert("すでに登録済みをメールアドレスです。");
        document.cookie = `email=${props.email}; max-age=60`;
        props.changeAuthState("signin");
      }
    });
  };

  const setFirestore = async (id: string) => {
    await setDoc(doc(db, "authUsers", id), {
      email: props.email,
      createdAt: new Date(),
    });
  };

  const handleAuthMailSend = async (id: string, authUrl: string) => {
    const mailData = {
      email: props.email,
      id: id,
      url: authUrl,
    };

    await fetch("/api/authMail", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mailData),
    });
  };

  return (
    <div className={styles.container}>
      <p className={styles.label}>
        以下のメールアドレスに認証メールを送信します。
      </p>
      <p className={styles.center}>{props.email}</p>
      <div className={styles.buttons}>
        <button
          className={styles.ng}
          onClick={() => props.changeSignUpState("beforeAuthInput")}
        >
          Edit
        </button>
        <button className={styles.ok} onClick={handleSendClick}>
          Send
        </button>
      </div>
    </div>
  );
};

export default BeforeAuth;
