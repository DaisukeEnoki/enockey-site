import type { Metadata } from "next";
import { XMLParser } from "fast-xml-parser";

export const metadata: Metadata = {
  title: "Blog",
  description: "enockey のブログ。note.com/enockey で公開中の記事一覧。",
  openGraph: {
    title: "Blog | enockey",
    description: "enockey のブログ。note.com/enockey で公開中の記事一覧。",
  },
};

const NOTE_RSS_URL = "https://note.com/enockey/rss";

type NoteArticle = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail?: string;
};

async function fetchNoteArticles(): Promise<NoteArticle[]> {
  const res = await fetch(NOTE_RSS_URL, { next: { revalidate: 3600 } });
  const xml = await res.text();

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const result = parser.parse(xml);

  // RSS フィードの各アイテムの型定義
  type RSSItem = {
    title?: string;
    link?: string;
    pubDate?: string;
    description?: string;
    enclosure?: { "@_url"?: string };
  };

  const items = result?.rss?.channel?.item ?? [];
  const itemArray: RSSItem[] = Array.isArray(items) ? items : [items];

  return itemArray.map((item) => ({
    title: item.title ?? "",
    link: item.link ?? "",
    pubDate: item.pubDate ?? "",
    description: (item.description ?? "").replace(/<[^>]*>/g, "").slice(0, 120),
    thumbnail: item.enclosure?.["@_url"] ?? undefined,
  }));
}

export default async function BlogPage() {
  const articles = await fetchNoteArticles();

  return (
    <main style={{ backgroundColor: "#f5f0e8" }} className="min-h-screen py-16 px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
          Blog
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          <a
            href="https://note.com/enockey"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ff6a45" }}
          >
            note.com/enockey
          </a>
        </p>

        <div className="flex flex-col gap-8">
          {articles.map((article) => (
            <a
              key={article.link}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 group"
            >
              {article.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-24 h-24 object-cover flex-shrink-0"
                />
              )}
              <div className="flex flex-col justify-center">
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(article.pubDate).toLocaleDateString("ja-JP")}
                </p>
                <h2
                  className="text-base font-medium group-hover:opacity-60 transition-opacity"
                  style={{ color: "#1a1a1a" }}
                >
                  {article.title}
                </h2>
                {article.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {article.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}