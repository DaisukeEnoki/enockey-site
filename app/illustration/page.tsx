import type { Metadata } from "next";
import { getImagesByAssetFolder } from "@/lib/cloudinary";
import IllustrationGallery from "./IllustrationGallery";

export const metadata: Metadata = {
  title: "Illustration",
  description: "enockey のイラスト作品集。デジタルイラストを中心に公開。",
  openGraph: {
    title: "Illustration | enockey",
    description: "enockey のイラスト作品集。デジタルイラストを中心に公開。",
  },
};

export default async function IllustrationPage() {
  // Cloudinaryの "illustration" フォルダから自動取得
  const images = await getImagesByAssetFolder("illustration");
  return <IllustrationGallery images={images} />;
}