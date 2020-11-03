import * as DiduxIo from "@didux-io/commons-js-node";

let builder = new DiduxIo.MerkleTreeBuilder();

builder.generate("PRIVATE_KEY", 14, (progress) => {
    console.log("Progress = " + Math.floor(progress * 100) + "%");
}).then(
    (merkleTree) => {
        console.log("Done!");

        // Create a signature using the Merkle Tree
        let signer = new DiduxIo.MerkleLamportSigner();

        let signature = signer.getSignature(merkleTree, "Hello World", "PRIVATE_KEY", 0);

        let verifier = new DiduxIo.MerkleLamportVerifier();

        if(verifier.verifyMerkleSignature("Hello World", signature, 0, 14, merkleTree.getPublicKey())) {
            console.log("Signature is valid!");
        }
        else {
            console.error("Invalid signature!!!");
        }
    },
    (error) => {
        console.error("Failed to generate Merkle Tree");
        console.error(error);
    }
);

let bip39 = new DiduxIo.BIP39();

let passphrase = bip39.generate(256);

console.log("Passphrase", passphrase);
console.log("Is valid", bip39.check(passphrase));

let bip32 = new DiduxIo.BIP32();

let privateKey = bip32.getPrivateKey(bip39.toSeed(passphrase));

console.log("Private key", privateKey);
