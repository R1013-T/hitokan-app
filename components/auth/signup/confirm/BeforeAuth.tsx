import styles from "./Confirm.module.scss";

interface Props {
  email: string;
  changeSignUpState: Function;
}

const BeforeAuth = (props: Props) => {
  const handleAuthMailSend = () => {};

  return (
    <div className={styles.beforeWrap}>
      <p>以下のメールアドレスに認証メールを送信します。</p>
      <p>{props.email}</p>
      <div className={styles.buttons}>
        <button className={styles.ng} onClick={() => props.changeSignUpState("beforeAuthInput")}>
          Cancel
        </button>
        <button className={styles.ok} onClick={handleAuthMailSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default BeforeAuth;
