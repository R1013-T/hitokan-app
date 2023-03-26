import styles from "./Details.module.scss";

import {
  VscClose,
  VscTrash,
  VscFolder,
  VscSave,
  VscEdit,
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
  isEdit: boolean;
  changeIsEdit: Function;
}

const Head = (props: Props) => {
  const [isCover, setIsCover] = useState(false);

  const handleCloseClick = () => {
    props.changeActiveParson("none");
  };

  const handleSaveClick = () => {
    props.save();
  };

  const handleFolderClick = () => {
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
        <div className={styles.itemWrap} title="編集" onClick={() => props.changeIsEdit()}>
          <VscEdit
            className={`${styles.item} ${styles.edit} ${props.isEdit ? styles.isEdit : ""}`}
          />
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
