// src/services/articleService.ts
import { SupabaseClient } from "@supabase/supabase-js";
// Tagの型
export interface Tag {
  id: number;
  name: string;
}
// 中間テーブルの型（article_tag）
export interface ArticleTag {
  tag: Tag; // リレーションによって取得されたTagオブジェクト
}
// 記事データの型定義
export interface Article {
  id: number;
  title: string;
  summary: string;
  author: string;
  published_at: string;
  updated_at: string;
  category: string;
  url: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments_count: number;
  source: { id: number; name: string };
  tags: string[];
  article_tag: ArticleTag[];
}

// 記事を取得する関数
export const fetchAllArticles = async (
  supabase: SupabaseClient
): Promise<Article[] | null> => {
  const { data: articles, error } = await supabase.from("article").select(`
  *,
  article_tag (
    tag (
      id,
      name
    )
  ),
  source (
    id,
    name
  )
`);

  if (error) {
    console.error("Error fetching articles:", error.message);
    return null;
  }

  return articles;
};
