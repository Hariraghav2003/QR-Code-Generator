const QRCode = require("qrcode");
const axios = require("axios");
const cloudinary = require("../config/Cloudinary");

async function getBase64FromUrl(url) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
  });

  return Buffer.from(res.data).toString("base64");
}

async function generateQR(url, logoUrl = null) {
  try {
    // Generate QR SVG
    let qrSvg = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    // Insert logo if exists
    if (logoUrl) {
      const logoBase64 = await getBase64FromUrl(logoUrl);

      const logoDataUri = `data:image/png;base64,${logoBase64}`;

      qrSvg = qrSvg.replace(
        "</svg>",
        `
        <rect x="39%" y="39%" width="22%" height="22%" rx="6" fill="white"/>
        <image
          href="${logoDataUri}"
          x="40%"
          y="40%"
          width="20%"
          height="20%"
          preserveAspectRatio="xMidYMid meet"
          crossorigin="anonymous"
        />
      </svg>`,
      );
    }

    // Convert SVG → Base64
    const base64Svg = Buffer.from(qrSvg).toString("base64");

    const dataUri = `data:image/svg+xml;base64,${base64Svg}`;

    // Upload QR to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "qr-codes",
      resource_type: "image",
      format: "svg",
    });

    // Return Cloudinary URL
    return result.secure_url;
  } catch (err) {
    console.error("QR Generation Error:", err);
    throw err;
  }
}

module.exports = { generateQR };
