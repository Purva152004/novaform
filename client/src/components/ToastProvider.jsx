import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

const ToastContext = createContext({ pushToast: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const pushToast = ({ title, description = "", tone = "success" }) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, title, description, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] flex w-[min(92vw,380px)] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="glass fade-in flex items-start gap-3 rounded-2xl px-4 py-3 shadow-neon"
          >
            {toast.tone === "error" ? (
              <CircleAlert className="mt-0.5 h-5 w-5 text-rose-300" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{toast.description}</p>
              ) : null}
            </div>
            <button
              className="rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
              onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
