import styles from "../styles/Main.module.scss";
import { auth } from "lib/firebase";
import { useRouter } from "next/router";
import Header from "~/publicParts/header/Top";
import AddButton from "~/main/add/button/AddButton";
import AddPanel from "~/main/add/panel/Panel";
import { useState } from "react";
import Head from "next/head";

const main = () => {
  const router = useRouter();

  const [isAdd, setIsAdd] = useState(false);

  const changeIsAdd = (state) => {
    setIsAdd(state);
  };

  const handleClickLogout = () => {
    auth.signOut();
    router.push("/");
  };

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Hitokan</title>
      </Head>
      <Header />
      <AddButton changeIsAdd={changeIsAdd} />
      {isAdd ? <AddPanel changeIsAdd={changeIsAdd} email={auth.currentUser?.email} /> : ""}
      {auth.currentUser?.email}
      <br />
      {auth.currentUser?.displayName}
      <br />
      <button onClick={handleClickLogout}>logout</button>
    </div>
  );
};

export default main;
