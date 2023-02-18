import styles from "./SignIn.module.scss";
import CenterImage from "../CenterImage";
import Loading from "~/Loading";
import Input from "./Input";

import Head from "next/head";
import { useState } from "react";
interface Props {
  changeAuthState: Function;
}

const Signin = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const changeIsLoading = (state: boolean) => {
    setIsLoading(state);
  };

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Sign in to HITOKAN</title>
      </Head>
      <CenterImage dir={1} />
      {isLoading ? <Loading text="ログイン中です" /> : ""}
      <p className={styles.title}>LOG IN TO YOUR ACCOUNT</p>
      <Input changeIsLoading={changeIsLoading} />
      <button
        onClick={() => props.changeAuthState("signup")}
      >{`Don't have your account ?`}</button>
    </div>
  );
};

export default Signin;
