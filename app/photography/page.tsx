// Server Component: カテゴリーフィルターは PhotographyGallery (Client) に委譲
// プロジェクトの追加は projects.ts で行う
import type { Metadata } from "next";
import PhotographyGallery from "./PhotographyGallery";
import { projects, categories } from "./projects";

export const metadata: Metadata = {
  title: "Photography",
  description: "enockey の写真作品集。ポートレート・ライフスタイル・エディトリアルなど。",
  openGraph: {
    title: "Photography | enockey",
    description: "enockey の写真作品集。ポートレート・ライフスタイル・エディトリアルなど。",
  },
};

export default function Photography() {
  return <PhotographyGallery projects={projects} categories={[...categories]} />;
}
