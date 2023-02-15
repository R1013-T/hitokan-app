import styles from "./Confirm.module.scss";

import { useEffect, useState } from "react";

import { VscEye, VscEyeClosed } from "react-icons/vsc";

interface Props {
  email: string;
  password: string;
  userName: string;
  changeIsLoading: Function;
  changeSignUpState: Function;
}

const AfterAuth = (props: Props) => {
  const [inputType, seInputType] = useState("password");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("s");
  };

  const handleClickEye = () => {
    setIsPasswordHidden((prevState) => !prevState);
  };

  useEffect(() => {
    if (isPasswordHidden) {
      seInputType("password")
    } else {
      seInputType("text")
    }
  }, [isPasswordHidden])
  

  return (
    <div className={`${styles.container} ${styles.after}`}>
      <form onSubmit={handleSubmit}>
        <label>UserName</label>
        <input type="text" value={props.userName} readOnly />
        <label>Email Address</label>
        <input type="text" value={props.email} readOnly />
        <label>Password</label>
        <div className={styles.passWrap}>
          <input type={inputType} value={props.password} readOnly />
          <div className={styles.eye} onClick={handleClickEye}>
            {isPasswordHidden ? <VscEye /> : <VscEyeClosed />}
          </div>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.ng}
            onClick={() => props.changeSignUpState("AfterAuthInput")}
          >
            Edit
          </button>
          <button type="submit" className={styles.ok}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default AfterAuth;
