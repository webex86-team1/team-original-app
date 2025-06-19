import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "../components/header.jsx";
import PostForm from "../routes/gamen.jsx";
import "../styles/auth/gamen.css";
import "../styles/auth/tpage.css";

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
      <h1></h1>
      <h2>投稿一覧</h2>
      <div id="allpost">
      {post.map((post) => (
        <div key={post.id}>
          <p id="dotdot"></p>
          <h3>{post.title}</h3>
          <p id="satisfyX">満足度:{post.satisfaction}/5</p>
          <img id="image" src={post.photoURL} alt={post.title} width="300" />
          <p id="maintextA">{post.mainText}</p>
          <p id="visitday">{post.visitDate}に訪れました</p>
          <p id="uploadday">{post.createdAt?.toDate().toLocaleString()}に投稿しました</p>
          <div id="deletebutton">
          <button onClick={() => handleDeletePost(post.id)}>削除</button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}


