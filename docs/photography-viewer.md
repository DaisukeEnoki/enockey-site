# Photography ビューアの技術メモ

作品ページ（`/photography/[slug]`）の実装で踏んだ地雷と、その解き方の記録。
同じ問題を二度踏まないために残す。最終更新: 2026-09-18

関連ファイル:
- `app/photography/[slug]/ProjectViewer.tsx` — ビューア本体
- `app/photography/projects.ts` — 作品データ（冒頭に公開の判断軸とタイトル3型）
- `docs/viewer-centering-design.md` — 中央寄せの設計書（Fable 設計）

---

## 1. 写真が画面の縦中央に来なかった問題

### 症状
スマホで写真が上に貼りつき下に大きな空白。PC ではページが画面をはみ出してスクロール。

### 原因（3つ重なっていた）

**A. `min-h-screen` は「最低 100vh」であって「ちょうど 100vh」ではない**

`<main>` の上にグローバルヘッダー（`app/layout.tsx`）が乗るので、
`ヘッダー + 100vh > 画面` となり原理的に必ずスクロールが出る。
さらに `min-height` は**確定した高さにならない**ため、中の `flex-1` も確定高さを持たない。
→ 子要素の `height: 100%` が解決できず `auto` に落ちる（CSS の規則）。

**B. Swiper の箱の高さは「いちばん背の高いスライドの中身」で決まる**

`.swiper` に高さを与えないと、箱の高さ = 一番大きい画像の高さになる。
モバイル 390px 幅（padding 引いて 358px）では:
- 横写真 4:3 → 358 × 0.75 = 269px
- 縦写真 3:4 → 358 × 1.33 = 477px

同じ作品に縦写真が混ざっていると箱が 477px になり、横写真のスライドはその中で上に貼りつく。

**C. `items-start`（モバイルのみ）で上寄せしていた** — A・B への過去の回避策。

### 解法: `fixed inset-0` の全画面レイヤー

```tsx
<main className="fixed inset-0 flex flex-col">
```

これで main の高さが「画面そのもの」で**確定する**。すると
`.swiper h-full` → `.swiper-wrapper` / `.swiper-slide`（swiper/css が `height:100%` を持つ）
→ `img max-h-full` と、% の連鎖が全部解決する。**JS 計測ゼロ・calc ゼロ。**

副次効果:
- ヘッダー高がモバイル 148px / PC 76px と可変な問題が消える（`layout.tsx` を触らずに済む）
- iOS Safari のツールバー伸縮に `fixed` が追従（`svh` / `dvh` の使い分けが不要）
- 作品ページでグローバルナビが隠れる（参考サイト hideakihamada.com と同じ挙動）

### やってはいけない（試して全部失敗した）

| 試したこと | なぜダメか |
|---|---|
| `min-h-[calc(100svh-7rem)]` | ヘッダー高が可変（148/76px）なので定数では合わない |
| `.swiper` に `h-full` / `!h-full` / インライン `height:100%` | 親が確定高さを持たないので % が解決しない（原因A） |
| Swiper を flex アイテムにして `flex-1` で stretch | 箱は伸びるが画像の max-h 計算がずれ PC ではみ出す |
| ResizeObserver で実測して `maxHeight` に渡す | 原因A を放置したまま測っても、伸びた分だけ画像が大きくなるだけ |
| `min-h-screen` に戻す | 原因A そのもの |

**教訓**: 症状ベースで小さく直すと、そのたび別の場所が壊れる。
高さが決まらない問題は「どこで高さが確定するか」を先に決めてから触る。

---

## 2. iPhone でページがクラッシュした問題

### 症状
27 枚の作品を iPhone の Safari で開くと「問題が繰り返し起きました」でページが落ちる。
ローカルでも Playwright（デスクトップ Chromium）でも再現しない。

### 原因
全スライドの画像を一度に DOM へ置いていた。元画像 4000×3000 × 27 枚でメモリ上限に到達。
他の作品（10 / 3 / 1 / 15 枚）では顕在化していなかっただけで、枚数が増えれば必ず踏む構造だった。

### 解法: 現在地の前後 2 枚だけ描画する

```tsx
const NEIGHBORS = 2;
const isNear = (i: number) => Math.abs(i - (current - 1)) <= NEIGHBORS;
// ...
{isNear(i) && <CldImage ... priority={i === 0} loading={i === 0 ? undefined : "lazy"} />}
```

DOM 上の画像が 27 枚 → 最大 5 枚に減る。
スライドの枠（`.swiper-slide`）自体は全部残すので、カウンターや遷移ロジックは変わらない。

### なぜ `loading="lazy"` だけでは効かないか

`effect: "fade"` は**全スライドを重ねて表示する**方式。
ブラウザから見ると全部が「表示領域内」なので、遅延読み込みが発動せず全部取りに行ってしまう。
**描画そのものを絞る**必要がある。

---

## 3. Swiper の CSS と戦わない

`swiper/css` は `.swiper-slide` を `display: block` に戻すため、
Tailwind の `flex` が打ち消されて縦写真が左に寄る。

```tsx
<div className="swiper-slide !flex items-center justify-center">
```

`!flex`（`!important`）が必須。**外すと縦写真が左寄せに戻る**（既知の回帰）。

一方で `.swiper-wrapper` / `.swiper-slide` の `height` は
swiper/css の `100%` をそのまま使う。**上書きしない**（fade の重なりが壊れうる）。

---

## 4. 写真の追加手順（運用）

1. 外付け `<category>/<slug>/` に書き出す
2. Cloudinary の `Photography/<slug>/` に `001` から連番でアップロード
3. `projects.ts` に 1 ブロック追記（`cover` は一覧サムネの public_id）
4. コミット・push（Vercel が自動デプロイ）

### 注意: 連番はファイル名昇順で振り直される

途中に写真を足すと**後続の番号が全部ずれる**。
`cover` に指定した番号が別の写真を指すようになるので、追加後は必ずサムネを確認する。

`cover` はフォルダ内の 1 枚を指すので、**サムネに指定した写真は本編にもその順番で出る**（別枠ではない）。

### macOS の `._` ファイルに注意

外付け（exFAT 等）では macOS が `._<ファイル名>` のメタデータファイルを作る。
アップロードスクリプトでは必ず除外する（`Invalid image file` エラーになる）。

```js
readdirSync(DIR).filter(f => f.endsWith(".jpg") && !f.startsWith("._"))
```

---

## 5. 検証のやり方

Playwright で実測する。目視だけだと「中央に見える」で終わってしまう。

```js
const area = document.querySelector('main').children[1].getBoundingClientRect();
const img  = document.querySelector('.swiper-slide-active img').getBoundingClientRect();
// 上下の余白差 / 左右の余白差がともに 4px 以内なら中央
Math.abs((img.top - area.top) - (area.bottom - img.bottom)) <= 4
Math.abs((img.left - area.left) - (area.right - img.right)) <= 4
// ページスクロールが出ていないこと
document.documentElement.scrollHeight <= window.innerHeight
```

モバイル 390×844 と PC 1440×900 の両方で測る。
**縦写真を含む作品でも測る**（原因B は縦写真がないと再現しない）。

fade 遷移は時間がかかるので計測前に `waitForTimeout(2500)` 程度待つこと。
