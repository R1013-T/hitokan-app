import styles from "./CenterImage.module.scss";

interface Props {
  dir: number;
}

const CenterImage = (props: Props) => {
  return (
    <div className={styles.container}>
      {props.dir === 1 ? (
        <img src="./images/hitokanIcon.svg" alt="" />
      ) : (
        <img src="../images/hitokanIcon.svg" alt="" />
      )}
    </div>
  );
};

export default CenterImage;
