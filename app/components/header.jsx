import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigate("./sign-in");
      })
      .catch(() => {
        alert("ログアウトできませんでした。");
      });
  };
  return (
    <>
      <ul>
        {/* ヘッダーの中身は適当です */}
        <li>ホーム</li>
        <li>育成</li>
        <li>作成</li>
        <li>閲覧</li>
      </ul>
      <button onClick={handleLogOut}>ログアウト</button>
    </>
  );
};

export default Header;
