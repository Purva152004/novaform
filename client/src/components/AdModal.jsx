import { useEffect, useState } from "react";
import Button from "./ui/Button";

const AD_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80";

export default function AdModal({ open, onComplete }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!open) return undefined;

    setCountdown(5);
    const timer = window.setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (open && countdown === 0) {
      onComplete();
    }
  }, [countdown, open, onComplete]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90 px-4 backdrop-blur-xl">
      <div className="glass mesh relative w-full max-w-4xl overflow-hidden rounded-[2rem] shadow-[0_0_80px_rgba(59,130,246,0.35)]">
        <img src={AD_IMAGE} alt="Men's fashion sponsored ad" className="h-[420px] w-full object-cover md:h-[520px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <span className="inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100 ring-1 ring-blue-300/30">
            Sponsored Style Spotlight
          </span>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold text-white md:text-5xl">
            Elevate your brand presence with premium menswear campaign visuals.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate-200 md:text-base">
            Your new form is ready. This fullscreen ad stays visible for 5 seconds before preview opens.
          </p>
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-200">Redirecting in {countdown}s</p>
            <Button onClick={onComplete} disabled={countdown > 0}>
              {countdown > 0 ? `Please wait ${countdown}s` : "Continue to preview"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
