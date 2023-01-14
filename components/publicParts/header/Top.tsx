import { useRouter } from "next/router";
import styles from "./Top.module.scss";

const Top = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("./");
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}></div>
      <div className={styles.center}>
        <p onClick={handleClick}>ヒトカン</p>
      </div>
      <div className={styles.right}></div>
    </div>
  );
};

export default Top;
