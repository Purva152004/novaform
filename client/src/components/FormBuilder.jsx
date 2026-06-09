// // import { GripVertical, Plus, Sparkles, Trash2, Upload } from "lucide-react";
// // import Button from "./ui/Button";
// // import Input from "./ui/Input";

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

// // const newField = (type = "TEXT") => ({
// //   id: crypto.randomUUID(),
// //   type,
// //   title: "Untitled field",
// //   description: "",
// //   placeholder: type === "PARAGRAPH" ? "Write your answer" : "",
// //   required: false,
// //   options: ["MULTIPLE_CHOICE", "DROPDOWN"].includes(type)
// //     ? [
// //         { label: "Option 1", value: "Option 1" },
// //         { label: "Option 2", value: "Option 2" },
// //         { label: "Option 3", value: "Option 3" }
// //       ]
// //     : [],
// //   accept: type === "FILE" ? ["image/*", "application/pdf"] : [],
// //   maxFiles: 1,
// //   maxSizeMB: 4
// // });

// // const morphFieldType = (field, nextType) => {
// //   const seed = newField(nextType);
// //   return {
// //     ...seed,
// //     id: field.id,
// //     title: field.title,
// //     description: field.description,
// //     required: field.required,
// //     placeholder: nextType === "PARAGRAPH" ? field.placeholder || "Write your answer" : nextType === "FILE" ? "" : field.placeholder
// //   };
// // };

// // export default function FormBuilder({
// //   form,
// //   onFormChange,
// //   onGenerateMore,
// //   generating
// // }) {
// //   const updateForm = (patch) => onFormChange({ ...form, ...patch });

// //   const updateField = (fieldId, patch) => {
// //     const fields = form.fields.map((field) => (field.id === fieldId ? { ...field, ...patch } : field));
// //     updateForm({ fields });
// //   };

// //   const removeField = (fieldId) => {
// //     updateForm({ fields: form.fields.filter((field) => field.id !== fieldId) });
// //   };

// //   const moveField = (fieldId, direction) => {
// //     const index = form.fields.findIndex((field) => field.id === fieldId);
// //     const nextIndex = index + direction;
// //     if (index < 0 || nextIndex < 0 || nextIndex >= form.fields.length) return;

// //     const fields = [...form.fields];
// //     const [field] = fields.splice(index, 1);
// //     fields.splice(nextIndex, 0, field);
// //     updateForm({ fields });
// //   };

// //   const updateOption = (fieldId, optionIndex, value) => {
// //     const field = form.fields.find((item) => item.id === fieldId);
// //     const options = [...field.options];
// //     options[optionIndex] = { label: value, value };
// //     updateField(fieldId, { options });
// //   };

// //   const addOption = (fieldId) => {
// //     const field = form.fields.find((item) => item.id === fieldId);
// //     updateField(fieldId, {
// //       options: [...field.options, { label: `Option ${field.options.length + 1}`, value: `Option ${field.options.length + 1}` }]
// //     });
// //   };

// //   return (
// //     <div className="glass rounded-[2rem] p-5 shadow-neon md:p-7">
// //       <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
// //         <div>
// //           <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Form Builder</p>
// //           <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">Polish the generated form</h2>
// //           <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
// //             Add clear form descriptions, upload fields, helper text, and production-ready validation before publishing.
// //           </p>
// //         </div>
// //         <Button onClick={onGenerateMore} loading={generating} className="md:w-auto">
// //           <Sparkles className="h-4 w-4" />
// //           Regenerate with AI
// //         </Button>
// //       </div>

// //       <div className="mt-6 grid gap-4">
// //         <Input label="Form title" value={form.title} onChange={(event) => updateForm({ title: event.target.value })} />
// //         <Input
// //           label="Form description"
// //           as="textarea"
// //           rows={4}
// //           value={form.description}
// //           onChange={(event) => updateForm({ description: event.target.value })}
// //           placeholder="Explain what this form is collecting, who should fill it, and upload expectations if files are required."
// //         />
// //       </div>

// //       <div className="mt-4 rounded-[1.6rem] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
// //         <label className="flex items-center justify-between gap-4 text-sm text-slate-700 dark:text-slate-200">
// //           <div>
// //             <p className="font-semibold text-slate-900 dark:text-white">Allow multiple responses</p>
// //             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
// //               Turn this off if each respondent should be allowed to submit only once.
// //             </p>
// //           </div>
// //           <input
// //             type="checkbox"
// //             checked={form.allowMultipleResponses ?? true}
// //             onChange={(event) => updateForm({ allowMultipleResponses: event.target.checked })}
// //           />
// //         </label>
// //       </div>

// //       <div className="mt-5 flex flex-wrap gap-3">
// //         {FIELD_TYPES.map((type) => (
// //           <button
// //             key={type}
// //             type="button"
// //             onClick={() => updateForm({ fields: [...form.fields, newField(type)] })}
// //             className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-slate-100 transition hover:border-blue-400/50 hover:bg-blue-500/10"
// //           >
// //             <span className="inline-flex items-center gap-2">
// //               {type === "FILE" ? <Upload className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
// //               {type.replaceAll("_", " ")}
// //             </span>
// //           </button>
// //         ))}
// //       </div>

// //       <div className="mt-6 space-y-4">
// //         {form.fields.map((field, index) => (
// //           <div key={field.id} className="rounded-[1.6rem] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
// //             <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
// //               <div className="flex items-center gap-3">
// //                 <div className="rounded-2xl bg-blue-500/15 p-2 text-blue-200">
// //                   <GripVertical className="h-5 w-5" />
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-semibold text-slate-900 dark:text-white">Field {index + 1}</p>
// //                   <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{field.type.replaceAll("_", " ")}</p>
// //                 </div>
// //               </div>
// //               <div className="flex flex-wrap gap-2">
// //                 <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => moveField(field.id, -1)} disabled={index === 0}>
// //                   Move up
// //                 </Button>
// //                 <Button
// //                   variant="secondary"
// //                   className="px-3 py-2 text-xs"
// //                   onClick={() => moveField(field.id, 1)}
// //                   disabled={index === form.fields.length - 1}
// //                 >
// //                   Move down
// //                 </Button>
// //                 <Button variant="secondary" className="px-3 py-2 text-xs text-rose-200" onClick={() => removeField(field.id)}>
// //                   <Trash2 className="h-4 w-4" />
// //                   Remove
// //                 </Button>
// //               </div>
// //             </div>

// //             <div className="mt-4 grid gap-4 md:grid-cols-2">
// //               <Input label="Question title" value={field.title} onChange={(event) => updateField(field.id, { title: event.target.value })} />
// //               <label className="block space-y-2">
// //                 <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Field type</span>
// //                 <select
// //                   className="w-full rounded-2xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 dark:border-white/10 dark:bg-white/10 dark:text-white"
// //                   value={field.type}
// //                   onChange={(event) => {
// //                     const nextType = event.target.value;
// //                     updateField(field.id, morphFieldType(field, nextType));
// //                   }}
// //                 >
// //                   {FIELD_TYPES.map((type) => (
// //                     <option key={type} value={type} className="text-slate-900">
// //                       {type.replaceAll("_", " ")}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </label>
// //               <Input
// //                 label="Help text"
// //                 value={field.description}
// //                 onChange={(event) => updateField(field.id, { description: event.target.value })}
// //                 placeholder="Add context, instructions, or upload guidance."
// //               />
// //               <Input
// //                 label="Placeholder"
// //                 value={field.placeholder || ""}
// //                 onChange={(event) => updateField(field.id, { placeholder: event.target.value })}
// //                 placeholder={field.type === "FILE" ? "Not used for uploads" : "Placeholder text"}
// //                 disabled={field.type === "FILE"}
// //               />
// //             </div>

// //             <div className="mt-4 flex flex-wrap items-center gap-4">
// //               <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
// //                 <input
// //                   type="checkbox"
// //                   checked={field.required}
// //                   onChange={(event) => updateField(field.id, { required: event.target.checked })}
// //                 />
// //                 Required question
// //               </label>
// //             </div>

// //             {["MULTIPLE_CHOICE", "DROPDOWN"].includes(field.type) ? (
// //               <div className="mt-4 space-y-3">
// //                 <div className="flex items-center justify-between">
// //                   <p className="text-sm font-semibold text-slate-900 dark:text-white">Options</p>
// //                   <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => addOption(field.id)}>
// //                     Add option
// //                   </Button>
// //                 </div>
// //                 {field.options.map((option, optionIndex) => (
// //                   <Input
// //                     key={`${field.id}-${optionIndex}`}
// //                     value={option.label}
// //                     onChange={(event) => updateOption(field.id, optionIndex, event.target.value)}
// //                     placeholder={`Option ${optionIndex + 1}`}
// //                   />
// //                 ))}
// //               </div>
// //             ) : null}

// //             {field.type === "FILE" ? (
// //               <div className="mt-4 grid gap-4 md:grid-cols-2">
// //                 <Input
// //                   label="Accepted file types"
// //                   value={(field.accept || []).join(", ")}
// //                   onChange={(event) => updateField(field.id, { accept: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
// //                   helper="Example: image/*, application/pdf, video/*"
// //                 />
// //                 <div className="grid gap-4 md:grid-cols-2">
// //                   <Input
// //                     label="Max files"
// //                     type="number"
// //                     min="1"
// //                     max="5"
// //                     value={field.maxFiles || 1}
// //                     onChange={(event) => updateField(field.id, { maxFiles: Number(event.target.value || 1) })}
// //                   />
// //                   <Input
// //                     label="Max size (MB)"
// //                     type="number"
// //                     min="1"
// //                     max="10"
// //                     value={field.maxSizeMB || 4}
// //                     onChange={(event) => updateField(field.id, { maxSizeMB: Number(event.target.value || 4) })}
// //                   />
// //                 </div>
// //               </div>
// //             ) : null}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
// import { GripVertical, Plus, Sparkles, Trash2, Upload } from "lucide-react";
// import Button from "./ui/Button";
// import Input from "./ui/Input";

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

// const newField = (type = "TEXT") => ({
//   id: crypto.randomUUID(),
//   type,
//   title: "Untitled field",
//   description: "",
//   placeholder: type === "PARAGRAPH" ? "Write your answer" : "",
//   required: type === "EMAIL" ? true : false,
//   options: ["MULTIPLE_CHOICE", "DROPDOWN"].includes(type)
//     ? [
//         { label: "Option 1", value: "Option 1" },
//         { label: "Option 2", value: "Option 2" },
//         { label: "Option 3", value: "Option 3" }
//       ]
//     : [],
//   accept: type === "FILE" ? ["image/*", "application/pdf"] : [],
//   maxFiles: 1,
//   maxSizeMB: 4
// });

// const morphFieldType = (field, nextType) => {
//   const seed = newField(nextType);
//   return {
//     ...seed,
//     id: field.id,
//     title: field.title,
//     description: field.description,
//     required: nextType === "EMAIL" ? true : field.required,
//     placeholder:
//       nextType === "PARAGRAPH"
//         ? field.placeholder || "Write your answer"
//         : nextType === "FILE"
//           ? ""
//           : field.placeholder
//   };
// };

// export default function FormBuilder({
//   form,
//   onFormChange,
//   onGenerateMore,
//   generating
// }) {
//   const updateForm = (patch) => onFormChange({ ...form, ...patch });

//   const updateField = (fieldId, patch) => {
//     const fields = form.fields.map((field) => (field.id === fieldId ? { ...field, ...patch } : field));
//     updateForm({ fields });
//   };

//   const removeField = (fieldId) => {
//     updateForm({ fields: form.fields.filter((field) => field.id !== fieldId) });
//   };

//   const moveField = (fieldId, direction) => {
//     const index = form.fields.findIndex((field) => field.id === fieldId);
//     const nextIndex = index + direction;
//     if (index < 0 || nextIndex < 0 || nextIndex >= form.fields.length) return;

//     const fields = [...form.fields];
//     const [field] = fields.splice(index, 1);
//     fields.splice(nextIndex, 0, field);
//     updateForm({ fields });
//   };

//   const updateOption = (fieldId, optionIndex, value) => {
//     const field = form.fields.find((item) => item.id === fieldId);
//     const options = [...field.options];
//     options[optionIndex] = { label: value, value };
//     updateField(fieldId, { options });
//   };

//   const addOption = (fieldId) => {
//     const field = form.fields.find((item) => item.id === fieldId);
//     updateField(fieldId, {
//       options: [
//         ...field.options,
//         {
//           label: `Option ${field.options.length + 1}`,
//           value: `Option ${field.options.length + 1}`
//         }
//       ]
//     });
//   };

//   const hasEmailField = form.fields.some((field) => field.type === "EMAIL");

//   return (
//     <div className="glass rounded-[2rem] p-5 shadow-neon md:p-7">
//       <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//         <div>
//           <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Form Builder</p>
//           <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
//             Polish the generated form
//           </h2>
//           <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
//             Add clear form descriptions, upload fields, helper text, and production-ready validation before publishing.
//           </p>
//         </div>
//         <Button onClick={onGenerateMore} loading={generating} className="md:w-auto">
//           <Sparkles className="h-4 w-4" />
//           Regenerate with AI
//         </Button>
//       </div>

//       <div className="mt-6 grid gap-4">
//         <Input
//           label="Form title"
//           value={form.title}
//           onChange={(event) => updateForm({ title: event.target.value })}
//         />
//         <Input
//           label="Form description"
//           as="textarea"
//           rows={4}
//           value={form.description}
//           onChange={(event) => updateForm({ description: event.target.value })}
//           placeholder="Explain what this form is collecting, who should fill it, and upload expectations if files are required."
//         />
//       </div>

//       <div className="mt-4 rounded-[1.6rem] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
//         <label className="flex items-center justify-between gap-4 text-sm text-slate-700 dark:text-slate-200">
//           <div>
//             <p className="font-semibold text-slate-900 dark:text-white">Allow multiple responses</p>
//             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//               Turn this off if each respondent should be allowed to submit only once.
//             </p>
//           </div>
//           <input
//             type="checkbox"
//             checked={form.allowMultipleResponses ?? true}
//             onChange={(event) => updateForm({ allowMultipleResponses: event.target.checked })}
//           />
//         </label>

//         {form.allowMultipleResponses === false ? (
//           <div className="mt-4 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
//             <p className="font-semibold">Single response mode is active</p>
//             <p className="mt-1 text-xs text-amber-100/80">
//               To enforce one response across browsers, devices, and operating systems, this form must include a required Email field.
//             </p>
//             {!hasEmailField ? (
//               <p className="mt-2 text-xs font-semibold text-rose-200">
//                 No Email field found. Add one now, or submissions cannot be uniquely restricted per user.
//               </p>
//             ) : null}
//           </div>
//         ) : null}
//       </div>

//       <div className="mt-5 flex flex-wrap gap-3">
//         {FIELD_TYPES.map((type) => (
//           <button
//             key={type}
//             type="button"
//             onClick={() => updateForm({ fields: [...form.fields, newField(type)] })}
//             className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-slate-100 transition hover:border-blue-400/50 hover:bg-blue-500/10"
//           >
//             <span className="inline-flex items-center gap-2">
//               {type === "FILE" ? <Upload className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
//               {type.replaceAll("_", " ")}
//             </span>
//           </button>
//         ))}
//       </div>

//       <div className="mt-6 space-y-4">
//         {form.fields.map((field, index) => (
//           <div
//             key={field.id}
//             className="rounded-[1.6rem] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
//           >
//             <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="rounded-2xl bg-blue-500/15 p-2 text-blue-200">
//                   <GripVertical className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-slate-900 dark:text-white">Field {index + 1}</p>
//                   <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
//                     {field.type.replaceAll("_", " ")}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => moveField(field.id, -1)} disabled={index === 0}>
//                   Move up
//                 </Button>
//                 <Button
//                   variant="secondary"
//                   className="px-3 py-2 text-xs"
//                   onClick={() => moveField(field.id, 1)}
//                   disabled={index === form.fields.length - 1}
//                 >
//                   Move down
//                 </Button>
//                 <Button variant="secondary" className="px-3 py-2 text-xs text-rose-200" onClick={() => removeField(field.id)}>
//                   <Trash2 className="h-4 w-4" />
//                   Remove
//                 </Button>
//               </div>
//             </div>

//             <div className="mt-4 grid gap-4 md:grid-cols-2">
//               <Input
//                 label="Question title"
//                 value={field.title}
//                 onChange={(event) => updateField(field.id, { title: event.target.value })}
//               />
//               <label className="block space-y-2">
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Field type</span>
//                 <select
//                   className="w-full rounded-2xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 dark:border-white/10 dark:bg-white/10 dark:text-white"
//                   value={field.type}
//                   onChange={(event) => {
//                     const nextType = event.target.value;
//                     updateField(field.id, morphFieldType(field, nextType));
//                   }}
//                 >
//                   {FIELD_TYPES.map((type) => (
//                     <option key={type} value={type} className="text-slate-900">
//                       {type.replaceAll("_", " ")}
//                     </option>
//                   ))}
//                 </select>
//               </label>
//               <Input
//                 label="Help text"
//                 value={field.description}
//                 onChange={(event) => updateField(field.id, { description: event.target.value })}
//                 placeholder="Add context, instructions, or upload guidance."
//               />
//               <Input
//                 label="Placeholder"
//                 value={field.placeholder || ""}
//                 onChange={(event) => updateField(field.id, { placeholder: event.target.value })}
//                 placeholder={field.type === "FILE" ? "Not used for uploads" : "Placeholder text"}
//                 disabled={field.type === "FILE"}
//               />
//             </div>

//             <div className="mt-4 flex flex-wrap items-center gap-4">
//               <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
//                 <input
//                   type="checkbox"
//                   checked={field.required || field.type === "EMAIL"}
//                   onChange={(event) =>
//                     updateField(field.id, {
//                       required: field.type === "EMAIL" ? true : event.target.checked
//                     })
//                   }
//                   disabled={field.type === "EMAIL"}
//                 />
//                 {field.type === "EMAIL" ? "Required question (locked for email identity)" : "Required question"}
//               </label>
//             </div>

//             {["MULTIPLE_CHOICE", "DROPDOWN"].includes(field.type) ? (
//               <div className="mt-4 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-semibold text-slate-900 dark:text-white">Options</p>
//                   <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => addOption(field.id)}>
//                     Add option
//                   </Button>
//                 </div>
//                 {field.options.map((option, optionIndex) => (
//                   <Input
//                     key={`${field.id}-${optionIndex}`}
//                     value={option.label}
//                     onChange={(event) => updateOption(field.id, optionIndex, event.target.value)}
//                     placeholder={`Option ${optionIndex + 1}`}
//                   />
//                 ))}
//               </div>
//             ) : null}

//             {field.type === "FILE" ? (
//               <div className="mt-4 grid gap-4 md:grid-cols-2">
//                 <Input
//                   label="Accepted file types"
//                   value={(field.accept || []).join(", ")}
//                   onChange={(event) =>
//                     updateField(field.id, {
//                       accept: event.target.value
//                         .split(",")
//                         .map((item) => item.trim())
//                         .filter(Boolean)
//                     })
//                   }
//                   helper="Example: image/*, application/pdf, video/*"
//                 />
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Input
//                     label="Max files"
//                     type="number"
//                     min="1"
//                     max="5"
//                     value={field.maxFiles || 1}
//                     onChange={(event) => updateField(field.id, { maxFiles: Number(event.target.value || 1) })}
//                   />
//                   <Input
//                     label="Max size (MB)"
//                     type="number"
//                     min="1"
//                     max="10"
//                     value={field.maxSizeMB || 4}
//                     onChange={(event) => updateField(field.id, { maxSizeMB: Number(event.target.value || 4) })}
//                   />
//                 </div>
//               </div>
//             ) : null}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { GripVertical, Plus, Sparkles, Trash2, Upload } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

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
  "PAGE_BREAK",
];

const newField = (type = "TEXT") => ({
  id: crypto.randomUUID(),
  type,
  title:
    type === "EMAIL"
      ? "Email Address"
      : type === "URL"
        ? "Website URL"
        : type === "CHECKBOX_GROUP"
          ? "Checkbox Question"
          : type === "LINEAR_SCALE"
            ? "Rating"
            : type === "PAGE_BREAK"
              ? "Section Break"
              : "Untitled field",
  description:
    type === "EMAIL"
      ? "We use this to prevent duplicate submissions."
      : type === "URL"
        ? "Paste a valid URL."
        : type === "LINEAR_SCALE"
          ? "Rate this on the scale below."
          : "",
  placeholder:
    type === "PARAGRAPH"
      ? "Write your answer"
      : type === "EMAIL"
        ? "name@example.com"
        : type === "URL"
          ? "https://example.com"
          : "",
  required: type === "EMAIL",
  options:
    type === "MULTIPLE_CHOICE" || type === "DROPDOWN"
      ? [
          { label: "Option 1", value: "Option 1" },
          { label: "Option 2", value: "Option 2" },
          { label: "Option 3", value: "Option 3" }
        ]
      : type === "CHECKBOX_GROUP"
        ? [
            { label: "Option 1", value: "Option 1" },
            { label: "Option 2", value: "Option 2" },
            { label: "Option 3", value: "Option 3" }
          ]
        : [],
  accept: type === "FILE" ? ["image/*", "application/pdf"] : [],
  maxFiles: 1,
  maxSizeMB: 4,
  scaleMin: type === "LINEAR_SCALE" ? 1 : undefined,
  scaleMax: type === "LINEAR_SCALE" ? 5 : undefined,
  minLabel: type === "LINEAR_SCALE" ? "Poor" : undefined,
  maxLabel: type === "LINEAR_SCALE" ? "Excellent" : undefined,
  visibility: null
});


const morphFieldType = (field, nextType) => {
  const seed = newField(nextType);
  return {
    ...seed,
    id: field.id,
    title:
      nextType === "EMAIL"
        ? "Email Address"
        : nextType === "URL"
          ? "Website URL"
          : field.title,
    description:
      nextType === "EMAIL"
        ? "We use this to prevent duplicate submissions."
        : nextType === "URL"
          ? field.description || "Paste a valid URL."
          : nextType === "LINEAR_SCALE"
            ? field.description || "Rate this on the scale below."
            : field.description,
    required: nextType === "EMAIL" ? true : field.required,
    placeholder:
      nextType === "PARAGRAPH"
        ? field.placeholder || "Write your answer"
        : nextType === "FILE" || nextType === "PAGE_BREAK" || nextType === "LINEAR_SCALE"
          ? ""
          : nextType === "EMAIL"
            ? "name@example.com"
            : nextType === "URL"
              ? "https://example.com"
              : field.placeholder
  };
};


export default function FormBuilder({
  form,
  onFormChange,
  onGenerateMore,
  generating,
}) {
  const updateForm = (patch) => onFormChange({ ...form, ...patch });

  const updateField = (fieldId, patch) => {
    const fields = form.fields.map((field) =>
      field.id === fieldId ? { ...field, ...patch } : field,
    );
    updateForm({ fields });
  };

  const removeField = (fieldId) => {
    const targetField = form.fields.find((field) => field.id === fieldId);
    const lockedEmailField =
      form.allowMultipleResponses === false && targetField?.type === "EMAIL";

    if (lockedEmailField) {
      return;
    }

    updateForm({ fields: form.fields.filter((field) => field.id !== fieldId) });
  };

  const moveField = (fieldId, direction) => {
    const index = form.fields.findIndex((field) => field.id === fieldId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= form.fields.length) return;

    const fields = [...form.fields];
    const [field] = fields.splice(index, 1);
    fields.splice(nextIndex, 0, field);
    updateForm({ fields });
  };

  const updateOption = (fieldId, optionIndex, value) => {
    const field = form.fields.find((item) => item.id === fieldId);
    const options = [...(field.options || [])];
    options[optionIndex] = { label: value, value };
    updateField(fieldId, { options });
  };

  const addOption = (fieldId) => {
    const field = form.fields.find((item) => item.id === fieldId);
    const current = field.options || [];
    updateField(fieldId, {
      options: [
        ...current,
        {
          label: `Option ${current.length + 1}`,
          value: `Option ${current.length + 1}`,
        },
      ],
    });
  };

  const hasEmailField = form.fields.some((field) => field.type === "EMAIL");

  const handleMultipleResponseToggle = (checked) => {
    if (!checked && !hasEmailField) {
      updateForm({
        allowMultipleResponses: false,
        fields: [newField("EMAIL"), ...form.fields],
      });
      return;
    }

    updateForm({ allowMultipleResponses: checked });
  };

  return (
    <div className="glass rounded-[2rem] p-5 shadow-neon md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
            Form Builder
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
            Polish the generated form
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Add clear form descriptions, upload fields, helper text, and
            production-ready validation before publishing.
          </p>
        </div>
        <Button
          onClick={onGenerateMore}
          loading={generating}
          className="md:w-auto"
        >
          <Sparkles className="h-4 w-4" />
          Regenerate with AI
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        <Input
          label="Form title"
          value={form.title}
          onChange={(event) => updateForm({ title: event.target.value })}
        />
        <Input
          label="Form description"
          as="textarea"
          rows={4}
          value={form.description}
          onChange={(event) => updateForm({ description: event.target.value })}
          placeholder="Explain what this form is collecting, who should fill it, and upload expectations if files are required."
        />
      </div>

      <div className="mt-4 rounded-[1.6rem] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
        <label className="flex items-center justify-between gap-4 text-sm text-slate-700 dark:text-slate-200">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              Allow multiple responses
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Turn this off if each respondent should be allowed to submit only
              once.
            </p>
          </div>
          <input
            type="checkbox"
            checked={form.allowMultipleResponses ?? true}
            onChange={(event) =>
              handleMultipleResponseToggle(event.target.checked)
            }
          />
        </label>

        {form.allowMultipleResponses === false ? (
          <div className="mt-4 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            <p className="font-semibold">Single response mode is active</p>
            <p className="mt-1 text-xs text-amber-100/80">
              One response is enforced by submitted email address across
              browsers, devices, and operating systems.
            </p>
            {hasEmailField ? (
              <p className="mt-2 text-xs font-semibold text-emerald-200">
                Required Email field is present and will be used for duplicate
                prevention.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {FIELD_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() =>
              updateForm({ fields: [...form.fields, newField(type)] })
            }
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-slate-100 transition hover:border-blue-400/50 hover:bg-blue-500/10"
          >
            <span className="inline-flex items-center gap-2">
              {type === "FILE" ? (
                <Upload className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {type.replaceAll("_", " ")}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {form.fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-[1.6rem] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-500/15 p-2 text-blue-200">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Field {index + 1}
                  </p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    {field.type.replaceAll("_", " ")}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="px-3 py-2 text-xs"
                  onClick={() => moveField(field.id, -1)}
                  disabled={index === 0}
                >
                  Move up
                </Button>
                <Button
                  variant="secondary"
                  className="px-3 py-2 text-xs"
                  onClick={() => moveField(field.id, 1)}
                  disabled={index === form.fields.length - 1}
                >
                  Move down
                </Button>
                <Button
                  variant="secondary"
                  className="px-3 py-2 text-xs text-rose-200"
                  onClick={() => removeField(field.id)}
                  disabled={
                    form.allowMultipleResponses === false &&
                    field.type === "EMAIL"
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input
                label="Question title"
                value={field.title}
                onChange={(event) =>
                  updateField(field.id, { title: event.target.value })
                }
              />

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Field type
                </span>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 dark:border-white/10 dark:bg-white/10 dark:text-white"
                  value={field.type}
                  onChange={(event) => {
                    const nextType = event.target.value;
                    updateField(field.id, morphFieldType(field, nextType));
                  }}
                >
                  {FIELD_TYPES.map((type) => (
                    <option key={type} value={type} className="text-slate-900">
                      {type.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <Input
                label="Help text"
                value={field.description}
                onChange={(event) =>
                  updateField(field.id, { description: event.target.value })
                }
                placeholder="Add context, instructions, or upload guidance."
              />

              <Input
                label="Placeholder"
                value={field.placeholder || ""}
                onChange={(event) =>
                  updateField(field.id, { placeholder: event.target.value })
                }
                placeholder={
                  field.type === "FILE" ||
                  field.type === "LINEAR_SCALE" ||
                  field.type === "PAGE_BREAK"
                    ? "Not used"
                    : "Placeholder text"
                }
                disabled={
                  field.type === "FILE" ||
                  field.type === "LINEAR_SCALE" ||
                  field.type === "PAGE_BREAK"
                }
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={field.required || field.type === "EMAIL"}
                  onChange={(event) =>
                    updateField(field.id, {
                      required:
                        field.type === "EMAIL" ? true : event.target.checked,
                    })
                  }
                  disabled={field.type === "EMAIL"}
                />
                {field.type === "EMAIL"
                  ? "Required question (locked for single-response mode)"
                  : "Required question"}
              </label>
            </div>

            {["MULTIPLE_CHOICE", "DROPDOWN", "CHECKBOX_GROUP"].includes(
              field.type,
            ) ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Options
                  </p>
                  <Button
                    variant="secondary"
                    className="px-3 py-2 text-xs"
                    onClick={() => addOption(field.id)}
                  >
                    Add option
                  </Button>
                </div>
                {(field.options || []).map((option, optionIndex) => (
                  <Input
                    key={`${field.id}-${optionIndex}`}
                    value={option.label}
                    onChange={(event) =>
                      updateOption(field.id, optionIndex, event.target.value)
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                ))}
              </div>
            ) : null}

            {field.type === "LINEAR_SCALE" ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label="Scale minimum"
                  type="number"
                  min="1"
                  max="10"
                  value={field.scaleMin || 1}
                  onChange={(event) =>
                    updateField(field.id, {
                      scaleMin: Number(event.target.value || 1),
                    })
                  }
                />
                <Input
                  label="Scale maximum"
                  type="number"
                  min="2"
                  max="10"
                  value={field.scaleMax || 5}
                  onChange={(event) =>
                    updateField(field.id, {
                      scaleMax: Number(event.target.value || 5),
                    })
                  }
                />
                <Input
                  label="Minimum label"
                  value={field.minLabel || "Poor"}
                  onChange={(event) =>
                    updateField(field.id, { minLabel: event.target.value })
                  }
                />
                <Input
                  label="Maximum label"
                  value={field.maxLabel || "Excellent"}
                  onChange={(event) =>
                    updateField(field.id, { maxLabel: event.target.value })
                  }
                />
              </div>
            ) : null}

            {field.type === "FILE" ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label="Accepted file types"
                  value={(field.accept || []).join(", ")}
                  onChange={(event) =>
                    updateField(field.id, {
                      accept: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                  helper="Example: image/*, application/pdf, video/*"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Max files"
                    type="number"
                    min="1"
                    max="5"
                    value={field.maxFiles || 1}
                    onChange={(event) =>
                      updateField(field.id, {
                        maxFiles: Number(event.target.value || 1),
                      })
                    }
                  />
                  <Input
                    label="Max size (MB)"
                    type="number"
                    min="1"
                    max="10"
                    value={field.maxSizeMB || 4}
                    onChange={(event) =>
                      updateField(field.id, {
                        maxSizeMB: Number(event.target.value || 4),
                      })
                    }
                  />
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
