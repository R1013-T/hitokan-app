import { useRouter } from "next/router";
import { useEffect } from "react";

const EmailAuth = () => {
  const router = useRouter();
  const { authId } = router.query;

  useEffect(() => {
    if (router.isReady) console.log(authId);
  }, [router.isReady]);

  return <div>{authId}</div>;
};

export default EmailAuth;
