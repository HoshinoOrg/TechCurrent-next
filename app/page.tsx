import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="mt-20 flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6 px-4">
          {isSupabaseConnected && <AuthButton />}
        </main>
      </div>
    </div>
  );
}
