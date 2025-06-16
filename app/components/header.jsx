import { Link, useNavigate } from "@remix-run/react";
import "../styles/auth/header.css";
import { LuSend } from "react-icons/lu";
import { FaMapMarked,FaUserCircle } from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";
import { GiMirrorMirror } from "react-icons/gi";
import { FaHouse } from "react-icons/fa6";

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    const logoutCheck = window.confirm("ログアウトしますか？");
    if (!logoutCheck) return;
    navigate("/sign-in");
  };

  return (
    <header>
      <nav>
          <p id="howuse">
          <Link to="/gamen">
          <LuSend />
          使い方
          </Link>
          </p>
          <p id="toukou">
          <Link to="/gamen">
          <MdPostAdd />
          投稿する
          </Link>
          </p>
          <p id="map">
          <Link to="/home">
          <FaMapMarked />
          地図
          </Link>
          </p>
          <p id="baedo">
          <Link to="/contact">
          <GiMirrorMirror />
          映え度
          </Link>
          </p>
          <p id="tpage">
          <Link to="/tpage">
          <FaHouse />
          投稿一覧
          </Link>
          </p>
      <button onClick={logout}><FaUserCircle /></button>
      </nav>
    </header>
  );
};

export default Header;
