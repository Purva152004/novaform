
// // // // // import dotenv from "dotenv";
// // // // // dotenv.config();

// // // // // import express from "express";
// // // // // import { z } from "zod";
// // // // // import OpenAI from "openai";
// // // // // import auth from "../middleware/auth.js";
// // // // // import Form from "../models/Form.js";

// // // // // const router = express.Router();

// // // // // const getOpenAI = () => {
// // // // //   const llmKey = (process.env.LLM_API_KEY || "").trim();
// // // // //   const llmBase = (process.env.LLM_BASE_URL || "").trim();
// // // // //   const openaiKey = (process.env.OPENAI_API_KEY || "").trim();

// // // // //   if (llmKey && llmBase) {
// // // // //     return new OpenAI({
// // // // //       apiKey: llmKey,
// // // // //       baseURL: llmBase,
// // // // //       defaultHeaders: {
// // // // //         "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
// // // // //         "X-Title": "Nova Forms AI"
// // // // //       }
// // // // //     });
// // // // //   }

// // // // //   if (openaiKey) {
// // // // //     return new OpenAI({ apiKey: openaiKey });
// // // // //   }

// // // // //   throw new Error("LLM_API_KEY + LLM_BASE_URL or OPENAI_API_KEY is required.");
// // // // // };

// // // // // const allowedFieldTypes = [
// // // // //   "TEXT",
// // // // //   "PARAGRAPH",
// // // // //   "MULTIPLE_CHOICE",
// // // // //   "DROPDOWN",
// // // // //   "DATE",
// // // // //   "EMAIL",
// // // // //   "NUMBER",
// // // // //   "FILE"
// // // // // ];

// // // // // const optionSchema = z.object({
// // // // //   label: z.string().trim().min(1).max(120),
// // // // //   value: z.string().trim().min(1).max(120)
// // // // // });

// // // // // const fieldSchema = z.object({
// // // // //   id: z.string().trim().min(1),
// // // // //   type: z.enum(allowedFieldTypes),
// // // // //   title: z.string().trim().min(1).max(120),
// // // // //   description: z.string().trim().max(280).optional().default(""),
// // // // //   placeholder: z.string().trim().max(140).optional().default(""),
// // // // //   required: z.boolean().default(false),
// // // // //   options: z.array(optionSchema).optional().default([]),
// // // // //   accept: z.array(z.string()).optional().default([]),
// // // // //   maxFiles: z.number().int().min(1).max(5).optional().default(1),
// // // // //   maxSizeMB: z.number().min(1).max(10).optional().default(4)
// // // // // });

// // // // // const formSchema = z.object({
// // // // //   title: z.string().trim().min(3).max(120),
// // // // //   description: z.string().trim().max(500).optional().default(""),
// // // // //   prompt: z.string().trim().max(2000).optional().default(""),
// // // // //   fieldCount: z.number().int().min(1).max(20).optional().default(3),
// // // // //   requiredByDefault: z.boolean().optional().default(false),
// // // // //   types: z.array(z.enum(allowedFieldTypes)).optional().default([]),
// // // // //   fields: z.array(fieldSchema).min(1).max(30),
// // // // //   published: z.boolean().optional().default(true)
// // // // // });

// // // // // const generateSchema = z.object({
// // // // //   title: z.string().trim().min(3).max(120),
// // // // //   description: z.string().trim().max(500).optional().default(""),
// // // // //   prompt: z.string().trim().max(2000).optional().default("general survey"),
// // // // //   numFields: z.number().int().min(3).max(20),
// // // // //   types: z.array(z.enum(allowedFieldTypes)).min(1),
// // // // //   requiredByDefault: z.boolean().optional().default(false)
// // // // // });

// // // // // const aiFieldSchema = z.object({
// // // // //   type: z.enum(allowedFieldTypes),
// // // // //   title: z.string().trim().min(1).max(120),
// // // // //   description: z.string().trim().max(280).optional().default(""),
// // // // //   required: z.boolean(),
// // // // //   options: z.array(z.string().trim().min(1).max(120)).optional().default([])
// // // // // });

// // // // // const buildId = () =>
// // // // //   `fld_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

// // // // // const buildEmbedId = () =>
// // // // //   `form_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

// // // // // const normalizeField = (field) => ({
// // // // //   id: field.id || buildId(),
// // // // //   type: field.type,
// // // // //   title: field.title,
// // // // //   description: field.description || "",
// // // // //   placeholder:
// // // // //     field.type === "PARAGRAPH"
// // // // //       ? field.placeholder || "Write your answer"
// // // // //       : field.type === "FILE"
// // // // //         ? ""
// // // // //         : field.placeholder || `Enter ${field.title.toLowerCase()}`,
// // // // //   required: field.required,
// // // // //   options: ["MULTIPLE_CHOICE", "DROPDOWN"].includes(field.type)
// // // // //     ? (field.options || []).map((option) => ({ label: option.label, value: option.value }))
// // // // //     : [],
// // // // //   accept: field.type === "FILE" ? field.accept || ["image/*", "application/pdf"] : [],
// // // // //   maxFiles: field.type === "FILE" ? Math.min(Math.max(field.maxFiles || 1, 1), 5) : 1,
// // // // //   maxSizeMB:
// // // // //     field.type === "FILE"
// // // // //       ? Math.min(Math.max(field.maxSizeMB || Number(process.env.MAX_FILE_SIZE_MB || 4), 1), 10)
// // // // //       : Number(process.env.MAX_FILE_SIZE_MB || 4)
// // // // // });

// // // // // const stripCodeFence = (text) =>
// // // // //   text
// // // // //     .replace(/^```(?:json)?\s*/i, "")
// // // // //     .replace(/```$/i, "")
// // // // //     .trim();

// // // // // const parseAiPayload = (rawText, requiredByDefault) => {
// // // // //   const parsed = JSON.parse(stripCodeFence(rawText));
// // // // //   const rawFields = Array.isArray(parsed) ? parsed : parsed.fields;
// // // // //   const fields = z.array(aiFieldSchema).min(1).max(20).parse(rawFields);

// // // // //   return fields.map((field) => {
// // // // //     const options = ["MULTIPLE_CHOICE", "DROPDOWN"].includes(field.type)
// // // // //       ? (field.options || []).slice(0, 6).map((option) => ({ label: option, value: option }))
// // // // //       : [];

// // // // //     return normalizeField({
// // // // //       id: buildId(),
// // // // //       type: field.type,
// // // // //       title: field.title,
// // // // //       description: field.description || "",
// // // // //       required: requiredByDefault ? true : field.required,
// // // // //       options,
// // // // //       accept: field.type === "FILE" ? ["image/*", "application/pdf"] : [],
// // // // //       maxFiles: field.type === "FILE" ? 3 : 1,
// // // // //       maxSizeMB: Number(process.env.MAX_FILE_SIZE_MB || 4)
// // // // //     });
// // // // //   });
// // // // // };

// // // // // const buildAiPrompt = ({ numFields, prompt, types, requiredByDefault }) => {
// // // // //   const choiceTypes = types.join("|");

// // // // //   return [
// // // // //     `Generate valid JSON only.`,
// // // // //     `Return exactly this shape: {"fields":[{"type":"TEXT|PARAGRAPH|MULTIPLE_CHOICE|DROPDOWN|DATE|EMAIL|NUMBER|FILE","title":"Smart title","description":"Helpful guidance","required":true,"options":["A","B"]}]}.`,
// // // // //     `Generate exactly ${numFields} fields.`,
// // // // //     `Allowed field types: ${choiceTypes}.`,
// // // // //     `Theme: ${prompt || "general survey"}.`,
// // // // //     `Default required preference: ${requiredByDefault ? "mostly required" : "mix optional and required"}.`,
// // // // //     `If type is MULTIPLE_CHOICE or DROPDOWN include 3-5 options.`,
// // // // //     `If type is FILE include title and description only.`,
// // // // //     `Do not include markdown. Do not include explanations.`
// // // // //   ].join(" ");
// // // // // };

// // // // // const candidateModels = () => {
// // // // //   const models = [
// // // // //     process.env.LLM_MODEL,
// // // // //     "openrouter/free",
// // // // //     "qwen/qwen-2.5-7b-instruct",
// // // // //     "openai/gpt-oss-20b:free",
// // // // //     "meta-llama/llama-3.1-8b-instruct:free"
// // // // //   ];

// // // // //   return [...new Set(models.filter(Boolean).map((item) => item.trim()))];
// // // // // };

// // // // // const titleFromPrompt = (prompt, fallback) => {
// // // // //   const lower = (prompt || "").toLowerCase();

// // // // //   if (lower.includes("name")) return "Full Name";
// // // // //   if (lower.includes("email")) return "Email Address";
// // // // //   if (lower.includes("phone")) return "Phone Number";
// // // // //   if (lower.includes("age")) return "Age";
// // // // //   if (lower.includes("mark")) return "Marks";
// // // // //   if (lower.includes("roll")) return "Roll Number";
// // // // //   if (lower.includes("resume")) return "Resume Upload";
// // // // //   if (lower.includes("photo")) return "Photo Upload";
// // // // //   if (lower.includes("branch")) return "Branch";
// // // // //   if (lower.includes("degree")) return "Degree";
// // // // //   return fallback;
// // // // // };

// // // // // const buildLocalFallbackFields = ({ numFields, types, requiredByDefault, prompt }) => {
// // // // //   const preferred = [];

// // // // //   if (prompt.toLowerCase().includes("name") && types.includes("TEXT")) {
// // // // //     preferred.push({ type: "TEXT", title: "Full Name" });
// // // // //   }
// // // // //   if (prompt.toLowerCase().includes("roll") && types.includes("NUMBER")) {
// // // // //     preferred.push({ type: "NUMBER", title: "Roll Number" });
// // // // //   }
// // // // //   if (prompt.toLowerCase().includes("mark") && types.includes("NUMBER")) {
// // // // //     preferred.push({ type: "NUMBER", title: "Marks" });
// // // // //   }
// // // // //   if (prompt.toLowerCase().includes("age") && types.includes("NUMBER")) {
// // // // //     preferred.push({ type: "NUMBER", title: "Age" });
// // // // //   }
// // // // //   if (prompt.toLowerCase().includes("resume") && types.includes("FILE")) {
// // // // //     preferred.push({ type: "FILE", title: "Resume Upload" });
// // // // //   }
// // // // //   if (prompt.toLowerCase().includes("photo") && types.includes("FILE")) {
// // // // //     preferred.push({ type: "FILE", title: "Photo Upload" });
// // // // //   }

// // // // //   const pool = types.length ? types : ["TEXT"];
// // // // //   let counter = 0;

// // // // //   while (preferred.length < numFields) {
// // // // //     const type = pool[counter % pool.length];
// // // // //     preferred.push({
// // // // //       type,
// // // // //       title: titleFromPrompt(prompt, `${type.replaceAll("_", " ")} Field ${counter + 1}`)
// // // // //     });
// // // // //     counter += 1;
// // // // //   }

// // // // //   return preferred.slice(0, numFields).map((field, index) =>
// // // // //     normalizeField({
// // // // //       id: buildId(),
// // // // //       type: field.type,
// // // // //       title: field.title || `${field.type} Field ${index + 1}`,
// // // // //       description:
// // // // //         field.type === "FILE"
// // // // //           ? "Upload the requested file."
// // // // //           : `Provide ${field.title?.toLowerCase() || "the requested information"}.`,
// // // // //       required: requiredByDefault,
// // // // //       options: ["MULTIPLE_CHOICE", "DROPDOWN"].includes(field.type)
// // // // //         ? [
// // // // //             { label: "Option 1", value: "Option 1" },
// // // // //             { label: "Option 2", value: "Option 2" },
// // // // //             { label: "Option 3", value: "Option 3" }
// // // // //           ]
// // // // //         : [],
// // // // //       accept: field.type === "FILE" ? ["image/*", "application/pdf"] : [],
// // // // //       maxFiles: field.type === "FILE" ? 1 : 1,
// // // // //       maxSizeMB: Number(process.env.MAX_FILE_SIZE_MB || 4)
// // // // //     })
// // // // //   );
// // // // // };

// // // // // router.post("/generate-form/auth", auth, async (req, res, next) => {
// // // // //   try {
// // // // //     const { title, description, prompt, numFields, types, requiredByDefault } = generateSchema.parse(req.body);

// // // // //     const client = getOpenAI();
// // // // //     let fields = null;
// // // // //     let lastError = null;

// // // // //     for (const model of candidateModels()) {
// // // // //       try {
// // // // //         console.log("Trying LLM model:", model);

// // // // //         const aiResponse = await client.chat.completions.create({
// // // // //           model,
// // // // //           temperature: 0.2,
// // // // //           messages: [
// // // // //             {
// // // // //               role: "system",
// // // // //               content: "You create production-grade form schemas. Return valid JSON only, no markdown, no prose."
// // // // //             },
// // // // //             {
// // // // //               role: "user",
// // // // //               content: buildAiPrompt({ numFields, prompt, types, requiredByDefault })
// // // // //             }
// // // // //           ]
// // // // //         });

// // // // //         const content = aiResponse?.choices?.[0]?.message?.content;
// // // // //         if (!content) {
// // // // //           continue;
// // // // //         }

// // // // //         fields = parseAiPayload(content, requiredByDefault);
// // // // //         if (fields?.length) {
// // // // //           break;
// // // // //         }
// // // // //       } catch (error) {
// // // // //         lastError = error;
// // // // //         console.error("Model failed:", model, error?.error?.message || error?.message || error);
// // // // //       }
// // // // //     }

// // // // //     if (!fields?.length) {
// // // // //       console.log("Falling back to local form generation.");
// // // // //       fields = buildLocalFallbackFields({ numFields, types, requiredByDefault, prompt });
// // // // //     }

// // // // //     const form = await Form.create({
// // // // //       userId: req.user.id,
// // // // //       title,
// // // // //       description,
// // // // //       prompt,
// // // // //       fieldCount: numFields,
// // // // //       types,
// // // // //       requiredByDefault,
// // // // //       embedId: buildEmbedId(),
// // // // //       fields,
// // // // //       published: true,
// // // // //       theme: {
// // // // //         heroTitle: title,
// // // // //         accentFrom: "#3b82f6",
// // // // //         accentTo: "#1d4ed8"
// // // // //       }
// // // // //     });

// // // // //     return res.status(201).json({
// // // // //       form,
// // // // //       aiFallbackUsed: Boolean(!fields || lastError)
// // // // //     });
// // // // //   } catch (error) {
// // // // //     return next(error);
// // // // //   }
// // // // // });

// // // // // router.get("/my/list", auth, async (req, res, next) => {
// // // // //   try {
// // // // //     const forms = await Form.find({ userId: req.user.id })
// // // // //       .sort({ createdAt: -1 })
// // // // //       .select("title description embedId fields responses published createdAt updatedAt");

// // // // //     return res.json({ forms });
// // // // //   } catch (error) {
// // // // //     return next(error);
// // // // //   }
// // // // // });

// // // // // router.get("/:id/edit", auth, async (req, res, next) => {
// // // // //   try {
// // // // //     const form = await Form.findOne({ _id: req.params.id, userId: req.user.id });
// // // // //     if (!form) {
// // // // //       return res.status(404).json({ message: "Form not found." });
// // // // //     }
// // // // //     return res.json({ form });
// // // // //   } catch (error) {
// // // // //     return next(error);
// // // // //   }
// // // // // });

// // // // // router.get("/:id", async (req, res, next) => {
// // // // //   try {
// // // // //     const form = await Form.findById(req.params.id).select("title description embedId fields published theme createdAt");
// // // // //     if (!form || !form.published) {
// // // // //       return res.status(404).json({ message: "Form not found." });
// // // // //     }
// // // // //     return res.json({ form });
// // // // //   } catch (error) {
// // // // //     return next(error);
// // // // //   }
// // // // // });

// // // // // router.put("/:id", auth, async (req, res, next) => {
// // // // //   try {
// // // // //     const parsed = formSchema.parse(req.body);
// // // // //     const fields = parsed.fields.map((field) => normalizeField(fieldSchema.parse(field)));

// // // // //     const form = await Form.findOneAndUpdate(
// // // // //       { _id: req.params.id, userId: req.user.id },
// // // // //       {
// // // // //         title: parsed.title,
// // // // //         description: parsed.description,
// // // // //         prompt: parsed.prompt,
// // // // //         fieldCount: parsed.fieldCount,
// // // // //         requiredByDefault: parsed.requiredByDefault,
// // // // //         types: parsed.types,
// // // // //         fields,
// // // // //         published: parsed.published
// // // // //       },
// // // // //       { new: true }
// // // // //     );

// // // // //     if (!form) {
// // // // //       return res.status(404).json({ message: "Form not found." });
// // // // //     }

// // // // //     return res.json({ form });
// // // // //   } catch (error) {
// // // // //     return next(error);
// // // // //   }
// // // // // });

// // // // // router.delete("/:id", auth, async (req, res, next) => {
// // // // //   try {
// // // // //     const deleted = await Form.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

// // // // //     if (!deleted) {
// // // // //       return res.status(404).json({ message: "Form not found." });
// // // // //     }

// // // // //     return res.json({ message: "Form deleted." });
// // // // //   } catch (error) {
// // // // //     return next(error);
// // // // //   }
// // // // // });

// // // // // export default router;
// // // // import dotenv from "dotenv";
// // // // dotenv.config();

// // // // import express from "express";
// // // // import { z } from "zod";
// // // // import OpenAI from "openai";
// // // // import auth from "../middleware/auth.js";
// // // // import Form from "../models/Form.js";

// // // // const router = express.Router();

// // // // const getOpenAI = () => {
// // // //   const llmKey = (process.env.LLM_API_KEY || "").trim();
// // // //   const llmBase = (process.env.LLM_BASE_URL || "").trim();
// // // //   const openaiKey = (process.env.OPENAI_API_KEY || "").trim();

// // // //   if (llmKey && llmBase) {
// // // //     return new OpenAI({
// // // //       apiKey: llmKey,
// // // //       baseURL: llmBase,
// // // //       defaultHeaders: {
// // // //         "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
// // // //         "X-Title": "Nova Forms AI"
// // // //       }
// // // //     });
// // // //   }

// // // //   if (openaiKey) {
// // // //     return new OpenAI({ apiKey: openaiKey });
// // // //   }

// // // //   throw new Error("LLM_API_KEY + LLM_BASE_URL or OPENAI_API_KEY is required.");
// // // // };

// // // // const allowedFieldTypes = [
// // // //   "TEXT",
// // // //   "PARAGRAPH",
// // // //   "MULTIPLE_CHOICE",
// // // //   "DROPDOWN",
// // // //   "DATE",
// // // //   "EMAIL",
// // // //   "NUMBER",
// // // //   "FILE"
// // // // ];

// // // // const optionSchema = z.object({
// // // //   label: z.string().trim().min(1).max(120),
// // // //   value: z.string().trim().min(1).max(120)
// // // // });

// // // // const fieldSchema = z.object({
// // // //   id: z.string().trim().min(1),
// // // //   type: z.enum(allowedFieldTypes),
// // // //   title: z.string().trim().min(1).max(120),
// // // //   description: z.string().trim().max(280).optional().default(""),
// // // //   placeholder: z.string().trim().max(140).optional().default(""),
// // // //   required: z.boolean().default(false),
// // // //   options: z.array(optionSchema).optional().default([]),
// // // //   accept: z.array(z.string()).optional().default([]),
// // // //   maxFiles: z.number().int().min(1).max(5).optional().default(1),
// // // //   maxSizeMB: z.number().min(1).max(10).optional().default(4)
// // // // });

// // // // const formSchema = z.object({
// // // //   title: z.string().trim().min(3).max(120),
// // // //   description: z.string().trim().max(500).optional().default(""),
// // // //   prompt: z.string().trim().max(2000).optional().default(""),
// // // //   fieldCount: z.number().int().min(1).max(20).optional().default(3),
// // // //   requiredByDefault: z.boolean().optional().default(false),
// // // //   allowMultipleResponses: z.boolean().optional().default(true),
// // // //   types: z.array(z.enum(allowedFieldTypes)).optional().default([]),
// // // //   fields: z.array(fieldSchema).min(1).max(30),
// // // //   published: z.boolean().optional().default(true)
// // // // });

// // // // const generateSchema = z.object({
// // // //   title: z.string().trim().min(3).max(120),
// // // //   description: z.string().trim().max(500).optional().default(""),
// // // //   prompt: z.string().trim().max(2000).optional().default("general survey"),
// // // //   numFields: z.number().int().min(3).max(20),
// // // //   types: z.array(z.enum(allowedFieldTypes)).min(1),
// // // //   requiredByDefault: z.boolean().optional().default(false)
// // // // });

// // // // const aiFieldSchema = z.object({
// // // //   type: z.enum(allowedFieldTypes),
// // // //   title: z.string().trim().min(1).max(120),
// // // //   description: z.string().trim().max(280).optional().default(""),
// // // //   required: z.boolean(),
// // // //   options: z.array(z.string().trim().min(1).max(120)).optional().default([])
// // // // });

// // // // const buildId = () =>
// // // //   `fld_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

// // // // const buildEmbedId = () =>
// // // //   `form_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

// // // // const normalizeField = (field) => ({
// // // //   id: field.id || buildId(),
// // // //   type: field.type,
// // // //   title: field.title,
// // // //   description: field.description || "",
// // // //   placeholder:
// // // //     field.type === "PARAGRAPH"
// // // //       ? field.placeholder || "Write your answer"
// // // //       : field.type === "FILE"
// // // //         ? ""
// // // //         : field.placeholder || `Enter ${field.title.toLowerCase()}`,
// // // //   required: field.required,
// // // //   options: ["MULTIPLE_CHOICE", "DROPDOWN"].includes(field.type)
// // // //     ? (field.options || []).map((option) => ({ label: option.label, value: option.value }))
// // // //     : [],
// // // //   accept: field.type === "FILE" ? field.accept || ["image/*", "application/pdf"] : [],
// // // //   maxFiles: field.type === "FILE" ? Math.min(Math.max(field.maxFiles || 1, 1), 5) : 1,
// // // //   maxSizeMB:
// // // //     field.type === "FILE"
// // // //       ? Math.min(Math.max(field.maxSizeMB || Number(process.env.MAX_FILE_SIZE_MB || 4), 1), 10)
// // // //       : Number(process.env.MAX_FILE_SIZE_MB || 4)
// // // // });

// // // // const stripCodeFence = (text) =>
// // // //   text
// // // //     .replace(/^```(?:json)?\s*/i, "")
// // // //     .replace(/```$/i, "")
// // // //     .trim();

// // // // const parseAiPayload = (rawText, requiredByDefault) => {
// // // //   const parsed = JSON.parse(stripCodeFence(rawText));
// // // //   const rawFields = Array.isArray(parsed) ? parsed : parsed.fields;
// // // //   const fields = z.array(aiFieldSchema).min(1).max(20).parse(rawFields);

// // // //   return fields.map((field) => {
// // // //     const options = ["MULTIPLE_CHOICE", "DROPDOWN"].includes(field.type)
// // // //       ? (field.options || []).slice(0, 6).map((option) => ({ label: option, value: option }))
// // // //       : [];

// // // //     return normalizeField({
// // // //       id: buildId(),
// // // //       type: field.type,
// // // //       title: field.title,
// // // //       description: field.description || "",
// // // //       required: requiredByDefault ? true : field.required,
// // // //       options,
// // // //       accept: field.type === "FILE" ? ["image/*", "application/pdf"] : [],
// // // //       maxFiles: field.type === "FILE" ? 3 : 1,
// // // //       maxSizeMB: Number(process.env.MAX_FILE_SIZE_MB || 4)
// // // //     });
// // // //   });
// // // // };

// // // // const buildAiPrompt = ({ numFields, prompt, types, requiredByDefault }) => {
// // // //   const choiceTypes = types.join("|");

// // // //   return [
// // // //     `Generate valid JSON only.`,
// // // //     `Return exactly this shape: {"fields":[{"type":"TEXT|PARAGRAPH|MULTIPLE_CHOICE|DROPDOWN|DATE|EMAIL|NUMBER|FILE","title":"Smart title","description":"Helpful guidance","required":true,"options":["A","B"]}]}.`,
// // // //     `Generate exactly ${numFields} fields.`,
// // // //     `Allowed field types: ${choiceTypes}.`,
// // // //     `Theme: ${prompt || "general survey"}.`,
// // // //     `Default required preference: ${requiredByDefault ? "mostly required" : "mix optional and required"}.`,
// // // //     `If type is MULTIPLE_CHOICE or DROPDOWN include 3-5 options.`,
// // // //     `If type is FILE include title and description only.`,
// // // //     `Do not include markdown. Do not include explanations.`
// // // //   ].join(" ");
// // // // };

// // // // const candidateModels = () => {
// // // //   const models = [
// // // //     process.env.LLM_MODEL,
// // // //     "openrouter/free",
// // // //     "qwen/qwen-2.5-7b-instruct",
// // // //     "openai/gpt-oss-20b:free",
// // // //     "meta-llama/llama-3.1-8b-instruct:free"
// // // //   ];

// // // //   return [...new Set(models.filter(Boolean).map((item) => item.trim()))];
// // // // };

// // // // const titleFromPrompt = (prompt, fallback) => {
// // // //   const lower = (prompt || "").toLowerCase();

// // // //   if (lower.includes("name")) return "Full Name";
// // // //   if (lower.includes("email")) return "Email Address";
// // // //   if (lower.includes("phone")) return "Phone Number";
// // // //   if (lower.includes("age")) return "Age";
// // // //   if (lower.includes("mark")) return "Marks";
// // // //   if (lower.includes("roll")) return "Roll Number";
// // // //   if (lower.includes("resume")) return "Resume Upload";
// // // //   if (lower.includes("photo")) return "Photo Upload";
// // // //   if (lower.includes("branch")) return "Branch";
// // // //   if (lower.includes("degree")) return "Degree";
// // // //   return fallback;
// // // // };

// // // // const buildLocalFallbackFields = ({ numFields, types, requiredByDefault, prompt }) => {
// // // //   const preferred = [];

// // // //   if (prompt.toLowerCase().includes("name") && types.includes("TEXT")) {
// // // //     preferred.push({ type: "TEXT", title: "Full Name" });
// // // //   }
// // // //   if (prompt.toLowerCase().includes("roll") && types.includes("NUMBER")) {
// // // //     preferred.push({ type: "NUMBER", title: "Roll Number" });
// // // //   }
// // // //   if (prompt.toLowerCase().includes("mark") && types.includes("NUMBER")) {
// // // //     preferred.push({ type: "NUMBER", title: "Marks" });
// // // //   }
// // // //   if (prompt.toLowerCase().includes("age") && types.includes("NUMBER")) {
// // // //     preferred.push({ type: "NUMBER", title: "Age" });
// // // //   }
// // // //   if (prompt.toLowerCase().includes("resume") && types.includes("FILE")) {
// // // //     preferred.push({ type: "FILE", title: "Resume Upload" });
// // // //   }
// // // //   if (prompt.toLowerCase().includes("photo") && types.includes("FILE")) {
// // // //     preferred.push({ type: "FILE", title: "Photo Upload" });
// // // //   }

// // // //   const pool = types.length ? types : ["TEXT"];
// // // //   let counter = 0;

// // // //   while (preferred.length < numFields) {
// // // //     const type = pool[counter % pool.length];
// // // //     preferred.push({
// // // //       type,
// // // //       title: titleFromPrompt(prompt, `${type.replaceAll("_", " ")} Field ${counter + 1}`)
// // // //     });
// // // //     counter += 1;
// // // //   }

// // // //   return preferred.slice(0, numFields).map((field, index) =>
// // // //     normalizeField({
// // // //       id: buildId(),
// // // //       type: field.type,
// // // //       title: field.title || `${field.type} Field ${index + 1}`,
// // // //       description:
// // // //         field.type === "FILE"
// // // //           ? "Upload the requested file."
// // // //           : `Provide ${field.title?.toLowerCase() || "the requested information"}.`,
// // // //       required: requiredByDefault,
// // // //       options: ["MULTIPLE_CHOICE", "DROPDOWN"].includes(field.type)
// // // //         ? [
// // // //             { label: "Option 1", value: "Option 1" },
// // // //             { label: "Option 2", value: "Option 2" },
// // // //             { label: "Option 3", value: "Option 3" }
// // // //           ]
// // // //         : [],
// // // //       accept: field.type === "FILE" ? ["image/*", "application/pdf"] : [],
// // // //       maxFiles: field.type === "FILE" ? 1 : 1,
// // // //       maxSizeMB: Number(process.env.MAX_FILE_SIZE_MB || 4)
// // // //     })
// // // //   );
// // // // };

// // // // router.post("/generate-form/auth", auth, async (req, res, next) => {
// // // //   try {
// // // //     const { title, description, prompt, numFields, types, requiredByDefault } = generateSchema.parse(req.body);

// // // //     const client = getOpenAI();
// // // //     let fields = null;
// // // //     let lastError = null;

// // // //     for (const model of candidateModels()) {
// // // //       try {
// // // //         console.log("Trying LLM model:", model);

// // // //         const aiResponse = await client.chat.completions.create({
// // // //           model,
// // // //           temperature: 0.2,
// // // //           messages: [
// // // //             {
// // // //               role: "system",
// // // //               content: "You create production-grade form schemas. Return valid JSON only, no markdown, no prose."
// // // //             },
// // // //             {
// // // //               role: "user",
// // // //               content: buildAiPrompt({ numFields, prompt, types, requiredByDefault })
// // // //             }
// // // //           ]
// // // //         });

// // // //         const content = aiResponse?.choices?.[0]?.message?.content;
// // // //         if (!content) {
// // // //           continue;
// // // //         }

// // // //         fields = parseAiPayload(content, requiredByDefault);
// // // //         if (fields?.length) {
// // // //           break;
// // // //         }
// // // //       } catch (error) {
// // // //         lastError = error;
// // // //         console.error("Model failed:", model, error?.error?.message || error?.message || error);
// // // //       }
// // // //     }

// // // //     if (!fields?.length) {
// // // //       console.log("Falling back to local form generation.");
// // // //       fields = buildLocalFallbackFields({ numFields, types, requiredByDefault, prompt });
// // // //     }

// // // //     const form = await Form.create({
// // // //       userId: req.user.id,
// // // //       title,
// // // //       description,
// // // //       prompt,
// // // //       fieldCount: numFields,
// // // //       types,
// // // //       requiredByDefault,
// // // //       allowMultipleResponses: true,
// // // //       embedId: buildEmbedId(),
// // // //       fields,
// // // //       published: true,
// // // //       theme: {
// // // //         heroTitle: title,
// // // //         accentFrom: "#3b82f6",
// // // //         accentTo: "#1d4ed8"
// // // //       }
// // // //     });

// // // //     return res.status(201).json({
// // // //       form,
// // // //       aiFallbackUsed: Boolean(!fields || lastError)
// // // //     });
// // // //   } catch (error) {
// // // //     return next(error);
// // // //   }
// // // // });

// // // // router.get("/my/list", auth, async (req, res, next) => {
// // // //   try {
// // // //     const forms = await Form.find({ userId: req.user.id })
// // // //       .sort({ createdAt: -1 })
// // // //       .select("title description embedId fields responses published allowMultipleResponses createdAt updatedAt");

// // // //     return res.json({ forms });
// // // //   } catch (error) {
// // // //     return next(error);
// // // //   }
// // // // });

// // // // router.get("/:id/edit", auth, async (req, res, next) => {
// // // //   try {
// // // //     const form = await Form.findOne({ _id: req.params.id, userId: req.user.id });
// // // //     if (!form) {
// // // //       return res.status(404).json({ message: "Form not found." });
// // // //     }
// // // //     return res.json({ form });
// // // //   } catch (error) {
// // // //     return next(error);
// // // //   }
// // // // });

// // // // router.get("/:id", async (req, res, next) => {
// // // //   try {
// // // //     const form = await Form.findById(req.params.id).select("title description embedId fields published theme allowMultipleResponses createdAt");
// // // //     if (!form || !form.published) {
// // // //       return res.status(404).json({ message: "Form not found." });
// // // //     }
// // // //     return res.json({ form });
// // // //   } catch (error) {
// // // //     return next(error);
// // // //   }
// // // // });

// // // // router.put("/:id", auth, async (req, res, next) => {
// // // //   try {
// // // //     const parsed = formSchema.parse(req.body);
// // // //     const fields = parsed.fields.map((field) => normalizeField(fieldSchema.parse(field)));

// // // //     const form = await Form.findOneAndUpdate(
// // // //       { _id: req.params.id, userId: req.user.id },
// // // //       {
// // // //         title: parsed.title,
// // // //         description: parsed.description,
// // // //         prompt: parsed.prompt,
// // // //         fieldCount: parsed.fieldCount,
// // // //         requiredByDefault: parsed.requiredByDefault,
// // // //         allowMultipleResponses: parsed.allowMultipleResponses,
// // // //         types: parsed.types,
// // // //         fields,
// // // //         published: parsed.published
// // // //       },
// // // //       { new: true }
// // // //     );

// // // //     if (!form) {
// // // //       return res.status(404).json({ message: "Form not found." });
// // // //     }

// // // //     return res.json({ form });
// // // //   } catch (error) {
// // // //     return next(error);
// // // //   }
// // // // });

// // // // router.delete("/:id", auth, async (req, res, next) => {
// // // //   try {
// // // //     const deleted = await Form.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

// // // //     if (!deleted) {
// // // //       return res.status(404).json({ message: "Form not found." });
// // // //     }

// // // //     return res.json({ message: "Form deleted." });
// // // //   } catch (error) {
// // // //     return next(error);
// // // //   }
// // // // });

// // // // export default router;
// // // import dotenv from "dotenv";
// // // dotenv.config();

// // // import express from "express";
// // // import { z } from "zod";
// // // import OpenAI from "openai";
// // // import auth from "../middleware/auth.js";
// // // import Form from "../models/Form.js";

// // // const router = express.Router();

// // // const getOpenAI = () => {
// // //   const llmKey = (process.env.LLM_API_KEY || "").trim();
// // //   const llmBase = (process.env.LLM_BASE_URL || "").trim();
// // //   const openaiKey = (process.env.OPENAI_API_KEY || "").trim();

// // //   if (llmKey && llmBase) {
// // //     return new OpenAI({
// // //       apiKey: llmKey,
// // //       baseURL: llmBase,
// // //       defaultHeaders: {
// // //         "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
// // //         "X-Title": "Nova Forms AI"
// // //       }
// // //     });
// // //   }

// // //   if (openaiKey) {
// // //     return new OpenAI({ apiKey: openaiKey });
// // //   }

// // //   throw new Error("LLM_API_KEY + LLM_BASE_URL or OPENAI_API_KEY is required.");
// // // };

// // // const allowedFieldTypes = [
// // //   "TEXT",
// // //   "PARAGRAPH",
// // //   "MULTIPLE_CHOICE",
// // //   "DROPDOWN",
// // //   "DATE",
// // //   "EMAIL",
// // //   "NUMBER",
// // //   "FILE"
// // // ];

// // // const optionSchema = z.object({
// // //   label: z.string().trim().min(1).max(120),
// // //   value: z.string().trim().min(1).max(120)
// // // });

// // // const fieldSchema = z.object({
// // //   id: z.string().trim().min(1),
// // //   type: z.enum(allowedFieldTypes),
// // //   title: z.string().trim().min(1).max(120),
// // //   description: z.string().trim().max(280).optional().default(""),
// // //   placeholder: z.string().trim().max(140).optional().default(""),
// // //   required: z.boolean().default(false),
// // //   options: z.array(optionSchema).optional().default([]),
// // //   accept: z.array(z.string()).optional().default([]),
// // //   maxFiles: z.number().int().min(1).max(5).optional().default(1),
// // //   maxSizeMB: z.number().min(1).max(10).optional().default(4)
// // // });

// // // const formSchema = z.object({
// // //   title: z.string().trim().min(3).max(120),
// // //   description: z.string().trim().max(500).optional().default(""),
// // //   prompt: z.string().trim().max(4000).optional().default(""),
// // //   fieldCount: z.number().int().min(1).max(50).optional().default(3),
// // //   requiredByDefault: z.boolean().optional().default(false),
// // //   allowMultipleResponses: z.boolean().optional().default(true),
// // //   types: z.array(z.enum(allowedFieldTypes)).optional().default([]),
// // //   fields: z.array(fieldSchema).min(1).max(50),
// // //   published: z.boolean().optional().default(true)
// // // });

// // // const generateSchema = z.object({
// // //   title: z.string().trim().min(3).max(120),
// // //   description: z.string().trim().max(500).optional().default(""),
// // //   prompt: z.string().trim().max(4000).optional().default("general survey"),
// // //   numFields: z.number().int().min(1).max(50),
// // //   types: z.array(z.enum(allowedFieldTypes)).min(1),
// // //   requiredByDefault: z.boolean().optional().default(false)
// // // });

// // // const aiFieldSchema = z.object({
// // //   type: z.enum(allowedFieldTypes),
// // //   title: z.string().trim().min(1).max(120),
// // //   description: z.string().trim().max(280).optional().default(""),
// // //   required: z.boolean(),
// // //   options: z.array(z.string().trim().min(1).max(120)).optional().default([])
// // // });

// // // const buildId = () =>
// // //   `fld_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

// // // const buildEmbedId = () =>
// // //   `form_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

// // // const normalizeField = (field) => ({
// // //   id: field.id || buildId(),
// // //   type: field.type,
// // //   title: field.title,
// // //   description: field.description || "",
// // //   placeholder:
// // //     field.type === "PARAGRAPH"
// // //       ? field.placeholder || "Write your answer"
// // //       : field.type === "FILE"
// // //         ? ""
// // //         : field.placeholder || `Enter ${field.title.toLowerCase()}`,
// // //   required: field.required,
// // //   options: ["MULTIPLE_CHOICE", "DROPDOWN"].includes(field.type)
// // //     ? (field.options || []).map((option) => ({ label: option.label, value: option.value }))
// // //     : [],
// // //   accept: field.type === "FILE" ? field.accept || ["image/*", "application/pdf"] : [],
// // //   maxFiles: field.type === "FILE" ? Math.min(Math.max(field.maxFiles || 1, 1), 5) : 1,
// // //   maxSizeMB:
// // //     field.type === "FILE"
// // //       ? Math.min(Math.max(field.maxSizeMB || Number(process.env.MAX_FILE_SIZE_MB || 4), 1), 10)
// // //       : Number(process.env.MAX_FILE_SIZE_MB || 4)
// // // });

// // // const stripCodeFence = (text) =>
// // //   text
// // //     .replace(/^```(?:json)?\s*/i, "")
// // //     .replace(/```$/i, "")
// // //     .trim();

// // // const parseAiPayload = (rawText, requiredByDefault) => {
// // //   const parsed = JSON.parse(stripCodeFence(rawText));
// // //   const rawFields = Array.isArray(parsed) ? parsed : parsed.fields;
// // //   const fields = z.array(aiFieldSchema).min(1).max(50).parse(rawFields);

// // //   return fields.map((field) => {
// // //     const options = ["MULTIPLE_CHOICE", "DROPDOWN"].includes(field.type)
// // //       ? (field.options || []).slice(0, 8).map((option) => ({ label: option, value: option }))
// // //       : [];

// // //     return normalizeField({
// // //       id: buildId(),
// // //       type: field.type,
// // //       title: field.title,
// // //       description: field.description || "",
// // //       required: requiredByDefault ? true : field.required,
// // //       options,
// // //       accept: field.type === "FILE" ? ["image/*", "application/pdf"] : [],
// // //       maxFiles: field.type === "FILE" ? 3 : 1,
// // //       maxSizeMB: Number(process.env.MAX_FILE_SIZE_MB || 4)
// // //     });
// // //   });
// // // };

// // // const extractRequestedFieldNames = (prompt = "") => {
// // //   const text = String(prompt || "").replace(/\s+/g, " ").trim();
// // //   if (!text) return [];

// // //   const patterns = [
// // //     /fields?\s+for\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
// // //     /includes?\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
// // //     /with\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
// // //     /with\s+the\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i
// // //   ];

// // //   let captured = "";
// // //   for (const pattern of patterns) {
// // //     const match = text.match(pattern);
// // //     if (match?.[1]) {
// // //       captured = match[1];
// // //       break;
// // //     }
// // //   }

// // //   if (!captured) return [];

// // //   const normalized = captured
// // //     .replace(/\band an additional\b/gi, ", additional")
// // //     .replace(/\band additional\b/gi, ", additional")
// // //     .replace(/\band\b/gi, ",")
// // //     .replace(/\s*,\s*/g, ",")
// // //     .trim();

// // //   const parts = normalized
// // //     .split(",")
// // //     .map((item) =>
// // //       item
// // //         .replace(/^for\s+/i, "")
// // //         .replace(/^a\s+/i, "")
// // //         .replace(/^an\s+/i, "")
// // //         .replace(/^the\s+/i, "")
// // //         .replace(/\s+field$/i, "")
// // //         .replace(/\s+fields$/i, "")
// // //         .trim()
// // //     )
// // //     .filter(Boolean);

// // //   return [...new Set(parts)].slice(0, 50);
// // // };

// // // const inferFieldType = (name) => {
// // //   const value = name.toLowerCase();

// // //   if (value.includes("email")) return "EMAIL";
// // //   if (
// // //     value.includes("resume") ||
// // //     value.includes("photo upload") ||
// // //     value.includes("profile photo") ||
// // //     value.includes("upload") ||
// // //     value.includes("document") ||
// // //     value.includes("file")
// // //   ) {
// // //     return "FILE";
// // //   }
// // //   if (value.includes("career goal") || value.includes("internship experience") || value.includes("skills")) {
// // //     return "PARAGRAPH";
// // //   }
// // //   if (value.includes("gender") || value.includes("married")) return "DROPDOWN";
// // //   if (value.includes("willingness") || value.includes("relocate")) return "MULTIPLE_CHOICE";
// // //   if (value.includes("job role")) return "DROPDOWN";
// // //   if (value.includes("date")) return "DATE";
// // //   if (
// // //     value.includes("age") ||
// // //     value.includes("semester") ||
// // //     value.includes("cgpa") ||
// // //     value.includes("gpa") ||
// // //     value.includes("marks") ||
// // //     value.includes("passing year") ||
// // //     value.includes("year")
// // //   ) {
// // //     return "NUMBER";
// // //   }
// // //   return "TEXT";
// // // };

// // // const buildOptionsForField = (title, type) => {
// // //   const lower = title.toLowerCase();

// // //   if (type === "DROPDOWN" && lower.includes("gender")) {
// // //     return [
// // //       { label: "Male", value: "Male" },
// // //       { label: "Female", value: "Female" },
// // //       { label: "Other", value: "Other" },
// // //       { label: "Prefer not to say", value: "Prefer not to say" }
// // //     ];
// // //   }

// // //   if (type === "DROPDOWN" && lower.includes("job role")) {
// // //     return [
// // //       { label: "Software Developer", value: "Software Developer" },
// // //       { label: "Data Analyst", value: "Data Analyst" },
// // //       { label: "UI/UX Designer", value: "UI/UX Designer" },
// // //       { label: "Product Associate", value: "Product Associate" }
// // //     ];
// // //   }

// // //   if (type === "MULTIPLE_CHOICE" && (lower.includes("relocate") || lower.includes("willingness"))) {
// // //     return [
// // //       { label: "Yes", value: "Yes" },
// // //       { label: "No", value: "No" }
// // //     ];
// // //   }

// // //   return ["MULTIPLE_CHOICE", "DROPDOWN"].includes(type)
// // //     ? [
// // //         { label: "Option 1", value: "Option 1" },
// // //         { label: "Option 2", value: "Option 2" },
// // //         { label: "Option 3", value: "Option 3" }
// // //       ]
// // //     : [];
// // // };

// // // const buildDescription = (title, type) => {
// // //   if (type === "FILE") {
// // //     return `Upload your ${title.toLowerCase()}.`;
// // //   }
// // //   if (type === "PARAGRAPH") {
// // //     return `Provide details for ${title.toLowerCase()}.`;
// // //   }
// // //   if (type === "DROPDOWN" || type === "MULTIPLE_CHOICE") {
// // //     return `Select your ${title.toLowerCase()}.`;
// // //   }
// // //   return `Enter your ${title.toLowerCase()}.`;
// // // };

// // // const buildPlaceholder = (title, type) => {
// // //   if (type === "PARAGRAPH") return "Write your answer";
// // //   if (type === "FILE") return "";
// // //   if (type === "EMAIL") return "name@example.com";
// // //   if (type === "DATE") return "";
// // //   return `Enter ${title.toLowerCase()}`;
// // // };

// // // const buildExplicitFields = ({ requestedFields, requiredByDefault }) =>
// // //   requestedFields.map((name) => {
// // //     const type = inferFieldType(name);
// // //     return normalizeField({
// // //       id: buildId(),
// // //       type,
// // //       title: name
// // //         .replace(/\burl\b/i, "URL")
// // //         .replace(/\bcgpa\b/i, "CGPA")
// // //         .replace(/\blinkedin\b/i, "LinkedIn")
// // //         .trim()
// // //         .replace(/\b\w/g, (char) => char.toUpperCase()),
// // //       description: buildDescription(name, type),
// // //       placeholder: buildPlaceholder(name, type),
// // //       required: requiredByDefault || ["EMAIL", "TEXT", "NUMBER", "FILE"].includes(type),
// // //       options: buildOptionsForField(name, type),
// // //       accept: type === "FILE" ? ["image/*", "application/pdf"] : [],
// // //       maxFiles: 1,
// // //       maxSizeMB: Number(process.env.MAX_FILE_SIZE_MB || 4)
// // //     });
// // //   });

// // // const buildLocalFallbackFields = ({ numFields, types, requiredByDefault, prompt, requestedFields }) => {
// // //   if (requestedFields.length) {
// // //     return buildExplicitFields({ requestedFields, requiredByDefault });
// // //   }

// // //   const pool = types.length ? types : ["TEXT"];
// // //   return Array.from({ length: numFields }).map((_, index) => {
// // //     const type = pool[index % pool.length];
// // //     const title = `${type.replaceAll("_", " ")} Field ${index + 1}`;

// // //     return normalizeField({
// // //       id: buildId(),
// // //       type,
// // //       title,
// // //       description:
// // //         type === "FILE"
// // //           ? "Upload the requested file."
// // //           : `Provide ${title.toLowerCase()}.`,
// // //       required: requiredByDefault,
// // //       options: buildOptionsForField(title, type),
// // //       accept: type === "FILE" ? ["image/*", "application/pdf"] : [],
// // //       maxFiles: 1,
// // //       maxSizeMB: Number(process.env.MAX_FILE_SIZE_MB || 4)
// // //     });
// // //   });
// // // };

// // // const buildAiPrompt = ({ effectiveFieldCount, prompt, types, requiredByDefault, requestedFields }) => {
// // //   const choiceTypes = types.join("|");

// // //   return [
// // //     `Generate valid JSON only.`,
// // //     `Return exactly this shape: {"fields":[{"type":"TEXT|PARAGRAPH|MULTIPLE_CHOICE|DROPDOWN|DATE|EMAIL|NUMBER|FILE","title":"Smart title","description":"Helpful guidance","required":true,"options":["A","B"]}]}.`,
// // //     `Generate exactly ${effectiveFieldCount} fields.`,
// // //     requestedFields.length
// // //       ? `The form must include these exact fields in order: ${requestedFields.join(", ")}.`
// // //       : `Theme: ${prompt || "general survey"}.`,
// // //     `Allowed field types: ${choiceTypes}.`,
// // //     `Default required preference: ${requiredByDefault ? "mostly required" : "mix optional and required"}.`,
// // //     `If type is MULTIPLE_CHOICE or DROPDOWN include 2-5 options.`,
// // //     `If type is FILE include title and description only.`,
// // //     `Do not include markdown. Do not include explanations.`
// // //   ].join(" ");
// // // };

// // // const candidateModels = () => {
// // //   const models = [
// // //     process.env.LLM_MODEL,
// // //     "openrouter/free",
// // //     "qwen/qwen-2.5-7b-instruct",
// // //     "openai/gpt-oss-20b:free",
// // //     "meta-llama/llama-3.1-8b-instruct:free"
// // //   ];

// // //   return [...new Set(models.filter(Boolean).map((item) => item.trim()))];
// // // };

// // // router.post("/generate-form/auth", auth, async (req, res, next) => {
// // //   try {
// // //     const { title, description, prompt, numFields, types, requiredByDefault } = generateSchema.parse(req.body);

// // //     const requestedFields = extractRequestedFieldNames(prompt);
// // //     const effectiveFieldCount = requestedFields.length || numFields;

// // //     const client = getOpenAI();
// // //     let fields = null;

// // //     for (const model of candidateModels()) {
// // //       try {
// // //         console.log("Trying LLM model:", model);

// // //         const aiResponse = await client.chat.completions.create({
// // //           model,
// // //           temperature: 0.2,
// // //           messages: [
// // //             {
// // //               role: "system",
// // //               content: "You create production-grade form schemas. Return valid JSON only, no markdown, no prose."
// // //             },
// // //             {
// // //               role: "user",
// // //               content: buildAiPrompt({
// // //                 effectiveFieldCount,
// // //                 prompt,
// // //                 types,
// // //                 requiredByDefault,
// // //                 requestedFields
// // //               })
// // //             }
// // //           ]
// // //         });

// // //         const content = aiResponse?.choices?.[0]?.message?.content;
// // //         if (!content) continue;

// // //         const parsedFields = parseAiPayload(content, requiredByDefault);

// // //         if (requestedFields.length) {
// // //           if (parsedFields.length === requestedFields.length) {
// // //             fields = parsedFields.map((field, index) =>
// // //               normalizeField({
// // //                 ...field,
// // //                 title: requestedFields[index]
// // //                   .replace(/\burl\b/i, "URL")
// // //                   .replace(/\bcgpa\b/i, "CGPA")
// // //                   .replace(/\blinkedin\b/i, "LinkedIn")
// // //                   .trim()
// // //                   .replace(/\b\w/g, (char) => char.toUpperCase()),
// // //                 required: requiredByDefault ? true : field.required
// // //               })
// // //             );
// // //           }
// // //         } else if (parsedFields.length === effectiveFieldCount) {
// // //           fields = parsedFields;
// // //         }

// // //         if (fields?.length) {
// // //           break;
// // //         }
// // //       } catch (error) {
// // //         console.error("Model failed:", model, error?.error?.message || error?.message || error);
// // //       }
// // //     }

// // //     if (!fields?.length) {
// // //       console.log("Falling back to local deterministic form generation.");
// // //       fields = buildLocalFallbackFields({
// // //         numFields: effectiveFieldCount,
// // //         types,
// // //         requiredByDefault,
// // //         prompt,
// // //         requestedFields
// // //       });
// // //     }

// // //     const form = await Form.create({
// // //       userId: req.user.id,
// // //       title,
// // //       description,
// // //       prompt,
// // //       fieldCount: effectiveFieldCount,
// // //       types,
// // //       requiredByDefault,
// // //       allowMultipleResponses: true,
// // //       embedId: buildEmbedId(),
// // //       fields,
// // //       published: true,
// // //       theme: {
// // //         heroTitle: title,
// // //         accentFrom: "#3b82f6",
// // //         accentTo: "#1d4ed8"
// // //       }
// // //     });

// // //     return res.status(201).json({ form });
// // //   } catch (error) {
// // //     return next(error);
// // //   }
// // // });

// // // router.get("/my/list", auth, async (req, res, next) => {
// // //   try {
// // //     const forms = await Form.find({ userId: req.user.id })
// // //       .sort({ createdAt: -1 })
// // //       .select("title description embedId fields responses published allowMultipleResponses createdAt updatedAt");

// // //     return res.json({ forms });
// // //   } catch (error) {
// // //     return next(error);
// // //   }
// // // });

// // // router.get("/:id/edit", auth, async (req, res, next) => {
// // //   try {
// // //     const form = await Form.findOne({ _id: req.params.id, userId: req.user.id });
// // //     if (!form) {
// // //       return res.status(404).json({ message: "Form not found." });
// // //     }
// // //     return res.json({ form });
// // //   } catch (error) {
// // //     return next(error);
// // //   }
// // // });

// // // router.get("/:id", async (req, res, next) => {
// // //   try {
// // //     const form = await Form.findById(req.params.id).select(
// // //       "title description embedId fields published theme allowMultipleResponses createdAt"
// // //     );
// // //     if (!form || !form.published) {
// // //       return res.status(404).json({ message: "Form not found." });
// // //     }
// // //     return res.json({ form });
// // //   } catch (error) {
// // //     return next(error);
// // //   }
// // // });

// // // router.put("/:id", auth, async (req, res, next) => {
// // //   try {
// // //     const parsed = formSchema.parse(req.body);
// // //     const fields = parsed.fields.map((field) => normalizeField(fieldSchema.parse(field)));

// // //     const form = await Form.findOneAndUpdate(
// // //       { _id: req.params.id, userId: req.user.id },
// // //       {
// // //         title: parsed.title,
// // //         description: parsed.description,
// // //         prompt: parsed.prompt,
// // //         fieldCount: parsed.fieldCount,
// // //         requiredByDefault: parsed.requiredByDefault,
// // //         allowMultipleResponses: parsed.allowMultipleResponses,
// // //         types: parsed.types,
// // //         fields,
// // //         published: parsed.published
// // //       },
// // //       { new: true }
// // //     );

// // //     if (!form) {
// // //       return res.status(404).json({ message: "Form not found." });
// // //     }

// // //     return res.json({ form });
// // //   } catch (error) {
// // //     return next(error);
// // //   }
// // // });

// // // router.delete("/:id", auth, async (req, res, next) => {
// // //   try {
// // //     const deleted = await Form.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

// // //     if (!deleted) {
// // //       return res.status(404).json({ message: "Form not found." });
// // //     }

// // //     return res.json({ message: "Form deleted." });
// // //   } catch (error) {
// // //     return next(error);
// // //   }
// // // });

// // // export default router;
// // import dotenv from "dotenv";
// // dotenv.config();

// // import express from "express";
// // import { z } from "zod";
// // import OpenAI from "openai";
// // import auth from "../middleware/auth.js";
// // import Form from "../models/Form.js";

// // const router = express.Router();

// // const getOpenAI = () => {
// //   const llmKey = (process.env.LLM_API_KEY || "").trim();
// //   const llmBase = (process.env.LLM_BASE_URL || "").trim();
// //   const openaiKey = (process.env.OPENAI_API_KEY || "").trim();

// //   if (llmKey && llmBase) {
// //     return new OpenAI({
// //       apiKey: llmKey,
// //       baseURL: llmBase,
// //       defaultHeaders: {
// //         "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
// //         "X-Title": "Nova Forms AI"
// //       }
// //     });
// //   }

// //   if (openaiKey) {
// //     return new OpenAI({ apiKey: openaiKey });
// //   }

// //   throw new Error("LLM_API_KEY + LLM_BASE_URL or OPENAI_API_KEY is required.");
// // };

// // const routerModels = [
// //   process.env.LLM_MODEL,
// //   "openrouter/free",
// //   "qwen/qwen-2.5-7b-instruct",
// //   "openai/gpt-oss-20b:free",
// //   "meta-llama/llama-3.1-8b-instruct:free"
// // ]
// //   .filter(Boolean)
// //   .map((model) => model.trim());

// // const allowedFieldTypes = [
// //   "TEXT",
// //   "PARAGRAPH",
// //   "MULTIPLE_CHOICE",
// //   "DROPDOWN",
// //   "DATE",
// //   "EMAIL",
// //   "NUMBER",
// //   "FILE"
// // ];

// // const optionSchema = z.object({
// //   label: z.string().trim().min(1).max(120),
// //   value: z.string().trim().min(1).max(120)
// // });

// // const fieldSchema = z.object({
// //   id: z.string().trim().min(1),
// //   type: z.enum(allowedFieldTypes),
// //   title: z.string().trim().min(1).max(120),
// //   description: z.string().trim().max(280).optional().default(""),
// //   placeholder: z.string().trim().max(140).optional().default(""),
// //   required: z.boolean().default(false),
// //   options: z.array(optionSchema).optional().default([]),
// //   accept: z.array(z.string()).optional().default([]),
// //   maxFiles: z.number().int().min(1).max(5).optional().default(1),
// //   maxSizeMB: z.number().min(1).max(10).optional().default(4)
// // });

// // const formSchema = z.object({
// //   title: z.string().trim().min(3).max(120),
// //   description: z.string().trim().max(500).optional().default(""),
// //   prompt: z.string().trim().max(6000).optional().default(""),
// //   fieldCount: z.number().int().min(1).max(100).optional().default(3),
// //   requiredByDefault: z.boolean().optional().default(false),
// //   allowMultipleResponses: z.boolean().optional().default(true),
// //   types: z.array(z.enum(allowedFieldTypes)).optional().default([]),
// //   fields: z.array(fieldSchema).min(1).max(100),
// //   published: z.boolean().optional().default(true)
// // });

// // const generateSchema = z.object({
// //   title: z.string().trim().min(3).max(120),
// //   description: z.string().trim().max(500).optional().default(""),
// //   prompt: z.string().trim().max(6000).optional().default("general survey"),
// //   numFields: z.number().int().min(1).max(100),
// //   types: z.array(z.enum(allowedFieldTypes)).min(1),
// //   requiredByDefault: z.boolean().optional().default(false)
// // });

// // const aiFieldSchema = z.object({
// //   title: z.string().trim().min(1).max(120),
// //   type: z.enum(allowedFieldTypes),
// //   description: z.string().trim().max(280).optional().default(""),
// //   required: z.boolean().optional().default(false),
// //   options: z.array(z.string().trim().min(1).max(120)).optional().default([])
// // });

// // const buildId = () =>
// //   `fld_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

// // const buildEmbedId = () =>
// //   `form_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

// // const toTitleCase = (value) =>
// //   value
// //     .replace(/\s+/g, " ")
// //     .trim()
// //     .replace(/\burl\b/gi, "URL")
// //     .replace(/\bcgpa\b/gi, "CGPA")
// //     .replace(/\bgpa\b/gi, "GPA")
// //     .replace(/\blinkedin\b/gi, "LinkedIn")
// //     .replace(/\bgithub\b/gi, "GitHub")
// //     .replace(/\bapi\b/gi, "API")
// //     .replace(/\b\w/g, (char) => char.toUpperCase());

// // const normalizeField = (field) => ({
// //   id: field.id || buildId(),
// //   type: field.type,
// //   title: field.title,
// //   description: field.description || "",
// //   placeholder:
// //     field.type === "PARAGRAPH"
// //       ? field.placeholder || "Write your answer"
// //       : field.type === "FILE"
// //         ? ""
// //         : field.type === "EMAIL"
// //           ? field.placeholder || "name@example.com"
// //           : field.placeholder || `Enter ${field.title.toLowerCase()}`,
// //   required: Boolean(field.required),
// //   options: ["MULTIPLE_CHOICE", "DROPDOWN"].includes(field.type)
// //     ? (field.options || []).map((option) => ({
// //         label: option.label,
// //         value: option.value
// //       }))
// //     : [],
// //   accept: field.type === "FILE" ? field.accept || ["image/*", "application/pdf"] : [],
// //   maxFiles: field.type === "FILE" ? Math.min(Math.max(field.maxFiles || 1, 1), 5) : 1,
// //   maxSizeMB:
// //     field.type === "FILE"
// //       ? Math.min(Math.max(field.maxSizeMB || Number(process.env.MAX_FILE_SIZE_MB || 4), 1), 10)
// //       : Number(process.env.MAX_FILE_SIZE_MB || 4)
// // });

// // const stripCodeFence = (text) =>
// //   String(text || "")
// //     .replace(/^```(?:json)?\s*/i, "")
// //     .replace(/```$/i, "")
// //     .trim();

// // const safeJsonParse = (text) => {
// //   try {
// //     return JSON.parse(stripCodeFence(text));
// //   } catch {
// //     return null;
// //   }
// // };

// // const extractRequestedFieldNames = (prompt = "") => {
// //   const text = String(prompt || "").replace(/\s+/g, " ").trim();
// //   if (!text) return [];

// //   const patterns = [
// //     /fields?\s+for\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
// //     /includes?\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
// //     /with\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i,
// //     /with\s+the\s+fields?\s+(.+?)(?:\.|$|include a mix|make important|make all|important fields|required fields)/i
// //   ];

// //   let captured = "";
// //   for (const pattern of patterns) {
// //     const match = text.match(pattern);
// //     if (match?.[1]) {
// //       captured = match[1];
// //       break;
// //     }
// //   }

// //   if (!captured) return [];

// //   const normalized = captured
// //     .replace(/\band an additional\b/gi, ", additional")
// //     .replace(/\band additional\b/gi, ", additional")
// //     .replace(/\band\b/gi, ",")
// //     .replace(/\s*,\s*/g, ",")
// //     .trim();

// //   return [...new Set(
// //     normalized
// //       .split(",")
// //       .map((item) =>
// //         item
// //           .replace(/^for\s+/i, "")
// //           .replace(/^a\s+/i, "")
// //           .replace(/^an\s+/i, "")
// //           .replace(/^the\s+/i, "")
// //           .replace(/\s+field$/i, "")
// //           .replace(/\s+fields$/i, "")
// //           .trim()
// //       )
// //       .filter(Boolean)
// //   )].slice(0, 100);
// // };

// // const inferFieldType = (name) => {
// //   const value = name.toLowerCase();

// //   if (value.includes("email")) return "EMAIL";
// //   if (
// //     value.includes("resume") ||
// //     value.includes("photo upload") ||
// //     value.includes("profile photo") ||
// //     value.includes("passport") ||
// //     value.includes("aadhaar") ||
// //     value.includes("pan card") ||
// //     value.includes("document") ||
// //     value.includes("certificate") ||
// //     value.includes("attachment") ||
// //     value.includes("upload") ||
// //     value.includes("file")
// //   ) {
// //     return "FILE";
// //   }
// //   if (
// //     value.includes("career goal") ||
// //     value.includes("objective") ||
// //     value.includes("experience") ||
// //     value.includes("skills") ||
// //     value.includes("about yourself") ||
// //     value.includes("summary") ||
// //     value.includes("feedback") ||
// //     value.includes("address")
// //   ) {
// //     return "PARAGRAPH";
// //   }
// //   if (value.includes("date of birth") || value === "dob" || value.includes("joining date")) return "DATE";
// //   if (value.includes("gender") || value.includes("marital") || value.includes("preferred job role")) return "DROPDOWN";
// //   if (
// //     value.includes("willing") ||
// //     value.includes("relocate") ||
// //     value.includes("yes or no") ||
// //     value.includes("available immediately")
// //   ) {
// //     return "MULTIPLE_CHOICE";
// //   }
// //   if (
// //     value.includes("age") ||
// //     value.includes("semester") ||
// //     value.includes("cgpa") ||
// //     value.includes("gpa") ||
// //     value.includes("marks") ||
// //     value.includes("passing year") ||
// //     value.includes("year") ||
// //     value.includes("score") ||
// //     value.includes("rank") ||
// //     value.includes("phone") ||
// //     value.includes("mobile") ||
// //     value.includes("roll")
// //   ) {
// //     return "NUMBER";
// //   }
// //   return "TEXT";
// // };

// // const buildOptionsForField = (title, type) => {
// //   const lower = title.toLowerCase();

// //   if (type === "DROPDOWN" && lower.includes("gender")) {
// //     return [
// //       { label: "Male", value: "Male" },
// //       { label: "Female", value: "Female" },
// //       { label: "Other", value: "Other" },
// //       { label: "Prefer not to say", value: "Prefer not to say" }
// //     ];
// //   }

// //   if (type === "DROPDOWN" && lower.includes("marital")) {
// //     return [
// //       { label: "Single", value: "Single" },
// //       { label: "Married", value: "Married" },
// //       { label: "Prefer not to say", value: "Prefer not to say" }
// //     ];
// //   }

// //   if (type === "DROPDOWN" && lower.includes("job role")) {
// //     return [
// //       { label: "Software Developer", value: "Software Developer" },
// //       { label: "Data Analyst", value: "Data Analyst" },
// //       { label: "UI/UX Designer", value: "UI/UX Designer" },
// //       { label: "Product Associate", value: "Product Associate" }
// //     ];
// //   }

// //   if (type === "MULTIPLE_CHOICE") {
// //     return [
// //       { label: "Yes", value: "Yes" },
// //       { label: "No", value: "No" }
// //     ];
// //   }

// //   if (["MULTIPLE_CHOICE", "DROPDOWN"].includes(type)) {
// //     return [
// //       { label: "Option 1", value: "Option 1" },
// //       { label: "Option 2", value: "Option 2" },
// //       { label: "Option 3", value: "Option 3" }
// //     ];
// //   }

// //   return [];
// // };

// // const buildDescription = (title, type) => {
// //   if (type === "FILE") return `Upload your ${title.toLowerCase()}.`;
// //   if (type === "PARAGRAPH") return `Provide details for ${title.toLowerCase()}.`;
// //   if (type === "DROPDOWN" || type === "MULTIPLE_CHOICE") return `Select your ${title.toLowerCase()}.`;
// //   return `Enter your ${title.toLowerCase()}.`;
// // };

// // const buildPlaceholder = (title, type) => {
// //   if (type === "PARAGRAPH") return "Write your answer";
// //   if (type === "FILE") return "";
// //   if (type === "EMAIL") return "name@example.com";
// //   if (type === "DATE") return "";
// //   return `Enter ${title.toLowerCase()}`;
// // };

// // const buildSkeletonFields = ({ requestedFields, requiredByDefault, allowedTypes }) =>
// //   requestedFields.map((name) => {
// //     let type = inferFieldType(name);
// //     if (!allowedTypes.includes(type)) {
// //       type = allowedTypes[0] || "TEXT";
// //     }

// //     return normalizeField({
// //       id: buildId(),
// //       type,
// //       title: toTitleCase(name),
// //       description: buildDescription(name, type),
// //       placeholder: buildPlaceholder(name, type),
// //       required: requiredByDefault || ["EMAIL", "TEXT", "NUMBER", "FILE"].includes(type),
// //       options: buildOptionsForField(name, type),
// //       accept: type === "FILE" ? ["image/*", "application/pdf"] : [],
// //       maxFiles: 1,
// //       maxSizeMB: Number(process.env.MAX_FILE_SIZE_MB || 4)
// //     });
// //   });

// // const buildGenericFields = ({ numFields, types, requiredByDefault }) =>
// //   Array.from({ length: numFields }).map((_, index) => {
// //     const type = types[index % types.length] || "TEXT";
// //     const title = `${type.replaceAll("_", " ")} Field ${index + 1}`;
// //     return normalizeField({
// //       id: buildId(),
// //       type,
// //       title,
// //       description: buildDescription(title, type),
// //       placeholder: buildPlaceholder(title, type),
// //       required: requiredByDefault,
// //       options: buildOptionsForField(title, type),
// //       accept: type === "FILE" ? ["image/*", "application/pdf"] : [],
// //       maxFiles: 1,
// //       maxSizeMB: Number(process.env.MAX_FILE_SIZE_MB || 4)
// //     });
// //   });

// // const buildAiPrompt = ({ skeletonFields, prompt, requiredByDefault }) => {
// //   const compact = skeletonFields.map((field, index) => ({
// //     index,
// //     title: field.title,
// //     type: field.type
// //   }));

// //   return [
// //     "Return valid JSON only.",
// //     `Return exactly this shape: {"fields":[{"index":0,"title":"Field Title","type":"TEXT","description":"Helpful guidance","required":true,"options":["A","B"]}]}.`,
// //     `There must be exactly ${skeletonFields.length} fields.`,
// //     "Keep the same field order and the same titles unless a tiny wording improvement is necessary.",
// //     `Requested form intent: ${prompt || "general survey"}.`,
// //     `Fields to enrich: ${JSON.stringify(compact)}.`,
// //     `Required preference: ${requiredByDefault ? "mostly required" : "balanced optional/required"}.`,
// //     "For MULTIPLE_CHOICE or DROPDOWN include 2-5 options.",
// //     "For FILE do not include options.",
// //     "Do not include markdown. Do not include explanations."
// //   ].join(" ");
// // };

// // const mergeAiIntoSkeleton = (skeletonFields, aiContent, requiredByDefault) => {
// //   const parsed = safeJsonParse(aiContent);
// //   const rawFields = Array.isArray(parsed) ? parsed : parsed?.fields;

// //   if (!Array.isArray(rawFields)) {
// //     return skeletonFields;
// //   }

// //   const valid = rawFields
// //     .map((field) =>
// //       z.object({
// //         index: z.number().int().min(0).max(999).optional(),
// //         title: z.string().trim().min(1).max(120).optional(),
// //         type: z.enum(allowedFieldTypes).optional(),
// //         description: z.string().trim().max(280).optional().default(""),
// //         required: z.boolean().optional().default(false),
// //         options: z.array(z.string().trim().min(1).max(120)).optional().default([])
// //       }).safeParse(field)
// //     )
// //     .filter((result) => result.success)
// //     .map((result) => result.data);

// //   const byIndex = new Map();
// //   valid.forEach((field, idx) => {
// //     const key = field.index ?? idx;
// //     if (!byIndex.has(key)) byIndex.set(key, field);
// //   });

// //   return skeletonFields.map((baseField, index) => {
// //     const aiField = byIndex.get(index);
// //     if (!aiField) return baseField;

// //     const nextType = aiField.type && allowedFieldTypes.includes(aiField.type) ? aiField.type : baseField.type;
// //     const nextOptions = ["MULTIPLE_CHOICE", "DROPDOWN"].includes(nextType)
// //       ? (aiField.options?.length
// //           ? aiField.options.slice(0, 8).map((option) => ({ label: option, value: option }))
// //           : baseField.options)
// //       : [];

// //     return normalizeField({
// //       ...baseField,
// //       type: nextType,
// //       title: aiField.title ? toTitleCase(aiField.title) : baseField.title,
// //       description: aiField.description || baseField.description,
// //       required: requiredByDefault ? true : Boolean(aiField.required ?? baseField.required),
// //       options: nextOptions,
// //       accept: nextType === "FILE" ? ["image/*", "application/pdf"] : [],
// //       maxFiles: nextType === "FILE" ? baseField.maxFiles || 1 : 1,
// //       maxSizeMB: nextType === "FILE" ? baseField.maxSizeMB || Number(process.env.MAX_FILE_SIZE_MB || 4) : Number(process.env.MAX_FILE_SIZE_MB || 4)
// //     });
// //   });
// // };

// // const generateWithAI = async ({ prompt, skeletonFields, requiredByDefault }) => {
// //   const client = getOpenAI();

// //   for (const model of [...new Set(routerModels)]) {
// //     try {
// //       console.log("Trying LLM model:", model);

// //       const aiResponse = await client.chat.completions.create({
// //         model,
// //         temperature: 0.2,
// //         messages: [
// //           {
// //             role: "system",
// //             content: "You enrich form metadata. Return valid JSON only."
// //           },
// //           {
// //             role: "user",
// //             content: buildAiPrompt({ skeletonFields, prompt, requiredByDefault })
// //           }
// //         ]
// //       });

// //       const content = aiResponse?.choices?.[0]?.message?.content;
// //       if (!content) continue;

// //       const merged = mergeAiIntoSkeleton(skeletonFields, content, requiredByDefault);
// //       if (merged.length === skeletonFields.length) {
// //         return merged;
// //       }
// //     } catch (error) {
// //       console.error("Model failed:", model, error?.error?.message || error?.message || error);
// //     }
// //   }

// //   return skeletonFields;
// // };

// // router.post("/generate-form/auth", auth, async (req, res, next) => {
// //   try {
// //     const { title, description, prompt, numFields, types, requiredByDefault } = generateSchema.parse(req.body);

// //     const requestedFields = extractRequestedFieldNames(prompt);
// //     const explicitMode = requestedFields.length > 0;
// //     const effectiveFieldCount = explicitMode ? requestedFields.length : numFields;

// //     const skeletonFields = explicitMode
// //       ? buildSkeletonFields({
// //           requestedFields,
// //           requiredByDefault,
// //           allowedTypes: types
// //         })
// //       : buildGenericFields({
// //           numFields: effectiveFieldCount,
// //           types,
// //           requiredByDefault
// //         });

// //     const fields = await generateWithAI({
// //       prompt,
// //       skeletonFields,
// //       requiredByDefault
// //     });

// //     const form = await Form.create({
// //       userId: req.user.id,
// //       title,
// //       description,
// //       prompt,
// //       fieldCount: effectiveFieldCount,
// //       types,
// //       requiredByDefault,
// //       allowMultipleResponses: true,
// //       embedId: buildEmbedId(),
// //       fields,
// //       published: true,
// //       theme: {
// //         heroTitle: title,
// //         accentFrom: "#3b82f6",
// //         accentTo: "#1d4ed8"
// //       }
// //     });

// //     return res.status(201).json({
// //       form,
// //       generationMeta: {
// //         explicitMode,
// //         requestedFieldCount: requestedFields.length,
// //         finalFieldCount: fields.length
// //       }
// //     });
// //   } catch (error) {
// //     return next(error);
// //   }
// // });

// // router.get("/my/list", auth, async (req, res, next) => {
// //   try {
// //     const forms = await Form.find({ userId: req.user.id })
// //       .sort({ createdAt: -1 })
// //       .select("title description embedId fields responses published allowMultipleResponses createdAt updatedAt");

// //     return res.json({ forms });
// //   } catch (error) {
// //     return next(error);
// //   }
// // });

// // router.get("/:id/edit", auth, async (req, res, next) => {
// //   try {
// //     const form = await Form.findOne({ _id: req.params.id, userId: req.user.id });
// //     if (!form) {
// //       return res.status(404).json({ message: "Form not found." });
// //     }
// //     return res.json({ form });
// //   } catch (error) {
// //     return next(error);
// //   }
// // });

// // router.get("/:id", async (req, res, next) => {
// //   try {
// //     const form = await Form.findById(req.params.id).select(
// //       "title description embedId fields published theme allowMultipleResponses createdAt"
// //     );
// //     if (!form || !form.published) {
// //       return res.status(404).json({ message: "Form not found." });
// //     }
// //     return res.json({ form });
// //   } catch (error) {
// //     return next(error);
// //   }
// // });

// // router.put("/:id", auth, async (req, res, next) => {
// //   try {
// //     const parsed = formSchema.parse(req.body);
// //     const fields = parsed.fields.map((field) => normalizeField(fieldSchema.parse(field)));

// //     const form = await Form.findOneAndUpdate(
// //       { _id: req.params.id, userId: req.user.id },
// //       {
// //         title: parsed.title,
// //         description: parsed.description,
// //         prompt: parsed.prompt,
// //         fieldCount: parsed.fieldCount,
// //         requiredByDefault: parsed.requiredByDefault,
// //         allowMultipleResponses: parsed.allowMultipleResponses,
// //         types: parsed.types,
// //         fields,
// //         published: parsed.published
// //       },
// //       { new: true }
// //     );

// //     if (!form) {
// //       return res.status(404).json({ message: "Form not found." });
// //     }

// //     return res.json({ form });
// //   } catch (error) {
// //     return next(error);
// //   }
// // });

// // router.delete("/:id", auth, async (req, res, next) => {
// //   try {
// //     const deleted = await Form.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

// //     if (!deleted) {
// //       return res.status(404).json({ message: "Form not found." });
// //     }

// //     return res.json({ message: "Form deleted." });
// //   } catch (error) {
// //     return next(error);
// //   }
// // });

// // export default router;
// import express from "express";
// import { z } from "zod";
// import auth from "../middleware/auth.js";
// import Form from "../models/Form.js";
// import { planFormFields } from "../services/aiFormPlanner.js";

// const router = express.Router();

// const allowedFieldTypes = [
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

// const optionSchema = z.object({
//   label: z.string().trim().min(1).max(120),
//   value: z.string().trim().min(1).max(120)
// });

// const fieldSchema = z.object({
//   id: z.string().trim().min(1),
//   type: z.enum(allowedFieldTypes),
//   title: z.string().trim().min(1).max(120),
//   description: z.string().trim().max(280).optional().default(""),
//   placeholder: z.string().trim().max(140).optional().default(""),
//   required: z.boolean().default(false),
//   options: z.array(optionSchema).optional().default([]),
//   accept: z.array(z.string()).optional().default([]),
//   maxFiles: z.number().int().min(1).max(5).optional().default(1),
//   maxSizeMB: z.number().min(1).max(25).optional().default(8),
//   scaleMin: z.number().int().min(1).max(10).optional().default(1),
//   scaleMax: z.number().int().min(2).max(10).optional().default(5),
//   minLabel: z.string().trim().max(60).optional().default("Low"),
//   maxLabel: z.string().trim().max(60).optional().default("High"),
//   visibility: z
//     .object({
//       dependsOnFieldId: z.string().trim().optional().default(""),
//       equals: z.string().trim().optional().default("")
//     })
//     .nullable()
//     .optional()
//     .default(null)
// });

// const formSchema = z.object({
//   title: z.string().trim().min(3).max(120),
//   description: z.string().trim().max(800).optional().default(""),
//   prompt: z.string().trim().max(6000).optional().default(""),
//   fieldCount: z.number().int().min(1).max(100).optional().default(3),
//   requiredByDefault: z.boolean().optional().default(false),
//   allowMultipleResponses: z.boolean().optional().default(true),
//   types: z.array(z.enum(allowedFieldTypes)).optional().default([]),
//   fields: z.array(fieldSchema).min(1).max(100),
//   published: z.boolean().optional().default(true)
// });

// const generateSchema = z.object({
//   title: z.string().trim().min(3).max(120),
//   description: z.string().trim().max(800).optional().default(""),
//   prompt: z.string().trim().max(6000).optional().default("general survey"),
//   numFields: z.number().int().min(1).max(100),
//   types: z.array(z.enum(allowedFieldTypes)).min(1),
//   requiredByDefault: z.boolean().optional().default(false)
// });

// const buildEmbedId = () =>
//   `form_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

// router.post("/generate-form/auth", auth, async (req, res, next) => {
//   try {
//     const { title, description, prompt, numFields, types, requiredByDefault } = generateSchema.parse(req.body);

//     const generation = await planFormFields({
//       prompt,
//       numFields,
//       types,
//       requiredByDefault
//     });

//     const form = await Form.create({
//       userId: req.user.id,
//       title,
//       description,
//       prompt,
//       fieldCount: generation.finalFieldCount,
//       types,
//       requiredByDefault,
//       allowMultipleResponses: true,
//       embedId: buildEmbedId(),
//       fields: generation.fields,
//       published: true,
//       theme: {
//         heroTitle: title,
//         accentFrom: "#3b82f6",
//         accentTo: "#1d4ed8"
//       }
//     });

//     return res.status(201).json({
//       form,
//       generationMeta: {
//         explicitMode: generation.explicitMode,
//         requestedFieldCount: generation.requestedFieldCount,
//         finalFieldCount: generation.finalFieldCount
//       }
//     });
//   } catch (error) {
//     return next(error);
//   }
// });

// router.get("/my/list", auth, async (req, res, next) => {
//   try {
//     const forms = await Form.find({ userId: req.user.id })
//       .sort({ createdAt: -1 })
//       .select("title description embedId fields responses published allowMultipleResponses createdAt updatedAt");

//     return res.json({ forms });
//   } catch (error) {
//     return next(error);
//   }
// });

// router.get("/:id/edit", auth, async (req, res, next) => {
//   try {
//     const form = await Form.findOne({ _id: req.params.id, userId: req.user.id });
//     if (!form) return res.status(404).json({ message: "Form not found." });
//     return res.json({ form });
//   } catch (error) {
//     return next(error);
//   }
// });

// router.get("/:id", async (req, res, next) => {
//   try {
//     const form = await Form.findById(req.params.id).select(
//       "title description embedId fields published theme allowMultipleResponses createdAt"
//     );
//     if (!form || !form.published) return res.status(404).json({ message: "Form not found." });
//     return res.json({ form });
//   } catch (error) {
//     return next(error);
//   }
// });

// router.put("/:id", auth, async (req, res, next) => {
//   try {
//     const parsed = formSchema.parse(req.body);

//     const form = await Form.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user.id },
//       {
//         title: parsed.title,
//         description: parsed.description,
//         prompt: parsed.prompt,
//         fieldCount: parsed.fieldCount,
//         requiredByDefault: parsed.requiredByDefault,
//         allowMultipleResponses: parsed.allowMultipleResponses,
//         types: parsed.types,
//         fields: parsed.fields,
//         published: parsed.published
//       },
//       { new: true }
//     );

//     if (!form) return res.status(404).json({ message: "Form not found." });
//     return res.json({ form });
//   } catch (error) {
//     return next(error);
//   }
// });

// router.delete("/:id", auth, async (req, res, next) => {
//   try {
//     const deleted = await Form.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
//     if (!deleted) return res.status(404).json({ message: "Form not found." });
//     return res.json({ message: "Form deleted." });
//   } catch (error) {
//     return next(error);
//   }
// });

// export default router;
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { z } from "zod";
import auth from "../middleware/auth.js";
import Form from "../models/Form.js";
import { planFormFields } from "../services/aiFormPlanner.js";

const router = express.Router();

const MAX_FORM_FIELDS = 100;

const allowedFieldTypes = [
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

const optionSchema = z.object({
  label: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(120)
});

const visibilitySchema = z
  .object({
    dependsOnFieldId: z.string().trim().optional().default(""),
    equals: z.string().trim().optional().default("")
  })
  .nullable()
  .optional()
  .default(null);

const fieldSchema = z.object({
  id: z.string().trim().min(1),
  type: z.enum(allowedFieldTypes),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(280).optional().default(""),
  placeholder: z.string().trim().max(140).optional().default(""),
  required: z.boolean().default(false),
  options: z.array(optionSchema).optional().default([]),
  accept: z.array(z.string()).optional().default([]),
  maxFiles: z.number().int().min(1).max(5).optional().default(1),
  maxSizeMB: z.number().min(1).max(10).optional().default(4),
  scaleMin: z.number().int().min(1).max(10).optional().default(1),
  scaleMax: z.number().int().min(2).max(10).optional().default(5),
  minLabel: z.string().trim().max(60).optional().default("Low"),
  maxLabel: z.string().trim().max(60).optional().default("High"),
  visibility: visibilitySchema
});

const formSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(500).optional().default(""),
  prompt: z.string().trim().max(6000).optional().default(""),
  fieldCount: z.number().int().min(1).max(MAX_FORM_FIELDS).optional().default(3),
  requiredByDefault: z.boolean().optional().default(false),
  allowMultipleResponses: z.boolean().optional().default(true),
  types: z.array(z.enum(allowedFieldTypes)).optional().default([]),
  fields: z.array(fieldSchema).min(1).max(MAX_FORM_FIELDS),
  published: z.boolean().optional().default(true)
});

const generateSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(500).optional().default(""),
  prompt: z.string().trim().max(6000).optional().default("general survey"),
  numFields: z.number().int().min(1).max(MAX_FORM_FIELDS),
  types: z.array(z.enum(allowedFieldTypes)).min(1),
  requiredByDefault: z.boolean().optional().default(false)
});

const buildEmbedId = () =>
  `form_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

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

  const normalized = captured
    .replace(/\band an additional\b/gi, ", additional")
    .replace(/\band additional\b/gi, ", additional")
    .replace(/\band\b/gi, ",")
    .replace(/\s*,\s*/g, ",")
    .trim();

  return [...new Set(
    normalized
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
  )].slice(0, 200);
};

const normalizeFieldsForSave = (fields, allowMultipleResponses) => {
  if (allowMultipleResponses !== false) {
    return fields;
  }

  const emailFields = fields.filter((field) => field.type === "EMAIL");
  if (!emailFields.length) {
    throw Object.assign(new Error("Single response mode requires at least one Email field."), {
      status: 400
    });
  }

  return fields.map((field) =>
    field.type === "EMAIL"
      ? {
          ...field,
          required: true
        }
      : field
  );
};

router.post("/generate-form/auth", auth, async (req, res, next) => {
  try {
    const { title, description, prompt, numFields, types, requiredByDefault } = generateSchema.parse(req.body);

    const requestedFields = extractRequestedFieldNames(prompt);
    const effectiveFieldCount = requestedFields.length || numFields;

    if (effectiveFieldCount > MAX_FORM_FIELDS) {
      return res.status(400).json({
        message: `You are trying to generate ${effectiveFieldCount} fields, but the current limit is ${MAX_FORM_FIELDS}. Please reduce the field count or split the form into sections.`
      });
    }

    const generation = await planFormFields({
      prompt,
      numFields,
      types,
      requiredByDefault
    });

    if (!generation.fields?.length) {
      return res.status(502).json({
        message: "We could not generate fields from this prompt right now. Please try again with a slightly simpler prompt."
      });
    }

    if (generation.finalFieldCount > MAX_FORM_FIELDS) {
      return res.status(400).json({
        message: `This prompt resolves to ${generation.finalFieldCount} fields, which is above the supported limit of ${MAX_FORM_FIELDS}.`
      });
    }

    const form = await Form.create({
      userId: req.user.id,
      title,
      description,
      prompt,
      fieldCount: generation.fields.length,
      types,
      requiredByDefault,
      allowMultipleResponses: true,
      embedId: buildEmbedId(),
      fields: generation.fields,
      published: true,
      theme: {
        heroTitle: title,
        accentFrom: "#3b82f6",
        accentTo: "#1d4ed8"
      }
    });

    return res.status(201).json({
      form,
      generationMeta: {
        explicitMode: generation.explicitMode,
        requestedFieldCount: generation.requestedFieldCount,
        finalFieldCount: generation.finalFieldCount
      },
      message: `Generated ${generation.finalFieldCount} field(s) successfully.`
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/my/list", auth, async (req, res, next) => {
  try {
    const forms = await Form.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("title description embedId fields responses published allowMultipleResponses createdAt updatedAt");

    return res.json({ forms });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/edit", auth, async (req, res, next) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: "Form not found." });
    }
    return res.json({ form });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id).select(
      "title description embedId fields published theme allowMultipleResponses createdAt"
    );
    if (!form || !form.published) {
      return res.status(404).json({ message: "Form not found." });
    }
    return res.json({ form });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const parsed = formSchema.parse(req.body);
    const normalizedFields = normalizeFieldsForSave(parsed.fields, parsed.allowMultipleResponses);

    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        title: parsed.title,
        description: parsed.description,
        prompt: parsed.prompt,
        fieldCount: normalizedFields.length,
        requiredByDefault: parsed.requiredByDefault,
        allowMultipleResponses: parsed.allowMultipleResponses,
        types: parsed.types,
        fields: normalizedFields,
        published: parsed.published
      },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ message: "Form not found." });
    }

    return res.json({ form, message: "Form updated successfully." });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const deleted = await Form.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: "Form not found." });
    }

    return res.json({ message: "Form deleted." });
  } catch (error) {
    return next(error);
  }
});

export default router;
