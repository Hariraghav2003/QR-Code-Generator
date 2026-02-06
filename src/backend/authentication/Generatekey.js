// generateKeys.js
const { generateKeyPairSync } = require("crypto");
const fs = require("fs");
const path = require("path");

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048, // key size
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

// Save keys into the authentication folder
const dir = __dirname; // current folder

fs.writeFileSync(path.join(dir, "private.key"), privateKey);
fs.writeFileSync(path.join(dir, "public.key"), publicKey);
