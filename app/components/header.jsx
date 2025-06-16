import { getAuth, signOut } from "firebase/auth";
import { Link,useNavigate } from "react-router-dom";
import { GiMirrorMirror } from "react-icons/gi";
import { FaMapMarkedAlt, } from "react-icons/fa";

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
        <li><Link to="/sign-in">使い方</Link></li>
        <li><Link to="/gamen">投稿する</Link></li>
        <li><Link to="/home"><FaMapMarkedAlt />地図</Link></li>
        <li><GiMirrorMirror /><Link to="/baedo">映え度</Link></li>
        <li><Link to="/tpage">投稿</Link></li>
      </ul>
      <button onClick={handleLogOut}>ログアウト</button>
    </>
  );
};

export default Header;