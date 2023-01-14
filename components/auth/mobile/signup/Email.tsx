import { useState } from "react";
import styles from "./SignUp.module.scss";

interface Props {
  changeEmail: Function;
  changeAuthState: Function;
  changeAuthCodeState: Function;
}

const Email = (props: Props) => {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return

    props.changeEmail(email)
    props.changeAuthCodeState(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">メールアドレス</label>
      <input
        id="email"
        type="text"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default Email;
