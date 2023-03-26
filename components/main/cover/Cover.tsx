import styles from "./Cover.module.scss";
import Option from "../option/Option";

import { useState } from "react";
import ChangeFile from "../people/details/changeFile/ChangeFile";
import { DocumentData } from "firebase/firestore";
import AddPerson from "../people/addPerson/AddPerson";
import Template from "../template/Template";
import Loading from "~/Loading";

interface Props {
  show: string;
  changeShow: Function;
  activeParson?: DocumentData;
}

const Cover = (props: Props) => {
  const [isClose, setIsClose] = useState(false);
  const [show, setShow] = useState(props.show);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const changeShow = (show: string) => {
    setShow(show);
  };

  const changeIsLoading = (state: boolean, text: string) => {
    setIsLoading(state);
    setLoadingText(text);
  };

  const handleClose = () => {
    setIsClose(true);

    setTimeout(function () {
      props.changeShow(false);
    }, 300);
  };

  return (
    <div className={`${styles.container} ${isClose ? styles.close : ""}`}>
      {isLoading ? <Loading text={loadingText} /> : ""}

      <div className={styles.top} onClick={() => handleClose()}></div>
      <div className={styles.left} onClick={() => handleClose()}></div>
      <div className={`${styles.center} ${isClose ? styles.close : ""}`}>
        {show === "option" ? <Option changeIsLoading={changeIsLoading} close={handleClose} /> : ""}
        {show === "changeFile" ? (
          <ChangeFile activeParson={props.activeParson} close={handleClose} />
        ) : (
          ""
        )}
        {show === "addPerson" ? (
          <AddPerson
            close={handleClose}
            changeShow={changeShow}
            changeIsLoading={changeIsLoading}
          />
        ) : (
          ""
        )}
        {show === "template" ? (
          <Template
            close={handleClose}
            changeShow={changeShow}
            changeIsLoading={changeIsLoading}
          />
        ) : (
          ""
        )}
      </div>
      <div className={styles.right} onClick={() => handleClose()}></div>
      <div className={styles.bottom} onClick={() => handleClose()}></div>
    </div>
  );
};

export default Cover;
