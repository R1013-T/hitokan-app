import styles from "./panel.module.scss";

import { VscChromeClose } from "react-icons/vsc";
import { useRef } from "react";
import { useState } from "react";

interface Props {
  email: string;
  changeIsAdd: Function;
}

const Panel = (props: Props) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [birth, setBirth] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("email: ", props.email);
    console.log("name: ", name);
    console.log("age: ", age);
    console.log("birth: ", birth);
    console.log("organization: ", organization);
    console.log("email: ", email);
    console.log("phone: ", phone);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div
          className={styles.closeButton}
          onClick={() => props.changeIsAdd(false)}
        >
          <VscChromeClose />
        </div>
        <p>追加</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className={styles.row}>
            <div className={styles.ageWrap}>
              <label htmlFor="age">age</label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className={styles.birthWrap}>
              <label htmlFor="birth">birthday</label>
              <input
                id="birth"
                type="date"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
              />
            </div>
          </div>
          <label htmlFor="organization">organization</label>
          <input
            id="organization"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
          <label htmlFor="email">email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="phone">phone</label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit">save</button>
        </form>
      </div>
    </div>
  );
};

export default Panel;
