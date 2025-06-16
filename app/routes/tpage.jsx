import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "../components/header.jsx";
import PostForm from "../routes/gamen.jsx";
import "../styles/auth/gamen.css";

export default function PostList() {
  const [post, setPosts] = useState([]);

  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, "ferret-database"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = (id) => {
    const confirmeddelete = window.confirm("本当に削除しますか？");
    if (!confirmeddelete) return;

    const newPosts = post.filter((post) => post.id !== id);
    setPosts(newPosts);
    alert("投稿が削除されました（Firestoreからの削除処理は別途必要）");
  };

  return (
    <div>
      <Header />

      <h2>投稿一覧</h2>
      {post.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>満足度: {post.satisfaction} / 5</p>
          <img src={post.photoURL} alt={post.title} width="200" />
          <p>{post.mainText}</p>
          <p>訪問時期: {post.visitDate}</p>
          <p>投稿時間: {post.createdAt?.toDate().toLocaleString()}</p>
          <button onClick={() => handleDeletePost(post.id)}>削除</button>
        </div>
      ))}
    </div>
  );
}


