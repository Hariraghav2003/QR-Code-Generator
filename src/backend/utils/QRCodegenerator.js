const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const { logger } = require("../log/Logger");

async function generateQR(url, logoPath = null, logoMime = null) {
  try {
    let qrSvg = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    let logoBase64 = null;
    if (logoPath) {
      logoBase64 = logoPath;
    }
    let logoData = null;
    if (logoBase64 && logoMime) {
      logoData = `data:${logoMime};base64,${logoBase64}`;
    }
    if (logoBase64) {
      qrSvg = qrSvg.replace(
        "</svg>",
        `
        <rect x="39%" y="39%" width="22%" height="22%" rx="6" fill="white"/>
        <image
          href="${logoData}"
          x="40%"
          y="40%"
          width="20%"
          height="20%"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>`,
      );
    }
    const outputDir = path.join(__dirname, "../qrcodes");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const fileName = `qr_${Date.now()}.svg`;
    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, qrSvg);
    return outputPath;
  } catch (err) {
    logger.error("QR Generation Error:", err);
    throw err;
  }
}

module.exports = { generateQR };
