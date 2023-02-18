import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "lib/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./SignIn.module.scss";

interface Props {
  changeIsLoading: Function;
}

const Input = (props: Props) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [ngFlag, setNgFlag] = useState(true);
  const [attention, setAttention] =
    useState("メールアドレスを入力してください。");

  useEffect(() => {
    const cookieEmail = getCookie();
    if (!cookieEmail) return;
    setEmail(cookieEmail);
    document.cookie = "email=; max-age=0";
  }, []);

  const getCookie = () => {
    let arr: any = new Array();
    if (document.cookie != "") {
      var tmp = document.cookie.split("; ");
      for (var i = 0; i < tmp.length; i++) {
        let data: any = tmp[i].split("=");
        arr[data[0]] = decodeURIComponent(data[1]);
      }
    }
    return arr["email"];
  };

  useEffect(() => {
    checkInput();
  }, [email, password]);

  const checkInput = () => {
    setNgFlag(true);
    if (!email) {
      setAttention("メールアドレスを入力してください。");
      return;
    }
    if (!password) {
      setAttention("パスワードを入力してください。");
      return;
    }

    setNgFlag(false);
    setAttention("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ngFlag) return;
    setNgFlag(true);
    props.changeIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("/main/View");
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/wrong-password":
            setAttention("パスワードが違います。");
            break;
          case "auth/user-not-found":
            setAttention("このメールアドレスは登録されていません。");
            break;
          default:
            setAttention("ログイン出来ません。");
        }

        props.changeIsLoading(false);
      });

    console.log(email, password);
  };

  return (
    <div className={`${styles.container}`}>
      <form onSubmit={handleSubmit}>
        <p>ログイン情報を入力してください。</p>
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
          autoComplete="email"
        />
        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          autoComplete="off"
        />
        <p className={styles.attention}>{attention}</p>
        <button
          type="submit"
          className={`${styles.continue} ${ngFlag ? styles.ng : ""}`}
        >
          Log in
        </button>
      </form>
    </div>
  );
};

export default Input;
