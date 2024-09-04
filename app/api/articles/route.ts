// /app/api/articles/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Article, fetchAllArticles } from "@/service/articleService"; // 型定義がある場合

// Supabaseクライアントの初期化

export async function GET() {
  const supabase = createClient();
  // Supabaseを使って記事データを取得

  const articles: Article[] | null = await fetchAllArticles(supabase);

  if (!articles) {
    return NextResponse.json(
      { error: "Error fetching articles" },
      { status: 500 }
    );
  }

  // 記事データをJSON形式で返す
  return NextResponse.json(articles);
}
