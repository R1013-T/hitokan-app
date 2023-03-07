import styles from "./People.module.scss";
import FileName from "./FileName";
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
            peopleArray.push(doc.data());
          });
          setPeopleData(peopleArray);
        });
      }
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <FileName
        activeFile={
          !props.activeFile && peopleData && peopleData[0]
            ? peopleData[0].file
            : props.activeFile
        }
      />
      <ActivePeople
        activeFile={
          !props.activeFile && peopleData && peopleData[0]
            ? peopleData[0].file
            : props.activeFile
        }
        peopleData={peopleData}
      />
    </div>
  );
};

export default View;
