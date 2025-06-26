import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from "date-fns";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/auth/post.css";

export default function PostForm() {
  const [user, setUser] = useState(null);
  const [post, setPosts] = useState([]);
  const [title, setTitles] = useState("");
  const [satisfaction, setSatisfactions] = useState(3);
  const [photo, setPhotos] = useState(null);
  const [mainText, setMainTexts] = useState("");
  const [visitDate, setVisitDates] = useState("");
  const uid = user?.uid;
  // 以下と同じ意味
  // let uid;
  // if (user !== null && user !== undefined) {
  //   uid = user.uid;
  // } else {
  //   uid = undefined;
  // }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // onAuthStateChanged()関数を実行し、戻り値（＝監視を解除する関数）をunsubscribeという定数に代入
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        alert("ログインしてください");
      }
    });
    return () => unsubscribe();
  });

  const handleAddPost = async () => {
    if (!user || !uid) {
      alert("ログインしてから投稿してください");
      return;
    }
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
      uid: user.uid,
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
    // fetchPosts(); // 投稿リスト更新
    alert("投稿が完了しました");
  };

  // const fetchPosts = async () => {
  //   const snapshot = await getDocs(collection(db, "posts"));
  //   const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //   setPosts(data);
  // };

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  return (
    <div className="postzentai">
      <h2 className="form-title">↓投稿はここから↓</h2>
      <div id="title">
        <input
          id="inputtitle"
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitles(e.target.value)}
        />
        <br />
      </div>
      <div id="classs">
        <div id="satisfy">
          <p className="classA">満足度（１〜５）</p>
          <input
            type="number"
            id="inputsatisfy"
            className="classA"
            value={satisfaction}
            onChange={(e) => setSatisfactions(Number(e.target.value))}
            min="1"
            max="5"
          />
          <br />
        </div>
        <div id="when">
          <p className="classA">訪問日</p>
          <input
            id="inputwhen"
            className="classA"
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDates(e.target.value)}
          />
          <br />
        </div>
      </div>
      <div id="image">
        <label>写真</label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={(e) => setPhotos(e.target.files[0])}
        />
        <br />
      </div>
      <div id="maintext">
        <input
          id="inputtext"
          type="text"
          placeholder="旅行記録を書いてください。"
          value={mainText}
          onChange={(e) => setMainTexts(e.target.value)}
        />
        <br />
      </div>
      <div id="toukoubotan">
        <button className="tb" onClick={handleAddPost}>
          投稿する
        </button>
      </div>
    </div>
  );
}
