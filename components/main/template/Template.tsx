import styles from "./Template.module.scss";

interface Props {
  close: Function;
  changeShow: Function;
}

const Template = (props: Props) => {
  return (
    <div className={styles.inner}>
      <div className={styles.head}>
        <p>テンプレートを編集</p>
      </div>
      <button
        type="button"
        className={styles.addPerson}
        onClick={() => props.changeShow("addPerson")}
      >
        人を追加
      </button>
      <button
        type="button"
        className={styles.setting}
        onClick={() => props.changeShow("option")}
      >
        設定
      </button>
      <main className={styles.main}></main>
    </div>
  );
};

export default Template;
