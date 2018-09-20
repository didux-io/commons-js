import { SHA1PRNG } from "../random/SHA1PRNG";

declare const sjcl: any;

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
        this.md256 = new sjcl.hash.sha256();
        this.md512 = new sjcl.hash.sha512();
    }

    fill(): void {
        for(let i = 0; i < this.count; i++) {
            let seed = this.seeds[i];

            // Prepare prng
            this.prng = new SHA1PRNG(seed);

            this.publicKeys.push(
                this.sha256(this.getLamportPublicKey())
            );
        }
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

    private sha256Short(data: string): string {
        return this.sha256(data).substr(0, 16);
    }

    private sha512(data: string): string {
        this.md512.update(sjcl.codec.utf8String.toBits(data));

        let output = this.md512.finalize();

        this.md512.reset();

        return sjcl.codec.base64.fromBits(output);
    }

    private sha256(data: string): string {
        this.md256.update(sjcl.codec.utf8String.toBits(data));

        let output = this.md256.finalize();

        this.md256.reset();

        return sjcl.codec.base64.fromBits(output);
    }
}