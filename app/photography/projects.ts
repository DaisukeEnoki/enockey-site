// 写真プロジェクトの唯一のデータ置き場。
// 一覧（page.tsx）・詳細（[slug]/page.tsx）・カテゴリーフィルターは
// すべてこのファイルから生成されるので、撮影を追加するときはここに追記するだけでよい。
//
// 追加手順:
//   1. 外付けの `<category>/<slug>/` に書き出す（例: personal/<slug>/）
//   2. Cloudinary に `Photography/<slug>` フォルダを作って写真をアップロード
//   3. 下の projects に 1 ブロック追記（cover は一覧サムネに使う public_id）
//   4. コミット・push（Vercel が自動デプロイ）

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
  {
    slug: "people",
    title: "People",
    year: "2018-2026",
    // 写真を Cloudinary に上げたら cover に public_id を入れる（例: "Photography/people/001"）
    cover: null,
    folder: "Photography/people",
    categories: ["portrait"],
  },
  {
    slug: "family",
    title: "Family",
    // 写真を Cloudinary に上げたら cover に public_id を入れる（例: "Photography/family/001"）
    cover: null,
    folder: "Photography/family",
    categories: ["portrait"],
    description: "いろんな家族の形を。",
  },
  {
    slug: "annual-rings",
    title: "Annual Rings",
    cover: "Photography/annual-rings/002",
    folder: "Photography/annual-rings",
    categories: ["portrait"],
    description: "生まれる前から、毎年撮らせていただいているご家族です。",
  },
  {
    slug: "shino-takeishi",
    title: "shinokumatic",
    year: "2026",
    cover: "Photography/shino-takeishi/001",
    folder: "Photography/shino-takeishi",
    categories: ["portrait"],
    description: "シンガーソングライター shinokumatic を撮影いたしました。",
    url: "https://www.instagram.com/shinokumatic/",
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

/** フィルターに常時表示するカテゴリー。まだ作品がないものも選択肢として出す */
export const categories = [
  "all",
  "portrait",
  "lifestyle",
  "editorial",
  // 依頼ではなく自分のために撮ったプロジェクト。外付けは personal/<slug>/ に置く
  "personal",
] as const;
