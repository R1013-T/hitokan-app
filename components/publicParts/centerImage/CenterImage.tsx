import Image from "next/image";
import styles from "./CenterImage.module.scss";

interface Props {
  isLoading: boolean;
}

const CenterImage = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {props.isLoading ? (
          <Image src="./images/LoadingIcon.svg" layout='fill' objectFit='contain' alt="" />
        ) : (
          <Image src="./images/icon.svg" layout='fill' objectFit='contain' alt="" />
        )}
      </div>
    </div>
  );
};

export default CenterImage;
