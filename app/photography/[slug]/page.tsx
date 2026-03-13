import Link from "next/link";

// プロジェクトデータ（後でCloudinaryの画像に差し替え）
const projectsData: Record<string, { title: string; year: string; images: string[] }> = {
  "sample-project": {
    title: "Sample Project",
    year: "2025",
    images: [], // Cloudinary public IDを配列で入れる
  },
};

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projectsData[params.slug];

  if (!project) {
    return (
      <main className="px-8 py-12">
        <p className="text-gray-500">Project not found.</p>
      </main>
    );
  }

  return (
    <main className="px-8 py-12" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-5xl mx-auto">

        {/* ナビ */}
        <div className="flex gap-8 mb-16 text-sm text-gray-400">
          <Link href="/photography" className="hover:text-gray-800 transition-colors">← Works</Link>
        </div>

        <h1 className="text-2xl font-light mb-2" style={{ color: "#1a1a1a" }}>{project.title}</h1>
        <p className="text-sm text-gray-400 mb-12">{project.year}</p>

        {/* 写真一覧（縦1列・フル幅） */}
        <div className="flex flex-col gap-2">
          {project.images.length === 0 ? (
            <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400 text-sm">写真をCloudinaryにアップ後に表示されます</p>
            </div>
          ) : (
            project.images.map((id, i) => (
              <div key={i} className="w-full aspect-video bg-gray-100" />
            ))
          )}
        </div>

      </div>
    </main>
  );
}
