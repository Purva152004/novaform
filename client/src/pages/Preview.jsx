// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { ArrowLeft, Eye, Save, Share2 } from "lucide-react";
// import api from "../lib/api";
// import { useToast } from "../components/ToastProvider";
// import FormBuilder from "../components/FormBuilder";
// import FormRenderer from "../components/FormRenderer";
// import Button from "../components/ui/Button";
// import { copyToClipboard } from "../lib/utils";

// function ConfettiBanner() {
//   const component = window.ReactConfetti?.default || window.ReactConfetti;
//   if (!component || !window.React) return null;
//   return window.React.createElement(component, {
//     width: window.innerWidth,
//     height: 260,
//     recycle: false,
//     numberOfPieces: 160,
//     gravity: 0.18
//   });
// }

// export default function Preview() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { pushToast } = useToast();
//   const [form, setForm] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [regenerating, setRegenerating] = useState(false);

//   const publicLink = useMemo(() => `${window.location.origin}/form/${id}`, [id]);

//   const loadForm = async () => {
//     try {
//       const { data } = await api.get(`/forms/${id}/edit`);
//       setForm(data.form);
//     } catch (error) {
//       pushToast({ title: "Could not load form", description: error.response?.data?.message, tone: "error" });
//       navigate("/");
//     }
//   };

//   useEffect(() => {
//     loadForm();
//   }, [id]);

//   const saveForm = async () => {
//     setSaving(true);
//     try {
//       const payload = {
//         title: form.title,
//         description: form.description,
//         prompt: form.prompt,
//         fieldCount: form.fieldCount || form.fields.length,
//         requiredByDefault: form.requiredByDefault,
//         types: form.types,
//         fields: form.fields,
//         published: form.published
//       };
//       const { data } = await api.put(`/forms/${id}`, payload);
//       setForm(data.form);
//       pushToast({ title: "Form saved", description: "Preview and public form are now in sync." });
//     } catch (error) {
//       pushToast({ title: "Save failed", description: error.response?.data?.message, tone: "error" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const regenerate = async () => {
//     setRegenerating(true);
//     try {
//       const { data } = await api.post("/forms/generate-form/auth", {
//         title: form.title,
//         description: form.description,
//         prompt: form.prompt || "general survey",
//         numFields: Math.min(Math.max(form.fields.length || 6, 3), 20),
//         requiredByDefault: form.requiredByDefault,
//         types: form.types?.length ? form.types : ["TEXT", "EMAIL", "FILE"]
//       });
//       pushToast({ title: "Form regenerated", description: "A fresh AI version replaced the draft." });
//       navigate(`/preview/${data.form._id}`);
//     } catch (error) {
//       pushToast({ title: "Regeneration failed", description: error.response?.data?.message, tone: "error" });
//     } finally {
//       setRegenerating(false);
//     }
//   };

//   if (!form) {
//     return <div className="glass rounded-[2rem] p-6 text-slate-300">Loading preview...</div>;
//   }

//   return (
//     <div className="space-y-6 pb-16">
//       <div className="glass relative overflow-hidden rounded-[2rem] p-6 shadow-neon">
//         <div className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-80">
//           <ConfettiBanner />
//         </div>
//         <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white">
//               <ArrowLeft className="h-4 w-4" />
//               Back to workspace
//             </Link>
//             <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">Preview and refine your form</h1>
//             <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
//               Edit fields, descriptions, file uploads, and helper text while checking the live public experience side by side.
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             <Button
//               variant="secondary"
//               onClick={async () => {
//                 await copyToClipboard(publicLink);
//                 pushToast({ title: "Public link copied", description: publicLink });
//               }}
//             >
//               <Share2 className="h-4 w-4" />
//               Copy share link
//             </Button>
//             <Button variant="secondary" onClick={() => window.open(publicLink, "_blank", "noopener,noreferrer")}>
//               <Eye className="h-4 w-4" />
//               Open public form
//             </Button>
//             <Button onClick={saveForm} loading={saving}>
//               <Save className="h-4 w-4" />
//               Save changes
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
//         <FormBuilder form={form} onFormChange={setForm} onGenerateMore={regenerate} generating={regenerating} />
//         <FormRenderer
//           form={form}
//           livePreview
//           onSubmit={async () => {
//             pushToast({ title: "Preview check complete", description: "Test submission stays in preview mode until you open the public form." });
//           }}
//         />
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Save, Share2 } from "lucide-react";
import api from "../lib/api";
import { useToast } from "../components/ToastProvider";
import FormBuilder from "../components/FormBuilder";
import FormRenderer from "../components/FormRenderer";
import Button from "../components/ui/Button";
import { copyToClipboard } from "../lib/utils";

function ConfettiBanner() {
  return null;
}

export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const publicLink = useMemo(() => `${window.location.origin}/form/${id}`, [id]);

  const loadForm = async () => {
    try {
      const { data } = await api.get(`/forms/${id}/edit`);
      setForm(data.form);
    } catch (error) {
      pushToast({ title: "Could not load form", description: error.response?.data?.message, tone: "error" });
      navigate("/");
    }
  };

  useEffect(() => {
    loadForm();
  }, [id]);

  const saveForm = async () => {
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        prompt: form.prompt,
        fieldCount: form.fields.length,
        requiredByDefault: form.requiredByDefault,
        allowMultipleResponses: form.allowMultipleResponses ?? true,
        types: form.types,
        fields: form.fields,
        published: form.published
      };
      const { data } = await api.put(`/forms/${id}`, payload);
      setForm(data.form);
      pushToast({ title: "Form saved", description: "Preview and public form are now in sync." });
    } catch (error) {
      pushToast({ title: "Save failed", description: error.response?.data?.message, tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const regenerate = async () => {
    setRegenerating(true);
    try {
      const { data } = await api.post("/forms/generate-form/auth", {
        title: form.title,
        description: form.description,
        prompt: form.prompt || "general survey",
        numFields: Math.min(Math.max(form.fields.length || 6, 3), 100),

        requiredByDefault: form.requiredByDefault,
        types: form.types?.length ? form.types : ["TEXT", "EMAIL", "FILE"]
      });
      pushToast({ title: "Form regenerated", description: "A fresh AI version replaced the draft." });
      navigate(`/preview/${data.form._id}`);
    } catch (error) {
      pushToast({ title: "Regeneration failed", description: error.response?.data?.message, tone: "error" });
    } finally {
      setRegenerating(false);
    }
  };

  if (!form) {
    return <div className="glass rounded-[2rem] p-6 text-slate-300">Loading preview...</div>;
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="glass relative overflow-hidden rounded-[2rem] p-6 shadow-neon">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-80">
          <ConfettiBanner />
        </div>
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to workspace
            </Link>
            <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">Preview and refine your form</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Edit fields, descriptions, file uploads, helper text while checking the live public experience side by side.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={async () => {
                await copyToClipboard(publicLink);
                pushToast({ title: "Public link copied", description: publicLink });
              }}
            >
              <Share2 className="h-4 w-4" />
              Copy share link
            </Button>
            <Button variant="secondary" onClick={() => window.open(publicLink, "_blank", "noopener,noreferrer")}>
              <Eye className="h-4 w-4" />
              Open public form
            </Button>
            <Button onClick={saveForm} loading={saving}>
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <FormBuilder form={form} onFormChange={setForm} onGenerateMore={regenerate} generating={regenerating} />
        <FormRenderer
          form={form}
          livePreview
          onSubmit={async () => {
            pushToast({ title: "Preview check complete", description: "Test submission stays in preview mode until you open the public form." });
          }}
        />
      </div>
    </div>
  );
}
