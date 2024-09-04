// /app/articles/page.tsx
import ArticleList from "@/components/ArticleList";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  // ユーザーの認証を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ユーザーが認証されていない場合、ログインページにリダイレクト
  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="w-full h-screen">
      <ArticleList />
      {/* クライアントコンポーネントをレンダリング */}
    </div>
  );
}
