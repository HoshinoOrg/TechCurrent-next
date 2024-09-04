// /app/api/articles/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  Article,
  Tag,
  fetchAllArticles,
  fetchAllTags,
} from "@/service/articleService"; // 型定義がある場合

// Supabaseクライアントの初期化

export async function GET() {
  const supabase = createClient();
  // Supabaseを使って記事データを取得

  const tags: Tag[] | null = await fetchAllTags(supabase);

  if (!tags) {
    return NextResponse.json({ error: "Error fetching tags" }, { status: 500 });
  }

  // 記事データをJSON形式で返す
  return NextResponse.json(tags);
}
