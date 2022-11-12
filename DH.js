const crypto = require("crypto");

console.log(crypto);
// ASSIGN INDITY KEY
const alice = crypto.getDiffieHellman("modp15");
const bob = crypto.getDiffieHellman("modp15");

// GENERATE PUBLIC KEY
alice.generateKeys();
bob.generateKeys();

// SHEARED KEY
const aliceSecret = alice.computeSecret(bob.generateKeys(), null, "hex");
const bobSecret = bob.computeSecret(alice.generateKeys(), null, "hex");
console.log("alice:", aliceSecret);
console.log("bob:", bobSecret);
