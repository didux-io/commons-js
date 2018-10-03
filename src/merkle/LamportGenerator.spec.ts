import { LamportGenerator } from "./LamportGenerator";

describe("LamportGenerator", () => {
    it("should return the correct amount of non-empty public keys", () => {
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

        // Expect 10 public keys to be generated
        expect(generator.publicKeys.length).toBe(10);

        // Expect public keys not to be empty strings
        for(let key of generator.publicKeys) {
            expect(key).not.toBe("");
        }
    });

    it("should return correctly encoded short sha256 values", () => {
        let testVectors = [
            {
                input: "hello world",
                output: "uU0nuZNNPgilLlLX"
            },
            {
                input: "1234567890",
                output: "x3Xnt1ft5jDNCqER"
            },
            {
                input: "blablablablabla",
                output: "A7d8p3Rhq8lzDzYx"
            }
        ];

        let generator = new LamportGenerator([], 0);

        for(let testVector of testVectors) {
            expect(generator.sha256Short(testVector.input)).toBe(testVector.output);
        }
    })

    it("should return correctly encoded sha256 values", () => {
        let testVectors = [
            {
                input: "hello world",
                output: "uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="
            },
            {
                input: "1234567890",
                output: "x3Xnt1ft5jDNCqERO9ECZhqziCnKUqZCKreChi8mhkY="
            },
            {
                input: "blablablablabla",
                output: "A7d8p3Rhq8lzDzYxWfYJCltl1dS2XGnh00irFkt0ZaY="
            }
        ];

        let generator = new LamportGenerator([], 0);

        for(let testVector of testVectors) {
            expect(generator.sha256(testVector.input)).toBe(testVector.output);
        }
    });

    it("should return correctly encoded sha512 values", () => {
        let testVectors = [
            {
                input: "hello world",
                output: "MJ7MSJwS1utMxA9QyQLytNDtd+5RGnx6m808qG1M2G+YndNbxf9JlnDaNCVbRbDP2DDoH2Bdz33FVC6TrpzXbw=="
            },
            {
                input: "1234567890",
                output: "ErAyJqbYvpxujNXlXcbHkgyqo53xSquS1ePqk0DRyKTT0LjkMU8fbvExukvxzrkYarh8gBrw1clbG++4ztriuQ=="
            },
            {
                input: "blablablablabla",
                output: "FzPGyJWj+Rr3BCUXTkOtV/LqhLFYYreGGLKxHhBcrjw9JcVhHpIOXYrWsWUavSHfXI6Vn6qIfCv/SZrImDm7UQ=="
            }
        ];

        let generator = new LamportGenerator([], 0);

        for(let testVector of testVectors) {
            expect(generator.sha512(testVector.input)).toBe(testVector.output);
        }
    });
});