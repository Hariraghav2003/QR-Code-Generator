const fs = require("fs");
const path = require("path");
const Busboy = require("busboy");
const { generateQR } = require("../utils/QRCodegenerator");

exports.generateQRCode = (req, res) => {
  try {
    const busboy = Busboy({ headers: req.headers });

    const dataDir = path.join(__dirname, "../data");

    // Create data folder if not exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let url = null;
    let logoPath = null;

    busboy.on("field", (fieldname, value) => {
      if (fieldname === "data") {
        url = value;
      }
    });
    let logoMime = null;

    busboy.on("file", (fieldname, file, info) => {
      if (fieldname === "logo") {
        const filename = info.filename; // ✅ correct
        logoMime = info.mimeType;
        const ext = path.extname(filename);

        const fileName = `logo_${Date.now()}${ext}`;

        const savePath = path.join(dataDir, fileName);

        const writeStream = fs.createWriteStream(savePath);

        file.pipe(writeStream);

        logoPath = savePath;
      }
    });

    busboy.on("finish", async () => {
      if (!url) {
        return res.status(422).json({
          error: "Missing URL",
        });
      }

      // Convert file → Base64 (if exists)
      let base64Logo = null;

      if (logoPath) {
        const fileBuffer = fs.readFileSync(logoPath);
        base64Logo = fileBuffer.toString("base64");
      }

      // Pass base64Logo to QR generator here
      const outputPath = await generateQR(url, base64Logo, logoMime);
      const fileName = path.basename(outputPath);
      const fileUrl = `${req.protocol}://${req.get("host")}/qrcode/${fileName}`;

      return res.status(200).json({
        success: true,
        url: fileUrl,
      });
    });

    req.pipe(busboy);
  } catch (error) {
    req.log.error("QR Error:", error);
    return res.status(500).json({
      error: "Failed to generate QR",
    });
  }
};
