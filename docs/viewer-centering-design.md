# 設計書: 作品ビューアを画面の縦中央に置く

作成: 2026-09-18 / 設計: Fable (design-architect) / 承認: enockey（全画面化 OK）
対象: `app/photography/[slug]/ProjectViewer.tsx` のみ

## 症状

スマホで写真が上に貼りつき、下に大きな空白ができる。PC ではページが画面をはみ出してスクロールが出る。

## 根本原因（3つが重なっている）

**A. `min-h-screen` は「最低 100vh」であって「ちょうど 100vh」ではない**
main の上にグローバルヘッダー（モバイル 148px / PC 76px）が乗るので、`ヘッダー + 100vh > 画面` となり必ずスクロールが出る。さらに `min-height` は「確定した高さ」にならないため、中の `flex-1` も確定高さを持たない。→ 子の `height:100%` が解決できず auto に落ちる（CSS の規則）。

**B. Swiper の箱の高さは「いちばん背の高いスライドの中身」で決まる**
`.swiper` に高さがないので、箱 = 一番大きい画像の高さ。モバイル 390px 幅では
- 横写真 4:3 → 358 × 0.75 = 269px
- 縦写真 3:4 → 358 × 1.33 = 477px

`.swiper` が 477px なのは縦写真が箱の高さを決めているから。横写真は 477px の箱の中で上に貼りつく。これが空白の直接原因。

**C. モバイルで `items-start`（上寄せ）にしている**
A・B への過去の回避策。A・B が解決すれば不要。

## 採用方式: ビューアを `fixed inset-0` の全画面レイヤーにする

main の高さが画面そのものに**確定する**ので、`.swiper h-full` → `.swiper-wrapper/.swiper-slide`（swiper/css が `height:100%` を持つ）→ `img max-h-full` と % の連鎖が全部解決する。**JS 計測ゼロ・calc ゼロ。**

- ヘッダー高が可変（148px/76px）という問題が消える。`layout.tsx` を触らないので他ページへの影響ゼロ
- iOS Safari のツールバー伸縮に `fixed inset-0` が追従（svh/dvh の使い分け不要）
- 参考サイト（hideakihamada.com）も作品ページではグローバルナビを出さず Index/Back/Next だけ
- `detail +` オーバーレイが既に `fixed inset-0 z-50` で同じパターン。コードベースに前例あり

## 変更内容（5箇所・すべてクラス差し替え）

1. **main**: `min-h-screen flex flex-col` → `fixed inset-0 flex flex-col`
2. **写真エリア**: `flex-1 flex items-start sm:items-center ...` → `flex-1 min-h-0 flex items-center ...`
   （`min-h-0` 必須。flex アイテムの既定 `min-height:auto` が縮小を拒みはみ出す）
3. **Swiper**: `swiper w-full` → `swiper w-full h-full`
4. **スライド**: `swiper-slide !flex items-start sm:items-center ...` → `swiper-slide !flex items-center ...`
5. **画像**: `max-h-[calc(100svh-14rem)] sm:max-h-[calc(100vh-8rem)] ...` → `max-h-full w-auto max-w-full object-contain`

古い calc 解説コメントは削除し、上記の理由を短く書き直す。`!flex` のコメントは残す。

## 変更しないもの

Swiper 初期化（fade / Keyboard / initialSlide）、goPrev/goNext、sessionStorage、detail オーバーレイ、空プロジェクトのプレースホルダー、上下バーの余白。`layout.tsx` / `globals.css` / `page.tsx`。

## 受け入れ基準（モバイル 390×844・PC 1440×900 の両方）

- `scrollHeight <= innerHeight`（ページスクロールが出ない）
- `main` の rect が `{top:0, height:innerHeight}`（±1px）
- 表示中 `<img>` の写真エリア内の上下余白差が **4px 以内**
- 同じく左右の余白差が **4px 以内**（`!flex` 回帰チェック）
- `img.top >= area.top && img.bottom <= area.bottom`（はみ出しなし）
- `.swiper` の高さ === 写真エリアの内側高さ（±1px）

数値目安: モバイルの写真エリアは 584px → 約 732px に拡大。横写真の上下余白が各 ≈220px で均等になる（現行は上 0 / 下 315）。PC の画像高さは 788px → 756px 以下に**縮むのが正しい**（はみ出し分が消える）。

機能回帰: fade 遷移 / 矢印キー / 端で隣プロジェクトへ（sessionStorage）/ detail オーバーレイ / Index で一覧に戻るとヘッダーが通常表示。

## やってはいけないこと

- `layout.tsx` のヘッダーを変更しない（全ページに波及）
- `globals.css` に `.swiper` 系のグローバル上書きを書かない
- `.swiper-wrapper` / `.swiper-slide` の height を Tailwind で上書きしない（swiper/css の 100% をそのまま使う。上書きすると fade が壊れうる）
- スライドの `!flex` を外さない（縦写真が左に寄る既知の回帰）
- 画像の max-h に `100vh/svh/dvh` の calc を再導入しない（ヘッダー高が可変で必ずずれる）
- ResizeObserver 等の JS 計測を入れない（純 CSS で解ける）
- `min-h-screen` に戻さない
- main に z-index を付けない（detail オーバーレイの z-50 が隠れる）
