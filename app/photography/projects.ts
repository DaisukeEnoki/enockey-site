// 写真プロジェクトの唯一のデータ置き場。
// 一覧（page.tsx）・詳細（[slug]/page.tsx）・カテゴリーフィルターは
// すべてこのファイルから生成されるので、撮影を追加するときはここに追記するだけでよい。
//
// 追加手順:
//   1. 外付けの `<category>/<slug>/` に書き出す（例: personal/<slug>/）
//   2. Cloudinary に `Photography/<slug>` フォルダを作って写真をアップロード
//   3. 下の projects に 1 ブロック追記（cover は一覧サムネに使う public_id）
//   4. コミット・push（Vercel が自動デプロイ）
//
// ────────────────────────────────────────────────
// 公開の判断軸（濱田英明「時間の面影」展のメモより・2026-09-17 採用）
//
//   写したい → 【その人のものになる】 → 見てもらいたい
//
// 真ん中を通らないものは出さない。自分の中で留まる写真は公開しない。
// 「その人のものになる」= 見た人が自分のものとして受け取れること。
// 具体的には「見たことがないけど、知ってる」を狙う（初めて見る光景なのに、
// 見た人が自分の記憶を重ねられる）。撮った本人だけが意味を分かる記録は出さない。
//
// タイトルの型（上の判断軸から導かれる呼び方）
//   1. 世界の名前（抽象）  Annual Rings / People / Family
//      → 複数の撮影をまたぐ連作。見る人が「何を感じにいくか」を指す
//   2. 固有名 + 年        Kansai University, 2018 / Seeds of Joy, 2024
//      → 1 回の撮影でひとつの世界が成立するとき。その場にしかない名前を使う
//   3. 人名              shinokumatic
//      → 一人を撮った仕事
//
// 避けるのは「一般名詞化した行事名」だけ（Graduation / Wedding など）。
// 誰もが知っている行事名は、見る前に「知ってる」で閉じてしまい余白が残らない。
// 同じ卒業式でも Kansai University なら、その大学にしかない名前なので入口が開く。
// ────────────────────────────────────────────────

export type Project = {
  slug: string;
  title: string;
  /** 未確定なら省略可。省略すると一覧・詳細とも年を表示しない */
  year?: string;
  /** 一覧のサムネに使う Cloudinary の public_id。未設定なら灰色プレースホルダー */
  cover: string | null;
  /** 詳細ページで写真を読み込む Cloudinary のフォルダパス */
  folder: string;
  categories: string[];
  description?: string;
  url?: string;
};

export const projects: Project[] = [
  // People / Family とも、通しで見たときにトーンが途切れると感情の入り方が
  // 変わるため #1 はモノクロ、#2 はカラーで分けている。モノクロには b/w タグを付ける
  {
    slug: "people-1",
    title: "People #1",
    year: "2018-2026",
    // 001 = DSC01843-158.jpg
    cover: "Photography/people-1/001",
    folder: "Photography/people-1",
    categories: ["portrait", "people", "b/w"],
    description: "モノクロの人々の写真のアーカイブです。",
  },
  {
    slug: "people-2",
    title: "People #2",
    year: "2018-2026",
    // 002 = 海を背に笑う一枚（IMG_5872-5-2.jpg）。被写体が中央にあり
    // 4:3 のサムネ切り取りでも構図が崩れない
    cover: "Photography/people-2/002",
    folder: "Photography/people-2",
    categories: ["portrait", "people"],
    description: "カラーの人々の写真のアーカイブです。",
  },
  {
    slug: "family-1",
    title: "Family #1",
    // 写真を Cloudinary に上げたら cover に public_id を入れる（例: "Photography/family-1/001"）
    cover: null,
    folder: "Photography/family-1",
    categories: ["portrait", "family", "b/w"],
    description: "モノクロの家族写真のアーカイブです。",
  },
  {
    slug: "family-2",
    title: "Family #2",
    cover: null,
    folder: "Photography/family-2",
    categories: ["portrait", "family"],
    description: "いろんな家族の形を。",
  },
  {
    slug: "annual-rings",
    title: "Annual Rings",
    // 外付けに 2019 / 2022 / 2024 のフォルダあり
    year: "2019-2024",
    // 002 = DSC01114-598のコピー.jpg
    cover: "Photography/annual-rings/002",
    folder: "Photography/annual-rings",
    categories: ["portrait", "family"],
    // 説明しすぎず、見る人が自分の記憶を重ねる余白を残す
    description: "お腹の中にいた頃から、毎年。",
  },
  {
    slug: "shino-takeishi",
    title: "shinokumatic",
    year: "2026",
    // 001 = DSC02173.jpg
    cover: "Photography/shino-takeishi/001",
    folder: "Photography/shino-takeishi",
    categories: ["portrait", "people"],
    description: "シンガーソングライター shinokumatic を撮影いたしました。",
    url: "https://www.instagram.com/shinokumatic/",
  },
  // 自分自身の卒業式。参加者でありながら第三者の目線で切り取っている。
  // 主題は個人ではなく「ある大学の卒業式」という場なので documentary。
  // 依頼ではなく自分の関わりから撮っているので personal を重ねる
  // （この 2 つは別の軸なので両方付く。濱田さんも portrait と personal を併用している）
  {
    slug: "kansai-university",
    title: "Kansai University",
    // 2017 年と 2018 年の卒業式が混ざっている
    year: "2017-2018",
    // 003 = 振り向いて笑う袴の一枚（842A1004-27-2.jpg）。顔は写っているが
    // 誰と特定されるより先に「卒業式の空気」が伝わる絵で、一覧の入口が開く。
    // ⚠️ 連番はファイル名昇順で振り直されるため、写真を足すと番号がずれる。
    // どの写真かを追えるようにファイル名を併記しておくこと
    cover: "Photography/kansai-university/003",
    folder: "Photography/kansai-university",
    categories: ["documentary", "personal"],
    description: "関西大学の卒業写真のアーカイブです。",
  },
  // 地元・松山市雄郡地区の成人式。母校の体育館と校庭で撮っている。
  // Kansai University と同じく「その場にしかない名前」を使い、
  // 一般名詞化した「成人式」をタイトルにはしない（判断軸の3型のうち 2 番）
  {
    slug: "yushin-junior-high-school",
    title: "Yushin Junior High School",
    year: "2015",
    // 001 = 伊予水軍太鼓と「祝 雄郡地区 成人式」の看板（IMG_5479.jpg）。
    // 個人の顔より先に「その日の場」が伝わる絵なので入口として開く
    cover: "Photography/yushin-junior-high-school/001",
    folder: "Photography/yushin-junior-high-school",
    categories: ["documentary", "personal"],
    description: "雄新中学校での成人式のアーカイブです。",
  },
  // 大学時代に住んでいた街。出来事ではなく日常の時間を撮っているので
  // 主題の軸（portrait / documentary）は立たず、personal だけを付ける。
  // 自分を写さず通りすがりの人を後ろ姿で置くことで、見る人が自分の住んだ街を
  // 重ねられる余地を残している（判断軸④「見たことないけど知ってる」）
  {
    slug: "takatsuki",
    title: "Takatsuki",
    year: "2015-2018",
    // 001 = 後ろ姿の二人と日傘（IMG_3187.jpg）。人が主題ではなく
    // 街に流れている時間そのものが写っている
    cover: "Photography/takatsuki/001",
    folder: "Photography/takatsuki",
    categories: ["personal"],
    // 説明文は置かない。撮った本人の事情を書くと見る人が自分の記憶を
    // 重ねる余地が閉じるため（detail はタグだけでも開く）
  },
  {
    slug: "seeds-of-joy",
    title: "Seeds of Joy",
    year: "2024",
    cover: "_42A1931-1-2_epzppp",
    folder: "Photography/seeds-of-joy",
    categories: ["editorial"],
    description:
      "株式会社 SABON JapanがCSR活動として取り組むボランティア活動「Seeds of Joy」を撮影しました。",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * フィルターに常時表示するカテゴリー。まだ作品がないものも選択肢として出す。
 * projects の categories にはこれ以外のタグ（people / family / b/w など）も付けてよく、
 * そちらはフィルターには並べず作品の属性としてだけ持たせる。
 */
export const categories = [
  "all",
  "portrait",
  "lifestyle",
  "editorial",
  // 出来事を第三者の目線で記録したもの。主題が個人ではなく「場」にあるとき
  "documentary",
  // 依頼ではなく自分の関わりから撮ったプロジェクト。外付けは personal/<slug>/ に置く。
  // 主題の軸（portrait / documentary など）とは別の軸なので重ねて付けてよい
  "personal",
] as const;
