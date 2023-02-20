import styles from "../../styles/Home.module.scss";
import Header from "~/Header";
import SignUp from "~/auth/signup/SignUp";
import AuthEmail from "~/auth/signup/confirm/AuthEmail";
import Loading from "~/Loading";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";

import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "lib/firebase";
import Head from "next/head";

const EmailAuth = () => {
  const router = useRouter();
  const { authId } = router.query;

  const [emailConfirmFlag, setEmailConfirmFlag] = useState(false);
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    checkEmail();
  }, [router.isReady]);

  const checkEmail = async () => {
    const docRef = doc(db, "authUsers", String(authId));
    const docSnap = await getDoc(docRef);

    
    if (docSnap.exists()) {
      setEmail(docSnap.data().email);
    } else {
      alert("最初からやり直してください。")
      router.push("/");
    }

    // await deleteDoc(docRef)

    setIsLoading(false);
  };

  const changeEmailConfirmFlag = (flag: boolean) => {
    setEmailConfirmFlag(flag);
  };

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Sign up to HITOKAN</title>
      </Head>
      {isLoading ? <Loading text={"メールアドレスを取得中です"} /> : ""}
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
