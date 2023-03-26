import styles from "./Option.module.scss";

import { signOut } from "firebase/auth";
import { auth } from "lib/firebase";
import { useState } from "react";
import Account from "./Account";
import Display from "./Display";
import Template from "./Template";

interface Props {
  changeIsLoading: Function;
  close: Function;
}

const Option = (props: Props) => {
  const [isActive, setIsActive] = useState("account");

  return (
    <div className={styles.inner}>
      <div className={styles.head}>
        <p>設定</p>
        <ul className={styles.settingList}>
          <li
            className={`${isActive === "account" ? styles.active : ""}`}
            onClick={() => setIsActive("account")}
          >
            Account
          </li>
          <li
            className={`${isActive === "display" ? styles.active : ""}`}
            onClick={() => setIsActive("display")}
          >
            Display
          </li>
          <li
            className={`${isActive === "template" ? styles.active : ""}`}
            onClick={() => setIsActive("template")}
          >
            Template
          </li>
        </ul>
      </div>
      <main className={styles.main}>
        {isActive === "account" ? <Account /> : ""}
        {isActive === "display" ? <Display /> : ""}
        {isActive === "template" ? (
          <Template
            changeIsLoading={props.changeIsLoading}
            close={props.close}
          />
        ) : (
          ""
        )}
      </main>
      <small className={styles.version}>Hitokan v0.50</small>
    </div>
  );
};

export default Option;
