import { useRouter } from "next/router";
import { useEffect } from "react";

const PageJump = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('./View')
  }, []);

  return <div></div>;
};

export default PageJump;
