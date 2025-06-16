import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from "date-fns";
import Header from "../components/header.jsx";
import "../styles/auth/gamen.css";

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
    const formattedDate = format(date,"yyyy/MM/dd")

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
      <Header />
      <h1></h1>
      <h2>投稿する</h2>
      <label>タイトル：</label>
      <input
        type="text"
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
    </div>
  );
}
