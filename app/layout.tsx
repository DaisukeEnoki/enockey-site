import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

// ============================================================
// サイト全体のデフォルトメタデータ
// 各ページで title / description を上書き可能。
// title は template により "ページ名 | enockey" の形式になる。
// ============================================================
export const metadata: Metadata = {
  // metadataBase: OGP画像など絶対URLが必要な場合の基準URL
  metadataBase: new URL("https://www.enockey.com"),
  title: {
    default: "enockey",
    template: "%s | enockey",
  },
  description:
    "Daisuke Enoki のポートフォリオサイト。写真・イラスト・音楽・エンジニアリングを通じて世界観を表現する場所。",
  icons: {
    icon: "/favicon.png",
  },
  // Open Graph（SNSシェア・Slack・Discord等での表示に使われる）
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://www.enockey.com",
    siteName: "enockey",
    title: "enockey",
    description:
      "Daisuke Enoki のポートフォリオサイト。写真・イラスト・音楽・エンジニアリングを通じて世界観を表現する場所。",
    images: [
      {
        // OGP画像: Cloudinary から 1200×630 でクロップして配信
        // NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME はビルド時に環境変数から注入される
        url: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_1200,h_630,q_auto/favicon_hetwn3`,
        width: 1200,
        height: 630,
        alt: "enockey",
      },
    ],
  },
  // Twitter / X でのカード表示
  twitter: {
    card: "summary_large_image",
    title: "enockey",
    description:
      "Daisuke Enoki のポートフォリオサイト。写真・イラスト・音楽・エンジニアリングを通じて世界観を表現する場所。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* body の背景はベージュをデフォルトに（CLAUDE.md デザインルール準拠） */}
      {/* Photography ページなど白基調のページは <main> で上書きする */}
      <body style={{ backgroundColor: "#f5f0e8", color: "#1a1a1a" }}>
        <header
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-8 py-6 gap-4"
          style={{ backgroundColor: "#f5f0e8" }}
        >
          <Link href="/" style={{ color: "#ff6a45" }} className="font-bold text-lg">
            enockey
          </Link>
          <nav className="flex flex-wrap gap-4 sm:gap-8 text-sm text-gray-500">
            <Link href="/profile">Profile</Link>
            <Link href="/illustration">Illustration</Link>
            <Link href="/photography">Photography</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
