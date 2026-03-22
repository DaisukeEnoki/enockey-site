"use client";

import { CldImage } from "next-cloudinary";

const products = [
  {
    id: 1,
    name: "face sticker",
    type: "ステッカー",
    suzuriUrl: "https://suzuri.jp/enockey/19613664/sticker/m/white",
    cloudinaryId: "favicon_hetwn3",
  },
];

export default function Shop() {
  return (
    <main style={{ backgroundColor: "#f5f0e8" }} className="min-h-screen">
      <section className="max-w-3xl mx-auto px-8 pt-12 pb-16">
        <h1 className="text-lg font-bold mb-1" style={{ color: "#1a1a1a" }}>
          Shop
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          SUZURI にて販売中
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <a
              key={product.id}
              href={product.suzuriUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="aspect-square overflow-hidden bg-white">
                <CldImage
                  src={product.cloudinaryId}
                  width={600}
                  height={600}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 group-hover:opacity-80 transition-opacity"
                />
              </div>
              <div className="mt-2 px-1">
                <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
                  {product.name}
                </p>
                <p className="text-xs text-gray-400">{product.type}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
