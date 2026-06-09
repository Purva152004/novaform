
// import { useMemo, useState } from "react";
// import { Download, ExternalLink, Files, LayoutDashboard, MessagesSquare, Trash2 } from "lucide-react";
// import Button from "./ui/Button";
// import { copyToClipboard, downloadBlob, formatDate } from "../lib/utils";

// const toCsvValue = (value) => {
//   const text = String(value ?? "");
//   return `"${text.replace(/"/g, '""')}"`;
// };

// export default function Dashboard({ forms, onDelete, onOpenPreview, toast }) {
//   const [activeFormId, setActiveFormId] = useState(forms[0]?._id || "");
//   const activeForm = useMemo(
//     () => forms.find((form) => form._id === activeFormId) || forms[0] || null,
//     [forms, activeFormId]
//   );

//   const exportCsv = () => {
//     if (!activeForm) return;

//     const headers = ["submittedAt", ...activeForm.fields.map((f) => f.title)];
//     const rows = activeForm.responses.map((response) => {
//       const values = [response.submittedAt];
//       activeForm.fields.forEach((field) => {
//         const value = response.answers?.[field.id];
//         values.push(Array.isArray(value) ? value.map((item) => item.name || item).join(" | ") : value ?? "");
//       });
//       return values;
//     });

//     const csv = [
//       headers.map(toCsvValue).join(","),
//       ...rows.map((row) => row.map(toCsvValue).join(","))
//     ].join("\n");

//     downloadBlob(
//       `${activeForm.title.replace(/\s+/g, "-").toLowerCase()}-responses.csv`,
//       csv,
//       "text/csv;charset=utf-8"
//     );
//     toast({ title: "CSV exported", description: `${rows.length} responses downloaded.` });
//   };

//   if (!forms.length) {
//     return (
//       <div className="glass rounded-[2rem] p-6 shadow-neon">
//         <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Dashboard</p>
//         <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">No forms yet</h2>
//         <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
//           Generate your first AI form from the home screen to unlock analytics and CSV exports.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
//       <div className="glass rounded-[2rem] p-5 shadow-neon">
//         <div className="flex items-center gap-3">
//           <LayoutDashboard className="h-5 w-5 text-blue-200" />
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Dashboard</p>
//             <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Your forms</h2>
//           </div>
//         </div>
//         <div className="mt-5 space-y-3">
//           {forms.map((form) => (
//             <button
//               key={form._id}
//               onClick={() => setActiveFormId(form._id)}
//               className={`w-full rounded-2xl border p-4 text-left transition ${
//                 activeForm?._id === form._id
//                   ? "border-blue-400/60 bg-blue-500/10"
//                   : "border-slate-200 bg-white/80 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
//               }`}
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <p className="font-semibold text-slate-900 dark:text-white">{form.title}</p>
//                   <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//                     {form.responses.length} responses • {form.fields.length} fields
//                   </p>
//                 </div>
//                 <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-blue-100">
//                   Live
//                 </span>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {activeForm ? (
//         <div className="space-y-6">
//           <div className="glass rounded-[2rem] p-6 shadow-neon">
//             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Insights</p>
//                 <h3 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{activeForm.title}</h3>
//                 <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
//                   {activeForm.description || "No form description added yet."}
//                 </p>
//               </div>
//               <div className="flex flex-wrap gap-3">
//                 <Button variant="secondary" onClick={() => onOpenPreview(activeForm._id)}>
//                   <Files className="h-4 w-4" />
//                   Open preview
//                 </Button>
//                 <Button
//                   variant="secondary"
//                   onClick={async () => {
//                     const url = `${window.location.origin}/form/${activeForm._id}`;
//                     await copyToClipboard(url);
//                     toast({ title: "Public link copied", description: url });
//                   }}
//                 >
//                   <ExternalLink className="h-4 w-4" />
//                   Copy public link
//                 </Button>
//                 <Button onClick={exportCsv}>
//                   <Download className="h-4 w-4" />
//                   Export CSV
//                 </Button>
//                 <Button variant="secondary" className="text-rose-200" onClick={() => onDelete(activeForm._id)}>
//                   <Trash2 className="h-4 w-4" />
//                   Delete
//                 </Button>
//               </div>
//             </div>

//             <div className="mt-6 grid gap-4 md:grid-cols-3">
//               <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
//                 <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Responses</p>
//                 <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{activeForm.responses.length}</p>
//               </div>
//               <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
//                 <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fields</p>
//                 <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{activeForm.fields.length}</p>
//               </div>
//               <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
//                 <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Latest update</p>
//                 <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{formatDate(activeForm.updatedAt)}</p>
//               </div>
//             </div>
//           </div>

//           <div className="glass overflow-hidden rounded-[2rem] shadow-neon">
//             <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-white/10">
//               <MessagesSquare className="h-5 w-5 text-blue-200" />
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Responses Table</p>
//                 <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Recent submissions</h3>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-white/10">
//                 <thead className="bg-slate-100 dark:bg-white/5">
//                   <tr>
//                     <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Submitted</th>
//                     {activeForm.fields.map((field) => (
//                       <th key={field.id} className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
//                         {field.title}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-200 dark:divide-white/10">
//                   {activeForm.responses.length ? (
//                     activeForm.responses.map((response) => (
//                       <tr key={response._id} className="align-top">
//                         <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(response.submittedAt)}</td>
//                         {activeForm.fields.map((field) => {
//                           const value = response.answers?.[field.id];
//                           return (
//                             <td key={`${response._id}-${field.id}`} className="px-4 py-3 text-slate-700 dark:text-slate-200">
//                               {Array.isArray(value) ? (
//                                 <div className="space-y-2">
//                                   {value.map((file, index) => (
//                                     <a
//                                       key={`${file.name}-${index}`}
//                                       href={file.url || "#"}
//                                       target="_blank"
//                                       rel="noreferrer"
//                                       download={file.name}
//                                       className="block text-blue-600 underline-offset-4 hover:underline dark:text-blue-200"
//                                     >
//                                       {file.name || String(file)}
//                                     </a>
//                                   ))}
//                                 </div>
//                               ) : (
//                                 String(value ?? "-")
//                               )}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={activeForm.fields.length + 1} className="px-4 py-8 text-center text-slate-400">
//                         No submissions yet. Share the public form link to start collecting responses.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }
// // import { useMemo, useState } from "react";
// // import { Download, ExternalLink, Files, LayoutDashboard, LockKeyhole, MessagesSquare, Repeat, Trash2 } from "lucide-react";
// // import Button from "./ui/Button";
// // import { copyToClipboard, downloadBlob, formatDate } from "../lib/utils";

// // const toCsvValue = (value) => {
// //   const text = String(value ?? "");
// //   return `"${text.replace(/"/g, '""')}"`;
// // };

// // const ResponseModeBadge = ({ allowMultipleResponses, compact = false }) => {
// //   const single = allowMultipleResponses === false;

// //   return (
// //     <span
// //       className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-semibold uppercase tracking-[0.2em] ${
// //         compact ? "text-[10px]" : "text-[11px]"
// //       } ${
// //         single
// //           ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
// //           : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
// //       }`}
// //     >
// //       {single ? <LockKeyhole className="h-3.5 w-3.5" /> : <Repeat className="h-3.5 w-3.5" />}
// //       {single ? "Single response" : "Multiple responses"}
// //     </span>
// //   );
// // };

// // export default function Dashboard({ forms, onDelete, onOpenPreview, toast }) {
// //   const [activeFormId, setActiveFormId] = useState(forms[0]?._id || "");
// //   const activeForm = useMemo(
// //     () => forms.find((form) => form._id === activeFormId) || forms[0] || null,
// //     [forms, activeFormId]
// //   );

// //   const exportCsv = () => {
// //     if (!activeForm) return;

// //     const headers = ["submittedAt", ...activeForm.fields.map((f) => f.title)];
// //     const rows = activeForm.responses.map((response) => {
// //       const values = [response.submittedAt];
// //       activeForm.fields.forEach((field) => {
// //         const value = response.answers?.[field.id];
// //         values.push(Array.isArray(value) ? value.map((item) => item.name || item).join(" | ") : value ?? "");
// //       });
// //       return values;
// //     });

// //     const csv = [
// //       headers.map(toCsvValue).join(","),
// //       ...rows.map((row) => row.map(toCsvValue).join(","))
// //     ].join("\n");

// //     downloadBlob(
// //       `${activeForm.title.replace(/\s+/g, "-").toLowerCase()}-responses.csv`,
// //       csv,
// //       "text/csv;charset=utf-8"
// //     );
// //     toast({ title: "CSV exported", description: `${rows.length} responses downloaded.` });
// //   };

// //   if (!forms.length) {
// //     return (
// //       <div className="glass rounded-[2rem] p-6 shadow-neon">
// //         <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Dashboard</p>
// //         <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">No forms yet</h2>
// //         <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
// //           Generate your first AI form from the home screen to unlock analytics and CSV exports.
// //         </p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
// //       <div className="glass rounded-[2rem] p-5 shadow-neon">
// //         <div className="flex items-center gap-3">
// //           <LayoutDashboard className="h-5 w-5 text-blue-200" />
// //           <div>
// //             <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Dashboard</p>
// //             <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Your forms</h2>
// //           </div>
// //         </div>

// //         <div className="mt-5 space-y-3">
// //           {forms.map((form) => (
// //             <button
// //               key={form._id}
// //               onClick={() => setActiveFormId(form._id)}
// //               className={`w-full rounded-2xl border p-4 text-left transition ${
// //                 activeForm?._id === form._id
// //                   ? "border-blue-400/60 bg-blue-500/10"
// //                   : "border-slate-200 bg-white/80 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
// //               }`}
// //             >
// //               <div className="flex items-start justify-between gap-3">
// //                 <div className="min-w-0">
// //                   <p className="truncate font-semibold text-slate-900 dark:text-white">{form.title}</p>
// //                   <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
// //                     {form.responses.length} responses • {form.fields.length} fields
// //                   </p>
// //                   <div className="mt-3">
// //                     <ResponseModeBadge allowMultipleResponses={form.allowMultipleResponses} compact />
// //                   </div>
// //                 </div>
// //                 <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-blue-100">
// //                   Live
// //                 </span>
// //               </div>
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {activeForm ? (
// //         <div className="space-y-6">
// //           <div className="glass rounded-[2rem] p-6 shadow-neon">
// //             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
// //               <div>
// //                 <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Insights</p>
// //                 <h3 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{activeForm.title}</h3>
// //                 <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
// //                   {activeForm.description || "No form description added yet."}
// //                 </p>
// //                 <div className="mt-4">
// //                   <ResponseModeBadge allowMultipleResponses={activeForm.allowMultipleResponses} />
// //                 </div>
// //               </div>

// //               <div className="flex flex-wrap gap-3">
// //                 <Button variant="secondary" onClick={() => onOpenPreview(activeForm._id)}>
// //                   <Files className="h-4 w-4" />
// //                   Open preview
// //                 </Button>
// //                 <Button
// //                   variant="secondary"
// //                   onClick={async () => {
// //                     const url = `${window.location.origin}/form/${activeForm._id}`;
// //                     await copyToClipboard(url);
// //                     toast({ title: "Public link copied", description: url });
// //                   }}
// //                 >
// //                   <ExternalLink className="h-4 w-4" />
// //                   Copy public link
// //                 </Button>
// //                 <Button onClick={exportCsv}>
// //                   <Download className="h-4 w-4" />
// //                   Export CSV
// //                 </Button>
// //                 <Button variant="secondary" className="text-rose-200" onClick={() => onDelete(activeForm._id)}>
// //                   <Trash2 className="h-4 w-4" />
// //                   Delete
// //                 </Button>
// //               </div>
// //             </div>

// //             <div className="mt-6 grid gap-4 md:grid-cols-3">
// //               <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
// //                 <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Responses</p>
// //                 <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{activeForm.responses.length}</p>
// //               </div>
// //               <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
// //                 <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fields</p>
// //                 <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{activeForm.fields.length}</p>
// //               </div>
// //               <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
// //                 <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Latest update</p>
// //                 <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{formatDate(activeForm.updatedAt)}</p>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="glass overflow-hidden rounded-[2rem] shadow-neon">
// //             <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-white/10">
// //               <MessagesSquare className="h-5 w-5 text-blue-200" />
// //               <div>
// //                 <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Responses Table</p>
// //                 <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Recent submissions</h3>
// //               </div>
// //             </div>

// //             <div className="overflow-x-auto">
// //               <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-white/10">
// //                 <thead className="bg-slate-100 dark:bg-white/5">
// //                   <tr>
// //                     <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Submitted</th>
// //                     {activeForm.fields.map((field) => (
// //                       <th key={field.id} className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
// //                         {field.title}
// //                       </th>
// //                     ))}
// //                   </tr>
// //                 </thead>

// //                 <tbody className="divide-y divide-slate-200 dark:divide-white/10">
// //                   {activeForm.responses.length ? (
// //                     activeForm.responses.map((response) => (
// //                       <tr key={response._id} className="align-top">
// //                         <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(response.submittedAt)}</td>
// //                         {activeForm.fields.map((field) => {
// //                           const value = response.answers?.[field.id];
// //                           return (
// //                             <td key={`${response._id}-${field.id}`} className="px-4 py-3 text-slate-700 dark:text-slate-200">
// //                               {Array.isArray(value) ? (
// //                                 <div className="space-y-2">
// //                                   {value.map((file, index) => (
// //                                     <a
// //                                       key={`${file.name}-${index}`}
// //                                       href={file.url || "#"}
// //                                       target="_blank"
// //                                       rel="noreferrer"
// //                                       download={file.name}
// //                                       className="block text-blue-600 underline-offset-4 hover:underline dark:text-blue-200"
// //                                     >
// //                                       {file.name || String(file)}
// //                                     </a>
// //                                   ))}
// //                                 </div>
// //                               ) : (
// //                                 String(value ?? "-")
// //                               )}
// //                             </td>
// //                           );
// //                         })}
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>
// //                       <td colSpan={activeForm.fields.length + 1} className="px-4 py-8 text-center text-slate-400">
// //                         No submissions yet. Share the public form link to start collecting responses.
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>
// //       ) : null}
// //     </div>
// //   );
// // }
import { useMemo, useState } from "react";
import {
  Download,
  ExternalLink,
  Files,
  LayoutDashboard,
  LockKeyhole,
  MessagesSquare,
  Repeat,
  Trash2
} from "lucide-react";
import Button from "./ui/Button";
import { copyToClipboard, downloadBlob, formatDate } from "../lib/utils";

const toCsvValue = (value) => {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
};

const ResponseModeBadge = ({ allowMultipleResponses, compact = false }) => {
  const single = allowMultipleResponses === false;

  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 font-semibold uppercase tracking-[0.2em] ${
        compact ? "text-[10px]" : "text-[11px]"
      } ${
        single
          ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
          : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
      }`}
    >
      {single ? <LockKeyhole className="h-3.5 w-3.5 shrink-0" /> : <Repeat className="h-3.5 w-3.5 shrink-0" />}
      <span className="truncate">{single ? "Single response" : "Multiple responses"}</span>
    </span>
  );
};

export default function Dashboard({ forms, onDelete, onOpenPreview, toast }) {
  const [activeFormId, setActiveFormId] = useState(forms[0]?._id || "");

  const activeForm = useMemo(
    () => forms.find((form) => form._id === activeFormId) || forms[0] || null,
    [forms, activeFormId]
  );

  const exportCsv = () => {
    if (!activeForm) return;

    const headers = ["submittedAt", ...activeForm.fields.map((f) => f.title)];
    const rows = activeForm.responses.map((response) => {
      const values = [response.submittedAt];
      activeForm.fields.forEach((field) => {
        const value = response.answers?.[field.id];
        values.push(
          Array.isArray(value) ? value.map((item) => item.name || item).join(" | ") : value ?? ""
        );
      });
      return values;
    });

    const csv = [
      headers.map(toCsvValue).join(","),
      ...rows.map((row) => row.map(toCsvValue).join(","))
    ].join("\n");

    downloadBlob(
      `${activeForm.title.replace(/\s+/g, "-").toLowerCase()}-responses.csv`,
      csv,
      "text/csv;charset=utf-8"
    );

    toast({
      title: "CSV exported",
      description: `${rows.length} responses downloaded.`
    });
  };

  if (!forms.length) {
    return (
      <div className="glass rounded-[2rem] p-6 shadow-neon">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Dashboard</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
          No forms yet
        </h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Generate your first AI form from the home screen to unlock analytics and CSV exports.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[340px,minmax(0,1fr)]">
      <div className="min-w-0">
        <div className="glass rounded-[2rem] p-5 shadow-neon">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 shrink-0 text-blue-200" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                Dashboard
              </p>
              <h2 className="truncate font-display text-2xl font-bold text-slate-900 dark:text-white">
                Your forms
              </h2>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {forms.map((form) => (
              <button
                key={form._id}
                onClick={() => setActiveFormId(form._id)}
                className={`w-full rounded-[1.6rem] border p-5 text-left transition ${
                  activeForm?._id === form._id
                    ? "border-blue-400/60 bg-blue-500/10 shadow-[0_0_0_1px_rgba(96,165,250,0.15)]"
                    : "border-slate-200 bg-white/80 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-semibold text-slate-900 dark:text-white">
                      {form.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {form.responses.length} responses • {form.fields.length} fields
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-blue-100">
                    Live
                  </span>
                </div>

                <div className="mt-4">
                  <ResponseModeBadge allowMultipleResponses={form.allowMultipleResponses} compact />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeForm ? (
        <div className="min-w-0 space-y-6">
          <div className="glass rounded-[2rem] p-6 shadow-neon md:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                  Insights
                </p>
                <h3 className="mt-3 break-words font-display text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl">
                  {activeForm.title}
                </h3>
                <p className="mt-3 break-words text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {activeForm.description || "No form description added yet."}
                </p>
                <div className="mt-5">
                  <ResponseModeBadge allowMultipleResponses={activeForm.allowMultipleResponses} />
                </div>
              </div>

              <div className="flex w-full flex-wrap gap-3 xl:w-auto xl:justify-end">
                <Button variant="secondary" onClick={() => onOpenPreview(activeForm._id)}>
                  <Files className="h-4 w-4" />
                  Open preview
                </Button>

                <Button
                  variant="secondary"
                  onClick={async () => {
                    const url = `${window.location.origin}/form/${activeForm._id}`;
                    await copyToClipboard(url);
                    toast({ title: "Public link copied", description: url });
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Copy public link
                </Button>

                <Button onClick={exportCsv}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>

                <Button
                  variant="secondary"
                  className="text-rose-200"
                  onClick={() => onDelete(activeForm._id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="min-w-0 rounded-[1.6rem] border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Responses</p>
                <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
                  {activeForm.responses.length}
                </p>
              </div>

              <div className="min-w-0 rounded-[1.6rem] border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fields</p>
                <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
                  {activeForm.fields.length}
                </p>
              </div>

              <div className="min-w-0 rounded-[1.6rem] border border-slate-200 bg-white/80 p-5 sm:col-span-2 xl:col-span-1 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Latest update</p>
                <p className="mt-3 break-words text-base font-semibold text-slate-900 dark:text-white">
                  {formatDate(activeForm.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass overflow-hidden rounded-[2rem] shadow-neon">
            <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-white/10">
              <MessagesSquare className="h-5 w-5 shrink-0 text-blue-200" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                  Responses Table
                </p>
                <h3 className="truncate font-display text-xl font-bold text-slate-900 dark:text-white">
                  Recent submissions
                </h3>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="min-w-max w-full divide-y divide-slate-200 text-left text-sm dark:divide-white/10">
                <thead className="bg-slate-100 dark:bg-white/5">
                  <tr>
                    <th className="sticky left-0 z-10 min-w-[180px] bg-slate-100 px-5 py-4 font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200">
                      Submitted
                    </th>
                    {activeForm.fields.map((field) => (
                      <th
                        key={field.id}
                        className="min-w-[180px] px-5 py-4 font-semibold leading-6 text-slate-700 dark:text-slate-200"
                      >
                        <div className="break-words">{field.title}</div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {activeForm.responses.length ? (
                    activeForm.responses.map((response) => (
                      <tr key={response._id} className="align-top">
                        <td className="sticky left-0 z-[1] min-w-[180px] bg-white/90 px-5 py-4 text-slate-600 backdrop-blur-sm dark:bg-slate-900/80 dark:text-slate-300">
                          {formatDate(response.submittedAt)}
                        </td>

                        {activeForm.fields.map((field) => {
                          const value = response.answers?.[field.id];

                          return (
                            <td
                              key={`${response._id}-${field.id}`}
                              className="min-w-[180px] px-5 py-4 text-slate-700 dark:text-slate-200"
                            >
                              {Array.isArray(value) ? (
                                <div className="space-y-2">
                                  {value.map((file, index) => (
                                    <a
                                      key={`${file.name}-${index}`}
                                      href={file.url || "#"}
                                      target="_blank"
                                      rel="noreferrer"
                                      download={file.name}
                                      className="block break-words text-blue-600 underline-offset-4 hover:underline dark:text-blue-200"
                                    >
                                      {file.name || String(file)}
                                    </a>
                                  ))}
                                </div>
                              ) : (
                                <div className="break-words whitespace-pre-wrap">
                                  {String(value ?? "-")}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={activeForm.fields.length + 1}
                        className="px-5 py-10 text-center text-slate-400"
                      >
                        No submissions yet. Share the public form link to start collecting responses.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
