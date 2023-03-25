import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "lib/firebase";
import { useState } from "react";
import styles from "./ChangeFile.module.scss";

interface Props {
  activeParson?: any;
  close: Function;
}

const ChangeFile = (props: Props) => {
  const [value, setValue] = useState(props.activeParson.file);
  const [attention, setAttention] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttention("")

    if (value) {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(
        db,
        "usersData",
        user.uid,
        "people",
        props.activeParson.id
      );

      await updateDoc(docRef, {
        file: value,
        updatedAt: new Date(),
      });

      props.close();
    } else {
      setAttention("ファイル名を入力してください。");
    }
  };

  return (
    <div className={styles.inner}>
      <div className={styles.head}>
        <p>ファイルを変更</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file">ファイル名を入力してください。</label>
        <input
          id="file"
          type="text"
          placeholder="ファイル名"
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
        <p className={styles.attention}>{attention}</p>

        <button type="submit">変更</button>
      </form>
    </div>
  );
};

export default ChangeFile;
