import Link from "next/link";

// 記事を追加するときはここに追記する
const texts: { title: string; year: string; slug: string | null; url: string | null }[] = [
  // 例（外部リンク）:
  // {
  //   title: "記事タイトル",
  //   year: "2026",
  //   slug: null,
  //   url: "https://note.com/...",
  // },
  // 例（サイト内記事）:
  // {
  //   title: "記事タイトル",
  //   year: "2026",
  //   slug: "article-slug",
  //   url: null,
  // },
];

export default function PhotographyText() {
  return (
    <main className="px-8 py-12" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-5xl mx-auto">

        {/* ナビ */}
        <div className="flex gap-8 mb-16 text-sm text-gray-400">
          <Link href="/photography" className="hover:text-gray-800 transition-colors">Works</Link>
          <Link href="/photography/text" className="text-gray-800 font-medium">Text</Link>
          <Link href="/photography/about" className="hover:text-gray-800 transition-colors">About</Link>
        </div>

        {/* 記事リスト */}
        <div className="flex flex-col">
          {texts.length === 0 ? (
            <p className="text-gray-300 text-sm">coming soon</p>
          ) : (
            texts.map((text, i) => {
              const content = (
                <div key={i} className="flex justify-between items-baseline py-4 border-b border-gray-100 group">
                  <span className="text-sm text-gray-800 group-hover:text-gray-400 transition-colors">
                    {text.title}
                  </span>
                  <span className="text-sm text-gray-300 ml-8 shrink-0">{text.year}</span>
                </div>
              );

              if (text.url) {
                return (
                  <a key={i} href={text.url} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                );
              }
              return (
                <Link key={i} href={`/photography/text/${text.slug}`}>
                  {content}
                </Link>
              );
            })
          )}
        </div>

      </div>
    </main>
  );
}
