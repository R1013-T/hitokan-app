import styles from "./ListRow.module.scss";

interface Props {
  name: string;
  age: string;
  birth: string;
  organization: string;
  email: string;
  phone: string;
}

const ListRow = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {props.name ? <p><span>name:</span>{props.name}</p> : ""}
        {props.age ? <p><span>age:</span>{props.age}</p> : ""}
        {props.birth ? <p><span>birthday:</span>{props.birth}</p> : ""}
        {props.organization ? <p><span>organization:</span>{props.organization}</p> : ""}
        {props.email ? <p><span>email:</span>{props.email}</p> : ""}
        {props.phone ? <p><span>phone:</span>{props.phone}</p> : ""}
      </div>
    </div>
  );
};

export default ListRow;
