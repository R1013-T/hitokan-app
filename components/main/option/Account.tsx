import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "lib/firebase";
import { useEffect, useState } from "react";
import styles from "./Option.module.scss";

const Account = () => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className={styles.accountWrap}>
      <form onSubmit={() => signOut(auth)}>
        <label>Name</label>
        <input
          type="text"
          value={`${user?.displayName ? user.displayName : ""}`}
          readOnly
        />
        <label>Email Address</label>
        <input
          type="text"
          value={`${user?.email ? user.email : ""}`}
          readOnly
        />
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
};

export default Account;
