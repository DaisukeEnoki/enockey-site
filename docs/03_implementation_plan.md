# 実装計画 - enockey.com

## 現状の完成度

| ページ | 完成度 | 残タスク |
|--------|--------|---------|
| Home | ★★★☆☆ | デザイン・コンテンツ拡充 |
| Profile | ★★★☆☆ | テキスト・リンク拡充 |
| Photography | ★★★☆☆ | 実際の作品データ追加 |
| Illustration | ★★☆☆☆ | 作品追加・レイアウト改善 |
| Contact | ★★★★☆ | 独自ドメインのメール設定 |
| Music | ☆☆☆☆☆ | 未着手 |

---

## 優先タスク一覧

### 高優先度

| # | タスク | 理由 |
|---|--------|------|
| T1 | 独自ドメインのメール設定 | `onboarding@resend.dev` のままでは信頼性が低い |
| T2 | Photography に実際の写真データを追加 | 現在 sample-project のみ |
| T3 | Illustration に作品を追加 | 現在3枚のみ |

### 中優先度

| # | タスク | 理由 |
|---|--------|------|
| T4 | Music ページの実装 | CLAUDE.md のページ構成に含まれている |
| T5 | Photography/Text を実装 | 現在 Coming Soon のまま |
| T6 | OGP・メタデータの設定 | SNSでシェアした際の見た目を整える |

### 低優先度

| # | タスク | 理由 |
|---|--------|------|
| T7 | Google Analytics の導入 | アクセス数を把握したい場合 |
| T8 | フォントの設定 | CLAUDE.md に「後日設定予定」と記載あり |

---

## T1: 独自ドメインメール設定の手順

1. Resend のダッシュボードでドメイン（enockey.com）を追加
2. DNSレコードに Resend の指示した値を設定
3. `contact.ts` の `from` を `no-reply@enockey.com` に変更

---

## T2: Photography 作品追加の手順

1. Cloudinary に写真をアップロード
2. `photography/[slug]/page.tsx` の `projectsData` に追加

```typescript
const projectsData = {
  "プロジェクト名": {
    title: "タイトル",
    year: "2024",
    images: ["cloudinary-id-1", "cloudinary-id-2"],
  },
}
```

3. `photography/page.tsx` の `projects` 配列にも追加

---

## 開発環境の起動方法

```bash
cd /Users/daisukeenoki/projects/enockey-site
npm run dev
# → http://localhost:3000 で確認
```

## デプロイ方法

```bash
git add .
git commit -m "変更内容の説明"
git push
# → Vercel が自動でデプロイ（約1〜2分後に反映）
```
