import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import Loading from "~/Loading";
import styles from "./Details.module.scss";
import Head from "./Head";
import Item from "./Item";

interface Props {
  activeParson?: any;
  changeActiveParson: Function;
}

const View = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [imageCode, setImageCode] = useState<string>("");
  const [values, setValues] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    console.log("activeParson:", props.activeParson);
    setValues(props.activeParson.values);
    setLabels(props.activeParson.labels);

    setImageCode(props.activeParson.values[0]);
  }, []);

  const changeImageCode = (code: string) => {
    setImageCode(code);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    save();
  };

  const save = () => {
    const formEl: any = document.forms;
    const inputArray = formEl.activePeopleForm.input;

    if (!inputArray) return;

    const labelArray: string[] = [];
    const valueArray: string[] = [];

    inputArray.forEach((input: any) => {
      labelArray.push(input.id);
      valueArray.push(input.value);
    });

    // 画像データを配列に追加
    
    console.log(props.activeParson.id);
    console.log(imageCode);
    console.log("labelArray:", labelArray);
    console.log("valueArray:", valueArray);

    setIsLoading(true);

    // Firestoreにidで変更

    setTimeout(function () {
      setIsLoading(false);
      props.changeActiveParson("none");
    }, 1000);
  };

  return (
    <div className={styles.container}>
      {isLoading ? <Loading text="保存中です" /> : ""}

      <Head
        activeParson={props.activeParson}
        changeActiveParson={props.changeActiveParson}
        save={save}
      />

      <form name="activePeopleForm" onSubmit={handleSubmit}>
        <div className={styles.dataWrap}>
          {values.map((value: string, i: number) => (
            <div key={i} className={`${styles.itemWrap}`}>
              <Item
                index={i}
                label={labels[i]}
                value={value}
                changeImageCode={changeImageCode}
                imageCode={imageCode}
              />
            </div>
          ))}
        </div>
        <button type="submit">保存して閉じる</button>
      </form>
    </div>
  );
};

export default View;
