const Busboy = require("busboy");
const { generateQR } = require("../utils/QRCodegenerator");
const cloudinary = require("../config/Cloudinary");

exports.generateQRCode = (req, res) => {
  try {
    const busboy = Busboy({ headers: req.headers });

    let url = null;
    let logoBuffer = null;
    let logoMime = null;

    // Get text field
    busboy.on("field", (fieldname, value) => {
      if (fieldname === "data") {
        url = value;
      }
    });

    // Get file
    busboy.on("file", (fieldname, file, info) => {
      if (fieldname === "logo") {
        logoMime = info.mimeType;

        const chunks = [];

        file.on("data", (data) => {
          chunks.push(data);
        });

        file.on("end", () => {
          logoBuffer = Buffer.concat(chunks);
        });
      }
    });

    busboy.on("finish", async () => {
      if (!url) {
        return res.status(422).json({
          error: "Missing URL",
        });
      }

      let logoUrl = null;

      // Upload to Cloudinary if logo exists
      if (logoBuffer) {
        const base64 = `data:${logoMime};base64,${logoBuffer.toString(
          "base64"
        )}`;

        const uploadResult = await cloudinary.uploader.upload(base64, {
          folder: "qr-logos",
        });

        logoUrl = uploadResult.secure_url;
      }
console.log("Logo URL:", logoUrl);
      // Pass Cloudinary URL to QR generator
      const qrUrl = await generateQR(url, logoUrl);

      return res.status(200).json({
        success: true,
        url: qrUrl,
      });
    });

    req.pipe(busboy);
  } catch (error) {
    console.error("QR Error:", error);

    return res.status(500).json({
      error: "Failed to generate QR",
    });
  }
};