import styles from "./CenterImage.module.scss";

interface Props {
  isLoading: boolean;
}

const CenterImage = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {props.isLoading ? (
          <img src="LoadingIcon.svg" alt="　" />
        ) : (
          <img src="Icon.svg" alt="　" />
        )}
      </div>
    </div>
  );
};

export default CenterImage;
