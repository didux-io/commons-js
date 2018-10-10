import { AddressHelper, AddressType } from "../address/AddressHelper";

export class MerkleTree {
    private addressHelper = new AddressHelper();

    layers: string[][];
    
    constructor(layers: string[][]) {
        this.layers = layers;
    }

    getPublicKey(): string {
        let addressType = "S" + (this.layers.length - 14);

        return this.addressHelper.addressFromPublicKey(
            this.layers[this.layers.length - 2][0] + this.layers[this.layers.length - 2][1],
            <AddressType>addressType
        );
    }
}