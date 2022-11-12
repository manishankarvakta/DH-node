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

// AES256
const aes256 = require("aes256");

const message = "This is random message...";

// ENCRYPT MESSAGE
const encrypted = aes256.encrypt(aliceSharedKey, message);
console.log("Encrypted Message:", encrypted);

// DECRYPT MESSAGE
const decrypted = aes256.decrypt(bobSharedKey, encrypted);
console.log("Decrypted Message:", decrypted);
