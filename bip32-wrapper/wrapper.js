let bip32 = require("bip32");

let SMILO_COIN_TYPE = 0x1991;

function getPrivateKeyFromSeed(seed, index, coinType) {
    index = index || 0;
    coinType = coinType === undefined ? SMILO_COIN_TYPE : coinType;

    var root = bip32.fromSeed(Buffer.from(seed, "hex"));

    var node = root.derivePath(`m/44'/${ coinType }'/0'/0/${ index }`);

    let privateKey = node.toWIF();

    return privateKey;
}

module.exports = {
    getPrivateKeyFromSeed
};