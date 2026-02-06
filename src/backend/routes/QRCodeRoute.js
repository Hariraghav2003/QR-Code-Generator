const Router = require("express").Router();
const qrCodeController = require("../controller/QRCodeController");
Router.post("/generateqr", qrCodeController.generateQRCode);
module.exports = Router;
