import { AddressHelper, AddressType } from "../address/AddressHelper";
import { CryptoHelper } from "../crypto/CryptoHelper";

export class MerkleTree {
    private addressHelper = new AddressHelper();
    private cryptoHelper = new CryptoHelper();

    layers: string[][];
    
    constructor(layers: string[][]) {
        this.layers = layers;
    }

    getPublicKey(): string {
        let addressType = "S" + (this.layers.length - 13);

        return this.addressHelper.addressFromPublicKey(
            this.cryptoHelper.sha256Hex(
                this.layers[this.layers.length - 2][0] + this.layers[this.layers.length - 2][1]
            ),
            <AddressType>addressType
        );
    }
}