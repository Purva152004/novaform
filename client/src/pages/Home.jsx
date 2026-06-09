// // import { useEffect, useMemo, useState } from "react";
// // import { Check, ChevronRight, LayoutPanelTop, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
// // import { useNavigate } from "react-router-dom";
// // import api from "../lib/api";
// // import { useAuth } from "../hooks/useAuth";
// // import { useToast } from "../components/ToastProvider";
// // import Button from "../components/ui/Button";
// // import Input from "../components/ui/Input";
// // import Dashboard from "../components/Dashboard";
// // import AdModal from "../components/AdModal";

// // const FIELD_TYPES = [
// //   "TEXT",
// //   "PARAGRAPH",
// //   "MULTIPLE_CHOICE",
// //   "DROPDOWN",
// //   "DATE",
// //   "EMAIL",
// //   "NUMBER",
// //   "FILE"
// // ];

// // const defaultGeneration = {
// //   title: "",
// //   description: "",
// //   prompt: "general survey",
// //   numFields: 6,
// //   requiredByDefault: true,
// //   types: ["TEXT", "EMAIL", "MULTIPLE_CHOICE", "FILE"]
// // };

// // export default function Home() {
// //   const navigate = useNavigate();
// //   const { user } = useAuth();
// //   const { pushToast } = useToast();
// //   const [generation, setGeneration] = useState(defaultGeneration);
// //   const [creating, setCreating] = useState(false);
// //   const [forms, setForms] = useState([]);
// //   const [loadingForms, setLoadingForms] = useState(false);
// //   const [pendingPreviewId, setPendingPreviewId] = useState("");
// //   const [showAd, setShowAd] = useState(false);

// //   const selectedLabel = useMemo(() => generation.types.join(", "), [generation.types]);

// //   const fetchForms = async () => {
// //     if (!user) return;
// //     setLoadingForms(true);
// //     try {
// //       const { data } = await api.get("/forms/my/list");
// //       setForms(data.forms);
// //     } catch (error) {
// //       pushToast({ title: "Failed to load dashboard", description: error.response?.data?.message, tone: "error" });
// //     } finally {
// //       setLoadingForms(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchForms();
// //   }, [user]);

// //   const toggleType = (type) => {
// //     setGeneration((current) => ({
// //       ...current,
// //       types: current.types.includes(type)
// //         ? current.types.filter((item) => item !== type)
// //         : [...current.types, type]
// //     }));
// //   };

// //   const handleGenerate = async () => {
// //     if (!user) {
// //       navigate("/login");
// //       return;
// //     }

// //     if (!generation.title.trim()) {
// //       pushToast({ title: "Form title required", description: "Add a title before generating.", tone: "error" });
// //       return;
// //     }

// //     if (generation.types.length === 0) {
// //       pushToast({ title: "Select at least one field type", tone: "error" });
// //       return;
// //     }

// //     setCreating(true);
// //     try {
// //       const { data } = await api.post("/forms/generate-form/auth", generation);
// //       setPendingPreviewId(data.form._id);
// //       setShowAd(true);
// //       pushToast({ title: "AI form generated", description: "Your new form is ready for polishing." });
// //       fetchForms();
// //     } catch (error) {
// //       pushToast({
// //         title: "Generation failed",
// //         description: error.response?.data?.message || "Please verify your OpenAI key and try again.",
// //         tone: "error"
// //       });
// //     } finally {
// //       setCreating(false);
// //     }
// //   };

// //   return (
// //     <div className="space-y-10 pb-16">
// //       <section className="mesh glass overflow-hidden rounded-[2rem] p-6 shadow-neon md:p-10">
// //         <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
// //           <div>
// //             <span className="inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-100 ring-1 ring-blue-300/25">
// //               AI Google Forms Generator
// //             </span>
// //             <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight text-white md:text-6xl ">
// //               Launch beautiful, high-converting forms with AI in under a minute.
// //             </h1>
// //             <p className="mt-5 max-w-2xl text-base text-slate-300 md:text-lg ">
// //               Generate smart questions from a single prompt, add descriptions and file uploads, preview live, publish instantly, and monitor every response from one dashboard.
// //             </p>
// //             <div className="mt-8 grid gap-3 sm:grid-cols-3">
// //               {[
// //                 [Sparkles, "AI field planning"],
// //                 [ShieldCheck, "JWT cookie auth"],
// //                 [LayoutPanelTop, "Glassmorphism SaaS UI"]
// //               ].map(([Icon, label]) => (
// //                 <div key={label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
// //                   <Icon className="h-5 w-5 text-blue-200" />
// //                   <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           <div className="glass rounded-[2rem] p-5 shadow-[0_0_50px_rgba(59,130,246,0.25)] md:p-7">
// //             <div className="flex items-center gap-2 text-blue-200">
// //               <Wand2 className="h-5 w-5" />
// //               <p className="text-xs font-semibold uppercase tracking-[0.3em]">Generate a form</p>
// //             </div>
// //             <div className="mt-5 space-y-4">
// //               <Input
// //                 label="Form title"
// //                 value={generation.title}
// //                 onChange={(event) => setGeneration((current) => ({ ...current, title: event.target.value }))}
// //                 placeholder="Candidate intake application"
// //               />
// //               <Input
// //                 label="Form description"
// //                 value={generation.description}
// //                 onChange={(event) => setGeneration((current) => ({ ...current, description: event.target.value }))}
// //                 placeholder="Tell submitters what this form is for."
// //               />
// //               <Input
// //                 label="AI prompt"
// //                 as="textarea"
// //                 rows={5}
// //                 value={generation.prompt}
// //                 onChange={(event) => setGeneration((current) => ({ ...current, prompt: event.target.value }))}
// //                 placeholder="Build a hiring intake form for a creative agency with portfolio upload and availability questions."
// //               />
// //               <div>
// //                 <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
// //                   <span>Field count</span>
// //                   <span>{generation.numFields}</span>
// //                 </div>
// //                 <input
// //                   type="range"
// //                   min="3"
// //                   max="20"
// //                   value={generation.numFields}
// //                   onChange={(event) => setGeneration((current) => ({ ...current, numFields: Number(event.target.value) }))}
// //                   className="mt-3 w-full"
// //                 />
// //               </div>
// //               <div>
// //                 <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Allowed field types</p>
// //                 <div className="mt-3 flex flex-wrap gap-2">
// //                   {FIELD_TYPES.map((type) => {
// //                     const active = generation.types.includes(type);
// //                     return (
// //                       <button
// //                         key={type}
// //                         onClick={() => toggleType(type)}
// //                         className={`rounded-full px-3 py-2 text-xs font-semibold transition ${active ? "bg-blue-500 text-white shadow-glow" : "border border-white/10 bg-white/5 text-slate-200 hover:border-blue-400/50"}`}
// //                       >
// //                         {active ? <Check className="mr-1 inline h-3.5 w-3.5" /> : null}
// //                         {type.replaceAll("_", " ")}
// //                       </button>
// //                     );
// //                   })}
// //                 </div>
// //                 <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Current set: {selectedLabel || "None"}</p>
// //               </div>
// //               <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
// //                 <div>
// //                   <p className="font-semibold">Required by default</p>
// //                   <p className="text-xs text-slate-500 dark:text-slate-400">AI will make most questions mandatory.</p>
// //                 </div>
// //                 <input
// //                   type="checkbox"
// //                   checked={generation.requiredByDefault}
// //                   onChange={(event) => setGeneration((current) => ({ ...current, requiredByDefault: event.target.checked }))}
// //                 />
// //               </label>
// //               <Button className="w-full" loading={creating} onClick={handleGenerate}>
// //                 Generate form with AI
// //                 <ChevronRight className="h-4 w-4" />
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {user ? (
// //         <section className="space-y-4">
// //           {loadingForms ? (
// //             <div className="glass rounded-[2rem] p-6 text-slate-300 shadow-neon">Loading your dashboard...</div>
// //           ) : (
// //             <Dashboard
// //               forms={forms}
// //               toast={pushToast}
// //               onOpenPreview={(id) => navigate(`/preview/${id}`)}
// //               onDelete={async (id) => {
// //                 try {
// //                   await api.delete(`/forms/${id}`);
// //                   pushToast({ title: "Form deleted" });
// //                   fetchForms();
// //                 } catch (error) {
// //                   pushToast({ title: "Delete failed", description: error.response?.data?.message, tone: "error" });
// //                 }
// //               }}
// //             />
// //           )}
// //         </section>
// //       ) : null}

// //       <AdModal
// //         open={showAd}
// //         onComplete={() => {
// //           setShowAd(false);
// //           if (pendingPreviewId) {
// //             navigate(`/preview/${pendingPreviewId}`);
// //           }
// //         }}
// //       />
// //     </div>
// //   );
// // }
// // // import { useEffect, useMemo, useState } from "react";
// // // import { Check, ChevronRight, LayoutPanelTop, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
// // // import { useNavigate } from "react-router-dom";
// // // import api from "../lib/api";
// // // import { useAuth } from "../hooks/useAuth";
// // // import { useToast } from "../components/ToastProvider";
// // // import Button from "../components/ui/Button";
// // // import Input from "../components/ui/Input";
// // // import Dashboard from "../components/Dashboard";
// // // import AdModal from "../components/AdModal";

// // // const FIELD_TYPES = [
// // //   "TEXT",
// // //   "PARAGRAPH",
// // //   "MULTIPLE_CHOICE",
// // //   "DROPDOWN",
// // //   "DATE",
// // //   "EMAIL",
// // //   "NUMBER",
// // //   "FILE"
// // // ];

// // // const defaultGeneration = {
// // //   title: "",
// // //   description: "",
// // //   prompt: "general survey",
// // //   numFields: 6,
// // //   requiredByDefault: true,
// // //   types: ["TEXT", "EMAIL", "MULTIPLE_CHOICE", "FILE"]
// // // };

// // // export default function Home() {
// // //   const navigate = useNavigate();
// // //   const { user } = useAuth();
// // //   const { pushToast } = useToast();
// // //   const [generation, setGeneration] = useState(defaultGeneration);
// // //   const [creating, setCreating] = useState(false);
// // //   const [forms, setForms] = useState([]);
// // //   const [loadingForms, setLoadingForms] = useState(false);
// // //   const [pendingPreviewId, setPendingPreviewId] = useState("");
// // //   const [showAd, setShowAd] = useState(false);

// // //   const selectedLabel = useMemo(() => generation.types.join(", "), [generation.types]);

// // //   const fetchForms = async () => {
// // //     if (!user) return;
// // //     setLoadingForms(true);
// // //     try {
// // //       const { data } = await api.get("/forms/my/list");
// // //       setForms(data.forms);
// // //     } catch (error) {
// // //       pushToast({ title: "Failed to load dashboard", description: error.response?.data?.message, tone: "error" });
// // //     } finally {
// // //       setLoadingForms(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchForms();
// // //   }, [user]);

// // //   const toggleType = (type) => {
// // //     setGeneration((current) => ({
// // //       ...current,
// // //       types: current.types.includes(type)
// // //         ? current.types.filter((item) => item !== type)
// // //         : [...current.types, type]
// // //     }));
// // //   };

// // //   const handleGenerate = async () => {
// // //     if (!user) {
// // //       navigate("/login");
// // //       return;
// // //     }

// // //     if (!generation.title.trim()) {
// // //       pushToast({ title: "Form title required", description: "Add a title before generating.", tone: "error" });
// // //       return;
// // //     }

// // //     if (generation.types.length === 0) {
// // //       pushToast({ title: "Select at least one field type", tone: "error" });
// // //       return;
// // //     }

// // //     setCreating(true);
// // //     try {
// // //       const { data } = await api.post("/forms/generate-form/auth", generation);
// // //       setPendingPreviewId(data.form._id);
// // //       setShowAd(true);
// // //       pushToast({
// // //         title: "AI form generated",
// // //         description: `Generated ${data.form.fields.length} field(s) from your request.`
// // //       });
// // //       fetchForms();
// // //     } catch (error) {
// // //       pushToast({
// // //         title: "Generation failed",
// // //         description: error.response?.data?.message || "Please verify your model key and try again.",
// // //         tone: "error"
// // //       });
// // //     } finally {
// // //       setCreating(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="space-y-10 pb-16">
// // //       <section className="mesh glass overflow-hidden rounded-[2rem] p-6 shadow-neon md:p-10">
// // //         <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
// // //           <div>
// // //             <span className="inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-100 ring-1 ring-blue-300/25">
// // //               AI Google Forms Generator
// // //             </span>
// // //             <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight text-white md:text-6xl ">
// // //               Launch beautiful, high-converting forms with AI in under a minute.
// // //             </h1>
// // //             <p className="mt-5 max-w-2xl text-base text-slate-300 md:text-lg ">
// // //               Generate smart questions from a single prompt, add descriptions and file uploads, preview live, publish instantly, and monitor every response from one dashboard.
// // //             </p>
// // //             <div className="mt-8 grid gap-3 sm:grid-cols-3">
// // //               {[
// // //                 [Sparkles, "AI field planning"],
// // //                 [ShieldCheck, "JWT cookie auth"],
// // //                 [LayoutPanelTop, "Glassmorphism SaaS UI"]
// // //               ].map(([Icon, label]) => (
// // //                 <div key={label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
// // //                   <Icon className="h-5 w-5 text-blue-200" />
// // //                   <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           <div className="glass rounded-[2rem] p-5 shadow-[0_0_50px_rgba(59,130,246,0.25)] md:p-7">
// // //             <div className="flex items-center gap-2 text-blue-200">
// // //               <Wand2 className="h-5 w-5" />
// // //               <p className="text-xs font-semibold uppercase tracking-[0.3em]">Generate a form</p>
// // //             </div>
// // //             <div className="mt-5 space-y-4">
// // //               <Input
// // //                 label="Form title"
// // //                 value={generation.title}
// // //                 onChange={(event) => setGeneration((current) => ({ ...current, title: event.target.value }))}
// // //                 placeholder="Candidate intake application"
// // //               />
// // //               <Input
// // //                 label="Form description"
// // //                 value={generation.description}
// // //                 onChange={(event) => setGeneration((current) => ({ ...current, description: event.target.value }))}
// // //                 placeholder="Tell submitters what this form is for."
// // //               />
// // //               <Input
// // //                 label="AI prompt"
// // //                 as="textarea"
// // //                 rows={5}
// // //                 value={generation.prompt}
// // //                 onChange={(event) => setGeneration((current) => ({ ...current, prompt: event.target.value }))}
// // //                 placeholder="List the exact fields you want. If you explicitly list fields in the prompt, that exact list will override the slider count."
// // //               />
// // //               <div>
// // //                 <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
// // //                   <span>Field count</span>
// // //                   <span>{generation.numFields}</span>
// // //                 </div>
// // //                 <input
// // //                   type="range"
// // //                   min="1"
// // //                   max="50"
// // //                   value={generation.numFields}
// // //                   onChange={(event) => setGeneration((current) => ({ ...current, numFields: Number(event.target.value) }))}
// // //                   className="mt-3 w-full"
// // //                 />
// // //                 <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
// // //                   If your prompt explicitly lists fields, the generator will use that exact number instead of this slider.
// // //                 </p>
// // //               </div>
// // //               <div>
// // //                 <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Allowed field types</p>
// // //                 <div className="mt-3 flex flex-wrap gap-2">
// // //                   {FIELD_TYPES.map((type) => {
// // //                     const active = generation.types.includes(type);
// // //                     return (
// // //                       <button
// // //                         key={type}
// // //                         onClick={() => toggleType(type)}
// // //                         className={`rounded-full px-3 py-2 text-xs font-semibold transition ${active ? "bg-blue-500 text-white shadow-glow" : "border border-white/10 bg-white/5 text-slate-200 hover:border-blue-400/50"}`}
// // //                       >
// // //                         {active ? <Check className="mr-1 inline h-3.5 w-3.5" /> : null}
// // //                         {type.replaceAll("_", " ")}
// // //                       </button>
// // //                     );
// // //                   })}
// // //                 </div>
// // //                 <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Current set: {selectedLabel || "None"}</p>
// // //               </div>
// // //               <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
// // //                 <div>
// // //                   <p className="font-semibold">Required by default</p>
// // //                   <p className="text-xs text-slate-500 dark:text-slate-400">AI will make most questions mandatory.</p>
// // //                 </div>
// // //                 <input
// // //                   type="checkbox"
// // //                   checked={generation.requiredByDefault}
// // //                   onChange={(event) => setGeneration((current) => ({ ...current, requiredByDefault: event.target.checked }))}
// // //                 />
// // //               </label>
// // //               <Button className="w-full" loading={creating} onClick={handleGenerate}>
// // //                 Generate form with AI
// // //                 <ChevronRight className="h-4 w-4" />
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {user ? (
// // //         <section className="space-y-4">
// // //           {loadingForms ? (
// // //             <div className="glass rounded-[2rem] p-6 text-slate-300 shadow-neon">Loading your dashboard...</div>
// // //           ) : (
// // //             <Dashboard
// // //               forms={forms}
// // //               toast={pushToast}
// // //               onOpenPreview={(id) => navigate(`/preview/${id}`)}
// // //               onDelete={async (id) => {
// // //                 try {
// // //                   await api.delete(`/forms/${id}`);
// // //                   pushToast({ title: "Form deleted" });
// // //                   fetchForms();
// // //                 } catch (error) {
// // //                   pushToast({ title: "Delete failed", description: error.response?.data?.message, tone: "error" });
// // //                 }
// // //               }}
// // //             />
// // //           )}
// // //         </section>
// // //       ) : null}

// // //       <AdModal
// // //         open={showAd}
// // //         onComplete={() => {
// // //           setShowAd(false);
// // //           if (pendingPreviewId) {
// // //             navigate(`/preview/${pendingPreviewId}`);
// // //           }
// // //         }}
// // //       />
// // //     </div>
// // //   );
// // // }
// import { useEffect, useMemo, useState } from "react";
// import { Check, ChevronRight, LayoutPanelTop, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import api from "../lib/api";
// import { useAuth } from "../hooks/useAuth";
// import { useToast } from "../components/ToastProvider";
// import Button from "../components/ui/Button";
// import Input from "../components/ui/Input";
// import Dashboard from "../components/Dashboard";
// import AdModal from "../components/AdModal";

// const FIELD_TYPES = [
//   "TEXT",
//   "PARAGRAPH",
//   "MULTIPLE_CHOICE",
//   "DROPDOWN",
//   "DATE",
//   "EMAIL",
//   "NUMBER",
//   "FILE"
// ];

// const defaultGeneration = {
//   title: "",
//   description: "",
//   prompt: "general survey",
//   numFields: 10,
//   requiredByDefault: true,
//   types: ["TEXT", "EMAIL", "MULTIPLE_CHOICE", "FILE"]
// };

// export default function Home() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { pushToast } = useToast();
//   const [generation, setGeneration] = useState(defaultGeneration);
//   const [creating, setCreating] = useState(false);
//   const [forms, setForms] = useState([]);
//   const [loadingForms, setLoadingForms] = useState(false);
//   const [pendingPreviewId, setPendingPreviewId] = useState("");
//   const [showAd, setShowAd] = useState(false);

//   const selectedLabel = useMemo(() => generation.types.join(", "), [generation.types]);

//   const fetchForms = async () => {
//     if (!user) return;
//     setLoadingForms(true);
//     try {
//       const { data } = await api.get("/forms/my/list");
//       setForms(data.forms);
//     } catch (error) {
//       pushToast({
//         title: "Failed to load dashboard",
//         description: error.response?.data?.message,
//         tone: "error"
//       });
//     } finally {
//       setLoadingForms(false);
//     }
//   };

//   useEffect(() => {
//     fetchForms();
//   }, [user]);

//   const toggleType = (type) => {
//     setGeneration((current) => ({
//       ...current,
//       types: current.types.includes(type)
//         ? current.types.filter((item) => item !== type)
//         : [...current.types, type]
//     }));
//   };

//   const handleGenerate = async () => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     if (!generation.title.trim()) {
//       pushToast({
//         title: "Form title required",
//         description: "Add a title before generating.",
//         tone: "error"
//       });
//       return;
//     }

//     if (generation.types.length === 0) {
//       pushToast({ title: "Select at least one field type", tone: "error" });
//       return;
//     }

//     setCreating(true);
//     try {
//       const { data } = await api.post("/forms/generate-form/auth", generation);
//       setPendingPreviewId(data.form._id);
//       setShowAd(true);
//       pushToast({
//         title: "AI form generated",
//         description: `Generated ${data.form.fields.length} field(s).`
//       });
//       fetchForms();
//     } catch (error) {
//       pushToast({
//         title: "Generation failed",
//         description: error.response?.data?.message || "Please verify your model setup and try again.",
//         tone: "error"
//       });
//     } finally {
//       setCreating(false);
//     }
//   };

//   return (
//     <div className="space-y-10 pb-16">
//       <section className="mesh glass overflow-hidden rounded-[2rem] p-6 shadow-neon md:p-10">
//         <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
//           <div>
//             <span className="inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-100 ring-1 ring-blue-300/25">
//               AI Google Forms Generator
//             </span>
//             <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
//               Launch beautiful, high-converting forms with AI in under a minute.
//             </h1>
//             <p className="mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
//               Generate smart questions from a single prompt, add descriptions and file uploads, preview live, publish instantly, and monitor every response from one dashboard.
//             </p>
//             <div className="mt-8 grid gap-3 sm:grid-cols-3">
//               {[
//                 [Sparkles, "AI field planning"],
//                 [ShieldCheck, "JWT cookie auth"],
//                 [LayoutPanelTop, "Glassmorphism SaaS UI"]
//               ].map(([Icon, label]) => (
//                 <div key={label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
//                   <Icon className="h-5 w-5 text-blue-200" />
//                   <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="glass rounded-[2rem] p-5 shadow-[0_0_50px_rgba(59,130,246,0.25)] md:p-7">
//             <div className="flex items-center gap-2 text-blue-200">
//               <Wand2 className="h-5 w-5" />
//               <p className="text-xs font-semibold uppercase tracking-[0.3em]">Generate a form</p>
//             </div>

//             <div className="mt-5 space-y-4">
//               <Input
//                 label="Form title"
//                 value={generation.title}
//                 onChange={(event) => setGeneration((current) => ({ ...current, title: event.target.value }))}
//                 placeholder="Candidate intake application"
//               />
//               <Input
//                 label="Form description"
//                 value={generation.description}
//                 onChange={(event) => setGeneration((current) => ({ ...current, description: event.target.value }))}
//                 placeholder="Tell submitters what this form is for."
//               />
//               <Input
//                 label="AI prompt"
//                 as="textarea"
//                 rows={5}
//                 value={generation.prompt}
//                 onChange={(event) => setGeneration((current) => ({ ...current, prompt: event.target.value }))}
//                 placeholder="List exact fields if you want exact field count. Example: Create a form with fields for full name, email, phone, resume upload..."
//               />

//               <div>
//                 <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
//                   <span>Field count</span>
//                   <span>{generation.numFields}</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="1"
//                   max="100"
//                   value={generation.numFields}
//                   onChange={(event) =>
//                     setGeneration((current) => ({
//                       ...current,
//                       numFields: Number(event.target.value)
//                     }))
//                   }
//                   className="mt-3 w-full"
//                 />
//                 <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
//                   Explicit field list in prompt overrides this slider. Generic prompt uses this slider.
//                 </p>
//               </div>

//               <div>
//                 <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Allowed field types</p>
//                 <div className="mt-3 flex flex-wrap gap-2">
//                   {FIELD_TYPES.map((type) => {
//                     const active = generation.types.includes(type);
//                     return (
//                       <button
//                         key={type}
//                         onClick={() => toggleType(type)}
//                         className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
//                           active
//                             ? "bg-blue-500 text-white shadow-glow"
//                             : "border border-white/10 bg-white/5 text-slate-200 hover:border-blue-400/50"
//                         }`}
//                       >
//                         {active ? <Check className="mr-1 inline h-3.5 w-3.5" /> : null}
//                         {type.replaceAll("_", " ")}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
//                   Current set: {selectedLabel || "None"}
//                 </p>
//               </div>

//               <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
//                 <div>
//                   <p className="font-semibold">Required by default</p>
//                   <p className="text-xs text-slate-500 dark:text-slate-400">
//                     AI will make most questions mandatory.
//                   </p>
//                 </div>
//                 <input
//                   type="checkbox"
//                   checked={generation.requiredByDefault}
//                   onChange={(event) =>
//                     setGeneration((current) => ({
//                       ...current,
//                       requiredByDefault: event.target.checked
//                     }))
//                   }
//                 />
//               </label>

//               <Button className="w-full" loading={creating} onClick={handleGenerate}>
//                 Generate form with AI
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {user ? (
//         <section className="space-y-4">
//           {loadingForms ? (
//             <div className="glass rounded-[2rem] p-6 text-slate-300 shadow-neon">
//               Loading your dashboard...
//             </div>
//           ) : (
//             <Dashboard
//               forms={forms}
//               toast={pushToast}
//               onOpenPreview={(id) => navigate(`/preview/${id}`)}
//               onDelete={async (id) => {
//                 try {
//                   await api.delete(`/forms/${id}`);
//                   pushToast({ title: "Form deleted" });
//                   fetchForms();
//                 } catch (error) {
//                   pushToast({
//                     title: "Delete failed",
//                     description: error.response?.data?.message,
//                     tone: "error"
//                   });
//                 }
//               }}
//             />
//           )}
//         </section>
//       ) : null}

//       <AdModal
//         open={showAd}
//         onComplete={() => {
//           setShowAd(false);
//           if (pendingPreviewId) {
//             navigate(`/preview/${pendingPreviewId}`);
//           }
//         }}
//       />
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, LayoutPanelTop, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ToastProvider";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Dashboard from "../components/Dashboard";
import AdModal from "../components/AdModal";

const FIELD_TYPES = [
  "TEXT",
  "PARAGRAPH",
  "MULTIPLE_CHOICE",
  "DROPDOWN",
  "DATE",
  "EMAIL",
  "URL",
  "NUMBER",
  "FILE",
  "CHECKBOX_GROUP",
  "LINEAR_SCALE",
  "PAGE_BREAK"
];

const defaultGeneration = {
  title: "",
  description: "",
  prompt: "",
  numFields: 10,
  requiredByDefault: true,
  types: ["TEXT", "EMAIL","URL", "MULTIPLE_CHOICE", "CHECKBOX_GROUP", "LINEAR_SCALE", "FILE"]
};

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [generation, setGeneration] = useState(defaultGeneration);
  const [creating, setCreating] = useState(false);
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [pendingPreviewId, setPendingPreviewId] = useState("");
  const [showAd, setShowAd] = useState(false);

  const selectedLabel = useMemo(() => generation.types.join(", "), [generation.types]);

  const fetchForms = async () => {
    if (!user) return;
    setLoadingForms(true);
    try {
      const { data } = await api.get("/forms/my/list");
      setForms(data.forms);
    } catch (error) {
      pushToast({
        title: "Failed to load dashboard",
        description: error.response?.data?.message,
        tone: "error"
      });
    } finally {
      setLoadingForms(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [user]);

  const toggleType = (type) => {
    setGeneration((current) => ({
      ...current,
      types: current.types.includes(type)
        ? current.types.filter((item) => item !== type)
        : [...current.types, type]
    }));
  };

  const handleGenerate = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!generation.title.trim()) {
      pushToast({
        title: "Form title required",
        description: "Add a title before generating.",
        tone: "error"
      });
      return;
    }

    if (generation.types.length === 0) {
      pushToast({ title: "Select at least one field type", tone: "error" });
      return;
    }

    setCreating(true);
    try {
      const { data } = await api.post("/forms/generate-form/auth", generation);
      setPendingPreviewId(data.form._id);
      setShowAd(true);
      pushToast({
        title: "AI form generated",
        description: `Generated ${data.form.fields.length} field(s).`
      });
      fetchForms();
    } catch (error) {
      pushToast({
        title: "Generation failed",
        description: error.response?.data?.message || "Please verify your model setup and try again.",
        tone: "error"
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      <section className="mesh glass overflow-hidden rounded-[2rem] p-6 shadow-neon md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-100 ring-1 ring-blue-300/25">
              AI Google Forms Generator
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Launch beautiful, high-converting forms with AI in under a minute.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
              Generate smart questions from a single prompt, add descriptions and file uploads, preview live, publish instantly, and monitor every response from one dashboard.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                [Sparkles, "AI field planning"],
                [ShieldCheck, "JWT cookie auth"],
                [LayoutPanelTop, "Glassmorphism SaaS UI"]
              ].map(([Icon, label]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                  <Icon className="h-5 w-5 text-blue-200" />
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2rem] p-5 shadow-[0_0_50px_rgba(59,130,246,0.25)] md:p-7">
            <div className="flex items-center gap-2 text-blue-200">
              <Wand2 className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">Generate a form</p>
            </div>

            <div className="mt-5 space-y-4">
              <Input
                label="Form title"
                value={generation.title}
                onChange={(event) => setGeneration((current) => ({ ...current, title: event.target.value }))}
                placeholder="Candidate intake application"
              />
              <Input
                label="Form description"
                value={generation.description}
                onChange={(event) => setGeneration((current) => ({ ...current, description: event.target.value }))}
                placeholder="Tell submitters what this form is for."
              />
              <Input
                label="AI prompt"
                as="textarea"
                rows={5}
                value={generation.prompt}
                onChange={(event) => setGeneration((current) => ({ ...current, prompt: event.target.value }))}
                placeholder="List exact fields if you want exact field count."
              />

              <div>
                <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
                  <span>Field count</span>
                  <span>{generation.numFields}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={generation.numFields}
                  onChange={(event) =>
                    setGeneration((current) => ({
                      ...current,
                      numFields: Number(event.target.value)
                    }))
                  }
                  className="mt-3 w-full"
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Explicit field list in prompt overrides this slider. Generic prompt uses this slider.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Allowed field types</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FIELD_TYPES.map((type) => {
                    const active = generation.types.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                          active
                            ? "bg-blue-500 text-white shadow-glow"
                            : "border border-white/10 bg-white/5 text-slate-200 hover:border-blue-400/50"
                        }`}
                      >
                        {active ? <Check className="mr-1 inline h-3.5 w-3.5" /> : null}
                        {type.replaceAll("_", " ")}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Current set: {selectedLabel || "None"}
                </p>
              </div>

              <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                <div>
                  <p className="font-semibold">Required by default</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    AI will make most questions mandatory.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={generation.requiredByDefault}
                  onChange={(event) =>
                    setGeneration((current) => ({
                      ...current,
                      requiredByDefault: event.target.checked
                    }))
                  }
                />
              </label>

              <Button className="w-full" loading={creating} onClick={handleGenerate}>
                Generate form with AI
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {user ? (
        <section className="space-y-4">
          {loadingForms ? (
            <div className="glass rounded-[2rem] p-6 text-slate-300 shadow-neon">
              Loading your dashboard...
            </div>
          ) : (
            <Dashboard
              forms={forms}
              toast={pushToast}
              onOpenPreview={(id) => navigate(`/preview/${id}`)}
              onDelete={async (id) => {
                try {
                  await api.delete(`/forms/${id}`);
                  pushToast({ title: "Form deleted" });
                  fetchForms();
                } catch (error) {
                  pushToast({
                    title: "Delete failed",
                    description: error.response?.data?.message,
                    tone: "error"
                  });
                }
              }}
            />
          )}
        </section>
      ) : null}

      <AdModal
        open={showAd}
        onComplete={() => {
          setShowAd(false);
          if (pendingPreviewId) {
            navigate(`/preview/${pendingPreviewId}`);
          }
        }}
      />
    </div>
  );
}
