const express = require("express");
const sharp = require("sharp");
const app = express();
const PORT = 3000;

// 動的に点数を埋め込んだOGP画像を生成するエンドポイント
app.get("/ogp/:score", async (req, res) => {
  const score = req.params.score; // 動的に指定された点数

  // ベースとなるOGP画像
  const baseImage = "public/ogp_template.png"; // あらかじめ用意したテンプレート画像

  try {
    // 動的にテキストを埋め込む画像を生成
    const ogpImage = await sharp(baseImage)
      .composite([
        {
          input: Buffer.from(`
      <svg width="800" height="400">
        <rect width="100%" height="100%" fill="black" />
        <text x="50%" y="50%" font-size="120" fill="red" text-anchor="middle" dominant-baseline="middle" dy="0.35em">
          ${score}点
        </text>
      </svg>`),
          top: 0,
          left: 0,
        },
      ])
      .toBuffer();

    // 画像を返す
    res.set("Content-Type", "image/png");
    res.send(ogpImage);
  } catch (error) {
    console.error(error);
    res.status(500).send("画像の生成に失敗しました");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
