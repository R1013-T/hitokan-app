import { useState } from "react";

interface Props {
  changeUserData: Function;
}

const Email = (props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.changeUserData(email, password)
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
      <label htmlFor="password">パスワード</label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Continue</button>
    </form>
  );
};

export default Email;
