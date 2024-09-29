// /app/articles/components/ArticleList.tsx
"use client";

import { Article, Source, Tag } from "@/service/articleService";
import { useState, useEffect } from "react";

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const [selectedSources, setSelectedSources] = useState<Set<number>>(
    new Set()
  );

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
    const fetchSources = async () => {
      const response = await fetch("/api/sources"); // APIから記事データを取得
      const data = await response.json();
      console.log(data);
      setSources(data);
    };

    fetchArticles();
    fetchTags();
    fetchSources();
  }, []);

  const handleSort = (criteria: "date" | "likes") => {
    const sorted = [...filteredArticles].sort((a, b) => {
      if (criteria === "date") {
        console.log(a.created_at, b.created_at);
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return b.likes - a.likes;
      }
    });
    setFilteredArticles(sorted);
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
    filterArticlesBySourceAndTag(selectedSources, newSelectedTags);
  };
  const handlerSourceClear = () => {
    const newSelectedSource = new Set<number>();
    setSelectedSources(newSelectedSource);
    filterArticlesBySourceAndTag(newSelectedSource, selectedTags);
  };

  // タグが選択されたときのハンドラー
  // ソースの選択/解除ハンドラ
  const handleSourceChange = (sourceId: number) => {
    const newSelectedSources = new Set(selectedSources);
    if (newSelectedSources.has(sourceId)) {
      newSelectedSources.delete(sourceId); // 選択解除
    } else {
      newSelectedSources.add(sourceId); // 選択
    }
    setSelectedSources(newSelectedSources);
    filterArticlesBySourceAndTag(newSelectedSources, selectedTags);
  };

  // タグの選択/解除ハンドラ
  const handleTagChange = (tagId: number) => {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tagId)) {
      newSelectedTags.delete(tagId); // 選択解除
    } else {
      newSelectedTags.add(tagId); // 選択
    }
    setSelectedTags(newSelectedTags);
    filterArticlesBySourceAndTag(selectedSources, newSelectedTags);
  };

  // ソースとタグによって記事をフィルタリングする関数
  const filterArticlesBySourceAndTag = (
    selectedSources: Set<number>,
    selectedTags: Set<number>
  ) => {
    if (selectedSources.size === 0 && selectedTags.size === 0) {
      setFilteredArticles(articles); // ソースもタグも選択されていない場合、全記事を表示
    } else {
      const filtered = articles.filter((article) => {
        const matchesSource =
          selectedSources.size === 0 || selectedSources.has(article.source.id);

        const matchesTag =
          selectedTags.size === 0 ||
          article.article_tag.some((tag) => selectedTags.has(tag.tag.id));

        return matchesSource && matchesTag;
      });

      setFilteredArticles(filtered);
    }
  };

  return (
    <div className="flex h-screen">
      {/* サイドバー */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 overflow-y-auto flex-shrink-0">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold">TechCurrent</h2>
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
                <h3 className="text-lg font-semibold">Filter by Sources</h3>
                <button
                  onClick={handlerSourceClear}
                  className="text-left hover:text-gray-300"
                >
                  Clear
                </button>
              </div>
              <div className="mt-2 bg-gray-700 p-2 rounded">
                {sources.map((source) => (
                  <div key={source.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`source-${source.id}`}
                      checked={selectedSources.has(source.id)}
                      onChange={() => handleSourceChange(source.id)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`source-${source.id}`}
                      className="hover:text-gray-400"
                    >
                      {source.name}
                    </label>
                  </div>
                ))}
              </div>
            </li>
            <li>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filter by Tags</h3>
                <button
                  onClick={handlerTagClear}
                  className="text-left hover:text-gray-300"
                >
                  Clear
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
    <div className="w-80 h-50 rounded overflow-hidden shadow-lg bg-white m-4">
      <a href={article.url} target="_blank" rel="noreferrer">
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
