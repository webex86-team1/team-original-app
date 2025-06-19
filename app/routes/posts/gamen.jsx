import "../styles/auth/header.css";
import { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from "date-fns";

export default function PostList() {
  const [post, setPosts] = useState([]);
  const [title, setTitles] = useState("");
  const [satisfaction, setSatisfactions] = useState(3);
  const [photo, setPhotos] = useState(null);
  const [mainText, setMainTexts] = useState("");
  const [visitDate, setVisitDates] = useState("");

  const handleAddPost = async () => {
    if (!title || !photo || !visitDate || !satisfaction || !mainText)
      return alert("すべての項目を入力してください");
    const confirmedupload = window.confirm("投稿しますか？");
    if (!confirmedupload) return;

    const photoRef = ref(storage, `images/${photo.name}`);
    await uploadBytes(photoRef, photo);
    console.log("await uploadBytes(photoRef, photo);");
    const photoURL = await getDownloadURL(photoRef);
    console.log("const photoURL = await getDownloadURL(photoRef);");
    const date = new Date();
    const formattedDate = format(date, "yyyy/MM/dd");

    await addDoc(collection(db, "ferret-database"), {
      title,
      satisfaction,
      photoURL,
      mainText,
      visitDate,
      createdAt: serverTimestamp(), //タイムスタンプを記録
    });

    setTitles("");
    setSatisfactions(3);
    setPhotos(null);
    setMainTexts("");
    setVisitDates("");
    fetchPosts(); // 投稿リスト更新
  };

  const handleDeletePost = async (id) => {
    const confirmeddelete = window.confirm("本当に削除しますか？");
    if (!confirmeddelete) return;

    const newPosts = post.filter((post) => post.id !== id);
    setPosts(newPosts);
    alert("投稿が削除されました（Firestoreからの削除処理は別途必要）");
  };

  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, "ferret-database"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>旅行投稿フォーム</h2>
      <label>タイトル：</label>
      <input
        type="text"
        className="title"
        value={title}
        onChange={(e) => setTitles(e.target.value)}
      />
      <br />
      <label>満足度（1〜5）：</label>
      <input
        type="number"
        value={satisfaction}
        onChange={(e) => setSatisfactions(Number(e.target.value))}
        min="1"
        max="5"
      />
      <br />
      <label>写真：</label>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png"
        onChange={(e) => setPhotos(e.target.files[0])}
      />
      <br />
      <label>本文：</label>
      <input
        type="text"
        value={mainText}
        onChange={(e) => setMainTexts(e.target.value)}
      />
      <br />
      <label>訪問時期：</label>
      <input
        type="text"
        value={visitDate}
        onChange={(e) => setVisitDates(e.target.value)}
      />
      <br />
      <button onClick={handleAddPost}>投稿する</button>

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
