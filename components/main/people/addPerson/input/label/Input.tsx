import { useEffect, useState } from "react";
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

  useEffect(() => {
    setLabel(props.label);
  }, [props.label]);

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        value={label}
        name="labelInput"
        className={styles.label}
        onChange={(e) => setLabel(e.currentTarget.value)}
      />
      <input
        type="text"
        value={value}
        name="valueInput"
        className={styles.value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <VscRemove
        className={`${styles.button} ${styles.del}`}
        onClick={() => props.changeLabels(false, props.index)}
      />
      <VscAdd
        className={`${styles.button} ${styles.add}`}
        onClick={() => props.changeLabels(true, props.index)}
      />
    </div>
  );
};

export default Input;
