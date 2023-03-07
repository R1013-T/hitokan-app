import styles from "./File.module.scss";

import { useEffect, useState } from "react";
import { auth, db } from "lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Head from "next/head";
import Panel from "./Panel";

interface Props {
  files: string[];
  changeActiveFile: Function;
  activeFile?: { name?: string; number?: number };
}

const View = (props: Props) => {
  const [user, setUser] = useState<User>();
  const [files, setFiles] = useState<string[]>(props.files);
  const [activeFileNumber, setActiveFileNumber] = useState<number>(0);
  const [activeFileName, setActiveFileName] = useState("");

  useEffect(() => {
    // fileを表示
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const peopleCollection = collection(
          db,
          "usersData",
          user.uid,
          "people"
        );
        const q = query(peopleCollection, orderBy("updatedAt", "desc"));
        const unsub = onSnapshot(q, (people) => {
          let fileArray: string[] = [];
          people.forEach((doc: DocumentData) => {
            let currentFile = doc.data().file;
            if (fileArray.length != 0) {
              let alreadyFileFlag = false;
              fileArray.forEach((file) => {
                if (file === currentFile) alreadyFileFlag = true;
              });
              if (!alreadyFileFlag) fileArray.push(currentFile);
            } else {
              fileArray.push(currentFile);
            }
          });
          setFiles(fileArray);
        });
      }
    });
  }, []);

  // active file
  const handleFileClick = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    setActiveFileName(String(e.currentTarget.textContent));
    setActiveFileNumber(Number(e.currentTarget.id));
  };
  useEffect(() => {
    props.changeActiveFile(activeFileName, activeFileNumber);
  }, [activeFileName, activeFileNumber]);

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>HITOKAN</title>
      </Head>
      <div className={styles.title}>
        <p>file</p>
      </div>
      <div className={styles.fileWrap}>
        {files.map((file, i) => (
          <div
            key={i}
            id={String(i)}
            className={`${styles.file} ${activeFileNumber === i ? styles.active : ""}`}
            onClick={(e) => handleFileClick(e)}
          >
            <Panel fileName={file} isActive={activeFileNumber === i} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default View;
