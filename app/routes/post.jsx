import { useEffect, useState, useRef } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from "date-fns";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "../components/header.jsx";
import "../styles/auth/gamen.css";

export default function PostList() {
  const [post, setPosts] = useState([]);
  const [title, setTitles] = useState("");
  const [satisfaction, setSatisfactions] = useState(3);
  const [photo, setPhotos] = useState(null);
  const [mainText, setMainTexts] = useState("");
  const [visitDate, setVisitDates] = useState("");
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchPosts(user.uid);
      } else {
        alert("ログインが必要です。");
        //ログインページに遷移する
      }
    });
  }, []);

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

    await addDoc(collection(db, "posts"), {
      title,
      satisfaction,
      photoURL,
      mainText,
      visitDate,
      createdAt: serverTimestamp(), //タイムスタンプを記録
      uid: user.uid,
    });

    setTitles("");
    setSatisfactions(3);
    setPhotos(null);
    setMainTexts("");
    setVisitDates("");
    fileInputRef.current.value = "";
    fetchPosts(); // 投稿リスト更新
  };

  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, "posts"));
    const data = snapshot.docs
      .map((doc) => {
        const postData = { id: doc.id, ...doc.data() };
        console.log("取得した投稿データ:", postData);
      })
      .filter((item) => item.uid === user?.uid);
    setPosts(data);
  };

  return (
    <div>
      <Header />
      <div className="contentsWrapper">
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
          ref={fileInputRef}
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
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDates(e.target.value)}
        />
        <br />
        <button onClick={handleAddPost}>投稿する</button>
      </div>
    </div>
  );
}
