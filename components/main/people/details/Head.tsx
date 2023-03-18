import styles from "./Details.module.scss";

import {
  VscClose,
  VscTrash,
  VscCopy,
  VscFolder,
  VscSave,
  VscAdd,
} from "react-icons/vsc";

interface Props {
  activeParson?: any;
  changeActiveParson: Function;
  save: Function;
}

const Head = (props: Props) => {
  const handleCloseClick = () => {
    props.changeActiveParson("none");
  };

  const handleSaveClick = () => {
    props.save();
  };
  const handleAddClick = () => {
    console.log("add");
  };
  const handleFolderClick = () => {
    console.log("folder");
  };
  const handleCopyClick = () => {
    console.log("copy");
  };
  const handleTrashClick = () => {
    console.log("trash");
  };

  return (
    <div className={styles.headWrap}>
      <div className={styles.left}>
        <div
          className={styles.itemWrap}
          title="閉じる"
          onClick={handleCloseClick}
        >
          <VscClose className={`${styles.item} ${styles.close}`} />
        </div>
        <div
          className={styles.itemWrap}
          title="保存して閉じる"
          onClick={handleSaveClick}
        >
          <VscSave className={`${styles.item} ${styles.save}`} />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.itemWrap} title="追加" onClick={handleAddClick}>
          <VscAdd className={`${styles.item} ${styles.add}`} />
        </div>
        <div
          className={styles.itemWrap}
          title="ファイルを変更"
          onClick={handleFolderClick}
        >
          <VscFolder className={`${styles.item} ${styles.folder}`} />
        </div>
        <div
          className={styles.itemWrap}
          title="コピー"
          onClick={handleCopyClick}
        >
          <VscCopy className={`${styles.item} ${styles.copy}`} />
        </div>
        <div
          className={styles.itemWrap}
          title="削除"
          onClick={handleTrashClick}
        >
          <VscTrash className={`${styles.item} ${styles.trash}`} />
        </div>
      </div>
    </div>
  );
};

export default Head;
