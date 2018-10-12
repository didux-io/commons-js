import { AddressHelper, AddressValidationErrorType } from "./AddressHelper";

interface IInvalidAddressTestVector {
    address: string;
    error: AddressValidationErrorType;
}

describe("AddressHelper", () => {
    let helper: AddressHelper;

    beforeEach(() => {
        helper = new AddressHelper();
    });

    it("Should format addresses correctly", () => {
        expect(
            helper.addressFromPublicKey("aAeb6053F3E94C9b9A09f33669435E7Ef1BeAedadadadada", "S5")
        ).toBe(
            "5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed"
        );

        expect(
            helper.addressFromPublicKey("B6916095ca1df60bB79Ce92cE3Ea74c37c5d359adadadada", "PUBLIC_CONTRACT")
        ).toBe(
            "fB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"
        );

        expect(
            helper.addressFromPublicKey("2908400098527886E0F7030069857D2E4169EE7a", "S5")
        ).toBe(
            "52908400098527886E0F7030069857D2E4169EE7"
        );

        expect(
            helper.addressFromPublicKey("7b1fdb04752bbc536007a920d24acb045561c26a", "S2")
        ).toBe(
            "27b1fdb04752bbc536007a920d24acb045561c26"
        );
    });

    it("should mark correct addresses as valid", () => {
        let testVectors = [
            "5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
            "fB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
            "52908400098527886E0F7030069857D2E4169EE7",
            "27b1fdb04752bbc536007a920d24acb045561c26"
        ];

        for(let address of testVectors) {
            expect(helper.isValidAddress(address).isValid).toBeTruthy(address);
        }
    });

    it("should mark incorrect addresses as invalid", () => {
        let testVectors: IInvalidAddressTestVector[] = [
            // Invalid prefix
            {
                address: "XaAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
                error: "prefix"
            },
            // Invalid checksum
            {
                address: "fB6916095ca1df60bB79Ce92cE3Ea74c37c5d359".toLowerCase(),
                error: "checksum"
            },
            // Invalid length
            {
                address: "fKdjsl",
                error: "size"
            }
        ];

        for(let testVector of testVectors) {
            expect(
                helper.isValidAddress(testVector.address)
            ).toEqual(
                {
                    isValid: false, 
                    error: testVector.error
                },
                testVector.address
            );
        }
    });
});