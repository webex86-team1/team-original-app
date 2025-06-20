
import "../styles/auth/howTo.css";

function howTo() {
  return (
    <>
      <div className="contentsWrapper">
        <h1>～アプリの使い方～</h1>
        <p>自分だけのオリジナル旅行マップを作ろう！</p>
        <div className="howTo-wrapper">
          <ul>
            <li className="steps">
              ステップ１
              <h4>
                旅行・お出かけをして、印象に残った出来事やシーンを写真に収めよう。
              </h4>
            </li>
            <li className="steps">
              ステップ２
              <h4>行った場所に印をつけよう！</h4>
              <ol>
                <li>
                  <a href="/map" style={{ textDecoration: "underline" }}>
                    地図
                  </a>
                  をクリック
                </li>
                <li>検索機能で訪れた場所を見つけよう。</li>
                <li>クリックするとピン止めされるよ</li>
              </ol>
            </li>
            <li className="steps">
              ステップ３
              <h4>投稿しよう！</h4>
              <p>
                ステップ２で作ったマーカーをタップして、「作成」をクリック 。
                <br />
                もしくは、
                <a href="/post" style={{ textDecoration: "underline" }}>
                  投稿する
                </a>
                を押してね。
              </p>
            </li>

            <li className="steps">
              ステップ４
              <h4>写真の映え度を確認しよう！</h4>
              <ol>
                <li>
                  <a href="/baedo" style={{ textDecoration: "underline" }}>
                    映え度
                  </a>
                  を押してね。
                </li>
                <li>
                  映え度を知りたい画像をアップロードすると100点満点で結果が返ってくるよ！
                </li>
              </ol>
              <div className="balloon2-right">
                <p>
                  100点満点がとれるような写真を旅しながら探すのも１つの楽しみ方かもね～
                </p>
              </div>
            </li>
            <li className="steps">
              ステップ５
              <h4>思い出を見返そう！</h4>
              <p>
                <a href="/postsView" style={{ textDecoration: "underline" }}>
                  投稿一覧
                </a>
                をクリック
                <br />
                ⇒今までの投稿をまとめて振り返れるよ👍
              </p>
            </li>
          </ul>
        </div>
        <div className="container">
          <img src="/tamago.png" alt="キラキラ" className="item" />
          <img src="/level2.png" alt="キラキラ" className="item" />
          <img src="/travel.png" alt="キラキラ" className="item" />
          <img src="/aaa.png" alt="キラキラ" className="item" />
          <img src="/hane.png" alt="キラキラ" className="item" />
        </div>
      </div>
    </>
  );
}

export default howTo;
