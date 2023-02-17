import styles from "./Loading.module.scss";

interface Props {
  compleat?: boolean;
  text: string;
}

const Loading = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <img
          src="/images/icon.svg"
          alt=""
          className={`${props.compleat ? "" : styles.move}`}
        />
        <p>{props.text}</p>
      </div>
    </div>
  );
};

export default Loading;
