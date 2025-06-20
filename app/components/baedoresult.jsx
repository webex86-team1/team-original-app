// import React from "react";
import "../styles/baedoresult.css";

export default function Baedoresult({ imageUrl,score }) {
  let fukidashitext = "";
  if(score>=100){
    fukidashitext = "はなまる💮";
  }
  else if(score>=75){
    fukidashitext= "おー✨素敵✨"
  }
  else if(score>=50){
    fukidashitext="頑張ったで賞☁"
  }
  else if(score>=1){
    fukidashitext="伸びしろあり🌱"
  }
  else if(score<=0){
    fukidashitext="えーん涙T-T"
  }
  if (!imageUrl) {
    return (
      <div>
        <h1>判定結果</h1>
        <p>画像がありません</p>
      </div>
    );
  }

  return (
    <div>
      <img src="/kirakira.png" alt="キラキラ" className="kirakira"/>
      <img src="/kirakira.png" alt="キラキラ" className="kirakira1"/>
    <div className="parent animation">
     <img src="/level2.png" alt="キャラクター" className="toraberun"/>
     <img src="/fukidashi_bw03.png" alt="ふきだし" className="fukidashi"/>
     <p className="toraberuntext">↑とらべるん</p>
     <p className="fukidasinotext">{fukidashitext}</p>
    </div>
      <div className="container">
      <h2 className="resultmoji">結果発表ー！！</h2>
      <img src={imageUrl} alt="判定画像" width="50%"  loading="lazy"/>
      <div className="saiten-line">
       <p className="saiten">この写真の映え度は</p>
       <p className="ten">
      <span className="dot dot1">・</span>
      <span className="dot dot2">・</span>
      <span className="dot dot3">・</span>
      </p>
      </div>
      <p className="resultline">
        <strong className="scoreresult">{score}</strong>
        <span className ="ten">点</span>
      </p>
      </div>
    </div>
  );
}
