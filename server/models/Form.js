// // // // import mongoose from "mongoose";

// // // // const optionSchema = new mongoose.Schema(
// // // //   {
// // // //     label: { type: String, trim: true, maxlength: 120, required: true },
// // // //     value: { type: String, trim: true, maxlength: 120, required: true }
// // // //   },
// // // //   { _id: false }
// // // // );

// // // // const fieldSchema = new mongoose.Schema(
// // // //   {
// // // //     id: { type: String, required: true },
// // // //     type: {
// // // //       type: String,
// // // //       enum: [
// // // //         "TEXT",
// // // //         "PARAGRAPH",
// // // //         "MULTIPLE_CHOICE",
// // // //         "DROPDOWN",
// // // //         "DATE",
// // // //         "EMAIL",
// // // //         "NUMBER",
// // // //         "FILE"
// // // //       ],
// // // //       required: true
// // // //     },
// // // //     title: { type: String, required: true, trim: true, maxlength: 120 },
// // // //     description: { type: String, trim: true, maxlength: 280, default: "" },
// // // //     placeholder: { type: String, trim: true, maxlength: 140, default: "" },
// // // //     required: { type: Boolean, default: false },
// // // //     options: { type: [optionSchema], default: [] },
// // // //     accept: { type: [String], default: [] },
// // // //     maxFiles: { type: Number, default: 1, min: 1, max: 5 },
// // // //     maxSizeMB: { type: Number, default: 4, min: 1, max: 10 }
// // // //   },
// // // //   { _id: false }
// // // // );

// // // // const uploadedFileSchema = new mongoose.Schema(
// // // //   {
// // // //     name: { type: String, required: true },
// // // //     type: { type: String, required: true },
// // // //     size: { type: Number, required: true },
// // // //     url: { type: String, required: true },
// // // //     storageKey: { type: String, required: true }
// // // //   },
// // // //   { _id: false }
// // // // );

// // // // const responseSchema = new mongoose.Schema(
// // // //   {
// // // //     answers: { type: mongoose.Schema.Types.Mixed, default: {} },
// // // //     uploadedFiles: { type: [uploadedFileSchema], default: [] },
// // // //     submittedAt: { type: Date, default: Date.now },
// // // //     submittedByIp: { type: String, default: "" },
// // // //     userAgent: { type: String, default: "" },
// // // //     attachmentCount: { type: Number, default: 0 }
// // // //   },
// // // //   { _id: true }
// // // // );

// // // // const formSchema = new mongoose.Schema(
// // // //   {
// // // //     userId: {
// // // //       type: mongoose.Schema.Types.ObjectId,
// // // //       ref: "User",
// // // //       required: true,
// // // //       index: true
// // // //     },
// // // //     title: { type: String, required: true, trim: true, maxlength: 120 },
// // // //     description: { type: String, trim: true, maxlength: 500, default: "" },
// // // //     prompt: { type: String, trim: true, maxlength: 2000, default: "" },
// // // //     fieldCount: { type: Number, min: 1, max: 20, default: 3 },
// // // //     types: { type: [String], default: [] },
// // // //     requiredByDefault: { type: Boolean, default: false },
// // // //     theme: {
// // // //       heroTitle: { type: String, trim: true, default: "" },
// // // //       accentFrom: { type: String, trim: true, default: "#3b82f6" },
// // // //       accentTo: { type: String, trim: true, default: "#1d4ed8" }
// // // //     },
// // // //     embedId: { type: String, required: true, unique: true, index: true },
// // // //     published: { type: Boolean, default: true },
// // // //     fields: { type: [fieldSchema], default: [] },
// // // //     responses: { type: [responseSchema], default: [] }
// // // //   },
// // // //   { timestamps: true }
// // // // );

// // // // formSchema.index({ title: "text", description: "text", prompt: "text" });

// // // // export default mongoose.model("Form", formSchema);
// // // import mongoose from "mongoose";

// // // const optionSchema = new mongoose.Schema(
// // //   {
// // //     label: { type: String, trim: true, maxlength: 120, required: true },
// // //     value: { type: String, trim: true, maxlength: 120, required: true }
// // //   },
// // //   { _id: false }
// // // );

// // // const fieldSchema = new mongoose.Schema(
// // //   {
// // //     id: { type: String, required: true },
// // //     type: {
// // //       type: String,
// // //       enum: [
// // //         "TEXT",
// // //         "PARAGRAPH",
// // //         "MULTIPLE_CHOICE",
// // //         "DROPDOWN",
// // //         "DATE",
// // //         "EMAIL",
// // //         "NUMBER",
// // //         "FILE"
// // //       ],
// // //       required: true
// // //     },
// // //     title: { type: String, required: true, trim: true, maxlength: 120 },
// // //     description: { type: String, trim: true, maxlength: 280, default: "" },
// // //     placeholder: { type: String, trim: true, maxlength: 140, default: "" },
// // //     required: { type: Boolean, default: false },
// // //     options: { type: [optionSchema], default: [] },
// // //     accept: { type: [String], default: [] },
// // //     maxFiles: { type: Number, default: 1, min: 1, max: 5 },
// // //     maxSizeMB: { type: Number, default: 4, min: 1, max: 10 }
// // //   },
// // //   { _id: false }
// // // );

// // // const uploadedFileSchema = new mongoose.Schema(
// // //   {
// // //     name: { type: String, required: true },
// // //     type: { type: String, required: true },
// // //     size: { type: Number, required: true },
// // //     url: { type: String, required: true },
// // //     storageKey: { type: String, required: true }
// // //   },
// // //   { _id: false }
// // // );

// // // const responseSchema = new mongoose.Schema(
// // //   {
// // //     answers: { type: mongoose.Schema.Types.Mixed, default: {} },
// // //     uploadedFiles: { type: [uploadedFileSchema], default: [] },
// // //     submittedAt: { type: Date, default: Date.now },
// // //     submittedByIp: { type: String, default: "" },
// // //     userAgent: { type: String, default: "" },
// // //     respondentFingerprint: { type: String, default: "" },
// // //     attachmentCount: { type: Number, default: 0 }
// // //   },
// // //   { _id: true }
// // // );

// // // const formSchema = new mongoose.Schema(
// // //   {
// // //     userId: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: "User",
// // //       required: true,
// // //       index: true
// // //     },
// // //     title: { type: String, required: true, trim: true, maxlength: 120 },
// // //     description: { type: String, trim: true, maxlength: 500, default: "" },
// // //     prompt: { type: String, trim: true, maxlength: 2000, default: "" },
// // //     fieldCount: { type: Number, min: 1, max: 20, default: 3 },
// // //     types: { type: [String], default: [] },
// // //     requiredByDefault: { type: Boolean, default: false },
// // //     allowMultipleResponses: { type: Boolean, default: true },
// // //     theme: {
// // //       heroTitle: { type: String, trim: true, default: "" },
// // //       accentFrom: { type: String, trim: true, default: "#3b82f6" },
// // //       accentTo: { type: String, trim: true, default: "#1d4ed8" }
// // //     },
// // //     embedId: { type: String, required: true, unique: true, index: true },
// // //     published: { type: Boolean, default: true },
// // //     fields: { type: [fieldSchema], default: [] },
// // //     responses: { type: [responseSchema], default: [] }
// // //   },
// // //   { timestamps: true }
// // // );

// // // formSchema.index({ title: "text", description: "text", prompt: "text" });

// // // export default mongoose.model("Form", formSchema);
// // import mongoose from "mongoose";

// // const optionSchema = new mongoose.Schema(
// //   {
// //     label: { type: String, trim: true, maxlength: 120, required: true },
// //     value: { type: String, trim: true, maxlength: 120, required: true }
// //   },
// //   { _id: false }
// // );

// // const fieldSchema = new mongoose.Schema(
// //   {
// //     id: { type: String, required: true },
// //     type: {
// //       type: String,
// //       enum: [
// //         "TEXT",
// //         "PARAGRAPH",
// //         "MULTIPLE_CHOICE",
// //         "DROPDOWN",
// //         "DATE",
// //         "EMAIL",
// //         "NUMBER",
// //         "FILE"
// //       ],
// //       required: true
// //     },
// //     title: { type: String, required: true, trim: true, maxlength: 120 },
// //     description: { type: String, trim: true, maxlength: 280, default: "" },
// //     placeholder: { type: String, trim: true, maxlength: 140, default: "" },
// //     required: { type: Boolean, default: false },
// //     options: { type: [optionSchema], default: [] },
// //     accept: { type: [String], default: [] },
// //     maxFiles: { type: Number, default: 1, min: 1, max: 5 },
// //     maxSizeMB: { type: Number, default: 4, min: 1, max: 10 }
// //   },
// //   { _id: false }
// // );

// // const uploadedFileSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true },
// //     type: { type: String, required: true },
// //     size: { type: Number, required: true },
// //     url: { type: String, required: true },
// //     storageKey: { type: String, required: true }
// //   },
// //   { _id: false }
// // );

// // const responseSchema = new mongoose.Schema(
// //   {
// //     answers: { type: mongoose.Schema.Types.Mixed, default: {} },
// //     uploadedFiles: { type: [uploadedFileSchema], default: [] },
// //     submittedAt: { type: Date, default: Date.now },
// //     submittedByIp: { type: String, default: "" },
// //     userAgent: { type: String, default: "" },
// //     attachmentCount: { type: Number, default: 0 }
// //   },
// //   { _id: true }
// // );

// // const formSchema = new mongoose.Schema(
// //   {
// //     userId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //       index: true
// //     },
// //     title: { type: String, required: true, trim: true, maxlength: 120 },
// //     description: { type: String, trim: true, maxlength: 500, default: "" },
// //     prompt: { type: String, trim: true, maxlength: 4000, default: "" },
// //     fieldCount: { type: Number, min: 1, max: 50, default: 3 },
// //     types: { type: [String], default: [] },
// //     requiredByDefault: { type: Boolean, default: false },
// //     allowMultipleResponses: { type: Boolean, default: true },
// //     theme: {
// //       heroTitle: { type: String, trim: true, default: "" },
// //       accentFrom: { type: String, trim: true, default: "#3b82f6" },
// //       accentTo: { type: String, trim: true, default: "#1d4ed8" }
// //     },
// //     embedId: { type: String, required: true, unique: true, index: true },
// //     published: { type: Boolean, default: true },
// //     fields: { type: [fieldSchema], default: [] },
// //     responses: { type: [responseSchema], default: [] }
// //   },
// //   { timestamps: true }
// // );

// // formSchema.index({ title: "text", description: "text", prompt: "text" });

// // export default mongoose.model("Form", formSchema);
// import mongoose from "mongoose";

// const optionSchema = new mongoose.Schema(
//   {
//     label: { type: String, trim: true, maxlength: 120, required: true },
//     value: { type: String, trim: true, maxlength: 120, required: true }
//   },
//   { _id: false }
// );

// const visibilitySchema = new mongoose.Schema(
//   {
//     dependsOnFieldId: { type: String, default: "" },
//     equals: { type: String, default: "" }
//   },
//   { _id: false }
// );

// const fieldSchema = new mongoose.Schema(
//   {
//     id: { type: String, required: true },
//     type: {
//       type: String,
//       enum: [
//         "TEXT",
//         "PARAGRAPH",
//         "MULTIPLE_CHOICE",
//         "DROPDOWN",
//         "DATE",
//         "EMAIL",
//         "NUMBER",
//         "FILE",
//         "CHECKBOX_GROUP",
//         "LINEAR_SCALE",
//         "PAGE_BREAK"
//       ],
//       required: true
//     },
//     title: { type: String, required: true, trim: true, maxlength: 120 },
//     description: { type: String, trim: true, maxlength: 280, default: "" },
//     placeholder: { type: String, trim: true, maxlength: 140, default: "" },
//     required: { type: Boolean, default: false },
//     options: { type: [optionSchema], default: [] },
//     accept: { type: [String], default: [] },
//     maxFiles: { type: Number, default: 1, min: 1, max: 5 },
//     maxSizeMB: { type: Number, default: 8, min: 1, max: 25 },
//     scaleMin: { type: Number, default: 1 },
//     scaleMax: { type: Number, default: 5 },
//     minLabel: { type: String, default: "Low" },
//     maxLabel: { type: String, default: "High" },
//     visibility: { type: visibilitySchema, default: null }
//   },
//   { _id: false }
// );

// const uploadedFileSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     type: { type: String, required: true },
//     size: { type: Number, required: true },
//     url: { type: String, required: true },
//     storageKey: { type: String, required: true }
//   },
//   { _id: false }
// );

// const responseSchema = new mongoose.Schema(
//   {
//     answers: { type: mongoose.Schema.Types.Mixed, default: {} },
//     uploadedFiles: { type: [uploadedFileSchema], default: [] },
//     submittedAt: { type: Date, default: Date.now, index: true },
//     submittedByIp: { type: String, default: "" },
//     userAgent: { type: String, default: "" },
//     attachmentCount: { type: Number, default: 0 }
//   },
//   { _id: true }
// );

// const formSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true
//     },
//     title: { type: String, required: true, trim: true, maxlength: 120 },
//     description: { type: String, trim: true, maxlength: 800, default: "" },
//     prompt: { type: String, trim: true, maxlength: 6000, default: "" },
//     fieldCount: { type: Number, min: 1, max: 100, default: 3 },
//     types: { type: [String], default: [] },
//     requiredByDefault: { type: Boolean, default: false },
//     allowMultipleResponses: { type: Boolean, default: true },
//     theme: {
//       heroTitle: { type: String, trim: true, default: "" },
//       accentFrom: { type: String, trim: true, default: "#3b82f6" },
//       accentTo: { type: String, trim: true, default: "#1d4ed8" }
//     },
//     embedId: { type: String, required: true, unique: true, index: true },
//     published: { type: Boolean, default: true, index: true },
//     fields: { type: [fieldSchema], default: [] },
//     responses: { type: [responseSchema], default: [] }
//   },
//   { timestamps: true }
// );

// formSchema.index({ userId: 1, updatedAt: -1 });
// formSchema.index({ userId: 1, title: 1 });
// formSchema.index({ title: "text", description: "text", prompt: "text" });

// export default mongoose.model("Form", formSchema);
import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 120, required: true },
    value: { type: String, trim: true, maxlength: 120, required: true }
  },
  { _id: false }
);

const visibilitySchema = new mongoose.Schema(
  {
    dependsOnFieldId: { type: String, default: "" },
    equals: { type: String, default: "" }
  },
  { _id: false }
);

const fieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "TEXT",
        "PARAGRAPH",
        "MULTIPLE_CHOICE",
        "DROPDOWN",
        "DATE",
        "EMAIL",
        "NUMBER",
        "URL",
        "FILE",
        "CHECKBOX_GROUP",
        "LINEAR_SCALE",
        "PAGE_BREAK"
      ],
      required: true
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 280, default: "" },
    placeholder: { type: String, trim: true, maxlength: 140, default: "" },
    required: { type: Boolean, default: false },
    options: { type: [optionSchema], default: [] },
    accept: { type: [String], default: [] },
    maxFiles: { type: Number, default: 1, min: 1, max: 5 },
    maxSizeMB: { type: Number, default: 4, min: 1, max: 10 },
    scaleMin: { type: Number, default: 1 },
    scaleMax: { type: Number, default: 5 },
    minLabel: { type: String, trim: true, maxlength: 60, default: "Low" },
    maxLabel: { type: String, trim: true, maxlength: 60, default: "High" },
    visibility: { type: visibilitySchema, default: null }
  },
  { _id: false }
);

const uploadedFileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    storageKey: { type: String, required: true }
  },
  { _id: false }
);

const responseSchema = new mongoose.Schema(
  {
    answers: { type: mongoose.Schema.Types.Mixed, default: {} },
    uploadedFiles: { type: [uploadedFileSchema], default: [] },
    submittedAt: { type: Date, default: Date.now },
    submittedByIp: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    attachmentCount: { type: Number, default: 0 }
  },
  { _id: true }
);

const formSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    prompt: { type: String, trim: true, maxlength: 6000, default: "" },
    fieldCount: { type: Number, min: 1, max: 100, default: 3 },
    types: { type: [String], default: [] },
    requiredByDefault: { type: Boolean, default: false },
    allowMultipleResponses: { type: Boolean, default: true },
    theme: {
      heroTitle: { type: String, trim: true, default: "" },
      accentFrom: { type: String, trim: true, default: "#3b82f6" },
      accentTo: { type: String, trim: true, default: "#1d4ed8" }
    },
    embedId: { type: String, required: true, unique: true, index: true },
    published: { type: Boolean, default: true },
    fields: { type: [fieldSchema], default: [] },
    responses: { type: [responseSchema], default: [] }
  },
  { timestamps: true }
);

formSchema.index({ title: "text", description: "text", prompt: "text" });
formSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model("Form", formSchema);
