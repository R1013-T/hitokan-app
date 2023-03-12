import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./Details.module.scss";
import Head from "./Head";

interface Props {
  activeParson?: any;
  changeActiveParson: Function;
}

const View = (props: Props) => {
  const [values, setValues] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    console.log("activeParson:", props.activeParson);
    setValues(props.activeParson.values);
    setLabels(props.activeParson.labels);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {};

  return (
    <div className={styles.container}>
      <Head changeActiveParson={props.changeActiveParson} />
      {values.map((value: string, i: number) => (
        <div key={i} className={`${styles.item}`}>
          <label>{labels[i]}</label>
          <input
            id={`input${String(i)}`}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e, i)}
          />
        </div>
      ))}
    </div>
  );
};

export default View;
