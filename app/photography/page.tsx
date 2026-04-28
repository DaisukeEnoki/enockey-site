// Server Component: カテゴリーフィルターは PhotographyGallery (Client) に委譲
// ここでメタデータを定義し、静的データを渡す
import type { Metadata } from "next";
import PhotographyGallery, { type Project } from "./PhotographyGallery";

export const metadata: Metadata = {
  title: "Photography",
  description: "enockey の写真作品集。ポートレート・ライフスタイル・エディトリアルなど。",
  openGraph: {
    title: "Photography | enockey",
    description: "enockey の写真作品集。ポートレート・ライフスタイル・エディトリアルなど。",
  },
};

// プロジェクトを追加するときはここに追記する
const projects: Project[] = [
  {
    slug: "seeds-of-joy-2024",
    title: "Seeds of Joy",
    year: "2024",
    cover: "_42A1931-1-2_epzppp",
    categories: ["editorial"],
  },
  {
    slug: "sample-portrait",
    title: "Sample Portrait",
    year: "2025",
    cover: null,
    categories: ["portrait"],
  },
];

export default function Photography() {
  return <PhotographyGallery projects={projects} />;
}
