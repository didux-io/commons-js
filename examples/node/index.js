const Smilo = require("./smilo-node.js");

let cryptoHelper = new Smilo.CryptoHelper();

console.log(cryptoHelper.sha256("Hello World"));