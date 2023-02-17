import styles from "./Top.module.scss";
import CenterImage from "./CenterImage";

import { FcGoogle } from "react-icons/fc";
import Head from "next/head";
interface Props {
  changeAuthState: Function;
}

const Top = (props: Props) => {
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
        <button type="button">
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
