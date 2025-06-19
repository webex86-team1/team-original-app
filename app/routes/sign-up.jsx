import "../styles/auth/sign-up.css";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "@remix-run/react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("新規登録に成功しました");
      navigate("/home");
    } catch (error) {
      alert("新規登録できませんでした");
    }
  };

  return (
    <div className="sign-up-page">
      <h1>フェレットラベル</h1>
      <h2>Hi,はじめまして？</h2>
      <img src="/eggTrip.png" alt="eggTrip"></img>

      <div className="sign-up-form">
        <form onSubmit={handleSubmit}>
          {/* メールアドレス */}
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* パスワード */}
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="sign-up-button">
            新規登録
          </button>
        </form>
        <Link to="/sign-in">ログインはこちら</Link>
      </div>
    </div>
  );
}
