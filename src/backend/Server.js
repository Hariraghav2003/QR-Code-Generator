// Importing required libraries
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const rateLimit = require("express-rate-limit");
const express = require("express");

// Impoerting logger
const { requestLogger, errorLogger, logger } = require("./log/Logger.js");

// Importing routes
const qrCodeRoute = require("./routes/QRCodeRoute.js");
const authenticationService = require("../backend/authentication/routes/Authissuer.js");
const { Secureapi } = require("./middleware/Secureapi.js");

dotenv.config();
const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://qr-code-generator-hariraghav.vercel.app",
];

// Apply CORS only for allowed origins
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use("/qrcode", express.static(path.join(__dirname, "qrcodes")));

// API Routes
app.use(cookieParser());
app.use((req, res, next) => {
  req.log = logger;
  next();
});
app.use(requestLogger);

// API Rate Limiting
const QRCodeApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // each IP can make 100 requests per 15 minutes
  message: {
    status: 429,
    error: "Too many requests, please try again after 15 minutes.",
  },
  standardHeaders: true, // return rate limit info in headers
  legacyHeaders: false, // disable the X-RateLimit headers
});

app.use("/qrcodeapi", (req, res, next) => {
  if (req.path.startsWith("/authservice")) {
    return next();
  }
  QRCodeApiLimiter(req, res, next);
});

app.use("/qrcodeapi", authenticationService);

// All other userapi routes with authentication
app.use(
  "/qrcodeapi",
  (req, res, next) => {
    return Secureapi(req, res, next);
  },
  [qrCodeRoute],
);

app.use(errorLogger);

const PORT = process.env.PORT;

app.listen(PORT, () =>
  console.log(`QR Code generator Service Server running on port ${PORT}`),
);
