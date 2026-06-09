import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ToastProvider";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

const loginSchema = registerSchema.omit({ name: true });

export default function Login() {
  const { login, register } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = mode === "register" ? registerSchema.parse(form) : loginSchema.parse(form);
      if (mode === "register") {
        await register(payload);
        pushToast({ title: "Account created", description: "You are now signed in." });
      } else {
        await login(payload);
        pushToast({ title: "Welcome back", description: "Your workspace is ready." });
      }
      navigate(location.state?.from || "/");
    } catch (error) {
      pushToast({
        title: mode === "register" ? "Registration failed" : "Login failed",
        description: error.issues?.[0]?.message || error.response?.data?.message || "Please try again.",
        tone: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 pb-16 lg:grid-cols-[0.95fr,1.05fr] lg:items-center">
      <section className="glass mesh rounded-[2rem] p-6 shadow-neon md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Secure access</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-slate-900 dark:text-white">Sign in to generate and manage AI forms.</h1>
        <p className="mt-4 max-w-xl text-sm text-slate-600 dark:text-slate-300">
          JWT sessions are stored in httpOnly cookies for a safer production setup. Create an account to unlock live previews, uploads, and CSV exports.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            [Mail, "Email auth"],
            [LockKeyhole, "Cookie sessions"],
            [UserRound, "Creator dashboard"]
          ].map(([Icon, label]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
              <Icon className="h-5 w-5 text-blue-200" />
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-[2rem] p-6 shadow-neon md:p-8">
        <div className="flex rounded-full bg-white/5 p-1 dark:bg-white/5">
          {[
            ["login", "Login"],
            ["register", "Register"]
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${mode === value ? "bg-gradient-to-r from-blue-500 to-indigo-700 text-white shadow-neon" : "text-slate-600 dark:text-slate-300"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          {mode === "register" ? (
            <Input label="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          ) : null}
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <Input label="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} helper="Use at least 8 characters." />
          <Button type="submit" className="w-full" loading={loading}>
            {mode === "register" ? "Create account" : "Sign in"}
          </Button>
        </form>
      </section>
    </div>
  );
}
