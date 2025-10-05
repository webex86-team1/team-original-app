import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/auth/post.css";

export default function PostForm() {
  const [user, setUser] = useState(null);
  const [title, setTitles] = useState("");
  const [satisfaction, setSatisfactions] = useState(3);
  const [photo, setPhotos] = useState(null);
  const [mainText, setMainTexts] = useState("");
  const [visitDate, setVisitDates] = useState("");
  const [loading, setLoading] = useState(false);

  const uid = user?.uid ?? null;

  // 認証状態の監視（マウント時のみ）
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        setUser(null);
        alert("ログインしてください");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddPost = async () => {
    if (!user || !uid) return alert("ログインしてから投稿してください");
    if (!title || !photo || !visitDate || !satisfaction || !mainText) {
      return alert("すべての項目を入力してください");
    }

    // 画像の軽いバリデーション
    const okTypes = ["image/jpeg", "image/png"];
    if (!okTypes.includes(photo.type)) {
      return alert("JPEG または PNG の画像を選択してください");
    }
    const maxSizeMB = 5;
    if (photo.size > maxSizeMB * 1024 * 1024) {
      return alert(`画像サイズは ${maxSizeMB}MB 以下にしてください`);
    }

    if (!window.confirm("投稿しますか？")) return;

    setLoading(true);
    try {
      // ユニークなファイル名にして上書きを避ける
      const uniqueName = `${Date.now()}-${photo.name}`;
      const photoRef = ref(storage, `image1/${uid}/${uniqueName}`);

      await uploadBytes(photoRef, photo);
      const photoURL = await getDownloadURL(photoRef);

      await addDoc(collection(db, "posts"), {
        uid,
        title,
        satisfaction,
        photoURL, // Storage のダウンロードURL
        mainText,
        visitDate, // <input type="date"> の yyyy-mm-dd 文字列
        createdAt: serverTimestamp(),
      });

      // フォーム初期化
      setTitles("");
      setSatisfactions(3);
      setPhotos(null);
      setMainTexts("");
      setVisitDates("");
      alert("投稿が完了しました");
    } catch (e) {
      console.error("投稿中にエラー:", e);
      alert(`投稿中にエラーが発生しました: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

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
          onChange={(e) => setPhotos(e.target.files?.[0] || null)}
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
        <button className="tb" onClick={handleAddPost} disabled={loading}>
          {loading ? "投稿中..." : "投稿する"}
        </button>
      </div>
    </div>
  );
}
