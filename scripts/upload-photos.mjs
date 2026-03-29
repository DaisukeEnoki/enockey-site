import { v2 as cloudinary } from "cloudinary";
import { readdirSync } from "fs";
import { join } from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SOURCE_DIR = "/Volumes/NX-P2SE2TB/JPEG/2024/2024-11-29_SABONボランティア活動/web";
const CLOUDINARY_FOLDER = "Photography/seeds-of-joy-2024";

const files = readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".jpg"));

console.log(`${files.length}枚アップロードします...\n`);

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const num = String(i + 1).padStart(3, "0");
  const publicId = `${CLOUDINARY_FOLDER}/${num}`;
  const filePath = join(SOURCE_DIR, file);

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
    });
    console.log(`✓ ${num}: ${file} → ${result.public_id}`);
  } catch (err) {
    console.error(`✗ ${num}: ${file} エラー`, err);
  }
}

console.log("\n完了！");
