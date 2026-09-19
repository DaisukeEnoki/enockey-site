"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import Swiper from "swiper";
import { EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

// 端でこの距離（px）以上払ったら隣のプロジェクトへ送る。
// 指の揺れ（数〜10px程度）を弾きつつ、通常の写真送りスワイプ（100px超）より
// 短く済むよう「もう一度しっかり払う」感覚になる距離を狙っている
const EDGE_SWIPE_PX = 60;

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

  // ボタン・スワイプ・矢印キーの三系統から呼ばれても二重に router.push しないためのガード。
  // slug が変わると ProjectViewer 自体が再マウントされる（Back 挙動が前提にしている動き）ため、
  // リセットは行わない
  const navigatingRef = useRef(false);
  // Swiper の on コールバックは生成時のクロージャに固定されるため、
  // 最新の props/state を読むには ref 経由にする（exhaustive-deps 対策も兼ねる）
  const handlersRef = useRef({
    jumpToNextProject: () => {},
    jumpToPrevProject: () => {},
  });

  // 現在地の前後 2 枚までを描画対象にする。Next/Back は 1 枚ずつ進むので、
  // 隣を先に用意しておけば遷移時に空白が見えない
  const NEIGHBORS = 2;
  const isNear = (i: number) => Math.abs(i - (current - 1)) <= NEIGHBORS;

  useEffect(() => {
    if (sessionStorage.getItem("photography:enterFromEnd") === "1") {
      sessionStorage.removeItem("photography:enterFromEnd");
      setStartAtEnd(true);
    }
  }, []);

  // 隣のプロジェクトへの遷移本体。ボタン・スワイプ・矢印キーの全経路がここを通ることで
  // 二重遷移ガード（navigatingRef）を 1 箇所に集約できる
  const jumpToNextProject = () => {
    if (!nextSlug || navigatingRef.current) return;
    navigatingRef.current = true;
    router.push(`/photography/${nextSlug}`);
  };

  const jumpToPrevProject = () => {
    if (!prevSlug || navigatingRef.current) return;
    navigatingRef.current = true;
    // Back で前のプロジェクトへ行くときは最後の写真から始めて、流れが逆戻りしないようにする
    sessionStorage.setItem("photography:enterFromEnd", "1");
    router.push(`/photography/${prevSlug}`);
  };

  // 毎レンダーで最新の関数を ref に反映する。Swiper の on コールバックは
  // 生成時点のクロージャを使い続けるため、これをしないと古い nextSlug/prevSlug を握ったままになる
  handlersRef.current = { jumpToNextProject, jumpToPrevProject };

  useEffect(() => {
    if (!containerRef.current || total === 0) return;

    swiperRef.current = new Swiper(containerRef.current, {
      modules: [EffectFade],
      speed: 600,
      effect: "fade",
      fadeEffect: { crossFade: true },
      initialSlide: startAtEnd ? total - 1 : 0,
      on: {
        slideChange(swiper) {
          setCurrent(swiper.activeIndex + 1);
        },
        // スワイプで隣のプロジェクトへ送るかどうかの判定。
        // touchEnd は Swiper 自身が slideTo するかどうかを決める前に発火するため、
        // ここでの isEnd/isBeginning は「ジェスチャ開始前に端にいたか」を表す。
        // reachEnd/reachBeginning は使わない（初期化時にも発火して誤爆するため却下 — 設計書 §3 論点1）
        touchEnd(swiper) {
          const dir = swiper.swipeDirection; // タップ・縦ジェスチャでは未設定のまま
          if (!dir) return;
          if (Math.abs(swiper.touches.diff) < EDGE_SWIPE_PX) return;
          if (dir === "next" && swiper.isEnd) handlersRef.current.jumpToNextProject();
          if (dir === "prev" && swiper.isBeginning) handlersRef.current.jumpToPrevProject();
        },
      },
    });
    setCurrent(swiperRef.current.activeIndex + 1);

    return () => {
      swiperRef.current?.destroy();
    };
  }, [total, startAtEnd]);

  // 端まで来たら Index に戻らず隣のプロジェクトへ送る（ボタン・矢印キー共通の経路）
  const goPrev = () => {
    const swiper = swiperRef.current;
    if (swiper && !swiper.isBeginning) {
      swiper.slidePrev();
      return;
    }
    jumpToPrevProject();
  };

  const goNext = () => {
    const swiper = swiperRef.current;
    if (swiper && !swiper.isEnd) {
      swiper.slideNext();
      return;
    }
    jumpToNextProject();
  };

  // detail オーバーレイを開いている間は矢印キーでの遷移を無効化する
  useEffect(() => {
    if (detailOpen) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailOpen, nextSlug, prevSlug]);

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
          <div
            ref={containerRef}
            className="swiper w-full h-full select-none touch-callout-none"
            // 右クリック保存・Android の長押しメニューを抑止。stopPropagation はしない
            // （Swiper が Safari で contextmenu を touchEnd 相当として使っているため）
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="swiper-wrapper">
              {/* !flex は必須: swiper/css が後から .swiper-slide を display:block に
                  戻すため、! なしでは justify-center が効かず縦写真が左に寄る */}
              {images.map((src, i) => (
                <div key={src} className="swiper-slide !flex items-center justify-center">
                  {/* max-h-full: 親（.swiper-slide）が height:100% で高さ確定済みのため、
                      calc で画面高から引き算しなくてもここで縦横比を保ったまま収まる */}
                  {/* 現在地の前後 NEIGHBORS 枚だけ描画する。全部を一度に DOM へ置くと
                      枚数の多い作品（27 枚等）で iPhone の Safari がメモリ不足で落ちるため。
                      fade 効果は全スライドを重ねて表示するので、単に loading="lazy" を
                      付けるだけでは読み込みが始まってしまい効果がない */}
                  {isNear(i) && (
                    <CldImage
                      src={src}
                      alt={`${title} - ${i + 1}`}
                      width={1600}
                      height={1200}
                      // 最初の 1 枚だけ優先読み込み。残りは遅延で取りに行く
                      priority={i === 0}
                      loading={i === 0 ? undefined : "lazy"}
                      // ドラッグ保存（PC）を抑止。タッチには影響しない属性
                      draggable={false}
                      className="max-h-full w-auto max-w-full object-contain select-none touch-callout-none"
                    />
                  )}
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
