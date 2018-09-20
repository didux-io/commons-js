export interface IPRNG {
    setSeed(value: any): void;

    nextSingle(): number;

    nextInt(bound: number): number;

    getRandomBytes(count: number): Int8Array;
}