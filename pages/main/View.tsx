import { auth } from "lib/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const View = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) router.push("/");
    setUser(user);
  }, []);

  return (
    <div>
      <p>{user?.email}</p>
      <p>{user?.displayName}</p>
    </div>
  );
};

export default View;
