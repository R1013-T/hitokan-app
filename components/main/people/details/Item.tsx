import { useEffect, useRef, useState } from "react";
import styles from "./Details.module.scss";

import { VscAdd, VscRemove } from "react-icons/vsc";
import { HiOutlinePhoto } from "react-icons/hi2";
import imageCompression from "browser-image-compression";

interface Props {
  index: number;
  label: string;
  value: string;
  changeImageCode: Function;
  imageCode: string;
  isEdit: boolean;
  changeValues: Function;
}

const Item = (props: Props) => {
  const [base64Text, setBase64Text] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    setBase64Text(props.imageCode);
    setValue(props.value);
    setLabel(props.label);
  }, []);

  useEffect(() => {
    setValue(props.value);
    setLabel(props.label);
  }, [props.value, props.label]);

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;

    // 画像リサイズ
    const options = {
      maxSizeMB: 0.1,
    };

    let resizeFile: Blob | undefined = undefined;
    await imageCompression(file, options)
      .then((compressedFile) => {
        resizeFile = compressedFile;
      })
      .catch((err) => {
        console.log(err.message);
      });

    // 画像をbase64に変換
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (!e.currentTarget) return;
      setBase64Text(e.currentTarget.result);
    };

    if (resizeFile) {
      reader.readAsDataURL(resizeFile);
    }
  };

  useEffect(() => {
    // 画像をbase64で表示
    const iconImage: any = document.querySelector("#iconImage");
    if (!iconImage) return;

    if (base64Text) {
      iconImage.src = base64Text;
      props.changeImageCode(base64Text);
    }
  }, [base64Text]);

  return (
    <div className={styles.data}>
      {props.index != 0 ? (
        <div
          className={`${styles.valueWrap} ${props.isEdit ? styles.isEdit : ""}`}
        >
          <input
            name="labelInput"
            type="text"
            className={styles.labelInput}
            value={label}
            onChange={(e) => setLabel(e.currentTarget.value)}
            readOnly={props.isEdit ? false : true}
          />
          <input
            name="valueInput"
            type="text"
            className={styles.valueInput}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            readOnly={props.isEdit ? false : true}
          />
          {props.isEdit ? (
            <VscRemove
              className={`${styles.button} ${styles.del}`}
              onClick={() => props.changeValues(false, props.index)}
            />
          ) : (
            ""
          )}
          {props.isEdit ? (
            <VscAdd
              className={`${styles.button} ${styles.add}`}
              onClick={() => props.changeValues(true, props.index)}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        <div id="imageWrap" className={styles.imageWrap}>
          <div className={styles.img}>
            <img id="iconImage" src="" alt="" />
            {props.isEdit ? (
              <label>
                <HiOutlinePhoto className={styles.imageSelectIcon} />
                <input
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => handleChangeImage(e)}
                />
              </label>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
