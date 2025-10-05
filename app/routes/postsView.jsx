import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/auth/postsView.css";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchPosts(user.uid);
      } else {
        alert("ログインが必要です。");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchPosts = async (uid) => {
    try {
      const snapshot = await getDocs(collection(db, "posts"));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.uid === uid);

      setPosts(data);
    } catch (error) {
      console.error("投稿データの取得中にエラーが発生しました:", error.message);
    }
  };

  const handleDeletePost = async (id) => {
    const confirmeddelete = window.confirm("本当に削除しますか？");
    if (!confirmeddelete) return;

    try {
      await deleteDoc(doc(db, "posts", id));
      const newPosts = posts.filter((post) => post.id !== id);
      setPosts(newPosts);
      alert("投稿が削除されました");
    } catch (error) {
      console.error("削除中にエラーが発生しました:", error.message);
      alert("削除中にエラーが発生しました。");
    }
  };

  return (
    <div className="postviewszentai">
      <h2 className="postview-title">投稿一覧</h2>
      <div id="allpost">
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>⭐満足度: {post.satisfaction} / 5</p>
            <img src={post.photoURL} alt={post.title} width="300" />
            <p>{post.mainText}</p>
            <p>
              訪問日:{" "}
              {post.visitDate}
            </p>
            <p>
              投稿日時:{" "}
              {post.createdAt && post.createdAt.toDate
                ? post.createdAt.toDate().toLocaleString()
                : "不明"}
            </p>
            <button onClick={() => handleDeletePost(post.id)}>削除</button>
          </div>
        ))}
      </div>
    </div>
  );
}
