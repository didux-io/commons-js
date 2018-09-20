import { LamportGenerator } from "./LamportGenerator";

describe("LamportGenerator", () => {
    it("should return the correct amount of public keys", () => {
        let generator = new LamportGenerator(
            [
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ])
            ],
            10
        );
        
        generator.fill();

        expect(generator.publicKeys.length).toBe(10);
    });
});