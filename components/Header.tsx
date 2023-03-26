import { useRouter } from "next/router";
import styles from "./Header.module.scss";

const Header = () => {

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* <img src="./images/icon.svg" alt="icon" /> */}
        <img
          src="../images/logo.png"
          alt=""
          className={styles.logo}
          onClick={() => location.reload()}
        />
      </div>
    </div>
  );
};

export default Header;
