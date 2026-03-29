import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getImagesInFolder(folder: string): Promise<string[]> {
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: folder,
    max_results: 100,
    direction: "asc",
  });
  return result.resources.map((r: { public_id: string }) => r.public_id);
}

export default cloudinary;
