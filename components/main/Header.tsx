import styles from "./Header.module.scss";

import { VscMenu } from "react-icons/vsc";
import { RiUser4Line } from "react-icons/ri";

interface Props {
  changeShowOption: Function;
}

const Header = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.menuWrap}>
        <VscMenu
          className={`${styles.icon} ${styles.menu}`}
          onClick={() => props.changeShowOption(true)}
        />
      </div>
      <div className={styles.imgWrap}>
        <img src="/images/logo.png" alt="HITOKAN" />
      </div>
      <div className={styles.spaceWrap}>
        <div className={styles.icon}></div>
      </div>
    </div>
  );
};

export default Header;
