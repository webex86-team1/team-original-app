import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "@remix-run/react";
import { GoogleAuthProvider, signInWithPopup } from "../firebase";
import "../styles/auth/sign-in.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("ログインに成功しました");
      navigate("/howTo");
    } catch (error) {
      alert("ログインに失敗しました");
      console.log(error.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (!email || !password || password.length < 6) {
        alert("メールアドレスと6文字以上のパスワードを入力してください。");
        return;
      }

      alert("ログインに成功しました");
      navigate("/howTo");
    } catch (error) {
      alert("ログインできませんでした");
    }
  };

  return (
    <div className="sign-in-page">
      <h1>フェレットラベル</h1>
      <h3>Hi,おかえり～</h3>
      <img src="/planeEgg.png" alt="planeEgg" />

      <div className="sign-in-form">
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
          <button className="btn" type="submit">
            ログイン
          </button>
        </form>
        <p>または</p>
        <button className="btn" onClick={handleGoogleSignIn}>
          Googleでログイン
        </button>
        <Link to="/sign-up">新規登録はこちら</Link>
      </div>
    </div>
  );
}
