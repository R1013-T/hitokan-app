import { auth } from "lib/firebase";
import { useRouter } from "next/router";

const main = () => {
  const router = useRouter();

  const handleClickLogout = () => {
    auth.signOut();
    router.push("/");
  };

  return (
    <div>
      {auth.currentUser?.email}
      {auth.currentUser?.displayName}
      <br />
      <button onClick={handleClickLogout}>logout</button>
    </div>
  );
};

export default main;
