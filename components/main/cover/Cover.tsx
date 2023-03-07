import styles from "./Cover.module.scss";
import Option from "../option/Option";

import { useState } from "react";

interface Props {
  changeShowOption: Function;
}

const Cover = (props: Props) => {
  const [isClose, setIsClose] = useState(false);

  const handleClose = () => {

    setIsClose(true)

    setTimeout(function () {
      props.changeShowOption(false);
    }, 300);

  };

  return (
    <div className={`${styles.container} ${isClose ? styles.close : ""}`}>
      <div className={styles.top} onClick={() => handleClose()}></div>
      <div className={styles.left} onClick={() => handleClose()}></div>
      <div className={`${styles.center} ${isClose ? styles.close : ""}`}>
          <Option />
      </div>
      <div className={styles.right} onClick={() => handleClose()}></div>
      <div className={styles.bottom} onClick={() => handleClose()}></div>
    </div>
  );
};

export default Cover;
