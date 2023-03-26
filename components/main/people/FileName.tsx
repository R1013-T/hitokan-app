import { useEffect } from "react";
import styles from "./People.module.scss";

import { MdArrowBackIosNew } from "react-icons/md";

interface Props {
  activeFile?: string;
}

const FileName = (props: Props) => {

  return (
    <div className={styles.fileNameWrap}>
        <MdArrowBackIosNew className={styles.arrow} />
        <p>{props.activeFile}</p>
    </div>
  );
};

export default FileName;
