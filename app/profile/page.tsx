"use client";

import { CldImage } from "next-cloudinary";
import Link from "next/link";

export default function Profile() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-6"
      style={{ backgroundColor: "#f5f0e8" }}
    >
      <CldImage
        src="favicon_hetwn3"
        width={120}
        height={120}
        alt="enockey logo"
        className="rounded-full"
      />

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold" style={{ color: "#1a1a1a" }}>
          enockey
        </h1>
        <p className="text-gray-500 text-sm tracking-widest">
          creator
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 mt-4 text-sm text-gray-400">
        <Link href="/photography" className="hover:text-gray-800 transition-colors">
          Photography
        </Link>
        <Link href="/illustration" className="hover:text-gray-800 transition-colors">
          Illustration
        </Link>
        <Link href="/contact" className="hover:text-gray-800 transition-colors">
          Contact
        </Link>
      </div>
    </main>
  );
}
