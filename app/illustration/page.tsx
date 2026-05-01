import { getImagesByAssetFolder } from "@/lib/cloudinary";
import IllustrationGallery from "./IllustrationGallery";

export default async function IllustrationPage() {
  // Cloudinaryの "illustration" フォルダから自動取得
  const images = await getImagesByAssetFolder("illustration");
  return <IllustrationGallery images={images} />;
}