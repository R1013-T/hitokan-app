import styles from "../../styles/View.module.scss";
import Loading from "~/Loading";
import Header from "~/main/Header";
import Option from "~/main/option/Option";
import FileView from "~/main/file/View";
import PeopleView from "~/main/people/View";

import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

import { auth, db } from "lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

interface UserDataType {
  setting: DocumentData | undefined;
  info: DocumentData | undefined;
}

interface DataType {
  user: User | undefined;
  userData: UserDataType | undefined;
  peopleData: DocumentData | undefined;
}

const dataContext: DataType = {
  user: undefined,
  userData: undefined,
  peopleData: undefined,
};

export const UserContext = createContext<DataType>(dataContext);

const View = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | undefined>();
  // let userData: UserData;
  // let peopleData: DocumentData;


  const [isLoading, setIsLoading] = useState(true);
  const [showOption, setShowOption] = useState(false);

  useEffect(() => {
    // ログイン状態確認
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // ユーザー情報をセット
        setUser(user);
        dataContext.user = user;
      } else {
        // ログインしていない場合はトップページヘ
        router.push("/");
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    checkUserInfo(); // ユーザー情報を取得

    // peopleコレクション常にチェック
    const peopleCollection = collection(db, "usersData", user.uid, "people");
    const unsub = onSnapshot(peopleCollection, (people) => {
      dataContext.peopleData = people;
    });
  }, [user]);

  const checkUserInfo = async () => {
    if (!user) return;

    const docRef = doc(db, "usersData", user.uid);
    const docSnap = await getDoc(doc(docRef, "data", "info"));

    // usersDataコレクションに存在確認
    if (docSnap.exists()) {
      //  ユーザー情報取得
      await getUserInfo();
    } else {
      // usersDataコレクションに無かったらセット
      await setUserInfo();
    }

    setIsLoading(false);
  };

  const getUserInfo = async () => {
    if (!user) return;
    const docRef = doc(db, "usersData", user.uid);

    const settingDoc = await getDoc(doc(docRef, "data", "setting"));
    const infoDoc = await getDoc(doc(docRef, "data", "info"));

    dataContext.userData = { setting: settingDoc.data(), info: infoDoc.data() };
  };

  const setUserInfo = async () => {
    if (!user) return;
    const docRef = doc(db, "usersData", user.uid);

    await setDoc(doc(docRef, "data", "info"), {
      email: user.email,
      name: user.displayName,
      createdAt: new Date(),
    });
    await setDoc(doc(docRef, "data", "setting"), {
      colorTheme: "white",
      viewType: "panel",
      template: [
        { label: "name", type: "string" },
        { label: "email", type: "string" },
        { label: "phone", type: "number" },
        { label: "birthday", type: "date" },
        { label: "age", type: "number" },
      ],
    });
  };

  // const handleSet = () => {
  //   if (!user) return;

  //   const labels = ["name", "age"];
  //   const data = ["太郎", 10];

  //   addDoc(collection(db, "usersData", user.uid, "people"), {
  //     file: "fileName",
  //     createdAt: new Date(),
  //     labels: labels,
  //     data: data,
  //   });
  // };

  // const handleConsole = () => {
  //   console.log("setting: ", userData?.setting);
  //   console.log("info   : ", userData?.info);
  //   if (peopleData.size != 0) {
  //     console.log("people");
  //     peopleData.forEach((doc: DocumentData) => {
  //       console.log(doc.data());
  //     });
  //   } else {
  //     console.log("noting people");
  //   }
  // };

  const changeShowOption = (state: boolean) => {
    setShowOption(state);
  };

  return (
    <div className={styles.wrapper}>
      <UserContext.Provider value={dataContext}>
        <Header changeShowOption={changeShowOption} />
        {isLoading ? <Loading text="ユーザー情報を取得中です" /> : ""}
        {showOption ? <Option changeShowOption={changeShowOption} /> : ""}

        <div className={styles.viewWrap}>
          <FileView />
          <PeopleView />
        </div>
      </UserContext.Provider>

      {/* <p>{user?.email}</p>
      <p>{user?.displayName}</p>
      <button onClick={() => signOut(auth)}>Sign Out</button>
      <br />
      <button onClick={handleSet}>set</button>
      <br />
      <button onClick={handleConsole}>console</button> */}
    </div>
  );
};

export default View;
