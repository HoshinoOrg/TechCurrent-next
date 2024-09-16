import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Teck Current
      </p>
      <div>
        {" "}
        Tech Current is designed to help you master both the flow of technology
        and the current innovations shaping the industry. Our mission is to
        control the ever-changing currents of tech information and keep you
        updated with the latest advancements. With Tech Current, you'll stay in
        sync with both the latest trends and the immediate pulse of
        technological progress.
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
