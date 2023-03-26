import styles from "./Template.module.scss";
import { useEffect, useState } from "react";

import { VscAdd, VscRemove } from "react-icons/vsc";

interface Props {
  index: number;
  label: string;
  changeLabels: Function;
}

const Input = (props: Props) => {
  const [label, setLabel] = useState(props.label);

  useEffect(() => {
    setLabel(props.label);
  }, [props.label]);

  return (
    <div className={styles.labelWrap}>
      <input
        type="text"
        value={label}
        name="templateInput"
        onChange={(e) => setLabel(e.currentTarget.value)}
      />
      <VscRemove
        className={`${styles.button} ${styles.del} `}
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
