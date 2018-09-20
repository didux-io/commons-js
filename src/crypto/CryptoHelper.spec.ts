import { CryptoHelper } from "./CryptoHelper";

declare const sjcl: any;

describe("CryptoHelper", () => {
    let cryptoHelper: CryptoHelper;

    beforeEach(() => {
        cryptoHelper = new CryptoHelper();
    });

    it("should compute sha512 hash correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "NieQminDE4Ggcewn98nKl3Jhgq7Smn3dLlQ1MyLPswq7njpt8qwsIP4jQ2MR1nhWTQyNMFkwV19g4tPQSBhNeQ=="
            },
            {
                data: "Hello World",
                output: "LHT9F+2v2A6ER7DUZ0HuJDt+t03SFJoKsbkkb7MDgvJ+hT2FhXGeDmfL2g2qj1FnEGRhXWRa4nrLFb+xRH9Fmw=="
            },
            {
                data: "Bla Bla Bla",
                output: "j9VPHxd/AFBxhUidXmyEySlIZg6RB2KHwiFqzCaMNhmclUGJa6OzmbTOLT7MDI/J+womhR1cNd3YYklWR8SHjg=="
            },
            {
                data: "Some words are longer than other words!",
                output: "JPc+bBv4u27eTp3ZrgPhiEYAFS+lWRd9HFaKiFTTQxK+s+wlQu2s41zbSVKGI4+xAfBf25IA3TtPXVLBTPuvrA=="
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha512(test.data)).toBe(test.output);
        }
    });

    it("should compute sha256 correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U="
            },
            {
                data: "Hello World",
                output: "pZGm1Av0IEBKARczz7exkNYsZb8LzaMrV7J32a2fFG4="
            },
            {
                data: "Bla Bla Bla",
                output: "CpvENCjEtiRJM7Ah41B3Jw/NLp3uuSyCKlN4jjv/oo8="
            },
            {
                data: "Some words are longer than other words!",
                output: "KC9NzYqIPavRl8iDx9/I/sZDUUwLl2RrNN4fK8KHwIA="
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha256(test.data)).toBe(test.output);
        }
    });

    it("should compute short sha256 correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "WZRHGrsBESr8wYFZ"
            },
            {
                data: "Hello World",
                output: "pZGm1Av0IEBKARcz"
            },
            {
                data: "Bla Bla Bla",
                output: "CpvENCjEtiRJM7Ah"
            },
            {
                data: "Some words are longer than other words!",
                output: "KC9NzYqIPavRl8iD"
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha256Short(test.data)).toBe(test.output);
        }
    });

    it("should compute binary sha256 correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "101100110010100010001110001101010111011000000010001000100101010111111001100000110000001010110011111011011001100011101001011010011110101000100011011100110011000000001101101101001011001101100111100101011110101101010011100000101110011110010101100111111000101"
            },
            {
                data: "Hello World",
                output: "1010010110010001101001101101010000001011111101000010000001000000010010100000000100010111001100111100111110110111101100011001000011010110001011000110010110111111000010111100110110100011001010110101011110110010011101111101100110101101100111110001010001101110"
            },
            {
                data: "Bla Bla Bla",
                output: "101010011011110001000011010000101000110001001011011000100100010010010011001110110000001000011110001101010000011101110010011100001111110011010010111010011101111011101011100100101100100000100010101001010011011110001000111000111011111111111010001010001111"
            },
            {
                data: "Some words are longer than other words!",
                output: "10100000101111010011011100110110001010100010000011110110101011110100011001011111001000100000111100011111011111110010001111111011000110010000110101000101001100000010111001011101100100011010110011010011011110000111110010101111000010100001111100000010000000"
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha256Binary(test.data)).toBe(test.output);
        }
    });

    it("should compute hexadecimal sha256 correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5"
            },
            {
                data: "Hello World",
                output: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"
            },
            {
                data: "Bla Bla Bla",
                output: "0a9bc43428c4b6244933b021e35077270fcd2e9deeb92c822a53788e3bffa28f"
            },
            {
                data: "Some words are longer than other words!",
                output: "282f4dcd8a883dabd197c883c7dfc8fec643514c0b97646b34de1f2bc287c080"
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha256Hex(test.data)).toBe(test.output, test.data);
        }
    });

    it("should return base32 sha256 correctly", () => {
        let testVectors = [
            {
                data: "12345",
                output: "LGKEOGV3AEISV7GBQFM7NTDUWT2RDOMY"
            },
            {
                data: "Hello World",
                output: "UWI2NVAL6QQEASQBC4Z47N5RSDLCYZN7"
            },
            {
                data: "Bla Bla Bla",
                output: "BKN4INBIYS3CISJTWAQ6GUDXE4H42LU5"
            },
            {
                data: "Some words are longer than other words!",
                output: "FAXU3TMKRA62XUMXZCB4PX6I73DEGUKM"
            }
        ];

        for(let test of testVectors) {
            expect(cryptoHelper.sha256Base32Short(test.data)).toBe(test.output);
        }
    });
    
    it("should set isInitialized to true if it hasn't been initialized yet", () => {
        spyOn(cryptoHelper, <any>"initialize").and.callThrough();
        spyOn(sjcl.codec.base64, "fromBits");
        spyOn(sjcl.codec.bytes, "fromBits").and.returnValue("");
        (<any>cryptoHelper).md512 = {
            update() {},
            finalize() {},
            reset() {}
        };
        (<any>cryptoHelper).md256 = {
            update() {},
            finalize() {},
            reset() {}
        };

        cryptoHelper.sha512("");
        expect((<any>cryptoHelper).isInitialized).toBeTruthy();

        (<any>cryptoHelper).isInitialized = false;
        cryptoHelper.sha256Binary("");
        expect((<any>cryptoHelper).isInitialized).toBeTruthy();

        (<any>cryptoHelper).isInitialized = false;
        cryptoHelper.sha256("");
        expect((<any>cryptoHelper).isInitialized).toBeTruthy();

        (<any>cryptoHelper).isInitialized = false;
        cryptoHelper.sha256Hex("");
        expect((<any>cryptoHelper).isInitialized).toBeTruthy();

        (<any>cryptoHelper).isInitialized = false;
        cryptoHelper.sha256Base32Short("");
        expect((<any>cryptoHelper).isInitialized).toBeTruthy();
    });
});