import styles from "../styles/Main.module.scss";
import Header from "~/publicParts/header/Top";
import AddButton from "~/main/add/button/AddButton";
import AddPanel from "~/main/add/panel/Panel";
import ListRow from "~/main/listRow/ListRow";

import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { auth, db } from "lib/firebase";

import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import List from "~/main/list/List";

const main = () => {
  let peopleData: any = [];

  const router = useRouter();

  const [isAdd, setIsAdd] = useState(false);
  const [peopleDataState, setPeopleDataState] = useState<any>([]);

  const changeIsAdd = (state) => {
    setIsAdd(state);
  };

  const handleClickLogout = () => {
    auth.signOut();
    router.push("/");
  };

  const getFirestore = async () => {
    const onSub = onSnapshot(
      collection(db, "users", auth.currentUser!.uid, "peoples"),
      (queryCounterSS) => {
        peopleData = [];
        queryCounterSS.forEach((doc) => {
          const data = doc.data()
          data.id = doc.id
          peopleData.push(data);
          setPeopleDataState(peopleData);
        });
      }
    );
  };

  // useEffect(() => {
  //   console.log(peopleDataState);
  // }, [peopleDataState]);

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
        <AddPanel changeIsAdd={changeIsAdd} people={""} />
      ) : (
        ""
      )}
      <div className={styles.main} suppressHydrationWarning={true}>
        <List peoples={peopleDataState} />
      </div>
      <div className={styles.displayName}>{auth.currentUser?.displayName}</div>
      <button onClick={handleClickLogout} className={styles.logoutButton}>
        ログアウト
      </button>
    </div>
  );
};

export default main;
