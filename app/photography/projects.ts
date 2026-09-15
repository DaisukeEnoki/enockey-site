// 写真プロジェクトの唯一のデータ置き場。
// 一覧（page.tsx）・詳細（[slug]/page.tsx）・カテゴリーフィルターは
// すべてこのファイルから生成されるので、撮影を追加するときはここに追記するだけでよい。
//
// 追加手順:
//   1. Cloudinary に `Photography/<slug>` フォルダを作って写真をアップロード
//   2. 下の projects に 1 ブロック追記（cover は一覧サムネに使う public_id）
//   3. コミット・push（Vercel が自動デプロイ）

export type Project = {
  slug: string;
  title: string;
  year: string;
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
    slug: "annual-rings",
    title: "Annual Rings",
    year: "2024",
    cover: "Photography/annual-rings/001",
    folder: "Photography/annual-rings",
    categories: ["portrait"],
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
export const categories = ["all", "portrait", "lifestyle", "editorial"] as const;
