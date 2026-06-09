// // // // // import Button from "./ui/Button";

// // // // // export default function FormRenderer({ form, onSubmit }) {
// // // // //   return (
// // // // //     <form onSubmit={onSubmit} className="space-y-4">
// // // // //       {form.fields.map((f, i) => (
// // // // //         <div key={i}>
// // // // //           <label className="block text-white">{f.label}</label>
// // // // //           {f.type === "textarea" ? (
// // // // //             <textarea className="w-full p-2" required={f.required} />
// // // // //           ) : (
// // // // //             <input
// // // // //               type={f.type}
// // // // //               className="w-full p-2"
// // // // //               required={f.required}
// // // // //             />
// // // // //           )}
// // // // //         </div>
// // // // //       ))}
// // // // //       <Button type="submit">Submit</Button>
// // // // //     </form>
// // // // //   );
// // // // // }
// // // // import { useMemo, useState } from "react";
// // // // import Button from "./ui/Button";
// // // // import Input from "./ui/Input";
// // // // import api from "../lib/api";

// // // // async function uploadSingleFile(file, field) {
// // // //   const formData = new FormData();
// // // //   formData.append("file", file);
// // // //   formData.append("acceptList", JSON.stringify(field.accept || []));
// // // //   formData.append("maxSizeMB", String(field.maxSizeMB || 4));

// // // //   const { data } = await api.post("/responses/upload", formData, {
// // // //     headers: { "Content-Type": "multipart/form-data" }
// // // //   });

// // // //   return data.file;
// // // // }

// // // // export default function FormRenderer({ form, onSubmit, livePreview = false }) {
// // // //   const [submitting, setSubmitting] = useState(false);
// // // //   const [uploadingMap, setUploadingMap] = useState({});
// // // //   const [values, setValues] = useState({});
// // // //   const [error, setError] = useState("");
// // // //   const fields = useMemo(() => form?.fields || [], [form?.fields]);

// // // //   const isUploading = Object.values(uploadingMap).some(Boolean);

// // // //   const updateValue = (fieldId, value) => {
// // // //     setValues((current) => ({ ...current, [fieldId]: value }));
// // // //   };

// // // //   const handleFileUpload = async (event, field) => {
// // // //     const files = Array.from(event.target.files || []);
// // // //     if (!files.length) {
// // // //       updateValue(field.id, []);
// // // //       return;
// // // //     }

// // // //     setUploadingMap((current) => ({ ...current, [field.id]: true }));
// // // //     setError("");

// // // //     try {
// // // //       const capped = files.slice(0, field.maxFiles || 1);
// // // //       const uploaded = await Promise.all(capped.map((file) => uploadSingleFile(file, field)));
// // // //       updateValue(field.id, uploaded);
// // // //     } catch (uploadError) {
// // // //       updateValue(field.id, []);
// // // //       setError(uploadError?.response?.data?.message || "File upload failed.");
// // // //     } finally {
// // // //       setUploadingMap((current) => ({ ...current, [field.id]: false }));
// // // //     }
// // // //   };

// // // //   const handleSubmit = async (event) => {
// // // //     event.preventDefault();
// // // //     if (!onSubmit || isUploading) return;

// // // //     setSubmitting(true);
// // // //     setError("");

// // // //     try {
// // // //       await onSubmit(values);
// // // //       if (!livePreview) {
// // // //         setValues({});
// // // //         event.target.reset();
// // // //       }
// // // //     } catch (submitError) {
// // // //       setError(submitError?.response?.data?.message || submitError?.message || "Unable to submit form.");
// // // //     } finally {
// // // //       setSubmitting(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="glass rounded-[2rem] p-5 shadow-neon md:p-7">
// // // //       <div className="mb-6">
// // // //         <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Live Form</p>
// // // //         <h3 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">{form.title}</h3>
// // // //         {form.description ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{form.description}</p> : null}
// // // //       </div>
// // // //       <form className="space-y-5" onSubmit={handleSubmit}>
// // // //         {fields.map((field) => (
// // // //           <div key={field.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
// // // //             <div className="mb-3">
// // // //               <label className="text-sm font-semibold text-slate-900 dark:text-white">
// // // //                 {field.title}
// // // //                 {field.required ? <span className="ml-1 text-blue-300">*</span> : null}
// // // //               </label>
// // // //               {field.description ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{field.description}</p> : null}
// // // //             </div>

// // // //             {field.type === "TEXT" && (
// // // //               <Input
// // // //                 placeholder={field.placeholder}
// // // //                 required={field.required}
// // // //                 value={values[field.id] || ""}
// // // //                 onChange={(event) => updateValue(field.id, event.target.value)}
// // // //               />
// // // //             )}

// // // //             {field.type === "EMAIL" && (
// // // //               <Input
// // // //                 type="email"
// // // //                 placeholder={field.placeholder || "name@company.com"}
// // // //                 required={field.required}
// // // //                 value={values[field.id] || ""}
// // // //                 onChange={(event) => updateValue(field.id, event.target.value)}
// // // //               />
// // // //             )}

// // // //             {field.type === "NUMBER" && (
// // // //               <Input
// // // //                 type="number"
// // // //                 placeholder={field.placeholder || "0"}
// // // //                 required={field.required}
// // // //                 value={values[field.id] || ""}
// // // //                 onChange={(event) => updateValue(field.id, event.target.value === "" ? "" : event.target.valueAsNumber)}
// // // //               />
// // // //             )}

// // // //             {field.type === "DATE" && (
// // // //               <Input
// // // //                 type="date"
// // // //                 required={field.required}
// // // //                 value={values[field.id] || ""}
// // // //                 onChange={(event) => updateValue(field.id, event.target.value)}
// // // //               />
// // // //             )}

// // // //             {field.type === "PARAGRAPH" && (
// // // //               <Input
// // // //                 as="textarea"
// // // //                 rows={5}
// // // //                 placeholder={field.placeholder || "Write your answer"}
// // // //                 required={field.required}
// // // //                 value={values[field.id] || ""}
// // // //                 onChange={(event) => updateValue(field.id, event.target.value)}
// // // //               />
// // // //             )}

// // // //             {field.type === "DROPDOWN" && (
// // // //               <select
// // // //                 required={field.required}
// // // //                 className="w-full rounded-2xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 dark:border-white/10 dark:bg-white/10 dark:text-white"
// // // //                 value={values[field.id] || ""}
// // // //                 onChange={(event) => updateValue(field.id, event.target.value)}
// // // //               >
// // // //                 <option value="">Select an option</option>
// // // //                 {field.options.map((option) => (
// // // //                   <option key={option.value} value={option.value} className="text-slate-900">
// // // //                     {option.label}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             )}

// // // //             {field.type === "MULTIPLE_CHOICE" && (
// // // //               <div className="space-y-3">
// // // //                 {field.options.map((option) => (
// // // //                   <label
// // // //                     key={option.value}
// // // //                     className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 transition hover:border-blue-400/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
// // // //                   >
// // // //                     <input
// // // //                       type="radio"
// // // //                       name={field.id}
// // // //                       value={option.value}
// // // //                       required={field.required}
// // // //                       checked={values[field.id] === option.value}
// // // //                       onChange={(event) => updateValue(field.id, event.target.value)}
// // // //                     />
// // // //                     {option.label}
// // // //                   </label>
// // // //                 ))}
// // // //               </div>
// // // //             )}

// // // //             {field.type === "FILE" && (
// // // //               <div className="space-y-3">
// // // //                 <input
// // // //                   type="file"
// // // //                   multiple={(field.maxFiles || 1) > 1}
// // // //                   accept={(field.accept || []).join(",")}
// // // //                   required={field.required}
// // // //                   className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-500/20 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-500/30 dark:text-slate-300 dark:file:text-blue-100"
// // // //                   onChange={(event) => handleFileUpload(event, field)}
// // // //                 />
// // // //                 <p className="text-xs text-slate-500 dark:text-slate-400">
// // // //                   Upload up to {field.maxFiles || 1} file(s), {field.maxSizeMB || 4}MB each.
// // // //                 </p>
// // // //                 {uploadingMap[field.id] ? <p className="text-xs text-blue-300">Uploading files...</p> : null}
// // // //                 {Array.isArray(values[field.id]) && values[field.id].length ? (
// // // //                   <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
// // // //                     {values[field.id].map((file) => (
// // // //                       <li key={`${file.storageKey}-${file.size}`} className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-white/5">
// // // //                         <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-600 underline-offset-4 hover:underline dark:text-blue-200">
// // // //                           {file.name}
// // // //                         </a>{" "}
// // // //                         ({Math.ceil(file.size / 1024)} KB)
// // // //                       </li>
// // // //                     ))}
// // // //                   </ul>
// // // //                 ) : null}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         ))}

// // // //         {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
// // // //         {fields.length === 0 ? <p className="text-sm text-slate-400">No fields yet. Add fields in the builder.</p> : null}

// // // //         <Button type="submit" className="w-full" loading={submitting} disabled={fields.length === 0 || isUploading}>
// // // //           {livePreview ? "Test this form" : "Submit response"}
// // // //         </Button>
// // // //       </form>
// // // //     </div>
// // // //   );
// // // // }
// // // import { ChevronDown } from "lucide-react";
// // // import { useMemo, useState } from "react";
// // // import Button from "./ui/Button";
// // // import Input from "./ui/Input";
// // // import api from "../lib/api";

// // // async function uploadSingleFile(file, field) {
// // //   const formData = new FormData();
// // //   formData.append("file", file);
// // //   formData.append("acceptList", JSON.stringify(field.accept || []));
// // //   formData.append("maxSizeMB", String(field.maxSizeMB || 4));

// // //   const { data } = await api.post("/responses/upload", formData, {
// // //     headers: { "Content-Type": "multipart/form-data" }
// // //   });

// // //   return data.file;
// // // }

// // // export default function FormRenderer({ form, onSubmit, livePreview = false }) {
// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [uploadingMap, setUploadingMap] = useState({});
// // //   const [values, setValues] = useState({});
// // //   const [error, setError] = useState("");
// // //   const fields = useMemo(() => form?.fields || [], [form?.fields]);

// // //   const isUploading = Object.values(uploadingMap).some(Boolean);

// // //   const updateValue = (fieldId, value) => {
// // //     setValues((current) => ({ ...current, [fieldId]: value }));
// // //   };

// // //   const handleFileUpload = async (event, field) => {
// // //     const files = Array.from(event.target.files || []);
// // //     if (!files.length) {
// // //       updateValue(field.id, []);
// // //       return;
// // //     }

// // //     setUploadingMap((current) => ({ ...current, [field.id]: true }));
// // //     setError("");

// // //     try {
// // //       const capped = files.slice(0, field.maxFiles || 1);
// // //       const uploaded = await Promise.all(capped.map((file) => uploadSingleFile(file, field)));
// // //       updateValue(field.id, uploaded);
// // //     } catch (uploadError) {
// // //       updateValue(field.id, []);
// // //       setError(uploadError?.response?.data?.message || "File upload failed.");
// // //     } finally {
// // //       setUploadingMap((current) => ({ ...current, [field.id]: false }));
// // //     }
// // //   };

// // //   const handleSubmit = async (event) => {
// // //     event.preventDefault();
// // //     if (!onSubmit || isUploading) return;

// // //     setSubmitting(true);
// // //     setError("");

// // //     try {
// // //       await onSubmit(values);
// // //       if (!livePreview) {
// // //         setValues({});
// // //         event.target.reset();
// // //       }
// // //     } catch (submitError) {
// // //       setError(
// // //         submitError?.response?.data?.message ||
// // //           submitError?.message ||
// // //           "Unable to submit form."
// // //       );
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="glass rounded-[2rem] p-5 shadow-neon md:p-7">
// // //       <div className="mb-6">
// // //         <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
// // //           Live Form
// // //         </p>
// // //         <h3 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
// // //           {form.title}
// // //         </h3>
// // //         {form.description ? (
// // //           <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
// // //             {form.description}
// // //           </p>
// // //         ) : null}
// // //       </div>

// // //       <form className="space-y-5" onSubmit={handleSubmit}>
// // //         {fields.map((field) => (
// // //           <div
// // //             key={field.id}
// // //             className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
// // //           >
// // //             <div className="mb-3">
// // //               <label className="text-sm font-semibold text-slate-900 dark:text-white">
// // //                 {field.title}
// // //                 {field.required ? <span className="ml-1 text-blue-300">*</span> : null}
// // //               </label>
// // //               {field.description ? (
// // //                 <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
// // //                   {field.description}
// // //                 </p>
// // //               ) : null}
// // //             </div>

// // //             {field.type === "TEXT" && (
// // //               <Input
// // //                 placeholder={field.placeholder}
// // //                 required={field.required}
// // //                 value={values[field.id] || ""}
// // //                 onChange={(event) => updateValue(field.id, event.target.value)}
// // //               />
// // //             )}

// // //             {field.type === "EMAIL" && (
// // //               <Input
// // //                 type="email"
// // //                 placeholder={field.placeholder || "name@company.com"}
// // //                 required={field.required}
// // //                 value={values[field.id] || ""}
// // //                 onChange={(event) => updateValue(field.id, event.target.value)}
// // //               />
// // //             )}

// // //             {field.type === "NUMBER" && (
// // //               <Input
// // //                 type="number"
// // //                 placeholder={field.placeholder || "0"}
// // //                 required={field.required}
// // //                 value={values[field.id] || ""}
// // //                 onChange={(event) =>
// // //                   updateValue(
// // //                     field.id,
// // //                     event.target.value === "" ? "" : event.target.valueAsNumber
// // //                   )
// // //                 }
// // //               />
// // //             )}

// // //             {field.type === "DATE" && (
// // //               <Input
// // //                 type="date"
// // //                 required={field.required}
// // //                 value={values[field.id] || ""}
// // //                 onChange={(event) => updateValue(field.id, event.target.value)}
// // //               />
// // //             )}

// // //             {field.type === "PARAGRAPH" && (
// // //               <Input
// // //                 as="textarea"
// // //                 rows={5}
// // //                 placeholder={field.placeholder || "Write your answer"}
// // //                 required={field.required}
// // //                 value={values[field.id] || ""}
// // //                 onChange={(event) => updateValue(field.id, event.target.value)}
// // //               />
// // //             )}

// // //             {field.type === "DROPDOWN" && (
// // //               <div className="relative">
// // //                 <select
// // //                   required={field.required}
// // //                   value={values[field.id] || ""}
// // //                   onChange={(event) => updateValue(field.id, event.target.value)}
// // //                   className="w-full appearance-none rounded-[1.25rem] border border-slate-300 bg-gradient-to-r from-white/90 to-blue-50/80 px-4 py-3 pr-12 text-sm font-medium text-slate-900 shadow-[0_8px_25px_rgba(59,130,246,0.08)] outline-none transition duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 dark:border-white/10 dark:bg-gradient-to-r dark:from-white/10 dark:to-blue-500/10 dark:text-white dark:shadow-[0_12px_30px_rgba(29,78,216,0.18)]"
// // //                 >
// // //                   <option value="" className="bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200">
// // //                     Select an option
// // //                   </option>
// // //                   {field.options.map((option) => (
// // //                     <option
// // //                       key={option.value}
// // //                       value={option.value}
// // //                       className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
// // //                     >
// // //                       {option.label}
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //                 <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-300">
// // //                   <ChevronDown className="h-5 w-5" />
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {field.type === "MULTIPLE_CHOICE" && (
// // //               <div className="space-y-3">
// // //                 {field.options.map((option) => (
// // //                   <label
// // //                     key={option.value}
// // //                     className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 transition hover:border-blue-400/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
// // //                   >
// // //                     <input
// // //                       type="radio"
// // //                       name={field.id}
// // //                       value={option.value}
// // //                       required={field.required}
// // //                       checked={values[field.id] === option.value}
// // //                       onChange={(event) => updateValue(field.id, event.target.value)}
// // //                     />
// // //                     {option.label}
// // //                   </label>
// // //                 ))}
// // //               </div>
// // //             )}

// // //             {field.type === "FILE" && (
// // //               <div className="space-y-3">
// // //                 <input
// // //                   type="file"
// // //                   multiple={(field.maxFiles || 1) > 1}
// // //                   accept={(field.accept || []).join(",")}
// // //                   required={field.required}
// // //                   className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-500/20 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-500/30 dark:text-slate-300 dark:file:text-blue-100"
// // //                   onChange={(event) => handleFileUpload(event, field)}
// // //                 />
// // //                 <p className="text-xs text-slate-500 dark:text-slate-400">
// // //                   Upload up to {field.maxFiles || 1} file(s), {field.maxSizeMB || 4}MB each.
// // //                 </p>
// // //                 {uploadingMap[field.id] ? (
// // //                   <p className="text-xs text-blue-300">Uploading files...</p>
// // //                 ) : null}
// // //                 {Array.isArray(values[field.id]) && values[field.id].length ? (
// // //                   <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
// // //                     {values[field.id].map((file) => (
// // //                       <li
// // //                         key={`${file.storageKey}-${file.size}`}
// // //                         className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-white/5"
// // //                       >
// // //                         <a
// // //                           href={file.url}
// // //                           target="_blank"
// // //                           rel="noreferrer"
// // //                           className="text-blue-600 underline-offset-4 hover:underline dark:text-blue-200"
// // //                         >
// // //                           {file.name}
// // //                         </a>{" "}
// // //                         ({Math.ceil(file.size / 1024)} KB)
// // //                       </li>
// // //                     ))}
// // //                   </ul>
// // //                 ) : null}
// // //               </div>
// // //             )}
// // //           </div>
// // //         ))}

// // //         {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
// // //         {fields.length === 0 ? (
// // //           <p className="text-sm text-slate-400">No fields yet. Add fields in the builder.</p>
// // //         ) : null}

// // //         <Button
// // //           type="submit"
// // //           className="w-full"
// // //           loading={submitting}
// // //           disabled={fields.length === 0 || isUploading}
// // //         >
// // //           {livePreview ? "Test this form" : "Submit response"}
// // //         </Button>
// // //       </form>
// // //     </div>
// // //   );
// // // }
// // import { ChevronDown } from "lucide-react";
// // import { useMemo, useState } from "react";
// // import Button from "./ui/Button";
// // import Input from "./ui/Input";
// // import api from "../lib/api";

// // async function uploadSingleFile(file) {
// //   const formData = new FormData();
// //   formData.append("file", file);

// //   const { data } = await api.post("/responses/upload", formData, {
// //     headers: { "Content-Type": "multipart/form-data" }
// //   });

// //   return data.file;
// // }

// // export default function FormRenderer({ form, onSubmit, livePreview = false }) {
// //   const [submitting, setSubmitting] = useState(false);
// //   const [uploadingMap, setUploadingMap] = useState({});
// //   const [values, setValues] = useState({});
// //   const [error, setError] = useState("");
// //   const fields = useMemo(() => form?.fields || [], [form?.fields]);

// //   const visibleFields = fields.filter((field) => {
// //     if (!field.visibility?.dependsOnFieldId) return true;
// //     return String(values[field.visibility.dependsOnFieldId] ?? "") === String(field.visibility.equals ?? "");
// //   });

// //   const isUploading = Object.values(uploadingMap).some(Boolean);

// //   const updateValue = (fieldId, value) => {
// //     setValues((current) => ({ ...current, [fieldId]: value }));
// //   };

// //   const handleFileUpload = async (event, field) => {
// //     const files = Array.from(event.target.files || []);
// //     if (!files.length) {
// //       updateValue(field.id, []);
// //       return;
// //     }

// //     setUploadingMap((current) => ({ ...current, [field.id]: true }));
// //     setError("");

// //     try {
// //       const capped = files.slice(0, field.maxFiles || 1);
// //       const uploaded = await Promise.all(capped.map((file) => uploadSingleFile(file)));
// //       updateValue(field.id, uploaded);
// //     } catch (uploadError) {
// //       updateValue(field.id, []);
// //       setError(uploadError?.response?.data?.message || "File upload failed.");
// //     } finally {
// //       setUploadingMap((current) => ({ ...current, [field.id]: false }));
// //     }
// //   };

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();
// //     if (!onSubmit || isUploading) return;

// //     setSubmitting(true);
// //     setError("");

// //     try {
// //       await onSubmit(values);
// //       if (!livePreview) {
// //         setValues({});
// //         event.target.reset();
// //       }
// //     } catch (submitError) {
// //       setError(
// //         submitError?.response?.data?.message ||
// //           submitError?.message ||
// //           "Unable to submit form."
// //       );
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="glass rounded-[2rem] p-5 shadow-neon md:p-7">
// //       <div className="mb-6">
// //         <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Live Form</p>
// //         <h3 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">{form.title}</h3>
// //         {form.description ? (
// //           <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{form.description}</p>
// //         ) : null}
// //       </div>

// //       <form className="space-y-5" onSubmit={handleSubmit}>
// //         {visibleFields.map((field, index) => {
// //           if (field.type === "PAGE_BREAK") {
// //             return (
// //               <div key={field.id} className="py-2">
// //                 <div className="mb-2 flex items-center gap-3">
// //                   <div className="h-px flex-1 bg-white/10" />
// //                   <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-200">
// //                     Section {index + 1}
// //                   </span>
// //                   <div className="h-px flex-1 bg-white/10" />
// //                 </div>
// //               </div>
// //             );
// //           }

// //           return (
// //             <div key={field.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
// //               <div className="mb-3">
// //                 <label className="text-sm font-semibold text-slate-900 dark:text-white">
// //                   {field.title}
// //                   {field.required ? <span className="ml-1 text-blue-300">*</span> : null}
// //                 </label>
// //                 {field.description ? (
// //                   <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{field.description}</p>
// //                 ) : null}
// //               </div>

// //               {field.type === "TEXT" && (
// //                 <Input
// //                   placeholder={field.placeholder}
// //                   required={field.required}
// //                   value={values[field.id] || ""}
// //                   onChange={(event) => updateValue(field.id, event.target.value)}
// //                 />
// //               )}

// //               {field.type === "EMAIL" && (
// //                 <Input
// //                   type="email"
// //                   placeholder={field.placeholder || "name@company.com"}
// //                   required={field.required}
// //                   value={values[field.id] || ""}
// //                   onChange={(event) => updateValue(field.id, event.target.value)}
// //                 />
// //               )}

// //               {field.type === "NUMBER" && (
// //                 <Input
// //                   type="number"
// //                   placeholder={field.placeholder || "0"}
// //                   required={field.required}
// //                   value={values[field.id] || ""}
// //                   onChange={(event) => updateValue(field.id, event.target.value)}
// //                 />
// //               )}

// //               {field.type === "DATE" && (
// //                 <Input
// //                   type="date"
// //                   required={field.required}
// //                   value={values[field.id] || ""}
// //                   onChange={(event) => updateValue(field.id, event.target.value)}
// //                 />
// //               )}

// //               {field.type === "PARAGRAPH" && (
// //                 <Input
// //                   as="textarea"
// //                   rows={5}
// //                   placeholder={field.placeholder || "Write your answer"}
// //                   required={field.required}
// //                   value={values[field.id] || ""}
// //                   onChange={(event) => updateValue(field.id, event.target.value)}
// //                 />
// //               )}

// //               {field.type === "DROPDOWN" && (
// //                 <div className="relative">
// //                   <select
// //                     required={field.required}
// //                     value={values[field.id] || ""}
// //                     onChange={(event) => updateValue(field.id, event.target.value)}
// //                     className="w-full appearance-none rounded-[1.25rem] border border-slate-300 bg-gradient-to-r from-white/90 to-blue-50/80 px-4 py-3 pr-12 text-sm font-medium text-slate-900 outline-none transition duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 dark:border-white/10 dark:bg-gradient-to-r dark:from-white/10 dark:to-blue-500/10 dark:text-white"
// //                   >
// //                     <option value="">Select an option</option>
// //                     {field.options.map((option) => (
// //                       <option key={option.value} value={option.value}>
// //                         {option.label}
// //                       </option>
// //                     ))}
// //                   </select>
// //                   <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-300">
// //                     <ChevronDown className="h-5 w-5" />
// //                   </div>
// //                 </div>
// //               )}

// //               {field.type === "MULTIPLE_CHOICE" && (
// //                 <div className="space-y-3">
// //                   {field.options.map((option) => (
// //                     <label
// //                       key={option.value}
// //                       className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 transition hover:border-blue-400/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
// //                     >
// //                       <input
// //                         type="radio"
// //                         name={field.id}
// //                         value={option.value}
// //                         required={field.required}
// //                         checked={values[field.id] === option.value}
// //                         onChange={(event) => updateValue(field.id, event.target.value)}
// //                       />
// //                       {option.label}
// //                     </label>
// //                   ))}
// //                 </div>
// //               )}

// //               {field.type === "CHECKBOX_GROUP" && (
// //                 <div className="space-y-3">
// //                   {field.options.map((option) => {
// //                     const current = Array.isArray(values[field.id]) ? values[field.id] : [];
// //                     const checked = current.includes(option.value);

// //                     return (
// //                       <label
// //                         key={option.value}
// //                         className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 transition hover:border-blue-400/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
// //                       >
// //                         <input
// //                           type="checkbox"
// //                           checked={checked}
// //                           onChange={(event) => {
// //                             const next = event.target.checked
// //                               ? [...current, option.value]
// //                               : current.filter((item) => item !== option.value);
// //                             updateValue(field.id, next);
// //                           }}
// //                         />
// //                         {option.label}
// //                       </label>
// //                     );
// //                   })}
// //                 </div>
// //               )}

// //               {field.type === "LINEAR_SCALE" && (
// //                 <div className="space-y-4">
// //                   <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
// //                     <span>{field.minLabel || "Low"}</span>
// //                     <span>{field.maxLabel || "High"}</span>
// //                   </div>
// //                   <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
// //                     {Array.from(
// //                       { length: (field.scaleMax || 5) - (field.scaleMin || 1) + 1 },
// //                       (_, idx) => (field.scaleMin || 1) + idx
// //                     ).map((score) => (
// //                       <label
// //                         key={score}
// //                         className={`flex cursor-pointer items-center justify-center rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
// //                           values[field.id] === String(score)
// //                             ? "border-blue-400 bg-blue-500 text-white"
// //                             : "border-slate-200 bg-white/80 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
// //                         }`}
// //                       >
// //                         <input
// //                           type="radio"
// //                           className="sr-only"
// //                           name={field.id}
// //                           value={String(score)}
// //                           checked={values[field.id] === String(score)}
// //                           onChange={(event) => updateValue(field.id, event.target.value)}
// //                         />
// //                         {score}
// //                       </label>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {field.type === "FILE" && (
// //                 <div className="space-y-3">
// //                   <input
// //                     type="file"
// //                     multiple={(field.maxFiles || 1) > 1}
// //                     accept={(field.accept || []).join(",")}
// //                     required={field.required}
// //                     className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-500/20 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-500/30 dark:text-slate-300 dark:file:text-blue-100"
// //                     onChange={(event) => handleFileUpload(event, field)}
// //                   />
// //                   <p className="text-xs text-slate-500 dark:text-slate-400">
// //                     Upload up to {field.maxFiles || 1} file(s), {field.maxSizeMB || 8}MB each.
// //                   </p>
// //                 </div>
// //               )}
// //             </div>
// //           );
// //         })}

// //         {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}

// //         <Button type="submit" className="w-full" loading={submitting} disabled={isUploading}>
// //           {livePreview ? "Test this form" : "Submit response"}
// //         </Button>
// //       </form>
// //     </div>
// //   );
// // }
// import { ChevronDown } from "lucide-react";
// import { useMemo, useState } from "react";
// import Button from "./ui/Button";
// import Input from "./ui/Input";
// import api from "../lib/api";

// async function uploadSingleFile(file, form, field) {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("formId", form._id);
//   formData.append("fieldId", field.id);

//   const { data } = await api.post("/responses/upload", formData, {
//     headers: { "Content-Type": "multipart/form-data" }
//   });

//   return data.file;
// }


// export default function FormRenderer({ form, onSubmit, livePreview = false }) {
//   const [submitting, setSubmitting] = useState(false);
//   const [uploadingMap, setUploadingMap] = useState({});
//   const [values, setValues] = useState({});
//   const [error, setError] = useState("");
//   const fields = useMemo(() => form?.fields || [], [form?.fields]);

//   const visibleFields = fields.filter((field) => {
//     if (!field.visibility?.dependsOnFieldId) return true;
//     return String(values[field.visibility.dependsOnFieldId] ?? "") === String(field.visibility.equals ?? "");
//   });

//   const isUploading = Object.values(uploadingMap).some(Boolean);

//   const updateValue = (fieldId, value) => {
//     setValues((current) => ({ ...current, [fieldId]: value }));
//   };

//   const handleFileUpload = async (event, field) => {
//     const files = Array.from(event.target.files || []);
//     if (!files.length) {
//       updateValue(field.id, []);
//       return;
//     }

//     setUploadingMap((current) => ({ ...current, [field.id]: true }));
//     setError("");

//     try {
//       const capped = files.slice(0, field.maxFiles || 1);
//       const uploaded = await Promise.all(capped.map((file) => uploadSingleFile(file, form, field)));

//       updateValue(field.id, uploaded);
//     } catch (uploadError) {
//       updateValue(field.id, []);
//       setError(uploadError?.response?.data?.message || "File upload failed.");
//     } finally {
//       setUploadingMap((current) => ({ ...current, [field.id]: false }));
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!onSubmit || isUploading) return;

//     setSubmitting(true);
//     setError("");

//     try {
//       await onSubmit(values);
//       if (!livePreview) {
//         setValues({});
//         event.target.reset();
//       }
//     } catch (submitError) {
//       setError(
//         submitError?.response?.data?.message ||
//           submitError?.message ||
//           "Unable to submit form."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="glass rounded-[2rem] p-5 shadow-neon md:p-7">
//       <div className="mb-6">
//         <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
//           Live Form
//         </p>
//         <h3 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
//           {form.title}
//         </h3>
//         {form.description ? (
//           <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
//             {form.description}
//           </p>
//         ) : null}
//       </div>

//       <form className="space-y-5" onSubmit={handleSubmit}>
//         {visibleFields.map((field, index) => {
//           if (field.type === "PAGE_BREAK") {
//             return (
//               <div key={field.id} className="py-2">
//                 <div className="mb-2 flex items-center gap-3">
//                   <div className="h-px flex-1 bg-white/10" />
//                   <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-200">
//                     Section {index + 1}
//                   </span>
//                   <div className="h-px flex-1 bg-white/10" />
//                 </div>
//               </div>
//             );
//           }

//           return (
//             <div
//               key={field.id}
//               className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
//             >
//               <div className="mb-3">
//                 <label className="text-sm font-semibold text-slate-900 dark:text-white">
//                   {field.title}
//                   {field.required ? <span className="ml-1 text-blue-300">*</span> : null}
//                 </label>
//                 {field.description ? (
//                   <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//                     {field.description}
//                   </p>
//                 ) : null}
//               </div>

//               {field.type === "TEXT" && (
//                 <Input
//                   placeholder={field.placeholder}
//                   required={field.required}
//                   value={values[field.id] || ""}
//                   onChange={(event) => updateValue(field.id, event.target.value)}
//                 />
//               )}

//               {field.type === "EMAIL" && (
//                 <Input
//                   type="email"
//                   placeholder={field.placeholder || "name@company.com"}
//                   required={field.required}
//                   value={values[field.id] || ""}
//                   onChange={(event) => updateValue(field.id, event.target.value)}
//                 />
//               )}

//               {field.type === "NUMBER" && (
//                 <Input
//                   type="number"
//                   placeholder={field.placeholder || "0"}
//                   required={field.required}
//                   value={values[field.id] || ""}
//                   onChange={(event) =>
//                     updateValue(
//                       field.id,
//                       event.target.value === "" ? "" : event.target.valueAsNumber
//                     )
//                   }
//                 />
//               )}

//               {field.type === "DATE" && (
//                 <Input
//                   type="date"
//                   required={field.required}
//                   value={values[field.id] || ""}
//                   onChange={(event) => updateValue(field.id, event.target.value)}
//                 />
//               )}

//               {field.type === "PARAGRAPH" && (
//                 <Input
//                   as="textarea"
//                   rows={5}
//                   placeholder={field.placeholder || "Write your answer"}
//                   required={field.required}
//                   value={values[field.id] || ""}
//                   onChange={(event) => updateValue(field.id, event.target.value)}
//                 />
//               )}

//               {field.type === "DROPDOWN" && (
//                 <div className="relative">
//                   <select
//                     required={field.required}
//                     value={values[field.id] || ""}
//                     onChange={(event) => updateValue(field.id, event.target.value)}
//                     className="w-full appearance-none rounded-[1.25rem] border border-slate-300 bg-gradient-to-r from-white/90 to-blue-50/80 px-4 py-3 pr-12 text-sm font-medium text-slate-900 outline-none transition duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 dark:border-white/10 dark:bg-gradient-to-r dark:from-white/10 dark:to-blue-500/10 dark:text-white"
//                   >
//                     <option value="">Select an option</option>
//                     {field.options.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-300">
//                     <ChevronDown className="h-5 w-5" />
//                   </div>
//                 </div>
//               )}

//               {field.type === "MULTIPLE_CHOICE" && (
//                 <div className="space-y-3">
//                   {field.options.map((option) => (
//                     <label
//                       key={option.value}
//                       className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 transition hover:border-blue-400/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
//                     >
//                       <input
//                         type="radio"
//                         name={field.id}
//                         value={option.value}
//                         required={field.required}
//                         checked={values[field.id] === option.value}
//                         onChange={(event) => updateValue(field.id, event.target.value)}
//                       />
//                       {option.label}
//                     </label>
//                   ))}
//                 </div>
//               )}

//               {field.type === "CHECKBOX_GROUP" && (
//                 <div className="space-y-3">
//                   {field.options.map((option) => {
//                     const current = Array.isArray(values[field.id]) ? values[field.id] : [];
//                     const checked = current.includes(option.value);

//                     return (
//                       <label
//                         key={option.value}
//                         className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 transition hover:border-blue-400/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={checked}
//                           onChange={(event) => {
//                             const next = event.target.checked
//                               ? [...current, option.value]
//                               : current.filter((item) => item !== option.value);
//                             updateValue(field.id, next);
//                           }}
//                         />
//                         {option.label}
//                       </label>
//                     );
//                   })}
//                 </div>
//               )}

//               {field.type === "LINEAR_SCALE" && (
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
//                     <span>{field.minLabel || "Poor"}</span>
//                     <span>{field.maxLabel || "Excellent"}</span>
//                   </div>

//                   <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
//                     {Array.from(
//                       { length: (field.scaleMax || 5) - (field.scaleMin || 1) + 1 },
//                       (_, idx) => (field.scaleMin || 1) + idx
//                     ).map((score) => (
//                       <label
//                         key={score}
//                         className={`flex cursor-pointer items-center justify-center rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
//                           values[field.id] === String(score)
//                             ? "border-blue-400 bg-blue-500 text-white"
//                             : "border-slate-200 bg-white/80 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
//                         }`}
//                       >
//                         <input
//                           type="radio"
//                           className="sr-only"
//                           name={field.id}
//                           value={String(score)}
//                           checked={values[field.id] === String(score)}
//                           onChange={(event) => updateValue(field.id, event.target.value)}
//                         />
//                         {score}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {field.type === "FILE" && (
//                 <div className="space-y-3">
//                   <input
//                     type="file"
//                     multiple={(field.maxFiles || 1) > 1}
//                     accept={(field.accept || []).join(",")}
//                     required={field.required}
//                     className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-500/20 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-500/30 dark:text-slate-300 dark:file:text-blue-100"
//                     onChange={(event) => handleFileUpload(event, field)}
//                   />
//                   <p className="text-xs text-slate-500 dark:text-slate-400">
//                     Upload up to {field.maxFiles || 1} file(s), {field.maxSizeMB || 4}MB each.
//                   </p>
//                   {uploadingMap[field.id] ? (
//                     <p className="text-xs text-blue-300">Uploading files...</p>
//                   ) : null}
//                   {Array.isArray(values[field.id]) && values[field.id].length ? (
//                     <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
//                       {values[field.id].map((file) => (
//                         <li
//                           key={`${file.storageKey}-${file.size}`}
//                           className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-white/5"
//                         >
//                           <a
//                             href={file.url}
//                             target="_blank"
//                             rel="noreferrer"
//                             className="text-blue-600 underline-offset-4 hover:underline dark:text-blue-200"
//                           >
//                             {file.name}
//                           </a>{" "}
//                           ({Math.ceil(file.size / 1024)} KB)
//                         </li>
//                       ))}
//                     </ul>
//                   ) : null}
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
//         {visibleFields.length === 0 ? (
//           <p className="text-sm text-slate-400">No fields yet. Add fields in the builder.</p>
//         ) : null}

//         <Button
//           type="submit"
//           className="w-full"
//           loading={submitting}
//           disabled={visibleFields.length === 0 || isUploading}
//         >
//           {livePreview ? "Test this form" : "Submit response"}
//         </Button>
//       </form>
//     </div>
//   );
// }
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import api from "../lib/api";

const AUTO_PAGE_SIZE = 20;

async function uploadSingleFile(file, form, field) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("formId", form._id);
  formData.append("fieldId", field.id);

  const { data } = await api.post("/responses/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return data.file;
}

function fieldHasValue(field, value) {
  if (field.type === "FILE") return Array.isArray(value) && value.length > 0;
  if (field.type === "CHECKBOX_GROUP") return Array.isArray(value) && value.length > 0;
  return value !== undefined && value !== null && value !== "";
}

function validatePageFields(pageFields, values) {
  for (const field of pageFields) {
    if (!field.required) continue;

    const value = values[field.id];
    if (!fieldHasValue(field, value)) {
      return `${field.title} is required.`;
    }

    if (field.type === "EMAIL") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value).trim())) {
        return `${field.title} must be a valid email address.`;
      }
    }

    if (field.type === "URL") {
      try {
        new URL(String(value).trim());
      } catch {
        return `${field.title} must be a valid URL.`;
      }
    }
  }

  return "";
}

export default function FormRenderer({ form, onSubmit, livePreview = false }) {
  const [submitting, setSubmitting] = useState(false);
  const [uploadingMap, setUploadingMap] = useState({});
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const fields = useMemo(() => form?.fields || [], [form?.fields]);

  useEffect(() => {
    setCurrentPage(0);
    setValues({});
    setError("");
  }, [form?._id]);

  const visibleFields = fields.filter((field) => {
    if (field.type === "PAGE_BREAK") return true;
    if (!field.visibility?.dependsOnFieldId) return true;
    return String(values[field.visibility.dependsOnFieldId] ?? "") === String(field.visibility.equals ?? "");
  });

  const pages = useMemo(() => {
    const hasExplicitPageBreaks = visibleFields.some((field) => field.type === "PAGE_BREAK");

    if (hasExplicitPageBreaks) {
      const builtPages = [];
      let currentFields = [];

      for (const field of visibleFields) {
        if (field.type === "PAGE_BREAK") {
          if (currentFields.length) {
            builtPages.push(currentFields);
            currentFields = [];
          }
          continue;
        }

        currentFields.push(field);
      }

      if (currentFields.length) {
        builtPages.push(currentFields);
      }

      return builtPages.length ? builtPages : [[]];
    }

    const normalFields = visibleFields.filter((field) => field.type !== "PAGE_BREAK");
    if (normalFields.length <= AUTO_PAGE_SIZE) {
      return [normalFields];
    }

    const builtPages = [];
    for (let index = 0; index < normalFields.length; index += AUTO_PAGE_SIZE) {
      builtPages.push(normalFields.slice(index, index + AUTO_PAGE_SIZE));
    }
    return builtPages;
  }, [visibleFields]);

  useEffect(() => {
    if (currentPage > pages.length - 1) {
      setCurrentPage(Math.max(0, pages.length - 1));
    }
  }, [pages.length, currentPage]);

  const currentPageFields = pages[currentPage] || [];
  const isUploading = Object.values(uploadingMap).some(Boolean);
  const isLastPage = currentPage === pages.length - 1;
  const isFirstPage = currentPage === 0;

  const updateValue = (fieldId, value) => {
    setValues((current) => ({ ...current, [fieldId]: value }));
  };

  const handleFileUpload = async (event, field) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      updateValue(field.id, []);
      return;
    }

    setUploadingMap((current) => ({ ...current, [field.id]: true }));
    setError("");

    try {
      const capped = files.slice(0, field.maxFiles || 1);
      const uploaded = await Promise.all(capped.map((file) => uploadSingleFile(file, form, field)));
      updateValue(field.id, uploaded);
    } catch (uploadError) {
      updateValue(field.id, []);
      setError(uploadError?.response?.data?.message || "File upload failed.");
    } finally {
      setUploadingMap((current) => ({ ...current, [field.id]: false }));
    }
  };

  const handleNextPage = () => {
    const pageError = validatePageFields(currentPageFields, values);
    if (pageError) {
      setError(pageError);
      return;
    }

    setError("");
    setCurrentPage((page) => Math.min(page + 1, pages.length - 1));
  };

  const handlePreviousPage = () => {
    setError("");
    setCurrentPage((page) => Math.max(page - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!onSubmit || isUploading) return;

    const pageError = validatePageFields(currentPageFields, values);
    if (pageError) {
      setError(pageError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit(values);
      if (!livePreview) {
        setValues({});
        setCurrentPage(0);
        event.target.reset();
      }
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.message ||
          "Unable to submit form."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass rounded-[2rem] p-5 shadow-neon md:p-7">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
          Live Form
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
          {form.title}
        </h3>
        {form.description ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {form.description}
          </p>
        ) : null}

        {pages.length > 1 ? (
          <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            Page {currentPage + 1} of {pages.length}
          </div>
        ) : null}
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {currentPageFields.map((field) => (
          <div
            key={field.id}
            className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
          >
            <div className="mb-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                {field.title}
                {field.required ? <span className="ml-1 text-blue-300">*</span> : null}
              </label>
              {field.description ? (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {field.description}
                </p>
              ) : null}
            </div>

            {field.type === "TEXT" && (
              <Input
                placeholder={field.placeholder}
                required={field.required}
                value={values[field.id] || ""}
                onChange={(event) => updateValue(field.id, event.target.value)}
              />
            )}

            {field.type === "EMAIL" && (
              <Input
                type="email"
                placeholder={field.placeholder || "name@company.com"}
                required={field.required}
                value={values[field.id] || ""}
                onChange={(event) => updateValue(field.id, event.target.value)}
              />
            )}

            {field.type === "URL" && (
              <Input
                type="url"
                placeholder={field.placeholder || "https://example.com"}
                required={field.required}
                value={values[field.id] || ""}
                onChange={(event) => updateValue(field.id, event.target.value)}
              />
            )}

            {field.type === "NUMBER" && (
              <Input
                type="number"
                placeholder={field.placeholder || "0"}
                required={field.required}
                value={values[field.id] || ""}
                onChange={(event) =>
                  updateValue(
                    field.id,
                    event.target.value === "" ? "" : event.target.valueAsNumber
                  )
                }
              />
            )}

            {field.type === "DATE" && (
              <Input
                type="date"
                required={field.required}
                value={values[field.id] || ""}
                onChange={(event) => updateValue(field.id, event.target.value)}
              />
            )}

            {field.type === "PARAGRAPH" && (
              <Input
                as="textarea"
                rows={5}
                placeholder={field.placeholder || "Write your answer"}
                required={field.required}
                value={values[field.id] || ""}
                onChange={(event) => updateValue(field.id, event.target.value)}
              />
            )}

            {field.type === "DROPDOWN" && (
              <div className="relative">
                <select
                  required={field.required}
                  value={values[field.id] || ""}
                  onChange={(event) => updateValue(field.id, event.target.value)}
                  className="w-full appearance-none rounded-[1.25rem] border border-slate-300 bg-gradient-to-r from-white/90 to-blue-50/80 px-4 py-3 pr-12 text-sm font-medium text-slate-900 outline-none transition duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 dark:border-white/10 dark:bg-gradient-to-r dark:from-white/10 dark:to-blue-500/10 dark:text-white"
                >
                  <option value="">Select an option</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-300">
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            )}

            {field.type === "MULTIPLE_CHOICE" && (
              <div className="space-y-3">
                {field.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 transition hover:border-blue-400/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                  >
                    <input
                      type="radio"
                      name={field.id}
                      value={option.value}
                      required={field.required}
                      checked={values[field.id] === option.value}
                      onChange={(event) => updateValue(field.id, event.target.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}

            {field.type === "CHECKBOX_GROUP" && (
              <div className="space-y-3">
                {field.options.map((option) => {
                  const current = Array.isArray(values[field.id]) ? values[field.id] : [];
                  const checked = current.includes(option.value);

                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 transition hover:border-blue-400/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          const next = event.target.checked
                            ? [...current, option.value]
                            : current.filter((item) => item !== option.value);
                          updateValue(field.id, next);
                        }}
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
            )}

            {field.type === "LINEAR_SCALE" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{field.minLabel || "Poor"}</span>
                  <span>{field.maxLabel || "Excellent"}</span>
                </div>

                <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {Array.from(
                    { length: (field.scaleMax || 5) - (field.scaleMin || 1) + 1 },
                    (_, idx) => (field.scaleMin || 1) + idx
                  ).map((score) => (
                    <label
                      key={score}
                      className={`flex cursor-pointer items-center justify-center rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                        values[field.id] === String(score)
                          ? "border-blue-400 bg-blue-500 text-white"
                          : "border-slate-200 bg-white/80 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        name={field.id}
                        value={String(score)}
                        checked={values[field.id] === String(score)}
                        onChange={(event) => updateValue(field.id, event.target.value)}
                      />
                      {score}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {field.type === "FILE" && (
              <div className="space-y-3">
                <input
                  type="file"
                  multiple={(field.maxFiles || 1) > 1}
                  accept={(field.accept || []).join(",")}
                  required={field.required}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-500/20 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-500/30 dark:text-slate-300 dark:file:text-blue-100"
                  onChange={(event) => handleFileUpload(event, field)}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload up to {field.maxFiles || 1} file(s), {field.maxSizeMB || 4}MB each.
                </p>
                {uploadingMap[field.id] ? (
                  <p className="text-xs text-blue-300">Uploading files...</p>
                ) : null}
                {Array.isArray(values[field.id]) && values[field.id].length ? (
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {values[field.id].map((file) => (
                      <li
                        key={`${file.storageKey}-${file.size}`}
                        className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-white/5"
                      >
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline-offset-4 hover:underline dark:text-blue-200"
                        >
                          {file.name}
                        </a>{" "}
                        ({Math.ceil(file.size / 1024)} KB)
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
          </div>
        ))}

        {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}

        {currentPageFields.length === 0 ? (
          <p className="text-sm text-slate-400">No fields yet. Add fields in the builder.</p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          {pages.length > 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handlePreviousPage}
              disabled={isFirstPage || submitting || isUploading}
            >
              Previous
            </Button>
          ) : <span />}

          {isLastPage ? (
            <Button
              type="submit"
              className="sm:min-w-[180px]"
              loading={submitting}
              disabled={currentPageFields.length === 0 || isUploading}
            >
              {livePreview ? "Test this form" : "Submit response"}
            </Button>
          ) : (
            <Button
              type="button"
              className="sm:min-w-[180px]"
              onClick={handleNextPage}
              disabled={isUploading}
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
