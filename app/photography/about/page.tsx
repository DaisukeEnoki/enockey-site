"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";

export default function PhotographyAbout() {
  return (
    <main className="px-8 py-12" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-5xl mx-auto">

        {/* ナビ */}
        <div className="flex gap-8 mb-16 text-sm text-gray-400">
          <Link href="/photography" className="hover:text-gray-800 transition-colors">Works</Link>
          <Link href="/photography/text" className="hover:text-gray-800 transition-colors">Text</Link>
          <Link href="/photography/about" className="text-gray-800 font-medium">About</Link>
        </div>

        {/* プロフィール写真 */}
        <div className="mb-16 max-w-sm">
          <CldImage
            src="_42A2040-27_x4shrd"
            width={600}
            height={750}
            alt="enockey"
            className="w-full object-cover"
          />
        </div>

        {/* プロフィールテキスト */}
        <div className="max-w-lg">
          <h1 className="text-5xl font-light mb-12" style={{ color: "#1a1a1a" }}>
            enockey
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Photographer based in Tokyo, from Ehime.
          </p>
        </div>

      </div>
    </main>
  );
}
