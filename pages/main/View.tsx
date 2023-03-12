import styles from "../../styles/View.module.scss";
import Loading from "~/Loading";
import Header from "~/main/Header";
import FileView from "~/main/file/View";
import PeopleView from "~/main/people/View";

import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
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
import Cover from "~/main/cover/Cover";

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
  const [activeFile, setActiveFile] = useState<{
    name?: string;
    number?: number;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [showOption, setShowOption] = useState(false);

  useEffect(() => {
    // ログイン状態確認
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // ユーザー情報をセット
        setUser(user);

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

  const handleSet = async () => {
    if (!user) return;

    const labels = ["name", "email", "phone", "age", "address"];
    const data = ["name22", "name22@test.com", "000-0000-0000", 10, "Tokyo"];
    const file = 10;

    const zeroPadding = (val: number, length: number) =>
      ("0000000" + val).slice(-length);

    await addDoc(collection(db, "usersData", user.uid, "people"), {
      file: `fileName ${zeroPadding(file, 2)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      labels: labels,
      values: data,
    });
  };

  useEffect(() => {
    if (!userData) return;

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

    setFilesState(files);
  };

  const changeActiveFile = (fileName: string, fileNumber: number) => {
    setActiveFile({ name: fileName, number: fileNumber });
  };

  const changeShowOption = (state: boolean) => {
    setShowOption(state);
  };

  return (
    <div className={styles.wrapper}>
      <Header changeShowOption={changeShowOption} />
      {isLoading ? <Loading text="ユーザー情報を取得中です" /> : ""}
      {showOption ? <Cover changeShowOption={changeShowOption} /> : ""}

      <button onClick={handleSet}>set</button>

      <div className={styles.viewWrap}>
        <FileView
          files={filesState}
          changeActiveFile={changeActiveFile}
          activeFile={activeFile}
        />
        <PeopleView activeFile={activeFile?.name} />
      </div>
    </div>
  );
};

export default View;
