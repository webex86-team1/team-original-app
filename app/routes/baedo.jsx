import React, { useState } from "react";
import Baedoresult from '../components/baedoresult';
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // ← 追加

export default function Baedo() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSubmitted(false); // 新しい画像選んだらリセット
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("画像を選択してください");
      return;
    }

    try {
      // Firebase Storage へのアップロード処理
      const uniqueName = `${Date.now()}_${image.name}`;
      const storageRef = ref(storage, `images/${uniqueName}`);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);

      console.log("アップロード成功！URL:", downloadURL);

      setPreviewUrl(downloadURL); // 結果画面に渡すURLをアップロード後のURLに
      setSubmitted(true);

    } catch (error) {
      console.error("画像のアップロードに失敗しました", error);
      alert("アップロードに失敗しました💦");
    }
  };

  // 表示切り替えポイント
  if (submitted) {
    return <Baedoresult imageUrl={previewUrl} />;
  }

  return (
    <div>
      <h1>映え度判定</h1>
      <p>写真を送信してね🌼</p>

      <input type="file" accept="image/*" onChange={handleImageChange} />
      {previewUrl && (
        <div>
          <img src={previewUrl} alt="preview" style={{ width: "300px" }} />
        </div>
      )}

      <button onClick={handleSubmit}>送信</button>
    </div>
  );
}
