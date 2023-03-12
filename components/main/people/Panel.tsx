import { DocumentData } from "firebase/firestore";
import styles from "./People.module.scss";

interface Props {
  parson: DocumentData;
}

const Panel = (props: Props) => {
  return (
    <div className={styles.panelContainer}>

      <div className={styles.imageWrap}>
        
      </div>

      <div className={styles.headWrap}>
        <label>{props.parson.labels[0]}</label>
        <input type="text" value={props.parson.values[0]} readOnly />
      </div>

      <div className={styles.itemWrap}>
        {props.parson.values?.map((item: string, i: number) => (
          <div
            key={i}
            className={`${styles.item} ${i === 0 ? styles.hidden : ""}`}
          >
            <label>{props.parson.labels[i]}</label>
            <input type="text" value={item} readOnly />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Panel;
