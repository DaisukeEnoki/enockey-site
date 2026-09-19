# 設計書: Photography ビューア — 長押し保存の抑止 と スワイプによる隣プロジェクト遷移

設計: design-architect（Fable・read-only）/ 2026-09-18
実装先: Sonnet（`/implementation`）

対象: `app/photography/[slug]/ProjectViewer.tsx`
補助: `app/globals.css`
参照した実機事実: `docs/photography-viewer.md`、`node_modules/swiper/swiper-bundle.js`（v12 の onTouchEnd / EffectFade / Keyboard 実装）、`node_modules/swiper/swiper.css`（`.swiper { touch-action: pan-y }`）

---

## 1. 設計の核心

- A: 写真エリア（`.swiper` コンテナ）に `select-none` + 自作ユーティリティ `touch-callout-none` + `onContextMenu` 抑止、`<img>` に `draggable={false}`。`touch-action` / `pointer-events` には一切触らない。
- B: Swiper の `touchEnd` イベント内で「`swiper.isEnd`（または `isBeginning`）かつ `swiper.swipeDirection` が該当方向かつ `|swiper.touches.diff| >= 60px`」を判定し、ボタンと同じ `jumpToNextProject / jumpToPrevProject` を呼ぶ。二重 push は `navigatingRef` で防ぐ。
- キーボードは Swiper の `Keyboard` モジュールを外し、自前の `keydown` で `goNext / goPrev` を呼ぶことで「ボタン・スワイプ・矢印キー」を同一関数に集約する。

---

## 2. 設計課題 A: 長押し保存の抑止

### 決定

| 何を | どこに | 手段 |
|---|---|---|
| `-webkit-touch-callout: none` | `.swiper` コンテナ div（`ref={containerRef}`）と `CldImage` の className 両方 | `globals.css` に Tailwind v4 の `@utility touch-callout-none { -webkit-touch-callout: none; }` を追加し、クラスとして当てる |
| `user-select: none` | 同上 | Tailwind 標準 `select-none`（v4 は `-webkit-user-select: none; user-select: none;` の両方を出す。node_modules で確認済み） |
| ドラッグ保存（PC） | `CldImage` | `draggable={false}`（next/image は `draggable` を `<img>` へ素通しする） |
| 右クリック保存（PC）/ Android 長押しメニュー | `.swiper` コンテナ div | `onContextMenu={(e) => e.preventDefault()}`（`stopPropagation` はしない） |

- `CldImage` の `className` は内部の `next/image` → `<img>` にそのまま乗る。つまり `<img>` 自身に `select-none touch-callout-none` が付く。コンテナにも付けるのは、`-webkit-touch-callout` が継承プロパティで、写真周囲の余白を長押しした場合も対象にするため。
- `user-select: none` の対象は**写真エリアだけ**に限定する。`<main>` 全体には付けない（detail オーバーレイの説明文・URL・タイトルはコピーできるままにする）。

### スワイプへの影響がないことの根拠（B との非干渉）

- 横スワイプを Swiper に届かせるかどうかを決めるのは `touch-action`（swiper.css が `.swiper { touch-action: pan-y }` を設定済み）と `pointer-events` の 2 つ。`user-select` / `-webkit-touch-callout` はテキスト選択と長押しメニューだけを制御し、ポインタイベントの配送には無関係。
- `draggable={false}` は HTML5 Drag&Drop（マウス）専用の属性で、タッチには影響しない。
- `onContextMenu` の `preventDefault` は既定動作（メニュー表示）だけを止める。Swiper 自身も `contextmenu` を Safari 上で touchEnd 相当として拾っているが（swiper-bundle.js L3026 付近）、伝播は止めないので Swiper の処理は変わらない。
- 今回 `touch-action` と `pointer-events` に関する CSS/属性は**一切書かない**（禁止事項に明記）。

### 却下案

| 案 | 却下理由 |
|---|---|
| インラインスタイル `style={{ WebkitTouchCallout: "none" }}` | PJ ルール「インラインスタイルはカスタムカラーのみ」に反する。`@utility` で 1 行で済む |
| `pointer-events: none` を img に付ける | enockey 明示禁止。スワイプが死ぬ |
| 写真の上に透明 div を被せる | Swiper の pointerdown ターゲットが変わり挙動が読めなくなる。`fixed inset-0` の高さ連鎖にも要素を足すことになる |
| `<main>` 全体に `select-none` | detail の文字が選択不能になり、利便性が落ちるだけで保存抑止には寄与しない |
| Cloudinary の署名付き URL / 透かし | 「面倒にする」目的に対して過剰。今回のスコープ外 |

### 防げないもの（設計書としての位置づけ）

この施策は「**保存を一手間面倒にする**」もの。以下は防げないし、防ごうとしない:
- OS のスクリーンショット / 画面収録
- 開発者ツール・「ページのソースを表示」からの `<img src>` 取得
- Cloudinary の直 URL（HTML に載る以上、原理的に取得可能）
- JavaScript 無効化環境（`onContextMenu` が効かない。CSS 側は効く）

---

## 3. 設計課題 B: スワイプで隣のプロジェクトへ

### 論点 1: 検知方法の比較と決定

| 候補 | fade 時の挙動（swiper-bundle.js で確認） | 判定 |
|---|---|---|
| `reachEnd` / `reachBeginning` | `updateProgress` 内で「端に**到達した瞬間**」に発火（L1322）。端でさらに引いたときには発火しない。さらに `initialSlide: total-1` で初期化した瞬間にも発火するので、Back 入場時に即遷移する誤爆リスクがある | 却下 |
| **`touchEnd` + `swiper.isEnd`/`isBeginning` + `swiper.swipeDirection` + `swiper.touches.diff`** | `touchEnd` は onTouchEnd 冒頭（L3044）で emit され、Swiper 自身の `slideTo` 判断（L3131 以降）より**前**。よってこの時点の `isEnd` は「ジェスチャ開始前に端にいたか」を表す。`swipeDirection` は touchStart で `undefined` にリセットされ（L2727）、縦ジェスチャ（`isScrolling`）は L2857 で早期 return するため未設定のまま。`touches.diff` は横方向のピクセル差（正=prev、負=next、L2877）。translate 依存が無いので fade でも同じ | **採用** |
| `allowSlideNext: false` + `slideNextTransitionStart` | transition 系イベントは `slideNext()` が実際に呼ばれたときに出るもので、スワイプの「試み」では出ない。`allowSlideNext` を落とすと通常送りも止まる | 却下 |
| `resistanceRatio` / `edgeSwipeDetection` | `edgeSwipeDetection` は「画面左右端から始まったタッチ（iOS の戻るジェスチャ）を無視する」設定で無関係。`resistanceRatio` は端での抵抗感の係数でイベントを出さない | 検知には却下（既定値 0.85 のままにする。後述） |
| Swiper 外に独自タッチハンドラ | 角度判定・方向判定・タップ除外を Swiper と二重に持つことになり、判定がずれる。保守者（enockey）にとっても Swiper の設定と自前ロジックの 2 箇所を追う羽目になる | 却下 |

補足（fade 固有）: EffectFade は `virtualTranslate: true` を強制し（L9152）、ドラッグ中は `setTranslate` 経由で各スライドの opacity を `1 - |progress|` に更新する（L9123）。つまり端で引っ張ると**現在の写真がわずかに薄くなり、離すと戻る**。これが「端まで来ている」ことの視覚フィードバックとして既に機能しているので、resistance の設定は変えない。

### 判定ロジック（要点）

```ts
// Swiper 生成時の on に追加
touchEnd(swiper) {
  const dir = swiper.swipeDirection;          // 'next' | 'prev' | undefined
  if (!dir) return;                            // タップ・縦ジェスチャは対象外
  if (Math.abs(swiper.touches.diff) < EDGE_SWIPE_PX) return;
  if (dir === "next" && swiper.isEnd)       handlersRef.current.jumpToNextProject();
  if (dir === "prev" && swiper.isBeginning) handlersRef.current.jumpToPrevProject();
}
```

`handlersRef` は毎レンダーで `handlersRef.current = { jumpToNextProject, jumpToPrevProject }` と更新する「最新参照」パターン。Swiper のコールバックは生成時のクロージャに固定されるため、props/state を直接読まずに ref 経由にする（exhaustive-deps 警告も避けられる）。

### 論点 2: 暴発防止

| 状況 | 挙動 | 根拠 |
|---|---|---|
| `total === 0` | Swiper を生成していないので `touchEnd` 自体が無い | 現状コードの `if (total === 0) return` |
| `total === 1` | `isBeginning && isEnd` が常に真。左スワイプ → 次、右スワイプ → 前。これは**意図通り**（Next/Back ボタンも 1 枚作品では即遷移する。ボタンと同じ挙動が要件） | 閾値 60px が指の揺れを弾く |
| `nextSlug` / `prevSlug` が `undefined`（作品が 1 つしか無い） | `jumpTo*` 内で `if (!slug) return`。Swiper の抵抗バウンスだけが起きる | 現状の `goNext/goPrev` と同じガードを共通関数に寄せる |
| 最後から 2 枚目 → 最後へのスワイプ | `touchEnd` 時点では `isEnd === false` なので遷移しない。次のスワイプで遷移 | L3044 が L3131 の slideTo より前 |
| タップ | `swipeDirection === undefined` | L2727 |
| Back 入場直後（`initialSlide: total-1`） | `reachEnd` 方式なら誤爆するが、本方式はタッチが無ければ何も起きない | — |

### 論点 3: 閾値

- `EDGE_SWIPE_PX = 60`（定数としてファイル冒頭近くに置き、日本語コメントで意図を書く）。
- 根拠: 390px 幅のスマホで約 15%。指の揺れ（数 px〜10px 程度）は確実に弾き、写真送りの通常スワイプ（100px 以上）より短くて済むので「もう一度しっかり払う」感覚で遷移できる。速度は見ない（Swiper の shortSwipes は 300ms 未満なら短距離でも送るが、ページ遷移はより明確な意思を要求したい）。
- 実機で「重い / 軽い」と感じたらこの定数だけを動かす（40〜80 の範囲を想定）。

### 論点 4: 連続発火の防止

- `const navigatingRef = useRef(false)`。`jumpToNextProject / jumpToPrevProject` の冒頭で `if (navigatingRef.current) return;`、`router.push` 直前で `true` にする。
- ボタン連打・スワイプ連打・矢印キー連打がすべて同じ関数を通るので、ガードは 1 箇所で済む。
- リセットはしない。`/photography/[slug]` は slug が変わると page サブツリーが再マウントされる（現状の「マウント時に sessionStorage を読む」Back 挙動が動いていること自体がその証拠）。もし再マウントされない症状が出た場合の保険は `page.tsx` で `<ProjectViewer key={slug} …/>` を付けること（要確認・現時点では不要と判断）。

### 論点 5: 遷移の体感

- **インジケータは出さない**。理由: (a) スワイプを離した瞬間に Swiper の抵抗バウンス（fade では opacity が戻る動き）が起き、「ジェスチャは受理された」と伝わる。(b) 現状の Next ボタン遷移も何も出しておらず、hideakihamada.com 準拠の「UI を退かせる」方針に沿う。(c) スピナーを足すと `fixed inset-0` レイヤーに要素を増やすことになる。
- 代わりに体感を縮める手として、マウント時に `router.prefetch()` を呼ぶことを**任意**で推奨。ただし Next 16 で動的セグメントに対する `router.prefetch` がページ本体まで先読みするかは**要確認**（効かなくても現状のボタン遷移と同じ体感なので、受け入れ基準には入れない）。

### 論点 6: 縦スワイプとの区別

- Swiper が `touchAngle`（既定 45°）で縦ジェスチャを `isScrolling` と判定し、その場合 `swipeDirection` を設定しない（L2837–2859）。本設計は `swipeDirection` を必須条件にしているので、縦ジェスチャは自動的に対象外。
- `.swiper` の `touch-action: pan-y` は swiper.css のまま。今回 `touch-action` を書き換えないので、ブラウザ側の縦ジェスチャ処理も従来通り。
- `fixed inset-0` のためページスクロールは無く、縦ドラッグは何も起こさない。この点は現状維持。

### 論点 7: detail オーバーレイ表示中

- タッチ: オーバーレイは `fixed inset-0 z-50` で `.swiper` の**子孫ではない**。Swiper は `pointerdown` を `.swiper` 要素で拾うため、オーバーレイ上のタッチは Swiper に届かず `touchEnd` も出ない。構造的に発火しない（追加ガード不要）。
- キーボード: `keydown` はグローバルなので、`detailOpen` を effect の依存に入れ、`detailOpen === true` のときは矢印キーを無視する。
- 受け入れ基準で両方を検証する。

### 論点 8: キーボードとの整合

- **決定: 三者を統一する**（端で矢印キーを押したらプロジェクト遷移）。
- 方法: `modules` から `Keyboard` を外し、`useEffect` で `window.addEventListener("keydown", …)`。`ArrowRight → goNext()`、`ArrowLeft → goPrev()`。修飾キー付き（`metaKey/ctrlKey/altKey`）は無視。`detailOpen` 中は無視。依存配列は `[detailOpen, nextSlug, prevSlug]`。
- 理由: Swiper の Keyboard モジュールは端で `slideNext()` を呼ぶだけで何も起きない（L5002）。「ボタンとスワイプは遷移、キーだけしない」は説明しづらい。自前 keydown 十数行で Swiper モジュール 1 つが減り、入力 3 系統がすべて `goNext / goPrev` の 2 関数に集約される。
- Swiper Keyboard が扱っていた PageUp/PageDown（`pageUpDown` 既定 true）は引き継がない。写真ビューアで PageUp/Down に依存する利用は想定しにくく、対応するとキー分岐が増えるだけ。

---

## 4. 変更ファイルと変更の要点

### 4-1. `app/globals.css`

```css
/* iOS Safari の長押しメニュー（写真に追加 / コピー）を出さない。Tailwind v4 に該当ユーティリティが無いので自作 */
@utility touch-callout-none {
  -webkit-touch-callout: none;
}
```

### 4-2. `app/photography/[slug]/ProjectViewer.tsx`

1. import: `import { EffectFade } from "swiper/modules";`（`Keyboard` を削除）。
2. 定数: `const EDGE_SWIPE_PX = 60;`（コメント: 端でこの距離以上払ったら隣のプロジェクトへ）。
3. ref 追加: `navigatingRef = useRef(false)`、`handlersRef = useRef({ jumpToNextProject, jumpToPrevProject })`（毎レンダーで `.current` を更新）。
4. 遷移関数を分離:
   - `jumpToNextProject()`: `if (!nextSlug || navigatingRef.current) return; navigatingRef.current = true; router.push(...)`
   - `jumpToPrevProject()`: 同上 + `sessionStorage.setItem("photography:enterFromEnd", "1")`
   - `goNext / goPrev` は「端でなければ slideNext/slidePrev、端なら jumpTo*」に書き換え（ボタンの `onClick` はそのまま）。
5. Swiper 生成オプション: `modules: [EffectFade]`、`keyboard` 設定削除、`on` に上記 `touchEnd` を追加。他のオプション（`speed`, `effect`, `fadeEffect`, `initialSlide`, `slideChange`）は変更しない。
6. keydown effect を新設（論点 8 の通り）。
7. JSX:
   - `.swiper` コンテナ div: `className="swiper w-full h-full select-none touch-callout-none"` と `onContextMenu={(e) => e.preventDefault()}`。
   - `CldImage`: `draggable={false}` と className に `select-none touch-callout-none` を追加。既存の `max-h-full w-auto max-w-full object-contain` は維持。
   - `.swiper-slide` の `!flex items-center justify-center` は**触らない**。
8. 行数見込み: 約 +35 行 → 約 265 行（300 行以内）。

### 4-3. `app/photography/[slug]/page.tsx`

変更なし（`key={slug}` は論点 4 の保険としてのみ。現時点では不要）。

### 4-4. `docs/photography-viewer.md`（実装後に追記・推奨）

「6. スワイプで隣のプロジェクトへ / 長押し保存の抑止」節を追記し、`touchEnd` を選んだ理由（`reachEnd` は初期化時にも発火する）と `pointer-events` 禁止を残す。3〜8 行で十分。

---

## 5. 受け入れ基準

### Playwright（デスクトップ Chromium・1440×900 と 390×844 の両方）で機械検証

A（保存抑止）
- [ ] `.swiper-slide-active img` の `getComputedStyle().webkitTouchCallout === "none"` かつ `userSelect === "none"`
- [ ] `.swiper-slide-active img` の `draggable === false`
- [ ] 写真上で `contextmenu` を dispatch すると `defaultPrevented === true`
- [ ] detail オーバーレイ内の説明文 `<p>` の `userSelect` が `"none"` **でない**（スコープ限定の確認）

B（スワイプ遷移）— Swiper は `simulateTouch: true` 既定なのでマウスドラッグで代替できる
- [ ] 複数枚作品（例: `kansai-university` 43 枚）の 1 枚目で左に 150px ドラッグ → カウンタが `2 / 43`、URL 不変
- [ ] 最後の写真で左に 150px ドラッグ → URL が `populated` 順の次スラッグに変わり、カウンタが `1 / N`
- [ ] 1 枚目で右に 150px ドラッグ → URL が前スラッグに変わり、カウンタが `N / N`（最後の写真から）
- [ ] 最後の写真で左に 30px ドラッグ → URL 不変、カウンタ不変
- [ ] 最後の写真で縦に 200px ドラッグ → URL 不変
- [ ] 最後の写真で左ドラッグを 2 回連続（間隔 100ms 程度）→ 最終 URL は「次の次」ではなく「次」
- [ ] 1 枚作品で左ドラッグ → 次へ、右ドラッグ → 前へ
- [ ] Next ボタン連打（最後の写真で 3 回 click）→ 最終 URL は「次」（`navigatingRef` がボタンにも効く）

キーボード
- [ ] `ArrowRight` を押すとカウンタが進み、最後の写真で `ArrowRight` → 次スラッグへ
- [ ] 1 枚目で `ArrowLeft` → 前スラッグへ、カウンタ `N / N`
- [ ] `detail +` を押してオーバーレイを開いた状態で `ArrowRight` → URL・カウンタ不変
- [ ] オーバーレイを開いた状態で写真エリア相当の座標を左ドラッグ → URL 不変（Close 後に閉じられること）

回帰（docs/photography-viewer.md §5 の既存測定をそのまま流す）
- [ ] 上下・左右の余白差が 4px 以内（縦写真を含む作品で）
- [ ] `document.documentElement.scrollHeight <= window.innerHeight`
- [ ] `.swiper-slide` の `display === "flex"`
- [ ] 43 枚作品で DOM 上の `img` が最大 5 枚（`isNear` が生きている）
- [ ] コンソールに React / Next のエラー・警告が出ない

### iPhone 実機（enockey）でしか確認できないもの
- [ ] 写真を長押ししても「写真に追加 / コピー / 共有」のシートが出ない
- [ ] 写真周辺の余白を長押ししても選択ハイライトやメニューが出ない
- [ ] 通常の左右スワイプで写真送りが**従来通り**動く（A の変更で死んでいない）
- [ ] 最後の写真で左に払うと次の作品へ、1 枚目で右に払うと前の作品の最後の写真へ
- [ ] 端で小さく揺らしても遷移しない／端で引っ張ると写真がわずかに薄くなって戻る（fade の抵抗表現。不快なら `resistanceRatio` を検討）
- [ ] 縦方向に指を動かしても遷移せず、画面が上下にずれない
- [ ] 画面左端から右へのスワイプ（iOS の「戻る」ジェスチャ）が従来通り Safari の戻るとして機能する
- [ ] detail を開いた状態でスワイプしても裏で遷移しない
- [ ] 43 枚作品を開いてクラッシュしない（回帰）

---

## 6. やってはいけないこと

既知の地雷（再掲）
- `fixed inset-0` の全画面レイヤー構造を崩さない。要素を追加する場合も高さ連鎖に割り込ませない
- `.swiper-slide` の `!flex` を外さない
- `.swiper-wrapper` / `.swiper-slide` の `height` を上書きしない
- `isNear` による描画絞り込みを壊さない（`loading="lazy"` は fade では効かない）
- `pointer-events: none` を img・スライド・コンテナのどこにも付けない

今回新たに生じる禁止事項
- `touch-action` を書かない（swiper.css の `pan-y` に任せる。`touch-action: none` にすると縦ジェスチャ判定が壊れ、`pan-x` にすると横スワイプが Swiper に届かなくなる）
- `onContextMenu` で `stopPropagation()` しない（Swiper が Safari で contextmenu を touchEnd 相当に使っている）
- `reachEnd` / `reachBeginning` で遷移を実装しない（初期化時・到達時に発火し誤爆する）
- Swiper 内部プロパティ（`touchEventsData` 等）に依存しない。使ってよいのは公開されている `swiper.isEnd / isBeginning / swipeDirection / touches.diff` のみ
- `router.push` を Swiper の `on.touchEnd` 内に直書きしない。必ず `jumpTo*` を経由（ガードの一元化）
- `<main>` 全体に `select-none` を付けない
- インラインスタイルで `WebkitTouchCallout` を書かない（`@utility` を使う）
- `resistanceRatio: 0` / `resistance: false` にしない（端の視覚フィードバックが消える）
- スピナー・トースト等の遷移中 UI を追加しない（今回のスコープ外）

---

## 7. 検証手順

### 7-1. Playwright（実装者が実行）

方針: `page.mouse` によるドラッグで Swiper の `simulateTouch` を使う。fade の遷移待ちは docs §5 の通り 2500ms 程度。

```ts
// ドラッグヘルパの方針（要点のみ）
async function drag(page, from, to) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 12 });   // steps を刻まないと Swiper が isMoved にならない
  await page.mouse.up();
}
// 写真中央座標は `.swiper-slide-active img` の boundingBox から取る
// URL 判定は page.waitForURL(/\/photography\/<期待スラッグ>$/, { timeout: 5000 })
// 「遷移しない」判定は 1500ms 待ってから expect(page.url()).toBe(before)
```

手順:
1. `npm run dev` 起動、`/photography/kansai-university`（43 枚）を 390×844 で開く
2. A の computedStyle / draggable / contextmenu 検証
3. B の各ケース（左 150px、右 150px、左 30px、縦 200px、連続 2 回）を順に実行。各ケース前に対象ページを開き直す
4. キーボードのケース（`page.keyboard.press("ArrowRight")`）
5. detail を開いて keydown・ドラッグの非発火を確認、Close で閉じる
6. 1440×900 で 2〜4 を再実行
7. 回帰測定（docs §5 のスクリプト）を縦写真を含む作品で実行
8. `page.on("console")` / `page.on("pageerror")` でエラーが無いことを確認

### 7-2. iPhone 実機（enockey が実施・Vercel Preview または同一 LAN の dev サーバー）

1. Safari で `/photography` → 任意の複数枚作品を開く
2. 写真を 1 秒以上長押し → シートが出ないこと。余白でも試す
3. 左右スワイプで 2〜3 枚送り、従来と同じ感触か確認
4. Next ボタンで最後まで進み、**左に大きく払う** → 次の作品の 1 枚目になること
5. 次の作品で **右に大きく払う** → 前の作品の**最後の写真**になること
6. 最後の写真で指を 1cm 未満だけ左右に揺らす → 遷移しないこと。引っ張ったときに写真が少し薄くなって戻る見え方が不快でないか
7. 最後の写真で上下に指を動かす → 遷移せず画面も動かないこと
8. `detail +` を開いて左右に払う → 何も起きない。Close で戻る
9. 43 枚作品を開いて最初から最後までスワイプで通す → クラッシュしない
10. 画面左端から右へのスワイプで Safari の「戻る」が従来通り動く

---

## 8. リスクと未解決点

1. **`user-select: none` と iOS の長押し**: `-webkit-touch-callout: none` だけで足りる環境が多いが、iOS のバージョンにより `user-select` が無いと選択ハイライトが出るケースがある。両方付ける設計なので問題ないはずだが、実機 2 番の結果で判断する。
2. **`touches.diff` の型**: swiper の TypeScript 型では `touches.diff` は `number` として公開されている（`swiper/types` の `SwiperTouches`）。もし型エラーが出る場合は `swiper.touches.diff ?? 0` で扱う。内部の `touchEventsData` には手を出さない。
3. **再マウントの前提**（論点 4）: `navigatingRef` をリセットしない設計は「slug が変わると ProjectViewer が再マウントされる」前提。現状の Back 挙動が動いていることが根拠だが、Next 16 の挙動が変わっていたら Back 後にボタンが効かなくなる。その場合は `page.tsx` で `key={slug}` を付ける（1 行）。
4. **`router.prefetch` の効果**（論点 5）: 任意項目。Next 16 の動的セグメントに対する prefetch 範囲は要確認。効かなければ入れなくてよい。
5. **1 枚作品のスラッグ**: `projects.ts` からは枚数が分からない（Cloudinary 側の枚数）。実装者は `getImagesInFolder` の結果か Cloudinary コンソールで特定する。
6. **閾値 60px の体感**: 実機で「遷移しにくい / しやすい」が出たら `EDGE_SWIPE_PX` だけを 40〜80 の範囲で動かす。速度判定の追加は、それでも不足したときに初めて検討する。
7. **PageUp/PageDown の非対応**（論点 8）: Swiper Keyboard モジュールを外すことで失われる。使っていた場合は keydown 分岐に 2 キー追加するだけで戻せる。
8. **Android Chrome**: `onContextMenu` の抑止で長押しメニューは出ないはずだが、実機が無いので未検証。スコープは iPhone 優先。
