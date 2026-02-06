const express = require("express");
const router = express.Router();
const authController = require("../controller/Authissuercontrol");
const { Origincheck } = require("../middleware/Origincheck");
router.get(
  "/authservice/service-token",
  Origincheck,
  authController.issueToken,
);
router.get("/authservice/public-key", Origincheck, authController.sendKey);
module.exports = router;
