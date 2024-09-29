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
  created_at: string;
  url: string;
  thumbnail: string;
  likes: number;
  source: { id: number; name: string };
  article_tag: ArticleTag[];
}

// 記事を取得する関数
export const fetchAllArticles = async (
  supabase: SupabaseClient
): Promise<Article[] | null> => {
  const { data: articles, error } = await supabase
    .from("article")
    .select(
      `
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
`
    )
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error.message);
    return null;
  }
  console.log(articles[0].created_at);
  return articles;
};

// タグを取得する関数
export const fetchAllTags = async (
  supabase: SupabaseClient
): Promise<Tag[] | null> => {
  const { data: tags, error } = await supabase.from("tag").select("*");

  if (error) {
    console.error("Error fetching tags:", error.message);
    return null;
  }
  console.log("tag", tags);
  return tags;
};
