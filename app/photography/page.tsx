import Link from "next/link";

// プロジェクトを追加するときはここに追記する
const projects = [
  {
    slug: "sample-project",
    title: "Sample Project",
    year: "2025",
    cover: null, // Cloudinaryにアップ後にpublic IDを入れる
  },
];

export default function Photography() {
  return (
    <main className="px-8 py-12" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-5xl mx-auto">

        {/* ナビ */}
        <div className="flex gap-8 mb-16 text-sm text-gray-400">
          <Link href="/photography" className="text-gray-800 font-medium">Works</Link>
          <Link href="/photography/about" className="hover:text-gray-800 transition-colors">About</Link>
        </div>

        {/* プロジェクトグリッド */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link key={project.slug} href={`/photography/${project.slug}`}>
              <div className="aspect-square bg-gray-100 overflow-hidden group">
                {/* カバー画像（後でCldImageに差し替え） */}
                <div className="w-full h-full bg-gray-200 group-hover:bg-gray-300 transition-colors flex items-end p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{project.title}</p>
                    <p className="text-xs text-gray-500">{project.year}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
