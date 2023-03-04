import styles from "./People.module.scss";

interface Props {
  activeFile?: string;
}

const FileName = (props: Props) => {
  return (
    <div className={styles.fileNameWrap}>
      <p>{props.activeFile}</p>
    </div>
  );
};

export default FileName;
