import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "lib/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "~/Loading";

const View = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    getUserInfo();
  }, [user]);

  const getUserInfo = () => {
    console.log("user:", user);
    // ! ユーザー情報取得
    // ! 取得出来なかったらトップに戻す？
    // ! ロード終了
    // ! Stay Signed In 表示
  };

  return (
    <div>
      {/* {isLoading ? <Loading text="ユーザー情報を取得中です" /> : ""} */}
      <p>{user?.email}</p>
      <p>{user?.displayName}</p>
      <button onClick={() => signOut(auth)} >Sign Out</button>
    </div>
  );
};

export default View;
