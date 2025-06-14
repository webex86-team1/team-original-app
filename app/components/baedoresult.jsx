// import React from "react";

export default function Baedoresult({ imageUrl,score }) {
  if (!imageUrl) {
    return (
      <div>
        <h2>判定結果</h2>
        <p>画像がありません</p>
      </div>
    );
  }

  return (
    <div>
      <h2>判定結果</h2>
      <img src={imageUrl} alt="判定画像" width="300" />
      <p>映え度スコア：<strong>{score}</strong> 点</p>
    </div>
  );
}
