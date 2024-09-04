// /app/articles/components/ArticleList.tsx
"use client";

import { useState, useEffect } from "react";

type Article = {
  id: number;
  title: string;
  published_at: string;
  likes: number;
  author: string;
  thumbnail: string;
  summary: string;
  article_tag: { tag: { id: number; name: string } }[];
  source: { name: string };
};

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // 記事データの取得
  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch("/api/articles"); // APIから記事データを取得
      const data = await response.json();
      setArticles(data);
    };

    fetchArticles();
  }, []);

  const handleSortClick = () => {
    setIsSortOpen(!isSortOpen);
  };

  const handleSort = (criteria: "date" | "likes") => {
    const sorted = [...articles].sort((a, b) => {
      if (criteria === "date") {
        return (
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
        );
      } else {
        return b.likes - a.likes;
      }
    });
    setArticles(sorted);
    setIsSortOpen(false); // ソートメニューを閉じる
  };

  return (
    <div className="flex h-full">
      {/* サイドバー */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold">TeckCurrent</h2>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <a href="#" className="hover:text-gray-400">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Profile
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Logout
              </a>
            </li>
            {/* ソート機能の追加 */}
            <li>
              <button onClick={handleSortClick} className="hover:text-gray-400">
                Sort
              </button>
              {isSortOpen && (
                <div className="mt-2 bg-gray-700 p-2 rounded">
                  <button
                    onClick={() => handleSort("date")}
                    className="block w-full text-left hover:text-gray-300"
                  >
                    Date
                  </button>
                  <button
                    onClick={() => handleSort("likes")}
                    className="block w-full text-left hover:text-gray-300"
                  >
                    Likes
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-grow p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-black">Main Content</h1>
        <div className="flex flex-wrap gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </main>
    </div>
  );
}

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
      <img
        className="w-full h-48 object-cover"
        src={article.thumbnail}
        alt={article.title}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-gray-600 text-xl mb-2">
          {article.title}
        </div>
        <p className="text-gray-600 text-sm mb-4">
          By {article.author} | Published on{" "}
          {new Date(article.published_at).toLocaleDateString()}
        </p>
        <p className="text-gray-700 text-base mb-4">{article.summary}</p>
        <span className="text-gray-600 text-sm">
          {article.article_tag.map((tagEntry) => (
            <span
              key={tagEntry.tag.id}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              {tagEntry.tag.name}
            </span>
          ))}
        </span>
      </div>
      <div className="px-6 pt-4 pb-2 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">
            source: {article.source.name}
          </span>
          <span className="text-gray-600 text-sm">Likes: {article.likes}</span>
        </div>
      </div>
    </div>
  );
};
