// Function to secure API based on the origin of the request
const Origincheck = async (req, res, next) => {
  try {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://qr-code-generator-ochre-tau.vercel.app"
    ];

    // Storing the request origin
    const requestOrigin = req.headers.origin || req.headers.referer;

    // No Origin or Referer => Block the request
    if (!requestOrigin) {
      return res.status(403).json({ message: "Unauthorized Access" });
    }

    // Trimming the unwanted Request Path
    const originURL = requestOrigin.split("/").slice(0, 3).join("/");

    // Not allowed Origin or Referer => Block the request
    if (!allowedOrigins.includes(originURL)) {
      return res.status(403).json({ message: "Unauthorized Access" });
    }
    // Allowed origin proceed with the request
    next();
  } catch (error) {
    req.log.error("Error in Origincheck middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { Origincheck };
