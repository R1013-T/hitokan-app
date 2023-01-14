import styles from "./CenterImage.module.scss";

interface Props {
  isLoading: boolean;
}

const CenterImage = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {props.isLoading ? (
          <img src="./images/LoadingIcon.svg" alt="" />
        ) : (
          <img src="./images/icon.svg" alt="" />
        )}
      </div>
    </div>
  );
};

export default CenterImage;
