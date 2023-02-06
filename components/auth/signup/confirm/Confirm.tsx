import { useEffect, useState } from "react";
import AfterAuth from "./AfterAuth";
import BeforeAuth from "./BeforeAuth";
import styles from "./Confirm.module.scss";

interface Props {
  email: string;
  password: string;
  userName: string;
  changeIsLoading: Function;
  changeSignUpState: Function;
}

const Confirm = (props: Props) => {
  const [authFlag, setAuthFlag] = useState(false)

  useEffect(() => {
    if (props.password) setAuthFlag(true)
    
  },[])

  return (
    <div className={styles.container}>
      {authFlag ? <AfterAuth /> : <BeforeAuth changeSignUpState={props.changeSignUpState} email={props.email} changeIsLoading={props.changeIsLoading} />}
    </div>
  );
};

export default Confirm;
