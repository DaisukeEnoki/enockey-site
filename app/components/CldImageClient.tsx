"use client";

// next-cloudinary 16.x の CldImage を Server Component から直接 import すると、
// 内部の useState が原因で Next.js 16 + Turbopack の prerender / SSR が失敗する。
// このラッパーを通すことで CldImage は完全に Client 側でのみ動作する。
//
// 使い方: Server Component で
//   import CldImage from "@/app/components/CldImageClient";
// として CldImage を import すれば、既存の API と同じ感覚で使える。

import dynamic from "next/dynamic";

const CldImage = dynamic(
  () => import("next-cloudinary").then((mod) => mod.CldImage),
  { ssr: false }
);

export default CldImage;
