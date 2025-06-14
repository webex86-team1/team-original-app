// const functions = require("firebase-functions");
const { defineSecret } = require("firebase-functions/params");
const { onInit } = require("firebase-functions/v2/core");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { onRequest } = require("firebase-functions/v2/https");
const { getStorage } = require("firebase-admin/storage");

// const apiKey = functions.config().gemini.key;
const apiKey = defineSecret("GOOGLE_API_KEY");
let genAI;

onInit(() => {
  genAI = new GoogleGenerativeAI(apiKey.value());
});

exports.scoreImage = onRequest(
  {
    secrets: [apiKey],
  },
  async (req, res) => {
    try {
      const imageUrl = req.query.imageUrl;

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
      次の条件に従い、与えられた画像に含まれる内容を判定して点数を計算し、数字だけを返してください。
      ① 丸いものが写っている → ＋50点
      ② 四角いものが写っている → ＋0点
      ③ 三角形が写っている → ＋10点
      ④ 白色が写っている → ＋50点
      ⑤ 青色が写っている → ＋20点
      ⑥ 黄色が写っている → ＋15点
      ⑦ 緑色が写っている → ＋5点
      ※ 上記のどれにも当てはまらない場合は0点を返してください。
      返すのは点数の数字のみで、説明やコメントは不要です。
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
        }
      ]);

      const text = result.response.text();
      const score = text.match(/\d+/)?.[0] || "0";
      console.log("スコア:", text);
      return res.status(200).send(score);
    } catch (error) {
      console.error("Error in scoreImage:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
);
