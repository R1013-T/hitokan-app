import styles from "./People.module.scss"
import FileName from "./FileName";

const View = () => {
  return (
    <div className={styles.wrapper}>
      <FileName />
      <p>　people</p>
    </div>
  );
}

export default View;