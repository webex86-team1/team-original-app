 // const functions = require("firebase-functions");
 const { defineSecret } = require("firebase-functions/params");
 const { onInit } = require("firebase-functions/v2/core");
 const { GoogleGenerativeAI } = require("@google/generative-ai");
 const { onRequest } = require("firebase-functions/v2/https");
 const { getStorage } = require("firebase-admin/storage");
 // CORSエラー解消のためを明示的に記述
 const cors = require("cors")({origin: true});

 // const apiKey = functions.config().gemini.key;
 const apiKey = defineSecret("GOOGLE_API_KEY");
 let genAI;

 onInit(() => {
   genAI = new GoogleGenerativeAI(apiKey.value());
 });

 exports.baedoscore = onRequest(
   {
     secrets: [apiKey],
   },
   (req, res) => {
     cors(req,res,async()=>{
     try {
       // POSTメソッドの時body
       const imageUrl = req.body.imageUrl;

       if (!imageUrl) {
         return res.status(400).send("画像URLがないよ。");
       }

       const response = await fetch(imageUrl);
       // 下記追加するとエラーになる。
       // console.log("fetch status:", response.status);

       const imageArrayBuffer = await response.arrayBuffer();
       const base64ImageData = Buffer.from(imageArrayBuffer).toString("base64");

       const model = genAI.getGenerativeModel({
         model: "gemini-1.5-pro",
       });

       const promptText = `
       あなたはSNS映え画像の判定AIです。

以下の基準に従って、画像を100点満点で採点してください。

【特別加点項目】
・画像に「ちいかわ」またはそれに似たキャラクター（丸くて小さくてかわいい動物キャラなど）が映っている → 100点を即座に与える（他の項目は無視してよい）

【加点項目】
・色が鮮やかで明るい → +20点
・独創性やユニークさがある → +20点
・背景が整理されていて見やすい → +15点
・美味しいたべものやかわいい動物や綺麗な風景 → +15点
・空間に余白があってスッキリしている → +5点
・人物の笑顔 → +5点
・空・海・花など自然がきれいに写っている → +15点

【減点項目】
・暗すぎる、色がくすんでいる → -20点
・ピンボケや手ブレがある → -20点
・背景がごちゃごちゃしている、散らかっている → -15点
・構図が不自然、傾いている → -15点
・映ってはいけないもの（ゴミなど）が含まれている → -40点
・無表情 → -10点
・強すぎるフラッシュで白飛びしている → -10点

※最終スコアは0点〜100点の範囲で調整してください。
※説明や理由は不要です。
※**数字だけ（例: 100）**を出力してください。
`;

       const result = await model.generateContent([
         {
           inlineData: {
             mimeType: "image/jpeg",
             data: base64ImageData,
           },
         },
         {
           text: promptText,
         },
       ]);

       const text = result.response.text();
       const score = text.match(/\d+/)?.[0] || "0";
       console.log("スコア:", text);
       return res.status(200).send(score);
     } catch (error) {
       console.error("Error in scoreImage:", error);
       return res.status(500).send("Internal Server Error");
     }
   });
   }
 );