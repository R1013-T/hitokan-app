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
  files?: string[];
  changeActiveFile: Function;
  activeFile?: { name?: string; number?: number };
}

const View = (props: Props) => {
  const [files, setFiles] = useState<string[] | undefined>([]);
  const [activeFileNumber, setActiveFileNumber] = useState<number>(0);
  const [activeFileName, setActiveFileName] = useState("");

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

  useEffect(() => {
    console.log("files:", props.files);
    setFiles(props.files)
  }, [props.files]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <p>file</p>
      </div>
      <div className={styles.fileWrap}>
        {files?.map((file, i) => (
          <div
            key={i}
            id={String(i)}
            className={`${styles.file} ${
              activeFileNumber === i ? styles.active : ""
            }`}
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
