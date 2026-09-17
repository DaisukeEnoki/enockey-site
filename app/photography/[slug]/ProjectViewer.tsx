"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import Swiper from "swiper";
import { Keyboard, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

type Props = {
  title: string;
  year?: string;
  images: string[];
  description?: string;
  url?: string;
  tags?: string[];
  /** 末尾で Next を押したときに送る先。写真のあるプロジェクトだけが渡ってくる */
  nextSlug?: string;
  /** 先頭で Back を押したときに送る先 */
  prevSlug?: string;
};

export default function ProjectViewer({ title, year, images, description, url, tags, nextSlug, prevSlug }: Props) {
  const router = useRouter();
  // Back で前のプロジェクトに入ったときは最後の写真から見せる。
  // sessionStorage を使うのは URL にクエリを残さないため（作品の URL を汚さない）
  const [startAtEnd, setStartAtEnd] = useState(false);
  const swiperRef = useRef<Swiper | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const total = images.length;

  useEffect(() => {
    if (sessionStorage.getItem("photography:enterFromEnd") === "1") {
      sessionStorage.removeItem("photography:enterFromEnd");
      setStartAtEnd(true);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || total === 0) return;

    swiperRef.current = new Swiper(containerRef.current, {
      modules: [Keyboard, EffectFade],
      keyboard: { enabled: true },
      speed: 600,
      effect: "fade",
      fadeEffect: { crossFade: true },
      initialSlide: startAtEnd ? total - 1 : 0,
      on: {
        slideChange(swiper) {
          setCurrent(swiper.activeIndex + 1);
        },
      },
    });
    setCurrent(swiperRef.current.activeIndex + 1);

    return () => {
      swiperRef.current?.destroy();
    };
  }, [total, startAtEnd]);

  // 端まで来たら Index に戻らず隣のプロジェクトへ送る。
  // Back で前のプロジェクトへ行くときは最後の写真から始めて、流れが逆戻りしないようにする
  const goPrev = () => {
    const swiper = swiperRef.current;
    if (swiper && !swiper.isBeginning) {
      swiper.slidePrev();
      return;
    }
    if (!prevSlug) return;
    sessionStorage.setItem("photography:enterFromEnd", "1");
    router.push(`/photography/${prevSlug}`);
  };

  const goNext = () => {
    const swiper = swiperRef.current;
    if (swiper && !swiper.isEnd) {
      swiper.slideNext();
      return;
    }
    if (nextSlug) router.push(`/photography/${nextSlug}`);
  };

  return (
    <main className="fixed inset-0 flex flex-col" style={{ backgroundColor: "#f5f5f5" }}>

      {/* ナビ上部 */}
      {/* py-3 sm:py-4: モバイルは上下余白を少し詰めてビューを広げる */}
      <div className="flex justify-between items-center px-6 py-3 sm:py-4 text-sm">
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
      {/* main が fixed inset-0 で高さ確定済みなので items-center だけで縦中央に置ける。 */}
      {/* min-h-0 必須: flex アイテムは既定で min-height:auto となり縮小を拒むため、    */}
      {/* これがないと中身（Swiper）がエリアの高さを超えてはみ出す                     */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-8 py-3 sm:py-2">
        {total === 0 ? (
          <div className="w-full max-w-4xl aspect-video bg-gray-200 flex items-center justify-center">
            <p className="text-gray-400 text-sm">写真をCloudinaryにアップ後に表示されます</p>
          </div>
        ) : (
          <div ref={containerRef} className="swiper w-full h-full">
            <div className="swiper-wrapper">
              {/* !flex は必須: swiper/css が後から .swiper-slide を display:block に
                  戻すため、! なしでは justify-center が効かず縦写真が左に寄る */}
              {images.map((src, i) => (
                <div key={src} className="swiper-slide !flex items-center justify-center">
                  {/* max-h-full: 親（.swiper-slide）が height:100% で高さ確定済みのため、
                      calc で画面高から引き算しなくてもここで縦横比を保ったまま収まる */}
                  <CldImage
                    src={src}
                    alt={`${title} - ${i + 1}`}
                    width={1600}
                    height={1200}
                    className="max-h-full w-auto max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 情報下部 */}
      {/* py-3 sm:py-4: モバイルは上下余白を少し詰める */}
      <div className="flex justify-between items-end px-6 py-3 sm:py-4 text-sm">
        <div>
          <p className="text-gray-800 font-medium uppercase tracking-wide">
            {year ? `${title}, ${year}` : title}
          </p>
          {/* 説明文を書かずタグだけ見せる作品もあるので、どちらかがあれば detail + を出す
              （説明しないことで、見る人が自分の記憶を重ねる余白を残す） */}
          {(description || (tags && tags.length > 0)) && (
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
