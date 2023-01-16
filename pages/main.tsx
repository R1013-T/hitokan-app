import styles from "../styles/Main.module.scss";
import { auth, db } from "lib/firebase";
import { useRouter } from "next/router";
import Header from "~/publicParts/header/Top";
import AddButton from "~/main/add/button/AddButton";
import AddPanel from "~/main/add/panel/Panel";
import { useState } from "react";
import Head from "next/head";
import { useEffect } from "react";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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

  const getFirestore = async () => {
    // const uid = await auth.currentUser!.uid
    // const q = query(collection(db, "users", auth.currentUser!.uid, "peoples"));
    const onSub = onSnapshot(
      collection(db, "users", auth.currentUser!.uid, "peoples"),
      (queryCounterSS) => {
        queryCounterSS.forEach((doc) => {
            console.log(doc.data());
        });
      }
    );
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) getFirestore();
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Hitokan</title>
      </Head>
      <Header />
      <AddButton changeIsAdd={changeIsAdd} />
      {isAdd ? (
        <AddPanel changeIsAdd={changeIsAdd} email={auth.currentUser?.email} />
      ) : (
        ""
      )}
      {auth.currentUser?.email}
      <br />
      {auth.currentUser?.displayName}
      <br />
      <button onClick={handleClickLogout}>logout</button>
    </div>
  );
};

export default main;
