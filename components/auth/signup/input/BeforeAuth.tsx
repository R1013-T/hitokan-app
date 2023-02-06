import { useEffect, useState } from "react";
import styles from "./Input.module.scss";

interface Props {
  email: string;
  changeEmail: Function;
  changeSignUpState: Function;
}

const BeforeAuth = (props: Props) => {
  const [email, setEmail] = useState(props.email);
  const [ngFlag, setNgFlag] = useState(true);
  const [ngMsg, setNgMsg] = useState("メールアドレスを入力してください。");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (ngFlag) return

    props.changeEmail(email);
    props.changeSignUpState("confirm");
  };

  useEffect(() => {
    setNgFlag(true);
    setNgMsg("メールアドレスを入力してください。");
    if (!email) return;

    const emailRegex =
      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    if (emailRegex.test(email)) {
      setNgFlag(false);
      setNgMsg("");
    } else {
      setNgMsg("メールアドレスの形式が違います。");
    }
  }, [email]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <p>認証メールを送信します。メールアドレスを入力してください。</p>
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          type="text"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <p className={styles.attention}>{ngMsg}</p>
        <button type="submit" className={`${ngFlag ? styles.ng : ""}`}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default BeforeAuth;
