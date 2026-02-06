const fs = require("fs");
const path = require("path");
const winston = require("winston");
const expressWinston = require("express-winston");

// Ensure log directory exists
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// File paths
const generalLogPath = path.join(logDir, "requests.log");
const errorLogPath = path.join(logDir, "errors.log");

// Request logger (all API calls)
const requestLogger = expressWinston.logger({
  transports: [
    // File: clean structured JSON logs
    new winston.transports.File({
      filename: generalLogPath,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json({ space: 2 }) // pretty-print JSON
      ),
    }),

    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message, meta }) => {
          const method = meta?.req?.method || "";
          const url = meta?.req?.url || "";
          const status = meta?.res?.statusCode || "";
          return `[${timestamp}] ${level.toUpperCase()} → ${method} ${url} ${status} ${message}`;
        })
      ),
    }),
  ],

  meta: true, // still capture filtered metadata
  expressFormat: false, // disable default morgan-style (we control it ourselves)

  requestFilter: (req, propName) => {
    if (propName === "method") return req.method;
    if (propName === "url") return req.url;
    if (propName === "body") return req.body;

    if (propName === "headers") {
      return {
        "user-agent": req.headers["user-agent"],
        referer: req.headers["referer"],
        authorization: req.headers["authorization"] ? "[REDACTED]" : undefined,
        cookie: req.headers["cookie"]
          ? req.headers["cookie"]
              .split(";")
              .map((c) => c.split("=")[0])
              .join("; ")
          : undefined,
      };
    }
    return undefined; // discard everything else
  },

  responseFilter: (res, propName) => {
    if (propName === "statusCode") return res.statusCode;
    return undefined;
  },
});

// Error logger (errors only)
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: errorLogPath,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json({
          space: 2, // pretty JSON in file
        })
      ),
    }),
  ],
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `[${timestamp}] ${level.toUpperCase()} ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ""
          }`;
        })
      ),
    }),
    new winston.transports.File({ filename: errorLogPath }),
  ],
});


module.exports = {
  requestLogger,
  errorLogger,
  logger
};
