import styles from "./Template.module.scss";

import { useEffect, useState } from "react";

import { auth, db } from "lib/firebase";
import { doc, DocumentData, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Input from "./Input";

interface Props {
  changeIsLoading: Function;
  close: Function;
}

const Inner = (props: Props) => {
  const [labels, setLabels] = useState<any[]>([]);

  useEffect(() => {
    console.log("aaaa");
    getTemplate();
  }, []);

  const getTemplate = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(db, "usersData", user.uid, "data", "setting");
    const settingDoc = await getDoc(docRef);
    const settingData = settingDoc.data();

    if (!settingData) return;
    const template = settingData.template;

    const labelArray: any[] = [];
    template.forEach((label: any) => {
      labelArray.push(label.label);
    });
    setLabels(labelArray);
  };
  useEffect(() => {
    console.log("labels:", labels);
  }, [labels]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // フォームの値取得
    const formEl: any = document.forms;
    const templateInput = formEl.templateForm.templateInput;

    const templateArray: any[] = [];

    templateInput.forEach((input: any) => {
      const label = { label: input.value, type: "string" };
      templateArray.push(label);
    });

    setTemplateFirestore(templateArray);
  };

  // Firestoreに保存
  const setTemplateFirestore = async (template: any) => {
    console.log(template);

    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(db, "usersData", user.uid, "data", "setting");

    props.changeIsLoading(true, "保存中です");

    await updateDoc(docRef, {
      template: template,
    });

    props.changeIsLoading(false, "");
    props.close();
  };

  const changeLabels = (isAdd: boolean, index: number) => {
    if (isAdd) {
      console.log("add", index);
      setLabels((prevState) => {
        const arr = [...prevState];
        arr.splice(index + 1, 0, "");
        return arr;
      });
    } else {
      console.log("del", index);
      setLabels(labels.filter((label, i) => i != index));
    }
  };

  return (
    <div className={styles.container}>
      <form name="templateForm" onSubmit={handleSubmit}>
        <div className={styles.labelsWrap}>
          {labels.map((label: string, i: number) => (
            <Input
              key={i}
              index={i}
              label={label}
              changeLabels={changeLabels}
            />
          ))}
        </div>
        <div id="labelsWrap" className={styles.labelsWrap}></div>
        {labels.length != 0 ? (
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
        ) : (
          ""
        )}
      </form>
    </div>
  );
};

export default Inner;
