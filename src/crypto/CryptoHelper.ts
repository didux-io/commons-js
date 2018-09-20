import * as forge from "node-forge";
import * as base32 from "hi-base32";
declare const sjcl: any;

export class CryptoHelper {
    private md256;
    private md512;
    private isInitialized: boolean = false;

    private initialize() {
        this.md256 = forge.md.sha256.create();
        this.md512 = forge.md.sha512.create();
        this.isInitialized = true;
    }

    sha512(data: string): string {
        if(!this.isInitialized)
            this.initialize();

        this.md512.update(data);

        let hashedData = this.md512.digest().toHex();

        this.md512.start();

        return forge.util.encode64(forge.util.hexToBytes(hashedData));
    }

    sha256Short(data: string): string {
        return this.sha256(data).substr(0, 16);
    }

    sha256Binary(data: string): string {
        if(!this.isInitialized)
            this.initialize();

        // Javascript does not have proper big integer support.
        // We therefore convert the hash to individual bytes and manually
        // convert to a bit string.
        this.md256.update(data);

        let hashedData = this.md256.digest();

        this.md256.start();

        let bytes = forge.util.createBuffer(hashedData, "raw");

        let bitString = "";
        while(bytes.length() > 0) {
            let byte = bytes.getByte();
            let bits:string = byte.toString(2);

            // Pad with exta zeros if needed
            if(bitString.length > 0)
                bitString += (<any>bits).padStart(8, "0");
            else
                bitString += bits;
        }

        return bitString;
    }

    sha256(data: string): string {
        if(!this.isInitialized)
            this.initialize();

        this.md256.update(data);

        let hashedData = this.md256.digest().toHex();

        this.md256.start();

        return forge.util.encode64(forge.util.hexToBytes(hashedData));
    }

    sha256Hex(data: string): string {
        if(!this.isInitialized)
            this.initialize();

        this.md256.update(data);

        let hashedData = this.md256.digest().toHex();

        this.md256.start();

        return hashedData;
    }

    sha256Base32Short(data: string): string {
        if(!this.isInitialized)
            this.initialize();

        this.md256.update(data);

        let hashedData = this.md256.digest();

        this.md256.start();

        let buffer = forge.util.createBuffer(hashedData, "raw");
        let bytes: number[] = [];
        while(buffer.length() > 0) {
            bytes.push(buffer.getByte());
        }

        return base32.encode(new Uint8Array(bytes)).substr(0, 32);
    }
}