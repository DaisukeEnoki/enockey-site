"use client";

import Image from "next/image";
import { CldImage } from "next-cloudinary";

const BASE = "https://lens.suzuri.jp/v3/500x500";
const MID = "19615168/1774222653-2048x2048.jpg";
const H = "7c15714aaa6f4c6be4292c14697a7156ce1f9b46";

type Product = {
  id: number;
  name: string;
  type: string;
  suzuriUrl: string;
  imageUrl?: string;
  cloudinaryId?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "face can badge",
    type: "缶バッジ",
    suzuriUrl: "https://suzuri.jp/enockey/19615168/can-badge/75mm/white",
    imageUrl: `${BASE}/can-badge/75mm/white/front/${MID}.webp`,
  },
  {
    id: 2,
    name: "face mug",
    type: "マグカップ",
    suzuriUrl: "https://suzuri.jp/enockey/19615168/mug/m/white",
    imageUrl: `${BASE}/mug/m/white/${MID}.jpg?h=${H}&printed=true`,
  },
  {
    id: 3,
    name: "face tote bag",
    type: "トートバッグ",
    suzuriUrl: "https://suzuri.jp/enockey/19615168/tote-bag/m/natural",
    cloudinaryId: "50e124a0-a7d4-49c9-a87c-b9cddf8016e7_xkzdpi",
  },
  {
    id: 4,
    name: "face keychain",
    type: "アクリルキーホルダー",
    suzuriUrl: "https://suzuri.jp/enockey/19615168/acrylic-keychain/50x50mm/clear",
    imageUrl: `${BASE}/acrylic-keychain/50x50mm/clear/${MID}.jpg?h=${H}&printed=true`,
  },
  {
    id: 5,
    name: "face tumbler",
    type: "サーモタンブラー",
    suzuriUrl: "https://suzuri.jp/enockey/19615168/thermo-tumbler/360ml/white",
    imageUrl: `${BASE}/thermo-tumbler/360ml/white/${MID}.jpg?h=${H}&printed=true`,
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
              <div className="aspect-square overflow-hidden bg-white relative">
                {product.cloudinaryId ? (
                  <CldImage
                    src={product.cloudinaryId}
                    width={500}
                    height={500}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <Image
                    src={product.imageUrl!}
                    fill
                    alt={product.name}
                    className="object-contain p-4 group-hover:opacity-80 transition-opacity"
                  />
                )}
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
