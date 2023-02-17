import { useRouter } from "next/router";
import { useEffect } from "react";

const noPageJump = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('./View')
  }, []);

  return <div></div>;
};

export default noPageJump;
