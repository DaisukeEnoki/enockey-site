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
};

export default function ProjectViewer({ title, year, images }: Props) {
  const swiperRef = useRef<Swiper | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
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
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        {total === 0 ? (
          <div className="w-full max-w-4xl aspect-video bg-gray-200 flex items-center justify-center">
            <p className="text-gray-400 text-sm">写真をCloudinaryにアップ後に表示されます</p>
          </div>
        ) : (
          <div ref={containerRef} className="swiper w-full max-w-4xl">
            <div className="swiper-wrapper">
              {images.map((src, i) => (
                <div key={src} className="swiper-slide">
                  <CldImage
                    src={src}
                    alt={`${title} - ${i + 1}`}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain"
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
        </div>
        {total > 0 && (
          <p className="text-gray-500">
            {current} / {total}
          </p>
        )}
      </div>

    </main>
  );
}
