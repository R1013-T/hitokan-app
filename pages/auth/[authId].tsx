import styles from "../../styles/Home.module.scss";
import Header from "~/Header";
import SignUp from "~/auth/signup/SignUp";
import AuthEmail from "~/auth/signup/confirm/AuthEmail";
import CenterImage from "~/auth/CenterImage";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "lib/firebase";

const EmailAuth = () => {
  const router = useRouter();
  const { authId } = router.query;

  const [emailConfirmFlag, setEmailConfirmFlag] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    checkEmail()

  }, [router.isReady]);

  const checkEmail = async () => {
    const docRef = doc(db, "authUsers", String(authId));
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setEmail(docSnap.data().email)
    } else {
      router.push('/')
    }
  }

  const changeEmailConfirmFlag = (flag: boolean) => {
    setEmailConfirmFlag(flag);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <img src="../images/topImage.png" alt="" className={styles.topImage} />
      </div>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          {emailConfirmFlag ? (
            <SignUp
              centerImageDir={2}
              email={email}
              signUpState="AfterAuthInput"
              changeAuthState={() => {}}
            />
          ) : (
            <AuthEmail
              email={email}
              changeEmailConfirmFlag={changeEmailConfirmFlag}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default EmailAuth;
