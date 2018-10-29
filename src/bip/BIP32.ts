import * as bitcoinjs from "./bitcoinjs-lib";

export class BIP32 {
    getPrivateKey(seedHex: string, index?: number, coinType?: number): string {
        return bitcoinjs.getPrivateKeyFromSeed(seedHex, index, coinType);
    }
}