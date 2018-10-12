import { CryptoHelper } from "../crypto/CryptoHelper";

export declare type AddressValidationErrorType = "prefix" | "size" | "checksum";

export interface IAddressValidationResult {
    isValid: boolean;
    error?: AddressValidationErrorType;
}

export type AddressType = "S1" | "S2" | "S3" | "S4" | "S5" | "PRIVATE_CONTRACT" | "PUBLIC_CONTRACT" | "RESERVED" | "UNSUPPORTED";

export class AddressHelper {
    private cryptoHelper = new CryptoHelper();

    addressFromPublicKey(publicKey: string, addressType: AddressType): string {
        let address = this.getAddressPrefix(addressType) + publicKey;

        address = address.substr(0, 40);

        return this.applyChecksum(address);
    }

    private applyChecksum(address: string): string {
        address = address.toLowerCase();

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
        if(!this.isValidPrefix(address.charAt(0))) {
            return {
                isValid: false,
                error: "prefix"
            };
        }

        // Check for size
        if(address.length != 40) {
            return {
                isValid: false,
                error: "size"
            };
        }

        // Check for valid checksum
        let lowerCaseAddress = address.toLowerCase();
        if(this.applyChecksum(lowerCaseAddress) != address) {
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

    private isValidPrefix(prefix: string): boolean {
        if(this.getLayerCount(prefix) != -1)
            return true;
        else {
            return prefix == "e" || prefix == "f" ||
                   prefix == "0" || prefix == "d";
        }
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