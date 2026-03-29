import { getImagesInFolder } from "@/lib/cloudinary";
import ProjectViewer from "./ProjectViewer";

// プロジェクトのメタデータ
const projectsMeta: Record<string, { title: string; year: string; folder: string }> = {
  "seeds-of-joy-2024": {
    title: "Seeds of Joy",
    year: "2024",
    folder: "Photography/seeds-of-joy-2024",
  },
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = projectsMeta[slug];

  if (!meta) {
    return (
      <main className="px-8 py-12">
        <p className="text-gray-500">Project not found.</p>
      </main>
    );
  }

  const images = await getImagesInFolder(meta.folder);

  return (
    <ProjectViewer
      title={meta.title}
      year={meta.year}
      images={images}
    />
  );
}
