import * as Smilo from "smilo-commons-js-node";

let builder = new Smilo.MerkleTreeBuilder();

builder.generate("PRIVATE_KEY", 14, (progress) => {
    console.log("Progress = ", progress);
}).then(
    (tree) => {
        console.log("Tree Generated!");
    },
    (error) => {
        console.error(error);
    }
);
