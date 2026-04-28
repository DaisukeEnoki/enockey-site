// Server Component: hooks なし、"use client" 不要
import type { Metadata } from "next";
import Image from "next/image";
import { CldImage } from "next-cloudinary";

export const metadata: Metadata = {
  title: "Shop",
  description: "enockey のオリジナルグッズ。SUZURI にて販売中。缶バッジ・マグカップ・トートバッグなど。",
  openGraph: {
    title: "Shop | enockey",
    description: "enockey のオリジナルグッズ。SUZURI にて販売中。缶バッジ・マグカップ・トートバッグなど。",
  },
};

const BASE = "https://lens.suzuri.jp/v3/500x500";

type Product = {
  id: number;
  name: string;
  type: string;
  suzuriUrl: string;
  imageUrl?: string;
  cloudinaryId?: string;
};

type Series = {
  title: string;
  lineStampUrl?: string;
  products: Product[];
};

const MID1 = "19615168/1774222653-2048x2048.jpg";
const H1 = "7c15714aaa6f4c6be4292c14697a7156ce1f9b46";

const MID2 = "19634798/1774520613-370x320.png";
const H2 = "3cc053705e412f37af0f2bfc68a97820a0662780";

const series: Series[] = [
  {
    title: "No1",
    products: [
      {
        id: 1,
        name: "face can badge",
        type: "缶バッジ",
        suzuriUrl: "https://suzuri.jp/enockey/19615168/can-badge/75mm/white",
        imageUrl: `${BASE}/can-badge/75mm/white/${MID1}.jpg?h=${H1}&printed=true`,
      },
      {
        id: 2,
        name: "face mug",
        type: "マグカップ",
        suzuriUrl: "https://suzuri.jp/enockey/19615168/mug/m/white",
        imageUrl: `${BASE}/mug/m/white/${MID1}.jpg?h=${H1}&printed=true`,
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
        imageUrl: `${BASE}/acrylic-keychain/50x50mm/clear/${MID1}.jpg?h=${H1}&printed=true`,
      },
      {
        id: 5,
        name: "face tumbler",
        type: "サーモタンブラー",
        suzuriUrl: "https://suzuri.jp/enockey/19615168/thermo-tumbler/360ml/white",
        imageUrl: `${BASE}/thermo-tumbler/360ml/white/${MID1}.jpg?h=${H1}&printed=true`,
      },
    ],
  },
  {
    title: "なかよし鯛焼き",
    lineStampUrl: "https://line.me/S/sticker/33347461",
    products: [
      {
        id: 6,
        name: "taiyaki sticker",
        type: "ステッカー",
        suzuriUrl: "https://suzuri.jp/enockey/19634798/sticker/m/white",
        imageUrl: `${BASE}/sticker/m/white/${MID2}.jpg?h=${H2}&printed=true`,
      },
      {
        id: 7,
        name: "taiyaki dry T-shirt",
        type: "ドライTシャツ",
        suzuriUrl: "https://suzuri.jp/enockey/19634798/dry-t-shirt/l/white",
        imageUrl: `${BASE}/dry-t-shirt/l/white/front/${MID2}.jpg?h=${H2}&printed=true`,
      },
      {
        id: 8,
        name: "taiyaki mentholatum can",
        type: "メンタム缶",
        suzuriUrl: "https://suzuri.jp/enockey/19634798/ebisuya-mentholatum-can-200g-for-shop/200g/silver",
        imageUrl: `${BASE}/ebisuya-mentholatum-can-200g-for-shop/200g/silver/${MID2}.jpg?h=${H2}&printed=true`,
      },
    ],
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <a
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
  );
}

export default function Shop() {
  return (
    <main style={{ backgroundColor: "#f5f0e8" }} className="min-h-screen">
      <section className="max-w-3xl mx-auto px-8 pt-12 pb-16">
        <h1 className="text-lg font-bold mb-1" style={{ color: "#1a1a1a" }}>
          Shop
        </h1>
        <p className="text-sm text-gray-400 mb-12">
          SUZURI にて販売中
        </p>

        {series.map((s) => (
          <div key={s.title} className="mb-14">
            <p className="text-xs text-gray-400 tracking-widest mb-4">{s.title}</p>
            {s.lineStampUrl && (
              <a
                href={s.lineStampUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 mb-4 px-4 py-3 bg-white hover:opacity-80 transition-opacity w-fit"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#06C755">
                  <path d="M12 2C6.48 2 2 5.92 2 10.72c0 3.16 1.83 5.94 4.6 7.64L5.5 22l4.26-2.3c.73.2 1.47.3 2.24.3 5.52 0 10-3.92 10-8.72S17.52 2 12 2z"/>
                </svg>
                <span className="text-sm font-medium" style={{ color: "#06C755" }}>
                  LINE スタンプを見る
                </span>
              </a>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {s.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
