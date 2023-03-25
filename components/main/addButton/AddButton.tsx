import styles from "./AddButton.module.scss";

import { VscAdd } from "react-icons/vsc";

interface Props {
  changeShow: Function;
}

const AddButton = (props: Props) => {
  return (
    <div className={styles.container} onClick={() => props.changeShow(true)}>
      <VscAdd className={styles.addButton} />
    </div>
  );
};

export default AddButton;
