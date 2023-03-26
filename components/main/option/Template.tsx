import Inner from "../template/Inner";
import styles from "./Option.module.scss";

interface Props {
  changeIsLoading: Function;
  close: Function;
}

const Template = (props: Props) => {
  return (
    <div className={styles.templateWrap}>
      <Inner changeIsLoading={props.changeIsLoading} close={props.close} />
    </div>
  );
};

export default Template;
