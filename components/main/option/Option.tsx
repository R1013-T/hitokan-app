import styles from "./Option.module.scss";
import Inner from "./Inner";

interface Props {
  changeShowOption: Function;
}

const Option = (props: Props) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.top}
        onClick={() => props.changeShowOption(false)}
      ></div>
      <div
        className={styles.left}
        onClick={() => props.changeShowOption(false)}
      ></div>
      <div className={styles.center}>
        <div className={styles.inner}>
          <Inner />
        </div>
      </div>
      <div
        className={styles.right}
        onClick={() => props.changeShowOption(false)}
      ></div>
      <div
        className={styles.bottom}
        onClick={() => props.changeShowOption(false)}
      ></div>
    </div>
  );
};

export default Option;
