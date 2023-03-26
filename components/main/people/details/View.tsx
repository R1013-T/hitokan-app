import { doc, DocumentData, updateDoc } from "firebase/firestore";
import { auth, db } from "lib/firebase";
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
  const [isEdit, setIsEdit] = useState(false);

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

  const save = async () => {
    const formEl: any = document.forms;
    const valueInput = formEl.activePeopleForm.valueInput;
    const labelInput = formEl.activePeopleForm.labelInput;

    const labelArray: string[] = [];
    const valueArray: string[] = [];

    valueInput.forEach((input: any) => {
      valueArray.push(input.value);
    });
    labelInput.forEach((input: any) => {
      labelArray.push(input.value);
    });

    // 画像データを配列に追加
    labelArray.unshift("image");
    valueArray.unshift(imageCode);

    setIsLoading(true);

    // Firestoreにidで変更

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
      labels: labelArray,
      values: valueArray,
      updatedAt: new Date(),
    })
      .then(() => {
        console.log(valueArray);
        setIsLoading(false);
        props.changeActiveParson("none");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const changeIsLoading = (state: boolean) => {
    setIsLoading(state);
  };

  const changeIsEdit = () => {
    setIsEdit((prevState) => !prevState);
  };

  return (
    <div className={styles.container}>
      {isLoading ? <Loading text="保存中です" /> : ""}

      <Head
        activeParson={props.activeParson}
        changeActiveParson={props.changeActiveParson}
        save={save}
        changeIsLoading={changeIsLoading}
        isEdit={isEdit}
        changeIsEdit={changeIsEdit}
      />

      <div className={styles.formWrap}>
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
                  isEdit={isEdit}
                />
              </div>
            ))}
          </div>
          {values.length != 0 ? (
            <button className={styles.save} type="submit">
              Save
            </button>
          ) : (
            ""
          )}
        </form>
      </div>
    </div>
  );
};

export default View;
