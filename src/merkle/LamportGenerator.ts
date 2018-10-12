import { SHA1PRNG } from "../random/SHA1PRNG";
import * as forge from "node-forge";

export class LamportGenerator {
    private readonly CS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    readonly publicKeys: string[];
    readonly seeds: Int8Array[];
    readonly count: number;

    private readonly md256: any;
    private readonly md512: any;
    private prng: SHA1PRNG;

    constructor(seeds: Int8Array[], count: number) {
        this.seeds = seeds;
        this.count = count;

        this.publicKeys = [];
        this.md256 = forge.md.sha256.create();
        this.md512 = forge.md.sha512.create();
    }

    fill(): void {
        for(let i = 0; i < this.count; i++) {
            let seed = this.seeds[i];

            if(!Array.isArray(seed)) {
                // The seed is not an array so we must map it to one.
                // This happens on node child_process environments where an array
                // is serialized to an object where the key is the index.
                seed = this.toArray(<any>seed);
            }

            // Prepare prng
            this.prng = new SHA1PRNG(seed);

            this.publicKeys.push(
                this.sha256(this.getLamportPublicKey())
            );
        }
    }

    private toArray(seedObject: {[index: string]: number}): Int8Array {
        let numbers = [];

        for(let key in seedObject) {
            numbers[Number(key)] = seedObject[key];
        }

        return new Int8Array(numbers);
    }

    private getLamportPublicKey(): string {
        return this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) +
               this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha256Short(this.getLamportPrivateKey()) + this.sha512(this.getLamportPrivateKey()) + this.sha512(this.getLamportPrivateKey());
    }

    private getLamportPrivateKey(): string {
        let length = this.CS.length;

        return    this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)]
                + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)]
                + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)]
                + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)] + this.CS[this.prng.nextInt(length)];
    }

    sha256Short(data: string): string {
        return this.sha256(data).substr(0, 16);
    }

    sha512(data: string): string {
        this.md512.update(data);

        let output = this.md512.digest().getBytes();

        this.md512.start();

        return forge.util.encode64(output);
    }

    sha256(data: string): string {
        this.md256.update(data);

        let output = this.md256.digest().getBytes();

        this.md256.start();

        return forge.util.encode64(output);
    }
}