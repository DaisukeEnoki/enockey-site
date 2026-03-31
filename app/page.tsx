"use client";

import { CldImage } from "next-cloudinary";
import Link from "next/link";

const sections = [
  {
    href: "/photography",
    label: "Photography",
    cloudinaryId: "_42A1931-1-2_epzppp",
  },
  {
    href: "/illustration",
    label: "Illustration",
    cloudinaryId: "91bfe02ace532bee28130dd052a8541e-1536x1536_orunko",
  },
  {
    href: "/shop",
    label: "Shop",
    cloudinaryId: "favicon_hetwn3",
  },
  {
    href: null,
    label: "Music",
    cloudinaryId: null,
  },
];

export default function Home() {
  return (
    <main style={{ backgroundColor: "#f5f0e8" }} className="min-h-screen">

      {/* Hero */}
      <section className="flex flex-col items-center pt-16 pb-10 px-8">
        <CldImage
          src="favicon_hetwn3"
          width={80}
          height={80}
          alt="enockey"
          className="rounded-full mb-4"
        />
        <h1 className="text-xl font-bold" style={{ color: "#1a1a1a" }}>
          enockey
        </h1>
      </section>

      {/* セクションカード */}
      <section className="max-w-3xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sections.map((section) =>
            section.href ? (
              <Link key={section.label} href={section.href}>
                <div className="aspect-square overflow-hidden group relative">
                  {section.cloudinaryId ? (
                    <CldImage
                      src={section.cloudinaryId}
                      width={600}
                      height={600}
                      alt={section.label}
                      className="w-full h-full object-cover group-hover:opacity-85 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-200 group-hover:bg-stone-300 transition-colors" />
                  )}
                  <div className="absolute bottom-0 left-0 p-3">
                    <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
                      {section.label}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div key={section.label} className="aspect-square relative opacity-40">
                <div className="w-full h-full bg-stone-200" />
                <div className="absolute bottom-0 left-0 p-3">
                  <p className="text-sm" style={{ color: "#1a1a1a" }}>
                    {section.label}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

    </main>
  );
}
