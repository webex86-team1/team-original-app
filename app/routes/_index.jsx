import { Link } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  return (
    <div className="index-page">
      <h1>トップページ</h1>
      <div className="index-page-links">
        <Link to="/sign-up">新規登録</Link>
        <Link to="/sign-in">ログイン</Link>
      </div>
    </div>
  );
}
