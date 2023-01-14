import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "lib/firebase";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./SignUp.module.scss";

interface Props {
  email: string;
  changeIsLoading: Function;
  changeIsCover: Function;
}

const Password = (props: Props) => {
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let errMsg = "";

    if (!password || !confirmPass || !username) errMsg = "入力してください";
    if (password.length <= 5) errMsg = "パスワードは６文字以上入力してください";
    if (password !== confirmPass) errMsg = "パスワードが一致しません";

    if (!errMsg) {
      props.changeIsLoading(true);
      props.changeIsCover(true);
      await createUserWithEmailAndPassword(auth, props.email, password)
        .then(() => {
          const user = auth.currentUser;
          if (!user) return;
          updateProfile(user, {
            displayName: username,
          })
            .then(() => {
              router.push("./main");
            })
            .catch((e) => {
              console.log(e);
              alert("エラーが発生しました。");
              router.push("./");
            });
        })
        .catch((err) => {
          switch (err.code) {
            case "auth/email-already-in-use":
              errMsg =
                "提供された電子メールは、既存のユーザーによってすでに使用されています。";
              break;
            default:
              errMsg = "エラー。最初からやり直してください。";
          }
          alert(errMsg);
          router.push("./");
        });

      console.log(password, confirmPass, username);
    } else {
      alert(errMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.afterInput}>
      <label htmlFor="password">パスワード</label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label htmlFor="confirm_password">パスワード（確認）</label>
      <input
        id="confirm_password"
        type="password"
        placeholder="PasswordConfirm"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
      />
      <label htmlFor="name">ユーザーネーム</label>
      <input
        id="name"
        type="text"
        placeholder="UserName"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Password;
