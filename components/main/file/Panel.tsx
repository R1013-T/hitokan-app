import styles from "./File.module.scss";

interface Props {
  fileName: string;
  isActive: boolean;
}

const Panel = (props: Props) => {
  return (
    <div className={`${styles.fileInner} ${props.isActive ? styles.active : ""} `}>
      <div className={styles.border}></div>
      <p className={styles.fileName}>{props.fileName}</p>
    </div>
  );
};

export default Panel;
