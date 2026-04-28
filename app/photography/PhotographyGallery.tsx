"use client";

// カテゴリーフィルター・インタラクションを担当する Client Component
// page.tsx (Server Component) からデータを受け取って表示する

import Link from "next/link";
import { useState } from "react";
import { CldImage } from "next-cloudinary";

const categories = ["all", "portrait", "lifestyle", "editorial"] as const;
type Category = (typeof categories)[number];

export type Project = {
  slug: string;
  title: string;
  year: string;
  cover: string | null;
  categories: Category[];
};

export default function PhotographyGallery({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Category>("all");

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(active));

  return (
    <main className="px-8 py-12" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-5xl mx-auto">

        {/* ナビ */}
        <div className="flex gap-8 mb-12 text-sm text-gray-400">
          <Link href="/photography" className="text-gray-800 font-medium">Works</Link>
          <Link href="/photography/text" className="hover:text-gray-800 transition-colors">Text</Link>
          <Link href="/photography/about" className="hover:text-gray-800 transition-colors">About</Link>
        </div>

        {/* カテゴリーフィルター */}
        <div className="flex gap-6 mb-10 text-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`transition-colors ${
                active === cat
                  ? "text-gray-800 font-medium"
                  : "text-gray-400 hover:text-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* プロジェクトグリッド */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          {filtered.map((project) => (
            <Link key={project.slug} href={`/photography/${project.slug}`}>
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden group relative">
                {project.cover ? (
                  <CldImage
                    src={project.cover}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:opacity-85 transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 group-hover:bg-gray-300 transition-colors" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end">
                  <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs font-medium text-white">{project.title}</p>
                    <p className="text-xs text-white/70">{project.year}</p>
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
