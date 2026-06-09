
// import express from "express";
// import multer from "multer";
// import { z } from "zod";
// import auth from "../middleware/auth.js";
// import Form from "../models/Form.js";
// import { uploadPublicFile } from "../services/storage.js";
// import { verifyTurnstile } from "../services/turnstile.js";

// const router = express.Router();
// const memoryUpload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: Number(process.env.MAX_FILE_SIZE_MB || 8) * 1024 * 1024
//   }
// });

// const uploadedFileSchema = z.object({
//   name: z.string().trim().min(1).max(180),
//   type: z.string().trim().min(1).max(120),
//   size: z.number().int().min(1),
//   url: z.string().trim().url(),
//   storageKey: z.string().trim().min(5).max(320)
// });

// const answerValueSchema = z.union([
//   z.string(),
//   z.number(),
//   z.boolean(),
//   z.array(z.string()),
//   z.array(uploadedFileSchema)
// ]);

// const responseSchema = z.object({
//   answers: z.record(answerValueSchema),
//   captchaToken: z.string().optional().default("")
// });

// const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

// const getSingleResponseEmailField = (form) =>
//   form.fields.find((field) => field.type === "EMAIL");

// router.post("/upload", memoryUpload.single("file"), async (req, res, next) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded." });

//     const uploaded = await uploadPublicFile(req.file);
//     return res.status(201).json({ file: uploaded });
//   } catch (error) {
//     return next(error);
//   }
// });

// router.post("/:id", async (req, res, next) => {
//   try {
//     const { answers, captchaToken } = responseSchema.parse(req.body);
//     const form = await Form.findById(req.params.id);

//     if (!form || !form.published) {
//       return res.status(404).json({ message: "Form not found." });
//     }

//     const captcha = await verifyTurnstile(captchaToken, req.ip);
//     if (!captcha.ok) {
//       return res.status(400).json({ message: captcha.message });
//     }

//     if (!form.allowMultipleResponses) {
//       const emailField = getSingleResponseEmailField(form);

//       if (!emailField) {
//         return res.status(400).json({
//           message: "This form is configured for one response per email, but no Email field exists."
//         });
//       }

//       const submittedEmail = normalizeEmail(answers[emailField.id]);
//       if (!submittedEmail) {
//         return res.status(400).json({
//           message: "Email is required for this form because only one response per email is allowed."
//         });
//       }

//       const existing = form.responses.some((response) => {
//         const existingEmail = normalizeEmail(response.answers?.[emailField.id]);
//         return existingEmail && existingEmail === submittedEmail;
//       });

//       if (existing) {
//         return res.status(409).json({
//           message: "This form only allows one response per email address."
//         });
//       }
//     }

//     let attachmentCount = 0;
//     const uploadedFiles = [];

//     for (const field of form.fields) {
//       if (field.type === "PAGE_BREAK") continue;

//       const value = answers[field.id];
//       const hasValue = Array.isArray(value)
//         ? value.length > 0
//         : value !== undefined && value !== null && value !== "";

//       if (field.visibility?.dependsOnFieldId) {
//         const dependsValue = answers[field.visibility.dependsOnFieldId];
//         if (String(dependsValue ?? "") !== String(field.visibility.equals ?? "")) {
//           continue;
//         }
//       }

//       if (field.required && !hasValue) {
//         return res.status(400).json({ message: `${field.title} is required.` });
//       }

//       if (field.type === "EMAIL" && hasValue) {
//         const validEmail = z.string().email().safeParse(String(value).trim());
//         if (!validEmail.success) {
//           return res.status(400).json({ message: `${field.title} must be a valid email address.` });
//         }
//       }

//       if (field.type === "FILE" && hasValue) {
//         const files = z.array(uploadedFileSchema).min(1).max(field.maxFiles || 1).parse(value);
//         uploadedFiles.push(...files);
//         attachmentCount += files.length;
//       }
//     }

//     form.responses.push({
//       answers,
//       uploadedFiles,
//       attachmentCount,
//       submittedAt: new Date(),
//       submittedByIp: req.ip,
//       userAgent: req.headers["user-agent"] || ""
//     });

//     await form.save();

//     return res.status(201).json({ message: "Response submitted successfully." });
//   } catch (error) {
//     return next(error);
//   }
// });

// router.get("/:id", auth, async (req, res, next) => {
//   try {
//     const form = await Form.findOne({ _id: req.params.id, userId: req.user.id }).select(
//       "title fields responses createdAt updatedAt allowMultipleResponses"
//     );

//     if (!form) return res.status(404).json({ message: "Form not found." });

//     return res.json({
//       responses: form.responses,
//       fields: form.fields,
//       title: form.title,
//       allowMultipleResponses: form.allowMultipleResponses
//     });
//   } catch (error) {
//     return next(error);
//   }
// });

// export default router;
import express from "express";
import multer from "multer";
import { z } from "zod";
import auth from "../middleware/auth.js";
import Form from "../models/Form.js";
import { uploadPublicFile } from "../services/storage.js";
import { verifyTurnstile } from "../services/turnstile.js";

const router = express.Router();

const MAX_UPLOAD_ROUTE_MB = 10;

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_ROUTE_MB * 1024 * 1024
  }
});

const uploadedFileSchema = z.object({
  name: z.string().trim().min(1).max(180),
  type: z.string().trim().min(1).max(120),
  size: z.number().int().min(1),
  url: z.string().trim().url(),
  storageKey: z.string().trim().min(5).max(320)
});

const answerValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.array(uploadedFileSchema)
]);

const responseSchema = z.object({
  answers: z.record(answerValueSchema),
  captchaToken: z.string().optional().default("")
});

const uploadContextSchema = z.object({
  formId: z.string().trim().min(1),
  fieldId: z.string().trim().min(1)
});

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const getSingleResponseEmailField = (form) =>
  form.fields.find((field) => field.type === "EMAIL");

const isMimeAllowed = (mimeType, acceptList = []) => {
  if (!acceptList.length) return true;
  if (!mimeType) return false;

  return acceptList.some((rule) => {
    const normalizedRule = String(rule || "").trim().toLowerCase();
    const normalizedMime = String(mimeType || "").trim().toLowerCase();

    if (!normalizedRule) return false;
    if (normalizedRule === normalizedMime) return true;

    if (normalizedRule.endsWith("/*")) {
      const prefix = normalizedRule.slice(0, normalizedRule.length - 1);
      return normalizedMime.startsWith(prefix);
    }

    return false;
  });
};

const isValidDateValue = (value) => {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return false;
  return !Number.isNaN(Date.parse(value));
};

const isVisibleField = (field, answers) => {
  if (!field.visibility?.dependsOnFieldId) return true;
  return String(answers[field.visibility.dependsOnFieldId] ?? "") === String(field.visibility.equals ?? "");
};

const sanitizeAndValidateAnswers = (form, answers) => {
  const allowedFieldIds = new Set(form.fields.map((field) => field.id));
  const submittedFieldIds = Object.keys(answers || {});
  const unknownFieldIds = submittedFieldIds.filter((fieldId) => !allowedFieldIds.has(fieldId));

  if (unknownFieldIds.length) {
    return {
      ok: false,
      status: 400,
      message: `This submission contains unknown field data: ${unknownFieldIds.join(", ")}.`
    };
  }

  const sanitizedAnswers = {};
  const uploadedFiles = [];
  let attachmentCount = 0;

  for (const field of form.fields) {
    if (field.type === "PAGE_BREAK") continue;
    if (!isVisibleField(field, answers)) continue;

    const value = answers[field.id];
    const hasValue = Array.isArray(value)
      ? value.length > 0
      : value !== undefined && value !== null && value !== "";

    if (field.required && !hasValue) {
      return {
        ok: false,
        status: 400,
        message: `${field.title} is required.`
      };
    }

    if (!hasValue) continue;

    if (field.type === "TEXT" || field.type === "PARAGRAPH") {
      if (typeof value !== "string") {
        return { ok: false, status: 400, message: `${field.title} must be text.` };
      }
      sanitizedAnswers[field.id] = value.trim();
      continue;
    }

    if (field.type === "EMAIL") {
      const validEmail = z.string().email().safeParse(String(value).trim());
      if (!validEmail.success) {
        return { ok: false, status: 400, message: `${field.title} must be a valid email address.` };
      }
      sanitizedAnswers[field.id] = String(value).trim();
      continue;
    }
    if (field.type === "URL") {
      const validUrl = z.string().url().safeParse(String(value).trim());
      if (!validUrl.success) {
        return { ok: false, status: 400, message: `${field.title} must be a valid URL.` };
      }
      sanitizedAnswers[field.id] = String(value).trim();
      continue;
    }

    if (field.type === "NUMBER") {
      if (typeof value !== "number" || Number.isNaN(value)) {
        return { ok: false, status: 400, message: `${field.title} must be a valid number.` };
      }
      sanitizedAnswers[field.id] = value;
      continue;
    }

    if (field.type === "DATE") {
      if (!isValidDateValue(value)) {
        return { ok: false, status: 400, message: `${field.title} must be a valid date.` };
      }
      sanitizedAnswers[field.id] = value;
      continue;
    }

    if (field.type === "DROPDOWN" || field.type === "MULTIPLE_CHOICE") {
      if (typeof value !== "string") {
        return { ok: false, status: 400, message: `${field.title} must be a valid option.` };
      }

      const allowedOptions = new Set((field.options || []).map((option) => option.value));
      if (!allowedOptions.has(value)) {
        return { ok: false, status: 400, message: `${field.title} contains an invalid option.` };
      }

      sanitizedAnswers[field.id] = value;
      continue;
    }

    if (field.type === "CHECKBOX_GROUP") {
      if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
        return { ok: false, status: 400, message: `${field.title} must contain valid selections.` };
      }

      const allowedOptions = new Set((field.options || []).map((option) => option.value));
      const invalidValues = value.filter((item) => !allowedOptions.has(item));
      if (invalidValues.length) {
        return { ok: false, status: 400, message: `${field.title} contains invalid selections.` };
      }

      sanitizedAnswers[field.id] = [...new Set(value)];
      continue;
    }

    if (field.type === "LINEAR_SCALE") {
      const numericValue =
        typeof value === "number"
          ? value
          : typeof value === "string" && value.trim() !== ""
            ? Number(value)
            : Number.NaN;

      if (Number.isNaN(numericValue)) {
        return { ok: false, status: 400, message: `${field.title} must be a valid rating.` };
      }

      const min = field.scaleMin || 1;
      const max = field.scaleMax || 5;

      if (numericValue < min || numericValue > max) {
        return { ok: false, status: 400, message: `${field.title} must be between ${min} and ${max}.` };
      }

      sanitizedAnswers[field.id] = String(numericValue);
      continue;
    }

    if (field.type === "FILE") {
      const files = z.array(uploadedFileSchema).min(1).max(field.maxFiles || 1).safeParse(value);
      if (!files.success) {
        return { ok: false, status: 400, message: `${field.title} contains invalid uploaded files.` };
      }

      const invalidMime = files.data.find((file) => !isMimeAllowed(file.type, field.accept || []));
      if (invalidMime) {
        return { ok: false, status: 400, message: `${field.title} contains a file type that is not allowed.` };
      }

      const invalidSize = files.data.find(
        (file) => file.size > Number(field.maxSizeMB || MAX_UPLOAD_ROUTE_MB) * 1024 * 1024
      );
      if (invalidSize) {
        return { ok: false, status: 400, message: `${field.title} contains a file that is too large.` };
      }

      sanitizedAnswers[field.id] = files.data;
      uploadedFiles.push(...files.data);
      attachmentCount += files.data.length;
    }
  }

  return {
    ok: true,
    sanitizedAnswers,
    uploadedFiles,
    attachmentCount
  };
};

router.post("/upload", memoryUpload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const { formId, fieldId } = uploadContextSchema.parse(req.body);
    const form = await Form.findById(formId).select("published fields");

    if (!form || !form.published) {
      return res.status(404).json({ message: "Form not found for upload." });
    }

    const field = form.fields.find((item) => item.id === fieldId);
    if (!field || field.type !== "FILE") {
      return res.status(400).json({ message: "This upload field is invalid." });
    }

    if (!isMimeAllowed(req.file.mimetype, field.accept || [])) {
      return res.status(400).json({
        message: `${field.title} only accepts: ${(field.accept || []).join(", ")}`
      });
    }

    const maxBytes = Number(field.maxSizeMB || MAX_UPLOAD_ROUTE_MB) * 1024 * 1024;
    if (req.file.size > maxBytes) {
      return res.status(400).json({
        message: `${field.title} only allows files up to ${field.maxSizeMB || MAX_UPLOAD_ROUTE_MB}MB.`
      });
    }

    const uploaded = await uploadPublicFile(req.file);
    return res.status(201).json({ file: uploaded });
  } catch (error) {
    return next(error);
  }
});

router.post("/:id", async (req, res, next) => {
  try {
    const { answers, captchaToken } = responseSchema.parse(req.body);
    const form = await Form.findById(req.params.id);

    if (!form || !form.published) {
      return res.status(404).json({ message: "Form not found." });
    }

    const captcha = await verifyTurnstile(captchaToken, req.ip);
    if (!captcha.ok) {
      return res.status(400).json({ message: captcha.message });
    }

    const validation = sanitizeAndValidateAnswers(form, answers);
    if (!validation.ok) {
      return res.status(validation.status).json({ message: validation.message });
    }

    if (!form.allowMultipleResponses) {
      const emailField = getSingleResponseEmailField(form);

      if (!emailField) {
        return res.status(400).json({
          message: "This form is configured for one response per email, but no Email field exists."
        });
      }

      const submittedEmail = normalizeEmail(validation.sanitizedAnswers[emailField.id]);
      if (!submittedEmail) {
        return res.status(400).json({
          message: "Email is required for this form because only one response per email is allowed."
        });
      }

      const existing = form.responses.some((response) => {
        const existingEmail = normalizeEmail(response.answers?.[emailField.id]);
        return existingEmail && existingEmail === submittedEmail;
      });

      if (existing) {
        return res.status(409).json({
          message: "This form only allows one response per email address."
        });
      }
    }

    form.responses.push({
      answers: validation.sanitizedAnswers,
      uploadedFiles: validation.uploadedFiles,
      attachmentCount: validation.attachmentCount,
      submittedAt: new Date(),
      submittedByIp: req.ip,
      userAgent: req.headers["user-agent"] || ""
    });

    await form.save();

    return res.status(201).json({ message: "Response submitted successfully." });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", auth, async (req, res, next) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, userId: req.user.id }).select(
      "title fields responses createdAt updatedAt allowMultipleResponses"
    );

    if (!form) return res.status(404).json({ message: "Form not found." });

    return res.json({
      responses: form.responses,
      fields: form.fields,
      title: form.title,
      allowMultipleResponses: form.allowMultipleResponses
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
