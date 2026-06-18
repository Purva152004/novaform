
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import * as Sentry from "@sentry/node";

import authRoutes from "./routes/auth.js";
import formRoutes from "./routes/forms.js";
import responseRoutes from "./routes/responses.js";
import logger from "./services/logger.js";
const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
];


for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.2
  });
}

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URL = process.env.CLIENT_URL;
app.get("/api/health", (req, res) => {
  res.status(204).end();
});
app.set("trust proxy", 1);

app.use(pinoHttp({ logger }));

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

app.use(
  "/api/forms/generate-form/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(
  "/api/responses",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 80,
    standardHeaders: true,
    legacyHeaders: false
  })
);



app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/responses", responseRoutes);

app.use((error, req, res, next) => {
  req.log?.error?.(error);
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error);
  }

  if (error?.name === "ZodError") {
    return res.status(400).json({
      message: "Validation failed.",
      issues: error.issues
    });
  }

  if (error?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Uploaded file is too large for this form field."
    });
  }

  if (error?.name === "AbortError") {
    return res.status(504).json({
      message: "The request timed out. Please try again."
    });
  }

  return res.status(error.status || 500).json({
    message: error.message || "Server error."
  });
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    logger.info("MongoDB connected");

    const formsCollection = mongoose.connection.collection("forms");
    await formsCollection.createIndex({ userId: 1, updatedAt: -1 });
    await formsCollection.createIndex({ published: 1, embedId: 1 });

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(error, "MongoDB connection failed");
    process.exit(1);
  });
