import { useEffect } from "react";

interface Props {
  email: string;
  password: string;
  userName: string;
  changeIsLoading: Function;
  changeSignUpState: Function;
}

const AfterAuth = (props: Props) => {

  useEffect(() => {
    console.log(props.email)
  },[])

  return (
    <div>
      <p>Email: {props.email}</p>
      <p>Password: {props.password}</p>
      <p>UserName: {props.userName}</p>
    </div>
  );
};

export default AfterAuth;
