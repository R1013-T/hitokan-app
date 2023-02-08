import { useRouter } from "next/router";
import CenterImage from "~/auth/CenterImage";
import styles from "./Confirm.module.scss";

interface Props {
  email: string;
  changeEmailConfirmFlag: Function;
}

const AuthEmail = (props: Props) => {
  const router = useRouter();
  
  return (
    <div className={styles.wrapper}>
      <CenterImage dir={2} />
      <main className={styles.main}>
        <div className={styles.container}>
          <p className={styles.label}>このメールアドレスで間違いないですか？</p>
          <p className={styles.center}>{props.email}</p>
          <div className={styles.buttons}>
            <button className={styles.ng} onClick={() => router.push("/")}>
              Cancel
            </button>
            <button
              className={styles.ok}
              onClick={() => props.changeEmailConfirmFlag(true)}
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthEmail;
