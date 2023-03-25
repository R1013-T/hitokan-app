import { useState } from "react";
import styles from "../Input.module.scss";

import { VscAdd, VscRemove } from "react-icons/vsc";

interface Props {
  index: number;
  label: string;
  changeLabels: Function;
}

const Input = (props: Props) => {
  const [label, setLabel] = useState(props.label);
  const [value, setValue] = useState("");

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        value={label}
        name='labelInput'
        className={styles.label}
        onChange={(e) => setLabel(e.currentTarget.value)}
        />
      <input
        type="text"
        value={value}
        name='valueInput'
        className={styles.value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      {/* <div className={styles.buttons}>
        <div
          className={`${styles.item} ${styles.del}`}
          title="この項目を削除"
          onClick={() => props.changeLabels("", props.index)}
        >
          <VscRemove />
        </div>
        <div
          className={`${styles.item} ${styles.add}`}
          title="この項目の下に追加"
        >
          <VscAdd />
        </div>
      </div> */}
    </div>
  );
};

export default Input;
