import { useEffect, useRef, useState } from "react";
import styles from "./SignUp.module.scss";

interface Props {
  authCode: string;
  changeAuthCodeState: Function;
  changeAuthState: Function;
  changeIsLoading: Function;
}

const AuthCode = (props: Props) => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [inputIndex, setIndex] = useState(0);

  const inputRef: any = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const bsFunction = (event: any) => {
    if (event.key === "Backspace" && inputIndex > 0) {
      inputRef[inputIndex - 1].current.focus();
      setIndex(inputIndex - 1);
    }
  };

  const changeNumber = () => {
    let number = "";
    inputRef.map((ref) => {
      number += ref.current.value.toString();
    });

    if (number.length == 6) {
      if (number == props.authCode) {
        props.changeAuthState("afterInput");
        props.changeAuthCodeState(false)
        props.changeIsLoading(false)
      } else {
        alert("認証コードがあっていません。");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", bsFunction, false);
    return () => {
      document.removeEventListener("keydown", bsFunction, false);
    };
  }, [bsFunction]);

  return (
    <div className={styles.authCodeWrapper}>
      <p className={styles.label}>
        認証メールを送信しました。認証コードを入力してください。
      </p>
      <div className={styles.inner}>
        {[...Array(6)].map((_, i) => (
          <input
            className="w-[12%] text-[50px] text-center h-[100px] border-0 bg-gray-100 rounded-md"
            maxLength={1}
            key={i}
            autoFocus={i === 0}
            value={code[i]}
            type="tel"
            ref={inputRef[i]}
            onChange={(e) => {
              const codeArray = [
                i !== 0 ? code[0] : e.target.value,
                i !== 1 ? code[1] : e.target.value,
                i !== 2 ? code[2] : e.target.value,
                i !== 3 ? code[3] : e.target.value,
                i !== 4 ? code[4] : e.target.value,
                i !== 5 ? code[5] : e.target.value,
              ];
              setCode([...codeArray]);
              if (e.target.value !== "") {
                i < 5 && inputRef[i + 1].current.focus();
                setIndex(inputIndex + 1);
              }
              changeNumber();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthCode;
