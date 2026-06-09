// import OpenAI from "openai";

// const SUPPORTED_TYPES = [
//   "TEXT",
//   "PARAGRAPH",
//   "MULTIPLE_CHOICE",
//   "DROPDOWN",
//   "DATE",
//   "EMAIL",
//   "NUMBER",
//   "FILE",
//   "CHECKBOX_GROUP",
//   "LINEAR_SCALE",
//   "PAGE_BREAK"
// ];

// const buildId = () =>
//   `fld_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

// const toTitleCase = (value) =>
//   String(value || "")
//     .replace(/\s+/g, " ")
//     .trim()
//     .replace(/\burl\b/gi, "URL")
//     .replace(/\bcgpa\b/gi, "CGPA")
//     .replace(/\bgpa\b/gi, "GPA")
//     .replace(/\blinkedin\b/gi, "LinkedIn")
//     .replace(/\bgithub\b/gi, "GitHub")
//     .replace(/\bapi\b/gi, "API")
//     .replace(/\b\w/g, (char) => char.toUpperCase());

// const stripCodeFence = (text) =>
//   String(text || "")
//     .replace(/^```(?:json)?\s*/i, "")
//     .replace(/```$/i, "")
//     .trim();

// const safeJsonParse = (text) => {
//   try {
//     return JSON.parse(stripCodeFence(text));
//   } catch {
//     return null;
//   }
// };

// const extractRequestedFieldNames = (prompt = "") => {
//   const text = String(prompt || "").replace(/\s+/g, " ").trim();
//   if (!text) return [];

//   const patterns = [
//     /fields?\s+for\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
//     /includes?\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
//     /with\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
//     /with\s+the\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i
//   ];

//   let captured = "";
//   for (const pattern of patterns) {
//     const match = text.match(pattern);
//     if (match?.[1]) {
//       captured = match[1];
//       break;
//     }
//   }

//   if (!captured) return [];

//   return [...new Set(
//     captured
//       .replace(/\band an additional\b/gi, ", additional")
//       .replace(/\band additional\b/gi, ", additional")
//       .replace(/\band\b/gi, ",")
//       .split(",")
//       .map((item) =>
//         item
//           .replace(/^for\s+/i, "")
//           .replace(/^a\s+/i, "")
//           .replace(/^an\s+/i, "")
//           .replace(/^the\s+/i, "")
//           .replace(/\s+field$/i, "")
//           .replace(/\s+fields$/i, "")
//           .trim()
//       )
//       .filter(Boolean)
//   )].slice(0, 100);
// };

// const inferFieldType = (name) => {
//   const value = name.toLowerCase();

//   if (value.includes("email")) return "EMAIL";
//   if (value.includes("rating") || value.includes("scale")) return "LINEAR_SCALE";
//   if (value.includes("checkbox") || value.includes("select all that apply")) return "CHECKBOX_GROUP";
//   if (
//     value.includes("resume") ||
//     value.includes("photo upload") ||
//     value.includes("profile photo") ||
//     value.includes("passport") ||
//     value.includes("aadhaar") ||
//     value.includes("pan card") ||
//     value.includes("document") ||
//     value.includes("certificate") ||
//     value.includes("attachment") ||
//     value.includes("upload") ||
//     value.includes("file")
//   ) {
//     return "FILE";
//   }
//   if (
//     value.includes("career goal") ||
//     value.includes("objective") ||
//     value.includes("experience") ||
//     value.includes("skills") ||
//     value.includes("summary") ||
//     value.includes("feedback") ||
//     value.includes("address")
//   ) {
//     return "PARAGRAPH";
//   }
//   if (value.includes("date of birth") || value === "dob" || value.includes("joining date")) return "DATE";
//   if (value.includes("gender") || value.includes("marital") || value.includes("preferred job role")) return "DROPDOWN";
//   if (value.includes("willing") || value.includes("relocate") || value.includes("yes/no")) return "MULTIPLE_CHOICE";
//   if (
//     value.includes("age") ||
//     value.includes("semester") ||
//     value.includes("cgpa") ||
//     value.includes("gpa") ||
//     value.includes("marks") ||
//     value.includes("passing year") ||
//     value.includes("year") ||
//     value.includes("score") ||
//     value.includes("rank") ||
//     value.includes("phone") ||
//     value.includes("mobile") ||
//     value.includes("roll")
//   ) {
//     return "NUMBER";
//   }
//   return "TEXT";
// };

// const buildDefaultOptions = (title, type) => {
//   const lower = title.toLowerCase();

//   if (type === "DROPDOWN" && lower.includes("gender")) {
//     return ["Male", "Female", "Other", "Prefer not to say"];
//   }
//   if (type === "MULTIPLE_CHOICE" && (lower.includes("relocate") || lower.includes("willing"))) {
//     return ["Yes", "No"];
//   }
//   if (type === "CHECKBOX_GROUP") {
//     return ["Option 1", "Option 2", "Option 3"];
//   }
//   if (type === "DROPDOWN" || type === "MULTIPLE_CHOICE") {
//     return ["Option 1", "Option 2", "Option 3"];
//   }
//   return [];
// };

// const buildDescription = (title, type) => {
//   if (type === "FILE") return `Upload your ${title.toLowerCase()}.`;
//   if (type === "PARAGRAPH") return `Provide details for ${title.toLowerCase()}.`;
//   if (type === "LINEAR_SCALE") return `Rate ${title.toLowerCase()} on the scale below.`;
//   if (type === "DROPDOWN" || type === "MULTIPLE_CHOICE" || type === "CHECKBOX_GROUP") {
//     return `Select your ${title.toLowerCase()}.`;
//   }
//   return `Enter your ${title.toLowerCase()}.`;
// };

// const buildPlaceholder = (title, type) => {
//   if (type === "PARAGRAPH") return "Write your answer";
//   if (type === "FILE" || type === "DATE" || type === "PAGE_BREAK") return "";
//   if (type === "EMAIL") return "name@example.com";
//   return `Enter ${title.toLowerCase()}`;
// };

// const normalizeField = (field) => ({
//   id: field.id || buildId(),
//   type: field.type,
//   title: field.title,
//   description: field.description || "",
//   placeholder: buildPlaceholder(field.title, field.type),
//   required: Boolean(field.required),
//   options: ["MULTIPLE_CHOICE", "DROPDOWN", "CHECKBOX_GROUP"].includes(field.type)
//     ? (field.options || []).map((option) =>
//         typeof option === "string" ? { label: option, value: option } : option
//       )
//     : [],
//   accept: field.type === "FILE" ? field.accept || ["image/*", "application/pdf"] : [],
//   maxFiles: field.type === "FILE" ? Math.min(Math.max(field.maxFiles || 1, 1), 5) : 1,
//   maxSizeMB: field.type === "FILE" ? Math.min(Math.max(field.maxSizeMB || 8, 1), 25) : 8,
//   scaleMin: field.type === "LINEAR_SCALE" ? field.scaleMin || 1 : undefined,
//   scaleMax: field.type === "LINEAR_SCALE" ? field.scaleMax || 5 : undefined,
//   minLabel: field.type === "LINEAR_SCALE" ? field.minLabel || "Low" : undefined,
//   maxLabel: field.type === "LINEAR_SCALE" ? field.maxLabel || "High" : undefined,
//   visibility: field.visibility || null
// });

// const dedupeFields = (fields) => {
//   const seen = new Set();
//   return fields.filter((field) => {
//     const key = `${field.type}::${field.title.trim().toLowerCase()}`;
//     if (seen.has(key)) return false;
//     seen.add(key);
//     return true;
//   });
// };

// const buildSkeletonFields = ({ requestedFields, requiredByDefault, allowedTypes }) =>
//   requestedFields.map((name) => {
//     let type = inferFieldType(name);
//     if (!allowedTypes.includes(type)) {
//       type = allowedTypes[0] || "TEXT";
//     }

//     return normalizeField({
//       id: buildId(),
//       type,
//       title: toTitleCase(name),
//       description: buildDescription(name, type),
//       required: requiredByDefault || ["EMAIL", "TEXT", "NUMBER", "FILE"].includes(type),
//       options: buildDefaultOptions(name, type)
//     });
//   });

// const buildGenericFields = ({ numFields, types, requiredByDefault }) =>
//   Array.from({ length: numFields }).map((_, index) => {
//     const type = types[index % types.length] || "TEXT";
//     const title = `${type.replaceAll("_", " ")} Field ${index + 1}`;
//     return normalizeField({
//       id: buildId(),
//       type,
//       title,
//       description: buildDescription(title, type),
//       required: requiredByDefault,
//       options: buildDefaultOptions(title, type)
//     });
//   });

// const buildAiPrompt = ({ skeletonFields, prompt, requiredByDefault }) => {
//   const compact = skeletonFields.map((field, index) => ({
//     index,
//     title: field.title,
//     type: field.type
//   }));

//   return [
//     "Return valid JSON only.",
//     `Return exactly this shape: {"fields":[{"index":0,"title":"Field Title","type":"TEXT","description":"Helpful guidance","required":true,"options":["A","B"],"scaleMin":1,"scaleMax":5,"minLabel":"Low","maxLabel":"High"}]}.`,
//     `There must be exactly ${skeletonFields.length} fields.`,
//     `Keep the same field order. Requested form intent: ${prompt || "general survey"}.`,
//     `Fields to enrich: ${JSON.stringify(compact)}.`,
//     `Required preference: ${requiredByDefault ? "mostly required" : "balanced optional/required"}.`,
//     "For MULTIPLE_CHOICE, DROPDOWN, and CHECKBOX_GROUP include 2-5 options.",
//     "For FILE do not include options.",
//     "Do not include markdown. Do not include explanations."
//   ].join(" ");
// };

// const mergeAiIntoSkeleton = (skeletonFields, aiContent, requiredByDefault) => {
//   const parsed = safeJsonParse(aiContent);
//   const rawFields = Array.isArray(parsed) ? parsed : parsed?.fields;
//   if (!Array.isArray(rawFields)) return skeletonFields;

//   return skeletonFields.map((baseField, index) => {
//     const aiField = rawFields.find((item, idx) => (item?.index ?? idx) === index);
//     if (!aiField) return baseField;

//     const nextType = SUPPORTED_TYPES.includes(aiField.type) ? aiField.type : baseField.type;
//     const merged = normalizeField({
//       ...baseField,
//       type: nextType,
//       title: aiField.title ? toTitleCase(aiField.title) : baseField.title,
//       description: aiField.description || baseField.description,
//       required: requiredByDefault ? true : Boolean(aiField.required ?? baseField.required),
//       options: aiField.options?.length ? aiField.options : baseField.options,
//       scaleMin: aiField.scaleMin,
//       scaleMax: aiField.scaleMax,
//       minLabel: aiField.minLabel,
//       maxLabel: aiField.maxLabel
//     });

//     return merged;
//   });
// };

// const withTimeout = async (promiseFactory, ms) => {
//   const controller = new AbortController();
//   const timer = setTimeout(() => controller.abort(), ms);

//   try {
//     return await promiseFactory(controller.signal);
//   } finally {
//     clearTimeout(timer);
//   }
// };

// const generateWithAI = async ({ prompt, skeletonFields, requiredByDefault }) => {
//   const client = new OpenAI({
//     apiKey: process.env.LLM_API_KEY,
//     baseURL: process.env.LLM_BASE_URL
//   });

//   const models = [process.env.LLM_MODEL_PRIMARY, process.env.LLM_MODEL_FALLBACK].filter(Boolean);

//   for (const model of models) {
//     for (let attempt = 1; attempt <= 2; attempt += 1) {
//       try {
//         const response = await withTimeout(
//           (signal) =>
//             client.chat.completions.create(
//               {
//                 model,
//                 temperature: 0.15,
//                 messages: [
//                   {
//                     role: "system",
//                     content: "You enrich form metadata. Return valid JSON only."
//                   },
//                   {
//                     role: "user",
//                     content: buildAiPrompt({ skeletonFields, prompt, requiredByDefault })
//                   }
//                 ]
//               },
//               { signal }
//             ),
//           15000
//         );

//         const content = response?.choices?.[0]?.message?.content;
//         if (!content) continue;

//         const merged = mergeAiIntoSkeleton(skeletonFields, content, requiredByDefault);
//         if (merged.length === skeletonFields.length) {
//           return dedupeFields(merged);
//         }
//       } catch {
//         if (attempt === 2) break;
//       }
//     }
//   }

//   return dedupeFields(skeletonFields);
// };

// export async function planFormFields({ prompt, numFields, types, requiredByDefault }) {
//   const requestedFields = extractRequestedFieldNames(prompt);
//   const explicitMode = requestedFields.length > 0;
//   const effectiveFieldCount = explicitMode ? requestedFields.length : numFields;

//   const skeletonFields = explicitMode
//     ? buildSkeletonFields({
//         requestedFields,
//         requiredByDefault,
//         allowedTypes: types
//       })
//     : buildGenericFields({
//         numFields: effectiveFieldCount,
//         types,
//         requiredByDefault
//       });

//   const fields = await generateWithAI({
//     prompt,
//     skeletonFields,
//     requiredByDefault
//   });

//   return {
//     fields: dedupeFields(fields).slice(0, effectiveFieldCount),
//     explicitMode,
//     requestedFieldCount: requestedFields.length,
//     finalFieldCount: effectiveFieldCount
//   };
// }
import OpenAI from "openai";

const MAX_FORM_FIELDS = 100;

const SUPPORTED_TYPES = [
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

const buildId = () =>
  `fld_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const toTitleCase = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\burl\b/gi, "URL")
    .replace(/\bcgpa\b/gi, "CGPA")
    .replace(/\bgpa\b/gi, "GPA")
    .replace(/\blinkedin\b/gi, "LinkedIn")
    .replace(/\bgithub\b/gi, "GitHub")
    .replace(/\bapi\b/gi, "API")
    .replace(/\bifsc\b/gi, "IFSC")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const stripCodeFence = (text) =>
  String(text || "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

const safeJsonParse = (text) => {
  try {
    return JSON.parse(stripCodeFence(text));
  } catch {
    return null;
  }
};

const normalizeText = (value) => String(value || "").toLowerCase().trim();

const isUrlLikeField = (value) => {
  const text = normalizeText(value);
  return (
    text.includes("url") ||
    text.includes("website") ||
    text.includes("web site") ||
    text.includes("linkedin") ||
    text.includes("github") ||
    text.includes("portfolio") ||
    text.includes("profile link") ||
    text.includes("link ")
  );
};

const isNameLikeField = (value) => {
  const text = normalizeText(value);
  return (
    text.endsWith(" name") ||
    text === "name" ||
    text.includes("full name") ||
    text.includes("manager name") ||
    text.includes("employee name") ||
    text.includes("contact name") ||
    text.includes("emergency contact name") ||
    text.includes("account holder name")
  );
};

const isFileLikeField = (value) => {
  const text = normalizeText(value);
  return (
    text.includes("resume") ||
    text.includes("photo upload") ||
    text.includes("profile photo") ||
    text.includes("passport") ||
    text.includes("aadhaar") ||
    text.includes("pan card") ||
    text.includes("document") ||
    text.includes("certificate") ||
    text.includes("attachment") ||
    text.includes("upload") ||
    text.includes("file") ||
    text.includes("proof")
  );
};

const isParagraphLikeField = (value) => {
  const text = normalizeText(value);
  return (
    text.includes("career goal") ||
    text.includes("objective") ||
    text.includes("experience") ||
    text.includes("skills") ||
    text.includes("summary") ||
    text.includes("feedback") ||
    text.includes("address") ||
    text.includes("medical conditions") ||
    text.includes("medications") ||
    text.includes("allergies") ||
    text.includes("surgeries") ||
    text.includes("symptom description") ||
    text.includes("personal introduction") ||
    text.includes("introduction") ||
    text.includes("notes")
  );
};

const isDateLikeField = (value) => {
  const text = normalizeText(value);
  return (
    text.includes("date of birth") ||
    text === "dob" ||
    text.includes("joining date") ||
    text.includes("appointment date") ||
    text.includes("preferred appointment date") ||
    text.includes("probation end date")
  );
};

const isDropdownLikeField = (value) => {
  const text = normalizeText(value);
  return (
    text.includes("gender") ||
    text.includes("marital") ||
    text.includes("preferred job role") ||
    text.includes("blood group") ||
    text.includes("doctor department") ||
    text.includes("department") ||
    text.includes("employee type") ||
    text.includes("work location") ||
    text.includes("shift preference")
  );
};

const isCheckboxLikeField = (value) => {
  const text = normalizeText(value);
  return (
    text.includes("checkbox") ||
    text.includes("consent") ||
    text.includes("select all that apply") ||
    text.includes("equipment required")
  );
};

const isMultipleChoiceLikeField = (value) => {
  const text = normalizeText(value);
  return (
    text.includes("yes/no") ||
    text.includes("yes no") ||
    text.includes("willing") ||
    text.includes("relocate")
  );
};

const isLinearScaleLikeField = (value) => {
  const text = normalizeText(value);
  return (
    text.includes("rating") ||
    text.includes("out of 5") ||
    text.includes("scale") ||
    text.includes("satisfaction score")
  );
};

const isNumericLikeField = (value) => {
  const text = normalizeText(value);

  if (isNameLikeField(text) || isUrlLikeField(text)) {
    return false;
  }

  return (
    text.includes("age") ||
    text.includes("semester") ||
    text.includes("cgpa") ||
    text.includes("gpa") ||
    text.includes("marks") ||
    text.includes("passing year") ||
    text === "year" ||
    text.includes("score") ||
    text.includes("rank") ||
    text.includes("phone") ||
    text.includes("mobile") ||
    text.includes("roll") ||
    text.includes("employee id") ||
    text.includes("contact number") ||
    text.includes("account number") ||
    text.includes("policy number")
  );
};

const extractRequestedFieldNames = (prompt = "") => {
  const text = String(prompt || "").replace(/\s+/g, " ").trim();
  if (!text) return [];

  const patterns = [
    /fields?\s+for\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
    /includes?\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
    /with\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
    /with\s+the\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i
  ];

  let captured = "";
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      captured = match[1];
      break;
    }
  }

  if (!captured) return [];

  return [...new Set(
    captured
      .replace(/\band an additional\b/gi, ", additional")
      .replace(/\band additional\b/gi, ", additional")
      .replace(/\band\b/gi, ",")
      .split(",")
      .map((item) =>
        item
          .replace(/^for\s+/i, "")
          .replace(/^a\s+/i, "")
          .replace(/^an\s+/i, "")
          .replace(/^the\s+/i, "")
          .replace(/\s+field$/i, "")
          .replace(/\s+fields$/i, "")
          .trim()
      )
      .filter(Boolean)
  )].slice(0, MAX_FORM_FIELDS);
};

const inferFieldType = (name) => {
  const value = normalizeText(name);

  if (value.includes("email")) return "EMAIL";
  if (isUrlLikeField(value)) return "URL";
  if (isNameLikeField(value)) return "TEXT";
  if (isLinearScaleLikeField(value)) return "LINEAR_SCALE";
  if (isCheckboxLikeField(value)) return "CHECKBOX_GROUP";
  if (isFileLikeField(value)) return "FILE";
  if (isParagraphLikeField(value)) return "PARAGRAPH";
  if (isDateLikeField(value)) return "DATE";
  if (isDropdownLikeField(value)) return "DROPDOWN";
  if (isMultipleChoiceLikeField(value)) return "MULTIPLE_CHOICE";
  if (isNumericLikeField(value)) return "NUMBER";

  return "TEXT";
};

const buildDefaultOptions = (title, type) => {
  const lower = normalizeText(title);

  if (type === "DROPDOWN" && lower.includes("gender")) {
    return ["Male", "Female", "Other", "Prefer not to say"];
  }

  if (type === "DROPDOWN" && lower.includes("blood group")) {
    return ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  }

  if (type === "DROPDOWN" && lower.includes("doctor department")) {
    return ["General Medicine", "Cardiology", "Orthopedics", "Dermatology", "Pediatrics"];
  }

  if (type === "MULTIPLE_CHOICE") {
    return ["Yes", "No"];
  }

  if (type === "CHECKBOX_GROUP" && lower.includes("consent")) {
    return ["I agree"];
  }

  if (type === "CHECKBOX_GROUP" && lower.includes("equipment")) {
    return ["Laptop", "Monitor", "Keyboard", "Headset"];
  }

  if (type === "CHECKBOX_GROUP") {
    return ["Option 1", "Option 2", "Option 3"];
  }

  if (type === "DROPDOWN") {
    return ["Option 1", "Option 2", "Option 3"];
  }

  return [];
};

const buildDescription = (title, type) => {
  const lower = String(title || "").toLowerCase();

  if (type === "FILE") return `Upload your ${lower}.`;
  if (type === "PARAGRAPH") return `Provide details for ${lower}.`;
  if (type === "LINEAR_SCALE") return `Rate ${lower} on the scale below.`;
  if (type === "CHECKBOX_GROUP") return `Select applicable option(s) for ${lower}.`;
  if (type === "DROPDOWN" || type === "MULTIPLE_CHOICE") return `Select your ${lower}.`;
  if (type === "URL") return `Paste the URL for ${lower}.`;
  return `Enter your ${lower}.`;
};


const buildPlaceholder = (title, type) => {
  if (type === "PARAGRAPH") return "Write your answer";
  if (type === "FILE" || type === "DATE" || type === "PAGE_BREAK" || type === "LINEAR_SCALE") return "";
  if (type === "EMAIL") return "name@example.com";
  if (type === "URL") return "https://example.com/profile";
  return `Enter ${String(title || "").toLowerCase()}`;
};


const normalizeField = (field) => ({
  id: field.id || buildId(),
  type: field.type,
  title: field.title,
  description: field.description || "",
  placeholder: buildPlaceholder(field.title, field.type),
  required: Boolean(field.required),
  options: ["MULTIPLE_CHOICE", "DROPDOWN", "CHECKBOX_GROUP"].includes(field.type)
    ? (field.options || []).map((option) =>
        typeof option === "string" ? { label: option, value: option } : option
      )
    : [],
  accept: field.type === "FILE" ? field.accept || ["image/*", "application/pdf"] : [],
  maxFiles: field.type === "FILE" ? Math.min(Math.max(field.maxFiles || 1, 1), 5) : 1,
  maxSizeMB: field.type === "FILE" ? Math.min(Math.max(field.maxSizeMB || 8, 1), 25) : 8,
  scaleMin: field.type === "LINEAR_SCALE" ? field.scaleMin || 1 : undefined,
  scaleMax: field.type === "LINEAR_SCALE" ? field.scaleMax || 5 : undefined,
  minLabel: field.type === "LINEAR_SCALE" ? field.minLabel || "Poor" : undefined,
  maxLabel: field.type === "LINEAR_SCALE" ? field.maxLabel || "Excellent" : undefined,
  visibility: field.visibility || null
});

const dedupeFields = (fields) => {
  const seen = new Set();
  return fields.filter((field) => {
    const key = `${field.type}::${field.title.trim().toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const buildSkeletonFields = ({ requestedFields, requiredByDefault, allowedTypes }) =>
  requestedFields.map((name) => {
    let type = inferFieldType(name);
    if (!allowedTypes.includes(type)) {
      type = allowedTypes[0] || "TEXT";
    }

    return normalizeField({
      id: buildId(),
      type,
      title: toTitleCase(name),
      description: buildDescription(name, type),
      required:
        type === "CHECKBOX_GROUP"
          ? requiredByDefault
          : requiredByDefault || ["EMAIL", "TEXT", "NUMBER", "FILE", "LINEAR_SCALE"].includes(type),
      options: buildDefaultOptions(name, type),
      scaleMin: type === "LINEAR_SCALE" ? 1 : undefined,
      scaleMax: type === "LINEAR_SCALE" ? 5 : undefined,
      minLabel: type === "LINEAR_SCALE" ? "Poor" : undefined,
      maxLabel: type === "LINEAR_SCALE" ? "Excellent" : undefined
    });
  });

const buildGenericFields = ({ numFields, types, requiredByDefault }) =>
  Array.from({ length: numFields }).map((_, index) => {
    const type = types[index % types.length] || "TEXT";
    const title = `${type.replaceAll("_", " ")} Field ${index + 1}`;
    return normalizeField({
      id: buildId(),
      type,
      title,
      description: buildDescription(title, type),
      required: requiredByDefault,
      options: buildDefaultOptions(title, type),
      scaleMin: type === "LINEAR_SCALE" ? 1 : undefined,
      scaleMax: type === "LINEAR_SCALE" ? 5 : undefined,
      minLabel: type === "LINEAR_SCALE" ? "Poor" : undefined,
      maxLabel: type === "LINEAR_SCALE" ? "Excellent" : undefined
    });
  });

const buildAiPrompt = ({ skeletonFields, prompt, requiredByDefault, preserveTypes }) => {
  const compact = skeletonFields.map((field, index) => ({
    index,
    title: field.title,
    type: field.type
  }));

  return [
    "Return valid JSON only.",
    `Return exactly this shape: {"fields":[{"index":0,"title":"Field Title","type":"TEXT|PARAGRAPH|MULTIPLE_CHOICE|DROPDOWN|DATE|EMAIL|URL|NUMBER|FILE|CHECKBOX_GROUP|LINEAR_SCALE|PAGE_BREAK","description":"Helpful guidance","required":true,"options":["A","B"],"scaleMin":1,"scaleMax":5,"minLabel":"Poor","maxLabel":"Excellent"}]}.`,
    `There must be exactly ${skeletonFields.length} fields.`,
    `Keep the same field order. Requested form intent: ${prompt || "general survey"}.`,
    `Fields to enrich: ${JSON.stringify(compact)}.`,
    preserveTypes
      ? "Do not change field types. Preserve the provided type for each field and only improve wording, descriptions, options, and scale labels."
      : "Only change a field type if the title clearly requires a different type.",
    `Required preference: ${requiredByDefault ? "mostly required" : "balanced optional/required"}.`,
    "For MULTIPLE_CHOICE, DROPDOWN, and CHECKBOX_GROUP include 2-5 options.",
    "For FILE do not include options.",
    "For LINEAR_SCALE include scaleMin, scaleMax, minLabel, and maxLabel.",
    "Do not include markdown. Do not include explanations."
  ].join(" ");
};

const coerceFieldTypeByTitle = ({ title, aiType, baseType, preserveTypes }) => {
  const semanticType = inferFieldType(title);

  if (preserveTypes) {
    return baseType;
  }

  if (semanticType === "TEXT" && isNameLikeField(title)) return "TEXT";
  if (semanticType === "URL") return "URL";
  if (semanticType === "EMAIL") return "EMAIL";
  if (semanticType === "FILE") return "FILE";
  if (semanticType === "LINEAR_SCALE") return "LINEAR_SCALE";
  if (semanticType === "CHECKBOX_GROUP") return "CHECKBOX_GROUP";
  if (semanticType === "DATE") return "DATE";

  return SUPPORTED_TYPES.includes(aiType) ? aiType : baseType;
};

const mergeAiIntoSkeleton = (skeletonFields, aiContent, requiredByDefault, preserveTypes) => {
  const parsed = safeJsonParse(aiContent);
  const rawFields = Array.isArray(parsed) ? parsed : parsed?.fields;
  if (!Array.isArray(rawFields)) return skeletonFields;

  return skeletonFields.map((baseField, index) => {
    const aiField = rawFields.find((item, idx) => (item?.index ?? idx) === index);
    if (!aiField) return baseField;

    const nextTitle = aiField.title ? toTitleCase(aiField.title) : baseField.title;
    const nextType = coerceFieldTypeByTitle({
      title: nextTitle,
      aiType: aiField.type,
      baseType: baseField.type,
      preserveTypes
    });

    return normalizeField({
      ...baseField,
      type: nextType,
      title: nextTitle,
      description: aiField.description || buildDescription(nextTitle, nextType),
      required: requiredByDefault ? true : Boolean(aiField.required ?? baseField.required),
      options: aiField.options?.length ? aiField.options : baseField.options,
      scaleMin: nextType === "LINEAR_SCALE" ? aiField.scaleMin || baseField.scaleMin || 1 : undefined,
      scaleMax: nextType === "LINEAR_SCALE" ? aiField.scaleMax || baseField.scaleMax || 5 : undefined,
      minLabel: nextType === "LINEAR_SCALE" ? aiField.minLabel || baseField.minLabel || "Poor" : undefined,
      maxLabel: nextType === "LINEAR_SCALE" ? aiField.maxLabel || baseField.maxLabel || "Excellent" : undefined
    });
  });
};

const withTimeout = async (promiseFactory, ms) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    return await promiseFactory(controller.signal);
  } finally {
    clearTimeout(timer);
  }
};

const generateWithAI = async ({ prompt, skeletonFields, requiredByDefault, preserveTypes }) => {
  const client = new OpenAI({
    apiKey: process.env.LLM_API_KEY,
    baseURL: process.env.LLM_BASE_URL
  });

  const models = [
    process.env.LLM_MODEL_PRIMARY,
    process.env.LLM_MODEL_FALLBACK,
    process.env.LLM_MODEL
  ].filter(Boolean);

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await withTimeout(
          (signal) =>
            client.chat.completions.create(
              {
                model,
                temperature: 0.15,
                messages: [
                  {
                    role: "system",
                    content: "You enrich form metadata. Return valid JSON only."
                  },
                  {
                    role: "user",
                    content: buildAiPrompt({
                      skeletonFields,
                      prompt,
                      requiredByDefault,
                      preserveTypes
                    })
                  }
                ]
              },
              { signal }
            ),
          8000
        );

        const content = response?.choices?.[0]?.message?.content;
        if (!content) continue;

        const merged = mergeAiIntoSkeleton(
          skeletonFields,
          content,
          requiredByDefault,
          preserveTypes
        );

        if (merged.length === skeletonFields.length) {
          return dedupeFields(merged);
        }
      } catch {
        if (attempt === 2) break;
      }
    }
  }

  return dedupeFields(skeletonFields);
};

export async function planFormFields({ prompt, numFields, types, requiredByDefault }) {
  const requestedFields = extractRequestedFieldNames(prompt);
  const explicitMode = requestedFields.length > 0;
  const effectiveFieldCount = explicitMode ? requestedFields.length : numFields;

  const skeletonFields = explicitMode
    ? buildSkeletonFields({
        requestedFields,
        requiredByDefault,
        allowedTypes: types
      })
    : buildGenericFields({
        numFields: effectiveFieldCount,
        types,
        requiredByDefault
      });

  const fields = await generateWithAI({
    prompt,
    skeletonFields,
    requiredByDefault,
    preserveTypes: explicitMode
  });

  return {
    fields: dedupeFields(fields).slice(0, effectiveFieldCount),
    explicitMode,
    requestedFieldCount: requestedFields.length,
    finalFieldCount: effectiveFieldCount
  };
}
