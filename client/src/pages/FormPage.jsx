
// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { CheckCircle2, LockKeyhole } from "lucide-react";
// import api from "../lib/api";
// import FormRenderer from "../components/FormRenderer";
// import { useToast } from "../components/ToastProvider";

// const getFingerprintKey = (formId) => `nova-form-respondent:${formId}`;

// const getOrCreateFingerprint = (formId) => {
//   const key = getFingerprintKey(formId);
//   const existing = localStorage.getItem(key);
//   if (existing) return existing;

//   const created =
//     typeof crypto !== "undefined" && crypto.randomUUID
//       ? crypto.randomUUID()
//       : `resp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

//   localStorage.setItem(key, created);
//   return created;
// };

// export default function FormPage() {
//   const { id } = useParams();
//   const { pushToast } = useToast();
//   const [form, setForm] = useState(null);
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         const { data } = await api.get(`/forms/${id}`);
//         setForm(data.form);
//       } catch (error) {
//         pushToast({ title: "Form unavailable", description: error.response?.data?.message, tone: "error" });
//       }
//     };
//     fetchForm();
//   }, [id, pushToast]);

//   if (!form) {
//     return <div className="glass rounded-[2rem] p-6 text-slate-300">Loading public form...</div>;
//   }

//   return (
//     <div className="mx-auto max-w-4xl space-y-6 pb-16">
//       <div className="glass mesh rounded-[2rem] p-6 shadow-neon md:p-8">
//         <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Public form</p>
//         <h1 className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-white">{form.title}</h1>
//         {form.description ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{form.description}</p> : null}
//         <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
//           <LockKeyhole className="h-3.5 w-3.5" />
//           {form.allowMultipleResponses ? "Multiple responses allowed" : "One response per user/device"}
//         </div>
//       </div>

//       {submitted ? (
//         <div className="glass rounded-[2rem] p-8 text-center shadow-neon">
//           <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-300" />
//           <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">Response submitted</h2>
//           <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
//             Thanks for completing the form.
//           </p>

//           {form.allowMultipleResponses ? (
//             <button
//               onClick={() => setSubmitted(false)}
//               className="mt-5 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white"
//             >
//               Submit another response
//             </button>
//           ) : (
//             <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
//               This form only allows one response.
//             </p>
//           )}
//         </div>
//       ) : (
//         <FormRenderer
//           form={form}
//           onSubmit={async (answers) => {
//             const respondentFingerprint = getOrCreateFingerprint(id);
//             await api.post(`/responses/${id}`, { answers, respondentFingerprint });
//             setSubmitted(true);
//           }}
//         />
//       )}

//       <p className="text-center text-xs text-slate-500 dark:text-slate-400">
//         Powered by Nova Forms AI • <Link className="text-blue-200 hover:underline" to="/">Create your own</Link>
//       </p>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import api from "../lib/api";
import FormRenderer from "../components/FormRenderer";
import { useToast } from "../components/ToastProvider";

export default function FormPage() {
  const { id } = useParams();
  const { pushToast } = useToast();
  const [form, setForm] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data } = await api.get(`/forms/${id}`);
        setForm(data.form);
      } catch (error) {
        pushToast({
          title: "Form unavailable",
          description: error.response?.data?.message,
          tone: "error"
        });
      }
    };

    fetchForm();
  }, [id, pushToast]);

  if (!form) {
    return <div className="glass rounded-[2rem] p-6 text-slate-300">Loading public form...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      <div className="glass mesh rounded-[2rem] p-6 shadow-neon md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Public form</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-white">
          {form.title}
        </h1>
        {form.description ? (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{form.description}</p>
        ) : null}

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          <LockKeyhole className="h-3.5 w-3.5" />
          {form.allowMultipleResponses
            ? "Multiple responses allowed"
            : "One response per email"}
        </div>
      </div>

      {submitted ? (
        <div className="glass rounded-[2rem] p-8 text-center shadow-neon">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-300" />
          <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">
            Response submitted
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Thanks for completing the form.
          </p>

          {form.allowMultipleResponses ? (
            <button
              onClick={() => setSubmitted(false)}
              className="mt-5 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white"
            >
              Submit another response
            </button>
          ) : (
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              This form only allows one response per email address.
            </p>
          )}
        </div>
      ) : (
        <FormRenderer
          form={form}
          onSubmit={async (answers) => {
            await api.post(`/responses/${id}`, { answers });
            setSubmitted(true);
          }}
        />
      )}

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Powered by Nova Forms AI •{" "}
        <Link className="text-blue-200 hover:underline" to="/">
          Create your own
        </Link>
      </p>
    </div>
  );
}
