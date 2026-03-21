"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

// プロジェクトデータ（後でCloudinaryの画像に差し替え）
const projectsData: Record<string, { title: string; year: string; images: string[] }> = {
  "sample-project": {
    title: "Sample Project",
    year: "2025",
    images: [], // Cloudinary public IDを配列で入れる
  },
};

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = projectsData[slug];
  const [index, setIndex] = useState(0);

  if (!project) {
    return (
      <main className="px-8 py-12">
        <p className="text-gray-500">Project not found.</p>
      </main>
    );
  }

  const total = project.images.length;
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f5f5" }}>

      {/* ナビ上部 */}
      <div className="flex justify-between items-center px-6 py-4 text-sm">
        <Link href="/photography" className="text-gray-800 hover:opacity-60 transition-opacity">
          Index
        </Link>
        <div className="flex gap-6">
          <button
            onClick={() => setIndex(i => i - 1)}
            disabled={!hasPrev}
            className="text-gray-800 disabled:opacity-30 hover:opacity-60 transition-opacity"
          >
            Back
          </button>
          <button
            onClick={() => setIndex(i => i + 1)}
            disabled={!hasNext}
            className="text-gray-800 disabled:opacity-30 hover:opacity-60 transition-opacity"
          >
            Next
          </button>
        </div>
      </div>

      {/* 写真エリア */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        {total === 0 ? (
          <div className="w-full max-w-4xl aspect-video bg-gray-200 flex items-center justify-center">
            <p className="text-gray-400 text-sm">写真をCloudinaryにアップ後に表示されます</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            {/* CldImage に差し替える予定 */}
            <div className="w-full aspect-video bg-gray-300" />
          </div>
        )}
      </div>

      {/* 情報下部 */}
      <div className="flex justify-between items-end px-6 py-4 text-sm">
        <div>
          <p className="text-gray-800 font-medium uppercase tracking-wide">
            {project.title}, {project.year}
          </p>
          <button className="text-gray-500 hover:text-gray-800 transition-colors mt-1">
            detail +
          </button>
        </div>
        {total > 0 && (
          <p className="text-gray-500">
            {index + 1} / {total}
          </p>
        )}
      </div>

    </main>
  );
}
