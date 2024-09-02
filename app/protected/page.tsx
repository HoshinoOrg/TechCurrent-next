import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Article, fetchAllArticles } from "@/service/articleService";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const articles: Article[] | null = await fetchAllArticles(supabase);

  if (!articles) {
    return <p>Error fetching articles</p>;
  }

  console.log("Fetched articles:", articles);

  return (
    <div className="w-full h-screen">
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
            </ul>
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-grow p-8 bg-gray-100">
          <h1 className="text-3xl font-bold mb-6 text-black">Main Content</h1>
          <p className="text-black">
            This is the main content area where you can add your components or
            any content.
          </p>
          <div className="flex flex-wrap gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// プロパティとして記事データを受け取るコンポーネント
const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
      {/* サムネイル画像 */}
      <img
        className="w-full h-48 object-cover"
        src={article.thumbnail}
        alt={article.title}
      />
      <div className="px-6 py-4">
        {/* タイトル */}
        <div className="font-bold text-gray-600 text-xl mb-2">
          {article.title}
        </div>
        {/* 著者と投稿日 */}
        <p className="text-gray-600 text-sm mb-4">
          By {article.author} | Published on{" "}
          {new Date(article.published_at).toLocaleDateString()}
        </p>
        {/* 要約 */}
        <p className="text-gray-700 text-base  mb-4">{article.summary}</p>
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
      {/* 下部情報 */}
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
