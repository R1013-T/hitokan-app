import styles from "./Confirm.module.scss";

import { useEffect, useState } from "react";

import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "lib/firebase";
import { useRouter } from "next/router";

interface Props {
  email: string;
  password: string;
  userName: string;
  changeIsLoading: Function;
  changeSignUpState: Function;
}

const AfterAuth = (props: Props) => {
  const router = useRouter();

  const [inputType, seInputType] = useState("password");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    props.changeIsLoading(true, "ユーザー情報を登録中です", false);
    await registerUser();
    await addUserFirestore();
    props.changeIsLoading(false, "", false);
  };

  const registerUser = async () => {
    await createUserWithEmailAndPassword(auth, props.email, props.password)
      .then(() => {
        const user = auth.currentUser;
        if (!user) return;
        updateProfile(user, {
          displayName: props.userName,
        }).then(() => {
          router.push("/main/View");
        });
      })
      .catch((err) => {
        let errMsg = "";
        switch (err.code) {
          case "auth/email-already-in-use":
            errMsg = "このメールアドレスすでに使用されています。";
            break;
          default:
            errMsg = "登録できません。エラーが発生しました。";
        }
        alert(errMsg);
      });
  };

  const addUserFirestore = async () => {
    // ! ① userコレクションに追加
  };

  const handleClickEye = () => {
    setIsPasswordHidden((prevState) => !prevState);
  };

  useEffect(() => {
    if (isPasswordHidden) {
      seInputType("password");
    } else {
      seInputType("text");
    }
  }, [isPasswordHidden]);

  return (
    <div className={`${styles.container} ${styles.after}`}>
      <form onSubmit={handleSubmit}>
        <label>UserName</label>
        <input type="text" value={props.userName} readOnly />
        <label>Email Address</label>
        <input type="text" value={props.email} readOnly />
        <label>Password</label>
        <div className={styles.passWrap}>
          <input type={inputType} value={props.password} readOnly />
          <div className={styles.eye} onClick={handleClickEye}>
            {isPasswordHidden ? <VscEye /> : <VscEyeClosed />}
          </div>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.ng}
            onClick={() => props.changeSignUpState("AfterAuthInput")}
          >
            Edit
          </button>
          <button type="submit" className={styles.ok}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default AfterAuth;
