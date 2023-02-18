import styles from "./Top.module.scss";
import CenterImage from "./CenterImage";

import { FcGoogle } from "react-icons/fc";
import Head from "next/head";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "lib/firebase";
interface Props {
  changeAuthState: Function;
}

const Top = (props: Props) => {
  const GoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    if (window.outerWidth <= 500) {
      signInWithPopup(auth, provider);
    } else {
      signInWithRedirect(auth, provider);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>HITOKAN</title>
      </Head>
      <CenterImage dir={1} />
      <div className={styles.buttonsWrap}>
        <button type="button" onClick={() => props.changeAuthState("signup")}>
          Sign up
        </button>
        <button type="button" onClick={() => props.changeAuthState("signin")}>
          Log in
        </button>
        <div className={styles.or}>or</div>
        <button type="button" onClick={GoogleSignIn}>
          <FcGoogle className={styles.google} />
          <div>
            Sign up with <span>Google</span>
          </div>
          <div className={styles.space}></div>
        </button>
      </div>
    </div>
  );
};

export default Top;
