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
  people?: DocumentData[];
  activeFile?: string;
}

const View = (props: Props) => {
  const [activeParson, setActiveParson] = useState<DocumentData | string>(
    "none"
  );

  const changeActiveParson = (parson: DocumentData | string) => {
    setActiveParson(parson);
  };

  return (
    <div className={styles.wrapper}>
      <FileName
        activeFile={
          !props.activeFile && props.people && props.people[0]
            ? props.people[0].file
            : props.activeFile
        }
      />
      {activeParson === "none" ? (
        <ActivePeople
        activeFile={
          !props.activeFile && props.people && props.people[0]
            ? props.people[0].file
            : props.activeFile
        }
          people={props.people}
          changeActiveParson={changeActiveParson}
        />
      ) : (
        <ActiveParson
          activeParson={activeParson}
          changeActiveParson={changeActiveParson}
        />
      )}
    </div>
  );
};

export default View;
