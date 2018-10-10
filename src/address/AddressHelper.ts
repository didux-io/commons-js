import { CryptoHelper } from "../crypto/CryptoHelper";

export declare type AddressValidationErrorType = "prefix" | "tree_root_length" | "invalid_character" | "checksum";

export interface IAddressValidationResult {
    isValid: boolean;
    error?: AddressValidationErrorType;
}

export type AddressType = "S1" | "S2" | "S3" | "S4" | "S5" | "PRIVATE_CONTRACT" | "PUBLIC_CONTRACT" | "RESERVED" | "UNSUPPORTED";

export class AddressHelper {
    private cryptoHelper = new CryptoHelper();

    addressFromPublicKey(publicKey: string, addressType: AddressType): string {
        let address = this.getAddressPrefix(addressType) + publicKey.toLowerCase();

        address = address.substr(0, 40);

        let shaStr = this.cryptoHelper.keccak256(address);
        let sha = this.hexToBytes(shaStr);

        for(let i = 0; i < 20; i++) {
            if((sha[i] & 0x08) > 0)
                address = this.replaceInString(address, 2 * i + 1, address.charAt(2 * i + 1).toUpperCase());

            if((sha[i] & 0x80) > 0)
                address = this.replaceInString(address, 2 * i, address.charAt(2 * i).toUpperCase())
        }

        return address;
    }

    private replaceInString(str: string, index: number, replacement: string): string {
        return str.substr(0, index) + replacement + str.substr(index + replacement.length);
    }

    private hexToBytes(hex: string): number[] {
        let bytes: number[] = [];

        for(let i = 0; i < hex.length / 2; i++) {
            let msb = hex[i * 2];
            let lsb = hex[i * 2 + 1];

            let byte = parseInt(msb + lsb, 16);

            bytes.push(byte);
        }

        return bytes;
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

    /**
     * Returns the amount of Merkle Tree layers for the given address.
     * 
     * If -1 is returned it means there is no backing Merkle Tree.
     */
    getLayerCount(address: string): number {
        switch(address.charAt(0)) {
            case("1"):
                return 14;
            case("2"):
                return 15;
            case("3"):
                return 16;
            case("4"):
                return 17;
            case("5"):
                return 18;
            default:
                return -1;
        }
    }

    /**
     * Gets the address prefix based on the address type.
     */
    getAddressPrefix(type: AddressType): string {
        switch(type) {
            case("S1"):
                return "1";
            case("S2"):
                return "2";
            case("S3"):
                return "3";
            case("S4"):
                return "4";
            case("S5"):
                return "5";
            case("PRIVATE_CONTRACT"):
                return "e";
            case("PUBLIC_CONTRACT"):
                return "f";
            case("RESERVED"):
                return "0";
            default:
                return "d"
        };
    }
}