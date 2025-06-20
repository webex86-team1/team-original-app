import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import Header from "../components/header.jsx";
// import PostForm from "../routes/gamen.jsx";
import "../styles/auth/gamen.css";

export default function PostList() {
  const [post, setPosts] = useState([]);
  // const [user, setUser] = useState(null);

  // const fetchPosts = async () => {
  //   const snapshot = await getDocs(collection(db, "posts"));
  //   const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //   setPosts(data);
  // };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("ログインユーザーのUID", user.uid);
        // setUser(user);
        fetchPosts(user.uid);
      } else {
        alert("ログインが必要です。");
        //ログインページに遷移する
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchPosts = async (uid) => {
    const snapshot = await getDocs(collection(db, "posts"));
    const data = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.uid === uid);
    setPosts(data);
  };

  const handleDeletePost = async (id) => {
    const confirmeddelete = window.confirm("本当に削除しますか？");
    if (!confirmeddelete) return;

    await deleteDoc(doc(db, "posts", id));
    const newPosts = post.filter((post) => post.id !== id);
    setPosts(newPosts);
    alert("投稿が削除されました"); //（Firestoreからの削除処理は別途必要）
  };

  return (
    <div>
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
