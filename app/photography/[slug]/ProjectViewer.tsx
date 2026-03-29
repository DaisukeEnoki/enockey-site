"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";

type Props = {
  title: string;
  year: string;
  images: string[];
};

export default function ProjectViewer({ title, year, images }: Props) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  // キーボード矢印キーで遷移
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && hasNext) setIndex(i => i + 1);
      if (e.key === "ArrowLeft" && hasPrev) setIndex(i => i - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hasPrev, hasNext]);

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
            <CldImage
              src={images[index]}
              alt={`${title} - ${index + 1}`}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>
        )}
      </div>

      {/* 情報下部 */}
      <div className="flex justify-between items-end px-6 py-4 text-sm">
        <div>
          <p className="text-gray-800 font-medium uppercase tracking-wide">
            {title}, {year}
          </p>
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
