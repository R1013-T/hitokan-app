import { useEffect, useState } from "react";
import Panel from "../add/panel/Panel";
import styles from "./List.module.scss";
import { RxCrossCircled } from "react-icons/rx";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "lib/firebase";
import Delete from "../delete/Delete";

interface Props {
  peoples: any;
}

const List = (props: Props) => {
  const [isChange, setIsChange] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [changePeopleData, setChangePeopleData] = useState("");
  const [deletePeopleData, setDeletePeopleData] = useState("");

  const handleListClick = (people) => {
    setChangePeopleData(people);
  };
  useEffect(() => {
    console.log(changePeopleData);
    setIsChange(true);
  }, [changePeopleData]);

  const changeIsAdd = (state) => {
    setIsChange(state);
  };

  const handleDelete = async (people) => {
    setDeletePeopleData(people);
  };
  useEffect(() => {
    setIsDelete(true);
  }, [deletePeopleData]);

  const changeIsDelete = (state) => {
    setIsDelete(state)
  }

  const list = props.peoples.map((people, index) => (
    <div key={index} className={styles.container}>
      <div className={styles.inner} onClick={() => handleListClick(people)}>
        {people.name ? <p>name: {people.name}</p> : ""}
        {people.age ? <p>age: {people.age}</p> : ""}
        {people.birthday ? <p>birthday: {people.birthday}</p> : ""}
        {people.organization ? <p>organization: {people.organization}</p> : ""}
        {people.email ? <p>email: {people.email}</p> : ""}
        {people.phone ? <p>phone: {people.phone}</p> : ""}
      </div>
      <RxCrossCircled
        className={styles.deleteButton}
        onClick={() => handleDelete(people)}
      />
    </div>
  ));

  return (
    <div className={styles.listWrapper}>
      {list}
      {isChange ? (
        <Panel changeIsAdd={changeIsAdd} people={changePeopleData} />
      ) : (
        ""
      )}
      {isDelete ? <Delete changeIsDelete={changeIsDelete} people={deletePeopleData} /> : ""}
    </div>
  );
};

export default List;
