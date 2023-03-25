import { useEffect, useState } from "react";
import styles from "./AddPerson.module.scss";
import File from "./input/File";
import View from "./input/label/View";

interface Props {
  close: Function;
  changeShow: Function;
  changeIsLoading: Function;
}

const AddPerson = (props: Props) => {
  const [inputState, setInputState] = useState("fileName");
  const [fileName, setFileName] = useState("");

  const changeInputState = (state: string) => {
    setInputState(state);
  };

  const changeFileName = (fileName: string) => {
    setFileName(fileName);
  };

  return (
    <div className={styles.inner}>
      <div className={styles.head}>
        <p>追加</p>
      </div>
      <button
        type="button"
        className={styles.templateEdit}
        onClick={() => props.changeShow("template")}
      >
        テンプレートを編集
      </button>
      <main className={styles.main}>
        {inputState === "fileName" ? (
          <File
            changeInputState={changeInputState}
            changeFileName={changeFileName}
          />
        ) : (
          ""
        )}
        {inputState === "values" ? (
          <View
            fileName={fileName}
            changeInputState={changeInputState}
            close={props.close}
            changeIsLoading={props.changeIsLoading}
          />
        ) : (
          ""
        )}
      </main>
    </div>
  );
};

export default AddPerson;
