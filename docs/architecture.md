# enockey.com アーキテクチャ図

## 外部サービス構成

```
enockey.com
│
├── ホスティング
│   └── Vercel（無料）
│       └── GitHubにpushすると自動デプロイ
│
├── ソースコード管理
│   └── GitHub
│       └── DaisukeEnoki/enockey-site
│
├── ドメイン・DNS
│   └── XServer（2027年2月まで）
│       └── enockey.com → Vercel（Aレコード: 216.198.79.1）
│       └── 予定: お名前.comへ移管
│
├── 画像管理
│   └── Cloudinary（無料・25GB）
│       └── cloud name: dgokjtpjz
│       └── プロフィール写真・イラスト・ロゴを管理
│
├── メール送信
│   └── Resend（無料・月3,000通）
│       └── Contactフォームの送信先: enockey.info@gmail.com
│       └── 送信元: onboarding@resend.dev（→ 将来: noreply@enockey.com）
│       └── DNSレコード設定済み（DKIM・SPF・DMARC）
│
└── コンテンツ（予定）
    ├── 写真 → Cloudinary
    ├── 動画 → YouTube（外部リンク）
    └── 音楽 → SoundCloud / Spotify（外部リンク）
```

## ページ構成

```
enockey.com
│
├── /                    トップページ（世界観の入口）
├── /profile             enockeyとしての顔・リンク集
├── /illustration        イラストギャラリー
├── /contact             お問い合わせフォーム（Resend）
│
└── /photography         フォトグラファーとしての世界
    ├── /                Works（プロジェクトグリッド）
    ├── /text            エッセイ・テキスト
    ├── /about           プロフィール
    └── /[slug]          各プロジェクト詳細
```

## 環境変数

詳細は `.env.example` を参照。

| 変数名 | 用途 | 管理場所 |
|--------|------|---------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary接続 | Vercel・.env.local |
| `RESEND_API_KEY` | メール送信 | Vercel・.env.local |

## 月額コスト

| サービス | 料金 |
|---------|------|
| Vercel | 無料 |
| Cloudinary | 無料 |
| Resend | 無料 |
| XServer | 年額（2027年2月まで） |
| ドメイン（移管後） | 年額約1,500円 |

**実質ほぼ無料で運用可能。**
