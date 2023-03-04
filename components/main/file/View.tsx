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

interface Props {
  files: string[];
}

const View = (props: Props) => {
  const [user, setUser] = useState<User>();
  const [files, setFiles] = useState<string[]>(props.files);

  const [activeFile, setActiveFile] = useState<number>(0);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // peopleコレクション常にチェック
        const peopleCollection = collection(
          db,
          "usersData",
          user.uid,
          "people"
        );
        const q = query(peopleCollection, orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (people) => {
          let fileArray: string[] = [];
          console.log("filesF", fileArray);
          people.forEach((doc: DocumentData) => {
            let currentFile = doc.data().file;
            if (fileArray.length != 0) {
              let alreadyFileFlag = false;
              fileArray.forEach((file) => {
                if (file === currentFile) alreadyFileFlag = true;
              });
              if (!alreadyFileFlag) fileArray.push(currentFile);
            } else {
              console.log("a");
              fileArray.push(currentFile);
            }
          });
          setFiles(fileArray);
        });
      }
    });
  }, []);

  useEffect(() => {
    console.log("files:", files);
  }, [files]);

  const handleFileClick = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    console.log(e.currentTarget.id);
    setActiveFile(Number(e.currentTarget.id));
  };

  const handleConsole = () => {
    console.log(files);
    console.log(props.files);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <p>files</p>
      </div>
      <div className={styles.fileWrap}>
        {files.map((file, i) => (
          <p
            key={i}
            id={String(i)}
            className={activeFile === i ? styles.active : ""}
            onClick={(e) => handleFileClick(e)}
          >
            {file}
          </p>
        ))}
      </div>
      <button onClick={handleConsole}>console</button>
    </div>
  );
};

export default View;
