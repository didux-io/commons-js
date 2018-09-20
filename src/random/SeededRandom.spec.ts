import { SeededRandom } from "./SeededRandom";

describe("SeededRandom", () => {
    let prng: SeededRandom;

    beforeEach(() => {
        prng = new SeededRandom("Seed");
    });

    it("should return a correct single random value", () => {
        for(let i = 0; i < 10000; i++) {
            let rand = prng.nextSingle();
            expect(rand).toBeGreaterThanOrEqual(0);
            expect(rand).toBeLessThanOrEqual(1);
        }
    });

    it("should return a correct next int value", () => {
        for(let i = 0; i < 10000; i++) {
            let rand = prng.nextInt(100);

            expect(rand).toBeGreaterThanOrEqual(0);
            expect(rand).toBeLessThan(100);
        }
    });

    it("should return a correct amount of random bytes", () => {
        let bytes = prng.getRandomBytes(100);

        expect(bytes.length).toBe(100);
    });
});