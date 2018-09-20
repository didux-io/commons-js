import "seedrandom";
import { IPRNG } from "./IPRNG";

export class SeededRandom implements IPRNG {
    private prng: any;

    constructor(seed) {
        this.prng = new (<any>Math).seedrandom(seed);
    }

    setSeed(value: any): void {
        this.prng = new (<any>Math).seedrandom(value);
    }

    nextSingle(): number {
        return this.prng();
    }

    nextInt(bound: number): number {
        return Math.round(this.nextSingle() * (bound - 1));
    }

    getRandomBytes(count: number): Int8Array {
        let randomBytes = new Int8Array(count);

        for(let i = 0; i < count; i++) {
            randomBytes[i] = Math.round(this.prng() * 0xFF);
        }

        return randomBytes;
    }
}