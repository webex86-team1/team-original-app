import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "@remix-run/react";
import { GoogleAuthProvider, signInWithPopup } from "../firebase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("ログインに成功しました");
      navigate("/gamen");
    } catch (error) {
      alert("ログインに失敗しました");
      console.log(error.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("ログインに成功しました");
      navigate("/home");
    } catch (error) {
      alert("ログインできませんでした");
    }
  };

  return (
    <div className="sign-up-page">
      <h1>タイトル</h1>
      <h2>Hi,おかえり～</h2>
      <img src="../public/eggTrip.png" alt="eggTrip"></img>

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
            ログイン
          </button>
        </form>
        <button className="google-button" onClick={handleGoogleSignIn}>
          Googleでログイン
        </button>
        <Link to="/sign-up">新規登録はこちら</Link>
      </div>
    </div>
  );
}
