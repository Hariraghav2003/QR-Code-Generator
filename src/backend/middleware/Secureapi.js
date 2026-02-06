// middleware/Secureapi.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { logger } = require("../log/Logger");
dotenv.config();
let PUBLIC_KEY = null;
const SERVICE_URL = process.env.SERVICE_URL;
async function fetchPublicKey() {
  if (!PUBLIC_KEY) {
    try {
      const res = await fetch(`${SERVICE_URL}/authservice/public-key`, {
        headers: {
          origin: "http://localhost:5173",
        },
      });
      const key = await res.json();
      PUBLIC_KEY = key.publicKey;
    } catch (error) {
      logger.error("Error fetching public key:", error);
      throw new Error("Failed to fetch public key");
    }
  }
  return PUBLIC_KEY;
}

const Secureapi = async (req, res, next) => {
  try {
    // Allowed origins
    const allowedOrigins = ["http://localhost:5173"];
    // Check request origin
    const requestOrigin = req.headers.origin || req.headers.referer;
    if (!requestOrigin) {
      return res.status(403).json({ message: "Unauthorized Access" });
    }

    const originURL = requestOrigin.split("/").slice(0, 3).join("/");
    if (!allowedOrigins.includes(originURL)) {
      return res.status(403).json({ message: "Unauthorized Access" });
    }

    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }
    let payload;
    try {
      const publicKey = await fetchPublicKey();
      payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    } catch (err) {
      return res.status(403).json({ error: "Invalid main token" });
    }

    next();
  } catch (err) {
    logger.error("Auth error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { Secureapi };
