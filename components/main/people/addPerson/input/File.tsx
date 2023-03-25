import { useState } from "react";
import styles from "./Input.module.scss";

interface Props {
  changeInputState: Function;
  changeFileName: Function;
}

const File = (props: Props) => {
  const [value, setValue] = useState("");
  const [attention, setAttention] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value) {
      props.changeFileName(value);
      props.changeInputState("values");
    } else {
      setAttention("ファイル名を入力してください。");
    }
  };

  return (
    <div className={styles.fileWrap}>
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
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default File;
