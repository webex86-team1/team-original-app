import React, { useState } from "react";
import Baedoresult from "../components/baedoresult";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/baedo.css";

export default function Baedo() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState("");
  // 初期値falseで表示されない
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

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
      setPreviewUrl(downloadURL);
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
    <div className ="zentai">
      <img src="/kumomo.png" alt="曇" className="kumo1" />
      <img src="/kumomo.png" alt="曇" className="kumo2" />
      <div className="parent">
        <img src="/level2.png" alt="キャラクター" className="toraberun" />
        <img src="/fukidashi_bw03.png" alt="ふきだし" className="fukidashi" />
        <p className="toraberuntext">↑とらべるん</p>
        <p className="fukidashitext">
          写真を
          <br />
          送信してね🌼
        </p>
      </div>
      <div className="container">
        <h1>--映え度判定--</h1>
        <p>
          旅行の思い出をとらべるんが採点します☁
          <br />
          100点はなまる💮を目指そう✨
        </p>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && (
          <div>
            <img src={previewUrl} alt="preview" style={{ width: "50%" }} />
          </div>
        )}
        <div>
          <button onClick={handleSubmit}>送信</button>
          {isLoading && <p style={{ color: "gray" }}>採点中…⏳</p>}
        </div>
      </div>
    </div>
  );
}
