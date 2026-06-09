import { LoaderCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Button({
  children,
  className,
  loading = false,
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-indigo-700 text-white shadow-neon hover:from-blue-400 hover:to-indigo-600",
    secondary:
      "bg-slate-900/5 text-slate-900 ring-1 ring-slate-300 hover:bg-slate-900/10 dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/15",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-500/10 dark:text-blue-200"
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
