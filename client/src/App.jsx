
// import { Link, Route, Routes, useNavigate } from "react-router-dom";
// import { LayoutDashboard, LogOut, Sparkles } from "lucide-react";
// import { useEffect, useState } from "react";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Preview from "./pages/Preview";
// import FormPage from "./pages/FormPage";
// import ThemeToggle from "./components/ThemeToggle";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { useAuth } from "./hooks/useAuth";
// import { useToast } from "./components/ToastProvider";

// export default function App() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const { pushToast } = useToast();
//   const [theme, setTheme] = useState(localStorage.getItem("nova-theme") || "dark");

//   useEffect(() => {
//     document.documentElement.classList.remove("dark", "light");
//     document.documentElement.classList.add(theme);
//     localStorage.setItem("nova-theme", theme);
//   }, [theme]);

//   return (
//     <div className="min-h-screen px-3 pb-8 pt-4 sm:px-4 md:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         <header className="sticky top-3 z-40 mb-6 rounded-[2rem] px-4 py-4 shadow-neon backdrop-blur-xl sm:px-5 md:top-4 md:mb-8 md:px-7">
//           <div className="glass absolute inset-0 -z-10 rounded-[2rem]" />
//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex min-w-0 items-center gap-3">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-glow sm:h-12 sm:w-12">
//                 <Sparkles className="h-6 w-6 text-white" />
//               </div>

//               <div className="min-w-0">
//                 <Link to="/" className="block truncate font-display text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
//                   Nova Forms AI
//                 </Link>
//                 <p className="truncate text-[10px] uppercase tracking-[0.3em] text-blue-200 sm:text-xs">
//                   MERN form generation studio
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
//               {user ? (
//                 <button
//                   onClick={() => navigate("/")}
//                   className="glass inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-900 dark:text-white sm:w-auto"
//                 >
//                   <LayoutDashboard className="h-4 w-4" />
//                   <span className="max-w-[180px] truncate">{user.email}</span>
//                 </button>
//               ) : null}

//               <ThemeToggle
//                 theme={theme}
//                 onToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
//               />

//               {user ? (
//                 <button
//                   onClick={async () => {
//                     await logout();
//                     pushToast({ title: "Signed out" });
//                     navigate("/login");
//                   }}
//                   className="glass inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-900 dark:text-white sm:w-auto"
//                 >
//                   <LogOut className="h-4 w-4" />
//                   Logout
//                 </button>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="glass inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-slate-900 dark:text-white sm:w-auto"
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         </header>

//         <main className="pb-6">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route
//               path="/preview/:id"
//               element={
//                 <ProtectedRoute>
//                   <Preview />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/form/:id" element={<FormPage />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Preview from "./pages/Preview";
import FormPage from "./pages/FormPage";
import ThemeToggle from "./components/ThemeToggle";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { useToast } from "./components/ToastProvider";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { pushToast } = useToast();
  const [theme, setTheme] = useState(localStorage.getItem("nova-theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("nova-theme", theme);
  }, [theme]);

  const showBackButton = location.pathname !== "/";

  return (
    <div className="min-h-screen px-3 pb-8 pt-4 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="sticky top-3 z-40 mb-6 rounded-[2rem] px-4 py-4 shadow-neon backdrop-blur-xl sm:px-5 md:top-4 md:mb-8 md:px-7">
          <div className="glass absolute inset-0 -z-10 rounded-[2rem]" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              {showBackButton ? (
                <button
                  onClick={() => navigate(-1)}
                  className="glass inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-slate-900 transition hover:scale-[1.02] dark:text-white"
                  aria-label="Go back"
                  title="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-glow sm:h-12 sm:w-12">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              )}

              <div className="min-w-0">
                <Link to="/" className="block truncate font-display text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  Nova Forms AI
                </Link>
                <p className="truncate text-[10px] uppercase tracking-[0.3em] text-blue-200 sm:text-xs">
                  MERN form generation studio
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              {user ? (
                <button
                  onClick={() => navigate("/")}
                  className="glass inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-900 dark:text-white sm:w-auto"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="max-w-[180px] truncate">{user.email}</span>
                </button>
              ) : null}

              <ThemeToggle
                theme={theme}
                onToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              />

              {user ? (
                <button
                  onClick={async () => {
                    await logout();
                    pushToast({ title: "Signed out" });
                    navigate("/login");
                  }}
                  className="glass inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-900 dark:text-white sm:w-auto"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="glass inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-slate-900 dark:text-white sm:w-auto"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="pb-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/preview/:id"
              element={
                <ProtectedRoute>
                  <Preview />
                </ProtectedRoute>
              }
            />
            <Route path="/form/:id" element={<FormPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
