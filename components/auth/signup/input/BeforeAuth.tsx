import { useState } from "react";
import styles from "./Input.module.scss";

interface Props {
  changeEmail: Function;
  changeSignUpState: Function;
}

const BeforeAuth = (props: Props) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    props.changeEmail(email);
    props.changeSignUpState("confirm");
  };

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
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default BeforeAuth;
