import Link from "next/link";

export default function PhotographyAbout() {
  return (
    <main className="px-8 py-12" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-5xl mx-auto">

        {/* ナビ */}
        <div className="flex gap-8 mb-16 text-sm text-gray-400">
          <Link href="/photography" className="hover:text-gray-800 transition-colors">Works</Link>
          <Link href="/photography/about" className="text-gray-800 font-medium">About</Link>
        </div>

        {/* プロフィール写真（後でCldImageに差し替え） */}
        <div className="w-full aspect-[4/5] bg-gray-100 mb-16 max-w-2xl" />

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
