import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import Panel from "./Panel";
import styles from "./People.module.scss";

interface Props {
  people?: DocumentData[];
  activeFile?: string;
  changeActiveParson: Function;
}

const ActivePeople = (props: Props) => {
  const [activePeople, setActivePeople] = useState<DocumentData[]>();

  useEffect(() => {
    if (!props.people) return;
    let activePeopleArray: DocumentData[] = [];
    props.people.forEach((parson) => {
      if (parson.file === props.activeFile) {
        activePeopleArray.push(parson);
      }
    });
    setActivePeople(activePeopleArray);
  }, [props.activeFile, props.people]);

  // useEffect(() => {
  //   console.log("▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽");
  //   activePeople?.forEach((parson) => {
  //     console.log(parson);
  //   });
  //   console.log("△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△");
  // }, [activePeople]);

  const handleParsonClick = (parson: DocumentData) => {
    props.changeActiveParson(parson)
  };

  return (
    <div className={styles.activeWrap}>
      <div className={styles.panelWrap}>
        {activePeople?.map((parson, i) => (
          <div key={i} id={String(i)} onClick={() => handleParsonClick(parson)}>
            <Panel parson={parson} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivePeople;
