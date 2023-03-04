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
  user?: User;
  userData?: UserDataType;
  peopleData?: DocumentData;
}
const View = () => {
  const router = useRouter();

  const [userData, setUserData] = useState<DataType>();

  const [user, setUser] = useState<User | undefined>();
  const [filesState, setFilesState] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showOption, setShowOption] = useState(false);

  useEffect(() => {
    // ログイン状態確認
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // ユーザー情報をセット
        setUser(user);

        // !
        setUserData((prevState) => ({ ...prevState, user: user }));
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
      setUserData((prevState) => ({ ...prevState, peopleData: people }));
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

    setUserData((prevState) => ({
      ...prevState,
      userData: { setting: settingDoc.data(), info: infoDoc.data() },
    }));
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

  const handleSet = () => {
    if (!user) return;

    const labels = ["name", "age"];
    const data = ["太郎", 10];

    addDoc(collection(db, "usersData", user.uid, "people"), {
      file: "fileName08",
      createdAt: new Date(),
      labels: labels,
      data: data,
    });
  };

  useEffect(() => {
    if (!userData) return;
    console.log("userData", userData);

    checkFiles();
  }, [userData]);

  const checkFiles = () => {
    if (!userData) return;
    if (!userData.peopleData) return;
    let files: string[] = [];

    userData.peopleData.forEach((people: DocumentData) => {
      const currentFile = people.data().file;

      if (files.length > 0) {
        let alreadyFileData = false;
        files.forEach((file) => {
          if (currentFile === file) alreadyFileData = true;
        });
        if (!alreadyFileData) files.push(currentFile);
      } else {
        files.push(currentFile);
      }
    });

    setFilesState(files)
  };

  useEffect(() => {
    console.log(filesState)
  },[filesState])

  const changeShowOption = (state: boolean) => {
    setShowOption(state);
  };

  return (
    <div className={styles.wrapper}>
      <Header changeShowOption={changeShowOption} />
      {/* <button onClick={handleSet}>set</button> */}
      {isLoading ? <Loading text="ユーザー情報を取得中です" /> : ""}
      {showOption ? <Option changeShowOption={changeShowOption} /> : ""}

      <div className={styles.viewWrap}>
        <FileView files={filesState} />
        <PeopleView />
      </div>

      {/* <p>{user?.email}</p>
      <p>{user?.displayName}</p>
      <button onClick={() => signOut(auth)}>Sign Out</button>
      <br />
      <br />
      <button onClick={handleConsole}>console</button> */}
    </div>
  );
};

export default View;
