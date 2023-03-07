import styles from "./Option.module.scss"

import { signOut } from "firebase/auth";
import { auth } from "lib/firebase";

const Option = () => {
  return (
    <div className={styles.inner}>
      <button onClick={() => signOut(auth)} >signOut</button>
    </div>
  );
}

export default Option;