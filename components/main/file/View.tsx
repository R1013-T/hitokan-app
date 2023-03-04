import styles from "./File.module.scss";

import { useContext, useEffect } from "react";
import { UserContext } from "pages/main/View";

import { DocumentData } from "firebase/firestore";

const View = () => {
  const userContextData = useContext(UserContext);

  console.log("userContextData", userContextData);

  useEffect(() => {
    setFileName();
  }, []);

  const setFileName = () => {
    if (!userContextData.peopleData) return;
    userContextData.peopleData.forEach((doc: DocumentData) => {
      console.log(doc.data());
    });
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>files</p>
    </div>
  );
};

export default View;
