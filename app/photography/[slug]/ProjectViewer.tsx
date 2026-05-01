"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import Swiper from "swiper";
import { Keyboard, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

type Props = {
  title: string;
  year: string;
  images: string[];
  description?: string;
  url?: string;
  tags?: string[];
};

export default function ProjectViewer({ title, year, images, description, url, tags }: Props) {
  const swiperRef = useRef<Swiper | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const total = images.length;

  useEffect(() => {
    if (!containerRef.current || total === 0) return;

    swiperRef.current = new Swiper(containerRef.current, {
      modules: [Keyboard, EffectFade],
      keyboard: { enabled: true },
      speed: 600,
      effect: "fade",
      fadeEffect: { crossFade: true },
      on: {
        slideChange(swiper) {
          setCurrent(swiper.activeIndex + 1);
        },
      },
    });

    return () => {
      swiperRef.current?.destroy();
    };
  }, [total]);

  const goPrev = () => swiperRef.current?.slidePrev();
  const goNext = () => swiperRef.current?.slideNext();

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f5f5" }}>

      {/* ナビ上部 */}
      <div className="flex justify-between items-center px-6 py-4 text-sm">
        <Link href="/photography" className="text-gray-800 hover:opacity-60 transition-opacity">
          Index
        </Link>
        <div className="flex gap-6">
          <button
            onClick={goPrev}
            className="text-gray-800 hover:opacity-60 transition-opacity"
          >
            Back
          </button>
          <button
            onClick={goNext}
            className="text-gray-800 hover:opacity-60 transition-opacity"
          >
            Next
          </button>
        </div>
      </div>

      {/* 写真エリア */}
      <div className="flex-1 flex items-center justify-center px-8 py-2">
        {total === 0 ? (
          <div className="w-full max-w-4xl aspect-video bg-gray-200 flex items-center justify-center">
            <p className="text-gray-400 text-sm">写真をCloudinaryにアップ後に表示されます</p>
          </div>
        ) : (
          <div ref={containerRef} className="swiper w-full">
            <div className="swiper-wrapper">
              {images.map((src, i) => (
                <div key={src} className="swiper-slide flex items-center justify-center">
                  <CldImage
                    src={src}
                    alt={`${title} - ${i + 1}`}
                    width={1600}
                    height={1200}
                    className="max-h-[calc(100vh-8rem)] w-auto max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 情報下部 */}
      <div className="flex justify-between items-end px-6 py-4 text-sm">
        <div>
          <p className="text-gray-800 font-medium uppercase tracking-wide">
            {title}, {year}
          </p>
          {description && (
            <button
              onClick={() => setDetailOpen(true)}
              className="text-gray-400 hover:opacity-60 transition-opacity mt-1"
            >
              detail +
            </button>
          )}
        </div>
        {total > 0 && (
          <p className="text-gray-500">
            {current} / {total}
          </p>
        )}
      </div>

      {/* detail オーバーレイ */}
      {detailOpen && (
        <div
          className="fixed inset-0 flex flex-col z-50"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          {/* Close */}
          <div className="flex justify-end px-6 py-4">
            <button
              onClick={() => setDetailOpen(false)}
              className="text-sm text-gray-800 hover:opacity-60 transition-opacity"
            >
              Close
            </button>
          </div>

          {/* 本文 */}
          <div className="flex-1 flex items-center justify-center px-12">
            <div className="max-w-md w-full">
              {description && (
                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                  {description}
                </p>
              )}
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:opacity-60 transition-opacity block mb-4"
                >
                  {url}
                </a>
              )}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="text-sm text-gray-400">
                      {tag},
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
