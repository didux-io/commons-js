const Smilo = require("./smilo-node.js");

let builder = new Smilo.MerkleTreeBuilder();

builder.generate("PRIVATE_KEY", 14, (progress) => {
    console.log(progress);
}).then(
    (merkleTree) => {
        console.log("Done!");
    },
    (error) => {
        console.error("Failed to generate Merkle Tree");
        console.error(error);
    }
);