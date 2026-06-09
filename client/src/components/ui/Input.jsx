import { cn } from "../../lib/utils";

export default function Input({ label, helper, error, className, as = "input", ...props }) {
  const Component = as;

  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span> : null}
      <Component
        className={cn(
          "w-full rounded-2xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 dark:border-white/10 dark:bg-white/10 dark:text-white",
          error && "border-rose-400 focus:ring-rose-400/40",
          className
        )}
        {...props}
      />
      {helper ? <p className="text-xs text-slate-500 dark:text-slate-400">{helper}</p> : null}
      {error ? <p className="text-xs text-rose-600 dark:text-rose-300">{error}</p> : null}
    </label>
  );
}
