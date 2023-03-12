import styles from "./Details.module.scss";

import { VscClose, VscTrash, VscCopy, VscFolder } from "react-icons/vsc";

interface Props {
  changeActiveParson: Function;
}

const Head = (props: Props) => {
  const handleCloseClick = () => {
    props.changeActiveParson("none");
  };

  return (
    <div className={styles.headWrap}>
      <div className={styles.left}>
        <div className={styles.itemWrap} onClick={handleCloseClick}>
          <VscClose className={`${styles.item} ${styles.close}`} />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.itemWrap}>
          <VscFolder className={`${styles.item} ${styles.folder}`} />
        </div>
        <div className={styles.itemWrap}>
          <VscCopy className={`${styles.item} ${styles.copy}`} />
        </div>
        <div className={styles.itemWrap}>
          <VscTrash className={`${styles.item} ${styles.trash}`} />
        </div>
      </div>
    </div>
  );
};

export default Head;
