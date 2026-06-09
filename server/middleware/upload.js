import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadRoot = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const sanitizeFileName = (name) =>
  name
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .replace(/_+/g, "_")
    .slice(-120);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadRoot),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || "") || "";
    const safeBase = sanitizeFileName(path.basename(file.originalname || "file", extension));
    const random = crypto.randomBytes(10).toString("hex");
    cb(null, `${Date.now()}_${random}_${safeBase}${extension}`);
  }
});

const fileSizeLimit = Number(process.env.MAX_FILE_SIZE_MB || 4) * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: fileSizeLimit }
});

export default upload;
