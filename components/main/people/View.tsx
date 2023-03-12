import styles from "./People.module.scss";
import FileName from "./FileName";
import ActiveParson from "./details/View";

import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "lib/firebase";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import ActivePeople from "./ActivePeople";

interface Props {
  activeFile?: string;
}

const View = (props: Props) => {
  const [peopleData, setPeopleData] = useState<DocumentData[]>();
  const [activeParson, setActiveParson] = useState<DocumentData | string>(
    "none"
  );

  useEffect(() => {
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
          let peopleArray: DocumentData[] = [];
          people.forEach((doc: DocumentData) => {
            let currentDoc = doc.data()
            currentDoc.id = doc.id
            peopleArray.push(currentDoc);
          });
          setPeopleData(peopleArray);
        });
      }
    });
  }, []);

  const changeActiveParson = (parson: DocumentData | string) => {
    setActiveParson(parson);
  };

  return (
    <div className={styles.wrapper}>
      <FileName
        activeFile={
          !props.activeFile && peopleData && peopleData[0]
            ? peopleData[0].file
            : props.activeFile
        }
      />
      {activeParson === "none" ? (
        <ActivePeople
          activeFile={
            !props.activeFile && peopleData && peopleData[0]
              ? peopleData[0].file
              : props.activeFile
          }
          peopleData={peopleData}
          changeActiveParson={changeActiveParson}
        />
      ) : (
        <ActiveParson activeParson={activeParson} changeActiveParson={changeActiveParson} />
      )}
    </div>
  );
};

export default View;
