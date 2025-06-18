import React, { useState } from "react";
import Baedoresult from "../components/baedoresult";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Header from "../components/header.jsx";
export default function Baedo() {
  const [image, setImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState(""); // スコア＋コメント

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSubmitted(false);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("画像を選択してください");
      return;
    }

    try {
      const uniqueName = `${Date.now()}_${image.name}`;
      const storageRef = ref(storage, `images/${uniqueName}`);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);

      console.log("アップロード成功！URL:", downloadURL);

      const response = await fetch(
        "https://baedoscore-z2oiicc62q-uc.a.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: downloadURL }),
        }
      );

      const data = await response.text();
      console.log("AI Studioからのレスポンス:", data);

      setResultData(data);
      setPreviewUrl(downloadURL); // URLも結果に渡す
      setSubmitted(true);
    } catch (error) {
      console.error("エラー:", error);
      alert("アップロードまたは採点に失敗しました💦");
    }
  };

  if (submitted && resultData) {
    return <Baedoresult imageUrl={previewUrl} score={resultData} />;
  }

  return (
    <div>
      <Header />
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
