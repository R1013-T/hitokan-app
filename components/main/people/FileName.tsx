import { useEffect } from "react";
import styles from "./People.module.scss";

interface Props {
  activeFile?: string;
}

const FileName = (props: Props) => {
  useEffect(() => {
    // if (props.activeFile) console.log(props.activeFile);
  }, [props.activeFile]);

  return (
    <div className={styles.fileNameWrap}>
      <p>{props.activeFile}</p>
    </div>
  );
};

export default FileName;
