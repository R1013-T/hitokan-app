import styles from "./Confirm.module.scss";

import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { db } from "lib/firebase";

interface Props {
  email: string;
  changeSignUpState: Function;
  changeIsLoading: Function;
}

const BeforeAuth = (props: Props) => {
  const handleSendClick = async () => {
    props.changeIsLoading(true);
    const id = uuidv4();
    const authUrl = `${location.href}/auth/${id}`;

    await setFirestore(id);

    handleAuthMailSend(id, authUrl);
  };

  const setFirestore = async (id: string) => {
    await setDoc(doc(db, "authUsers", id), {
      email: props.email,
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
    // .then((res) => {
    //   console.log("mailsend")
    // })
    // .catch((err) => {
    //   console.log("MailSendErr:", err);
    // });
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
