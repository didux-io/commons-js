import { CryptoHelper } from "../crypto/CryptoHelper";

export declare type AddressValidationErrorType = "prefix" | "tree_root_length" | "invalid_character" | "checksum";

export interface IAddressValidationResult {
    isValid: boolean;
    error?: AddressValidationErrorType;
}

export class AddressHelper {
    private prefixToCountMap = {
        S1: 14,
        S2: 15,
        S3: 16,
        S4: 17,
        S5: 18
    };
    private countToPrefixMap = {
        "14": "S1",
        "15": "S2",
        "16": "S3",
        "17": "S4",
        "18": "S5"
    };

    private cryptoHelper = new CryptoHelper();

    addressFromPublicKey(publicKey: string, layerCount: number): string {
        let preAddress = this.cryptoHelper.sha256Base32Short(
            publicKey
        );

        let addressPrefix = this.getAddressPrefix(layerCount);

        let checksum = this.cryptoHelper.sha256Base32Short(
            addressPrefix +
            preAddress
        );

        let address =  addressPrefix +
                         preAddress +
                         checksum.substr(0, 4);

        return address;
    }

    isValidAddress(address: string): IAddressValidationResult {
        // Check for invalid prefix
        if(this.getLayerCount(address) == -1) {
            return {
                isValid: false,
                error: "prefix"
            };
        }

        let treeRoot = address.substr(2, 32);

        // Check for valid size
        if(treeRoot.length != 32) {
            return {
                isValid: false,
                error: "tree_root_length"
            };
        }

        // Check for valid characters
        let validCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        for(let i = 0; i < 32; i++) {
            if(validCharacters.indexOf(treeRoot[i]) == -1) {
                return {
                    isValid: false,
                    error: "invalid_character"
                };
            }
        }

        let checksum = address.substr(34);
        let correctEnding = this.cryptoHelper.sha256Base32Short(
            address.substr(0, 2) + treeRoot
        ).substr(0, 4);

        // Check for valid checksum
        if(checksum != correctEnding) {
            return {
                isValid: false,
                error: "checksum"
            };
        }

        // Appears to be correct :D
        return {
            isValid: true
        };
    }

    getLayerCount(address: string): number {
        return this.prefixToCountMap[address.substr(0, 2)] || -1;
    }

    getAddressPrefix(layerCount: number): string {
        return this.countToPrefixMap[layerCount.toString()] || "X1";
    }
}