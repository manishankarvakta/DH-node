const crypto = require("crypto");

// ALL CURVES
// console.log(crypto.getCurves());

// USE CURVES [ secp256k1 ] [used by bitCoin]

// ALICE KEY
const alice = crypto.createECDH("secp256k1");
alice.generateKeys();

// BOB KEY
const bob = crypto.createECDH("secp256k1");
bob.generateKeys();

// ALICE PUBLICE KEY
const alicePublicKeyBase64 = alice.getPublicKey().toString("base64");

// BOB PUBLICE KEY
const bobPublicKeyBase64 = bob.getPublicKey().toString("base64");

// ALICE SHARED KEY
const aliceSharedKey = alice.computeSecret(bobPublicKeyBase64, "base64", "hex");

// BOB SHARED KEY
const bobSharedKey = bob.computeSecret(alicePublicKeyBase64, "base64", "hex");

console.log(aliceSharedKey === bobSharedKey);

console.log("Alice Sheared Kay:", aliceSharedKey);
console.log("BoB Sheared Kay:", bobSharedKey);

// ALICE MESSAGE SEND
const message = "This is random message...";

const IV = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(
  "aes-256-gcm",
  Buffer.from(aliceSharedKey, "hex"),
  IV
);

// encrypt msg
let encrypted = cipher.update(message, "utf8", "hex");
encrypted += cipher.final("hex");

const auth_tag = cipher.getAuthTag().toString("hex");

console.table({
  IV: IV.toString("hex"),
  encrypted: encrypted,
  auth_tag: auth_tag,
});
console.log("orignal msg:", message);

const payload = IV.toString("hex") + encrypted + auth_tag;

const payload64 = Buffer.from(payload, "hex").toString("base64");

console.log("payload:", payload64);

// BOB RECEIVE
// Payload Buffer
const bob_payload = Buffer.from(payload64, "base64").toString("hex");

// GET BOB IV, ENCRYPTED, AUTH
const bob_iv = bob_payload.substring(0, 32);
const bob_encrypted = bob_payload.substring(32, bob_payload.length - 32);
const bob_auth_tag = bob_payload.substring(
  bob_payload.length - 32,
  bob_payload.length
);

console.table({
  //   bob_payload,
  bob_iv,
  bob_encrypted,
  bob_auth_tag,
});

try {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(bobSharedKey, "hex"),
    Buffer.from(bob_iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(bob_auth_tag, "hex"));
  let decrypted = decipher.update(bob_encrypted, "hex", "utf8");
  console.log("decrypted msg:", decrypted);
} catch (error) {
  console.log(error);
}
