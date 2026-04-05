"use client";

import { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

export default function IllustrationGallery({ images }: { images: string[] }) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // スクロールフェードイン
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setVisibleItems((prev) => new Set([...prev, index]));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [images]);

  // キーボードナビ（Lightbox）
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i !== null ? Math.min(i + 1, images.length - 1) : null));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i !== null ? Math.max(i - 1, 0) : null));
      if (e.key === "Escape") setLightboxIndex(null);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, images.length]);

  return (
    <main className="px-8 py-12" style={{ backgroundColor: "#f5f0e8" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-10">Illustration</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((src, i) => (
            <div
              key={src}
              ref={(el) => { itemRefs.current[i] = el; }}
              data-index={i}
              className="cursor-pointer"
              style={{
                opacity: visibleItems.has(i) ? 1 : 0,
                transform: visibleItems.has(i) ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.6s ease ${(i % 6) * 80}ms, transform 0.6s ease ${(i % 6) * 80}ms`,
              }}
              onClick={() => setLightboxIndex(i)}
            >
              <div className="overflow-hidden">
                <CldImage
                  src={src}
                  width={600}
                  height={600}
                  alt={`illustration ${i + 1}`}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* 閉じるボタン */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-6 text-white text-2xl leading-none"
            aria-label="閉じる"
          >
            ✕
          </button>

          <div
            className="relative flex items-center gap-6 px-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 前へ */}
            <button
              onClick={() => setLightboxIndex((i) => (i !== null ? Math.max(i - 1, 0) : null))}
              disabled={lightboxIndex === 0}
              className="text-white text-2xl disabled:opacity-20 hover:opacity-70 transition-opacity"
              aria-label="前へ"
            >
              ←
            </button>

            <CldImage
              src={images[lightboxIndex]}
              width={1200}
              height={1200}
              alt={`illustration ${lightboxIndex + 1}`}
              className="max-h-[80vh] max-w-[70vw] w-auto h-auto object-contain"
            />

            {/* 次へ */}
            <button
              onClick={() =>
                setLightboxIndex((i) => (i !== null ? Math.min(i + 1, images.length - 1) : null))
              }
              disabled={lightboxIndex === images.length - 1}
              className="text-white text-2xl disabled:opacity-20 hover:opacity-70 transition-opacity"
              aria-label="次へ"
            >
              →
            </button>
          </div>

          {/* 枚数表示 */}
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </main>
  );
}