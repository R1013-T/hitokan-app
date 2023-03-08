import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import Panel from "./Panel";
import styles from "./People.module.scss";

interface Props {
  peopleData?: DocumentData[];
  activeFile?: string;
}

const ActivePeople = (props: Props) => {
  const [activePeople, setActivePeople] = useState<DocumentData[]>();

  useEffect(() => {
    if (!props.peopleData) return;
    let activePeopleArray: DocumentData[] = [];
    props.peopleData.forEach((parson) => {
      if (parson.file === props.activeFile) {
        activePeopleArray.push(parson);
      }
    });
    setActivePeople(activePeopleArray);
  }, [props.activeFile, props.peopleData]);

  useEffect(() => {
    console.log("▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽")
    activePeople?.forEach((parson) => {
      console.log(parson)
    });
    console.log("△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△")
  }, [activePeople]);

  return (
    <div className={styles.activeWrap}>
      <div className={styles.panelWrap}>
        {activePeople?.map((parson, i) => (
          <div key={i} id={String(i)}>
            <Panel parson={parson} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivePeople;
