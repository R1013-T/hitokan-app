import styles from "./AddButton.module.scss";
import { AiOutlinePlus } from "react-icons/ai";

interface Props {
  changeIsAdd: Function;
}

const AddButton = (props: Props) => {
  return (
    <div className={styles.container} onClick={() => props.changeIsAdd(true)}>
      <AiOutlinePlus />
    </div>
  );
};

export default AddButton;
