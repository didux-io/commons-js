import { FixedBigNumber } from "./FixedBigNumber";

describe("FixedBigNumber", () => {
    it("should handle malformed string formats correctly", () => {
        expect(new FixedBigNumber("100.100.100", 3).isValid()).toBeFalsy();
        expect(new FixedBigNumber("asdfasdfasdf", 3).isValid()).toBeFalsy();
        expect(new FixedBigNumber(".....", 3).isValid()).toBeFalsy();
        expect(new FixedBigNumber("1000asd1.d.1", 3).isValid()).toBeFalsy();
    });

    it("should return a correct BigInteger string", () => {
        let checks = [
            {
                input: new FixedBigNumber(100, 6),
                result: "100000000"
            },
            {
                input: new FixedBigNumber("100.123456789", 9),
                result: "100123456789"
            },
            {
                input: new FixedBigNumber("100.123456789", 6),
                result: "100123456"
            },
            {
                input: new FixedBigNumber("100.123456789", 0),
                result: "100"
            },
            {
                input: new FixedBigNumber("0.0000000000001", 13),
                result: "00000000000001"
            },
            {
                input: new FixedBigNumber("200000000", 0),
                result: "200000000"
            },
            {
                input: new FixedBigNumber("200000000", 18),
                result: "200000000000000000000000000"
            }
        ];

        for(let check of checks) {
            expect(check.input.toBigIntegerString()).toEqual(check.result);
        }
    });

    it("should create a FixedBigNumber from a BigInteger string correctly", () => {
        let checks = [
            {
                result: new FixedBigNumber(100, 6),
                decimals: 6,
                input: "100000000"
            },
            {
                result: new FixedBigNumber("100.123456789", 9),
                decimals: 9,
                input: "100123456789"
            },
            {
                result: new FixedBigNumber("100.123456", 6),
                decimals: 6,
                input: "100123456"
            },
            {
                result: new FixedBigNumber("100", 0),
                decimals: 0,
                input: "100"
            },
            {
                result: new FixedBigNumber("0.0000000000001", 13),
                decimals: 13,
                input: "00000000000001"
            },
            {
                result: new FixedBigNumber("200000000", 0),
                decimals: 0,
                input: "200000000"
            },
            {
                result: new FixedBigNumber("200000000", 18),
                decimals: 18,
                input: "200000000000000000000000000"
            }
        ];

        for(let check of checks) {
            expect(
                FixedBigNumber.fromBigIntegerString(check.input, check.decimals).eq(check.result)
            ).toBeTruthy(check.input);
        }
    });

    it("should return the correct amount of decimals", () => {
        expect(new FixedBigNumber(0, 1).getDecimals()).toBe(1);
        expect(new FixedBigNumber(0, 5).getDecimals()).toBe(5);
        expect(new FixedBigNumber(0, 33).getDecimals()).toBe(33);
        expect(new FixedBigNumber(0, 99).getDecimals()).toBe(99);
    });

    it("should mark valid FixedBigNumbers as valid", () => {
        let valid: FixedBigNumber[] = [
            new FixedBigNumber("0.00001", 5),
            new FixedBigNumber("0", 10),
            new FixedBigNumber("0.000000001", 9),
            new FixedBigNumber("0.000100000000", 4)
        ];

        for(let number of valid) {
            expect(number.isValid()).toBeTruthy(number.toString());
        }
    });

    it("should mark invalid FixedBigNumbers as not valid", () => {
        let invalid: FixedBigNumber[] = [
            new FixedBigNumber("0.00001", 4),
            new FixedBigNumber("0.000000001", 8),
            new FixedBigNumber("0.000100000000", 3)
        ];

        for(let number of invalid) {
            expect(number.isValid()).toBeFalsy(number.toString());
        }
    });

    it("should handle equality checks correctly", () => {
        let checks = [
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(10, 2),
                result: true
            },
            {
                a: new FixedBigNumber("21791283.121231", 6),
                b: new FixedBigNumber("21791283.121231", 6),
                result: true
            },
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(3, 2),
                result: false
            },
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(15, 2),
                result: false
            }
        ];

        for(let check of checks) {
            expect(check.a.eq(check.b)).toBe(check.result);
        }
    });

    it("should handle greater than checks correctly", () => {
        let checks = [
            {
                a: new FixedBigNumber(12, 2),
                b: new FixedBigNumber(10, 2),
                result: true
            },
            {
                a: new FixedBigNumber("21791283.821231", 6),
                b: new FixedBigNumber("21791283.121231", 6),
                result: true
            },
            {
                a: new FixedBigNumber(3, 2),
                b: new FixedBigNumber(10, 2),
                result: false
            },
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(15, 2),
                result: false
            },
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(10, 2),
                result: false
            }
        ];

        for(let check of checks) {
            expect(check.a.gt(check.b)).toBe(check.result);
        }
    });

    it("should handle greater than or equal to checks correctly", () => {
        let checks = [
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(10, 2),
                result: true
            },
            {
                a: new FixedBigNumber("21791283.121231", 6),
                b: new FixedBigNumber("21791283.121231", 6),
                result: true
            },
            {
                a: new FixedBigNumber(9, 2),
                b: new FixedBigNumber(10, 2),
                result: false
            },
            {
                a: new FixedBigNumber("21791283.121230", 6),
                b: new FixedBigNumber("21791283.121231", 6),
                result: false
            },
        ];

        for(let check of checks) {
            expect(check.a.gte(check.b)).toBe(check.result);
        }
    });

    it("should handle less than checks correctly", () => {
        let checks = [
            {
                a: new FixedBigNumber(12, 2),
                b: new FixedBigNumber(10, 2),
                result: false
            },
            {
                a: new FixedBigNumber("21791283.821231", 6),
                b: new FixedBigNumber("21791283.121231", 6),
                result: false
            },
            {
                a: new FixedBigNumber(3, 2),
                b: new FixedBigNumber(10, 2),
                result: true
            },
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(15, 2),
                result: true
            },
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(10, 2),
                result: false
            }
        ];

        for(let check of checks) {
            expect(check.a.lt(check.b)).toBe(check.result);
        }
    });

    it("should handle less than or equal to checks correctly", () => {
        let checks = [
            {
                a: new FixedBigNumber(11, 2),
                b: new FixedBigNumber(10, 2),
                result: false
            },
            {
                a: new FixedBigNumber("21791283.121232", 6),
                b: new FixedBigNumber("21791283.121231", 6),
                result: false
            },
            {
                a: new FixedBigNumber(9, 2),
                b: new FixedBigNumber(10, 2),
                result: true
            },
            {
                a: new FixedBigNumber(9, 2),
                b: new FixedBigNumber(9, 2),
                result: true
            },
            {
                a: new FixedBigNumber("21791283.121230", 6),
                b: new FixedBigNumber("21791283.121231", 6),
                result: true
            },
        ];

        for(let check of checks) {
            expect(check.a.lte(check.b)).toBe(check.result);
        }
    });

    it("should handle multiply correctly", () => {
        let checks = [
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(10, 2),
                result: new FixedBigNumber(100, 2)
            },
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(-2, 2),
                result: new FixedBigNumber(-20, 2)
            },
            {
                a: new FixedBigNumber(10.5, 2),
                b: new FixedBigNumber(5, 2),
                result: new FixedBigNumber(52.5, 2)
            },
            {
                a: new FixedBigNumber(-2, 2),
                b: new FixedBigNumber(-2, 2),
                result: new FixedBigNumber(4, 2)
            }
        ];

        for(let check of checks) {
            expect(check.a.mul(check.b).eq(check.result)).toBeTruthy();
        }
    });

    it("should handle divide correctly", () => {
        let checks = [
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(10, 2),
                result: new FixedBigNumber(1, 2)
            },
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(-2, 2),
                result: new FixedBigNumber(-5, 2)
            },
            {
                a: new FixedBigNumber(10.5, 2),
                b: new FixedBigNumber(5, 2),
                result: new FixedBigNumber(2.1, 2)
            },
            {
                a: new FixedBigNumber(-2, 2),
                b: new FixedBigNumber(-2, 2),
                result: new FixedBigNumber(1, 2)
            }
        ];

        for(let check of checks) {
            expect(check.a.div(check.b).eq(check.result)).toBeTruthy();
        }
    });

    it("should handle add correctly", () => {
        let checks = [
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(10, 2),
                result: new FixedBigNumber(20, 2)
            },
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(-2, 2),
                result: new FixedBigNumber(8, 2)
            },
            {
                a: new FixedBigNumber(10.5, 2),
                b: new FixedBigNumber(5, 2),
                result: new FixedBigNumber(15.5, 2)
            },
            {
                a: new FixedBigNumber(-2, 2),
                b: new FixedBigNumber(-2, 2),
                result: new FixedBigNumber(-4, 2)
            }
        ];

        for(let check of checks) {
            expect(check.a.add(check.b).eq(check.result)).toBeTruthy();
        }
    });

    it("should handle subtract correctly", () => {
        let checks = [
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(10, 2),
                result: new FixedBigNumber(0, 2)
            },
            {
                a: new FixedBigNumber(10, 2),
                b: new FixedBigNumber(-2, 2),
                result: new FixedBigNumber(12, 2)
            },
            {
                a: new FixedBigNumber(10.5, 2),
                b: new FixedBigNumber(5, 2),
                result: new FixedBigNumber(5.5, 2)
            },
            {
                a: new FixedBigNumber(-2, 2),
                b: new FixedBigNumber(-2, 2),
                result: new FixedBigNumber(0, 2)
            }
        ];

        for(let check of checks) {
            expect(check.a.sub(check.b).eq(check.result)).toBeTruthy();
        }
    });
});