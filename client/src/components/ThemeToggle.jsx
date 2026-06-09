import { MoonStar, SunMedium } from "lucide-react";

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-neon transition hover:scale-[1.02] "
    >
      {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
