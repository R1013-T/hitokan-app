import styles from "./Details.module.scss";

import {
  VscClose,
  VscTrash,
  VscCopy,
  VscFolder,
  VscSave,
  VscAdd,
} from "react-icons/vsc";
import { useEffect, useState } from "react";
import { auth, db } from "lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import Cover from "~/main/cover/Cover";

interface Props {
  activeParson?: any;
  changeActiveParson: Function;
  save: Function;
  changeIsLoading: Function;
}

const Head = (props: Props) => {
  const [isCover, setIsCover] = useState(false);

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
    console.log(props.activeParson.file);
    changeShow(true);
  };

  const handleTrashClick = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(
      db,
      "usersData",
      user.uid,
      "people",
      props.activeParson.id
    );
    const res = window.confirm("削除しますか?");
    if (!res) return;
    props.changeIsLoading(true);
    await deleteDoc(docRef)
      .then(() => {
        props.changeIsLoading(false);
        props.changeActiveParson("none");
      })
      .catch((err) => {
        props.changeIsLoading(false);
        console.log(err.message);
      });
  };

  const changeShow = (state: boolean) => {
    setIsCover(state);
  };

  return (
    <div className={styles.headWrap}>
      {isCover ? (
        <Cover
          show="changeFile"
          changeShow={changeShow}
          activeParson={props.activeParson}
        />
      ) : (
        ""
      )}
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
        {/* <div className={styles.itemWrap} title="追加" onClick={handleAddClick}>
          <VscAdd className={`${styles.item} ${styles.add}`} />
        </div> */}
        <div
          className={styles.itemWrap}
          title="ファイルを変更"
          onClick={handleFolderClick}
        >
          <VscFolder className={`${styles.item} ${styles.folder}`} />
        </div>
        {/* <div
          className={styles.itemWrap}
          title="コピー"
          onClick={handleCopyClick}
        >
          <VscCopy className={`${styles.item} ${styles.copy}`} />
        </div> */}
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
