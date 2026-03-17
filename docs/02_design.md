# 設計書 - enockey.com

## システム全体像

```
ユーザーのブラウザ
  ↓ アクセス
Vercel（ホスティング）
  ↓ Next.js がリクエストを処理
  ├─ Server Component → HTMLを生成して返す
  ├─ Client Component → ブラウザ側でインタラクション
  ├─ Server Action → フォーム送信など（Resend API呼び出し）
  └─ Cloudinary → 画像を最適化して配信
```

---

## 技術スタック

| 技術 | バージョン | 用途 | 選定理由 |
|------|----------|------|---------|
| Next.js | 16.1.6 | フレームワーク | App Router・SSR・デプロイが簡単 |
| TypeScript | ^5 | 言語 | 型安全・バグを事前に防ぐ |
| Tailwind CSS | v4 | スタイリング | 素早くUIを作れる |
| Cloudinary | - | 画像管理・配信 | 無料枠が充実・自動最適化 |
| Resend | ^6.9.3 | メール送信 | シンプルなAPI・無料枠あり |
| Vercel | - | ホスティング | Next.jsと相性最高・自動デプロイ |

---

## ディレクトリ構成

```
enockey-site/
├── app/
│   ├── layout.tsx              # 全ページ共通レイアウト（ナビ含む）
│   ├── page.tsx                # Home (/)
│   ├── globals.css             # グローバルスタイル
│   ├── actions/
│   │   └── contact.ts          # Server Action（メール送信処理）
│   ├── profile/
│   │   └── page.tsx            # Profile (/profile)
│   ├── illustration/
│   │   └── page.tsx            # Illustration (/illustration)
│   ├── photography/
│   │   ├── page.tsx            # Photography一覧 (/photography)
│   │   ├── text/page.tsx       # テキスト一覧
│   │   ├── about/page.tsx      # 写真プロフィール
│   │   └── [slug]/page.tsx     # 個別プロジェクトビューア
│   └── contact/
│       └── page.tsx            # お問い合わせフォーム
├── docs/                       # ドキュメント（本ファイル）
├── .env.local                  # 環境変数（Gitに含めない）
└── .env.example                # 環境変数テンプレート
```

---

## コンポーネント設計

### Server Component（デフォルト）
- サーバー側でHTMLを生成→高速表示
- 使用例: Home, Photography一覧, Photography Text

### Client Component（"use client" が必要なもの）
- ブラウザ側のインタラクションが必要なもの
- 使用例: フォーム, 写真ビューア（前後ボタン）, イラストギャラリー

---

## 外部サービス連携

### Cloudinary（画像管理）

```
Cloudinaryダッシュボードに画像をアップロード
  ↓ public ID が発行される（例: profile_hetwn3）
  ↓
CldImage コンポーネントで表示
  <CldImage src="profile_hetwn3" width={400} height={400} />
  ↓ Cloudinary CDN から最適化済み画像を配信
```

### Resend（メール送信）

```
ユーザーがContactフォームを送信
  ↓
Server Action (contact.ts) が呼ばれる
  ↓ バリデーション（スパムチェック含む）
  ↓
Resend API にメール送信リクエスト
  ↓
enockey.info@gmail.com にメールが届く
```

---

## 環境変数

| 変数名 | 用途 | 公開範囲 |
|--------|------|---------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary クラウド名 | クライアント・サーバー両方 |
| `RESEND_API_KEY` | Resend APIキー | サーバーのみ（絶対に公開しない） |

---

## セキュリティ設計

### お問い合わせフォームのスパム対策

| 対策 | 仕組み |
|------|--------|
| ハニーポット | 非表示フィールド `_website` に値があればボットと判定 |
| 送信時間チェック | ページ表示から3秒未満の送信は自動送信と判定・拒否 |
| サーバー側バリデーション | 必須項目チェック・文字数チェック |

---

## デプロイフロー

```
ローカルで開発
  ↓ git push → GitHub
  ↓ Vercel が自動検知
  ↓ ビルド & デプロイ（約1〜2分）
  ↓ enockey.com に反映
```
