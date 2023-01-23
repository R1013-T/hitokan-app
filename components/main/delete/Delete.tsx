import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "lib/firebase";
import styles from "./Delete.module.scss";

interface Props {
  people: any;
  changeIsDelete: Function;
}

const Delete = (props: Props) => {
  const handleDelete = async () => {
    await deleteDoc(
      doc(db, "users", auth.currentUser!.uid, "peoples", props.people.id)
    );

    props.changeIsDelete(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <p>削除しますか？</p>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.no}
            onClick={() => props.changeIsDelete(false)}
          >
            Cancel
          </button>
          <button type="button" className={styles.ok} onClick={handleDelete}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
