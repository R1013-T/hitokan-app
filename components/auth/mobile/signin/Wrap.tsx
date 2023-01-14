import styles from "./SignIn.module.scss";
import Input from "./Input";
import { useState } from "react";
import { useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "lib/firebase";
import { useRouter } from "next/router";

interface Props {
  changeIsLoading: Function;
}

const Wrap = (props: Props) => {
  const router = useRouter();

  const [isCover, setIsCover] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const changeUserData = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  // testuser@test.com test1234

  const signinEmail = async () => {
    setIsCover(true);
    props.changeIsLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("./main");
      })
      .catch((err) => {
        let errMsg = "";
        switch (err.code) {
          case "auth/wrong-password":
            errMsg = "パスワードが違います。";
            break;
          default:
            errMsg = "ログイン出来ません。";
        }
        alert(errMsg);
        setIsCover(false);
        props.changeIsLoading(false);
      });
  };

  useEffect(() => {
    if (!email) return;
    if (!password) return;

    signinEmail();
  }, [email, password]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <h2>Sign In</h2>
        <Input changeUserData={changeUserData} />
        
      </div>
      {isCover ? <div className={styles.cover}></div> : ""}
    </div>
  );
};

export default Wrap;
