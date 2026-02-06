const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Keys
const PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, "../private.key"), 
  "utf8"
);
const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "../public.key"), 
  "utf8"
);

exports.issueToken = async (req,res) => {
  const token = jwt.sign(
    {
      service: "weeflyapp",
    },
    PRIVATE_KEY,
    {
      algorithm: "RS256",
      keyid: "key1",
    }
  );

  return res.json({ token });
};

exports.sendKey = async (req,res) => {
  return res.json({ kid: "key1", publicKey: PUBLIC_KEY });
};
