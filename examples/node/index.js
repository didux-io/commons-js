const DiduxIo = require("./diduxio-node.js");

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