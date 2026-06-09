import pino from "pino";

const level = process.env.LOG_LEVEL || "info";

const logger = pino({
  level,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "token",
      "apiKey",
      "secret",
      "*.password",
      "*.token"
    ],
    censor: "[REDACTED]"
  },
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname"
          }
        }
      : undefined
});

export default logger;
