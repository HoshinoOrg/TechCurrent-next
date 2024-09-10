// /app/articles/components/ArticleList.tsx test
"use client";

import { Article, Tag } from "@/service/articleService";
import { useState, useEffect } from "react";

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());

  // 記事データの取得
  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch("/api/articles"); // APIから記事データを取得
      const data = await response.json();
      setArticles(data);
      setFilteredArticles(data);
    };

    const fetchTags = async () => {
      const response = await fetch("/api/tags"); // APIから記事データを取得
      const data = await response.json();
      console.log(data);
      setTags(data);
    };

    fetchArticles();
    fetchTags();
  }, []);

  const handleSort = (criteria: "date" | "likes") => {
    const sorted = [...articles].sort((a, b) => {
      if (criteria === "date") {
        console.log(a.created_at, b.created_at);
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return b.likes - a.likes;
      }
    });
    setArticles(sorted);
  };

  // タグが選択されたときのハンドラー
  const handleTagChange = (tagId: number) => {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tagId)) {
      newSelectedTags.delete(tagId); // 選択解除
    } else {
      newSelectedTags.add(tagId); // 選択
    }
    setSelectedTags(newSelectedTags);

    filterArticlesByTags(newSelectedTags);
  };

  // タグによって記事をフィルタリングする関数
  const filterArticlesByTags = (selectedTags: Set<number>) => {
    if (selectedTags.size === 0) {
      setFilteredArticles(articles); // タグが選択されていない場合、全記事を表示
    } else {
      const filtered = articles.filter((article) =>
        article.article_tag.some((tagEntry) =>
          selectedTags.has(tagEntry.tag.id)
        )
      );
      setFilteredArticles(filtered);
    }
  };

  const handlerTagClear = () => {
    const newSelectedTags = new Set<number>();
    setSelectedTags(newSelectedTags);
    filterArticlesByTags(newSelectedTags);
  };

  return (
    <div className="flex h-screen">
      {/* サイドバー */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 overflow-y-auto">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold">TeckCurrent</h2>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-4">
            {/* ソート機能の追加 */}
            <li>
              <h3 className="text-lg font-semibold">Sort</h3>
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
            </li>
            <li>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filter by Tags</h3>
                <button
                  onClick={handlerTagClear}
                  className="text-left hover:text-gray-300"
                >
                  クリア
                </button>
              </div>

              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={selectedTags.has(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
                    className="hover:text-gray-400"
                  >
                    {tag.name}
                  </label>
                </div>
              ))}
            </li>
          </ul>
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-grow p-8 bg-gray-100 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Main Content</h1>
        <div className="flex flex-wrap gap-4">
          {filteredArticles.map((article) => (
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
      <a href={article.url} target="_blank" rel="noreferrer">
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
            {new Date(article.created_at).toLocaleDateString()}
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
            <span className="text-gray-600 text-sm">
              Likes: {article.likes}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};
