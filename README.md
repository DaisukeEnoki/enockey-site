# enockey.com

Daisuke Enoki の個人サイト。写真・イラスト・音楽・エンジニアリングを通じて世界観を表現する場所。

**[enockey.com](https://enockey.com)**

---

## Tech Stack

| 技術 | 用途 |
|------|------|
| [Next.js 16](https://nextjs.org/) | フレームワーク（App Router） |
| [TypeScript](https://www.typescriptlang.org/) | 言語 |
| [Tailwind CSS v4](https://tailwindcss.com/) | スタイリング |
| [Cloudinary](https://cloudinary.com/) | 画像管理・配信 |
| [Resend](https://resend.com/) | メール送信 |
| [Vercel](https://vercel.com/) | ホスティング・自動デプロイ |

---

## Getting Started

```bash
# 依存パッケージをインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local に必要な値を入力

# 開発サーバーを起動
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

---

## Environment Variables

`.env.example` を参照してください。

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary のクラウド名 |
| `RESEND_API_KEY` | Resend の API キー（サーバー専用） |

---

## Project Structure

```
app/
├── layout.tsx              # 共通レイアウト・ナビゲーション
├── page.tsx                # Home
├── actions/
│   └── contact.ts          # Server Action（メール送信）
├── profile/                # Profile
├── photography/            # Photography ギャラリー
│   └── [slug]/             # 個別プロジェクトビューア
├── illustration/           # Illustration ギャラリー
└── contact/                # お問い合わせフォーム
```

---

## Deploy

`main` ブランチへの push で Vercel が自動デプロイします。

```bash
git push origin main
```

---

## License

このリポジトリのコードは参考目的で公開しています。
コンテンツ（写真・イラスト・テキスト）の無断転載はご遠慮ください。
