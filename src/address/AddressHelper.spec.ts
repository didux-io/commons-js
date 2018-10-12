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

    // it("should generate correct addresses", () => {
    //     for(let addressTemplate of templatePublicKeys) {
    //         let address = helper.addressFromPublicKey(addressTemplate.key, addressTemplate.layerCount);

    //         expect(address).toBe(addressTemplate.address, `${ addressTemplate.key } should return ${ addressTemplate.address }`);
    //     }
    // });

    // it("should validate correct addresses as valid", () => {
    //     for(let templateAddress of templatePublicKeys) {
    //         let address = templateAddress.address;

    //         expect(helper.isValidAddress(address)).toEqual({
    //             isValid: true
    //         })
    //     }
    // })

    // it("should not validate addresses with an incorrect prefix", () => {
    //     for(let templateAddress of templatePublicKeys) {
    //         let address = templateAddress.address;

    //         // We sneakily change the address prefix.
    //         address = "X" + address.substr(1);

    //         expect(helper.isValidAddress(address)).toEqual({
    //             isValid: false,
    //             error: "prefix"
    //         });
    //     }
    // });

    // it("should not validate addresses with an invalid tree root size", () => {
    //     for(let templateAddress of templatePublicKeys) {
    //         let address = templateAddress.address;

    //         // We cut the address short
    //         address = address.substr(0, 30);

    //         expect(helper.isValidAddress(address)).toEqual({
    //             isValid: false,
    //             error: "tree_root_length"
    //         })
    //     }
    // });

    // it("should not validate addresses with invalid characters", () => {
    //     let invalidCharactersToTest = [
    //         "1", "8", "9", "0"
    //     ];
    //     for(let i = 0; i < templatePublicKeys.length; i++) {
    //         let templateAddress = templatePublicKeys[i];

    //         let address = templateAddress.address;

    //         // We sneakily change a character to an invalid value
    //         address = address.substr(0, 22) + invalidCharactersToTest[(i % invalidCharactersToTest.length)] + address.substr(23);

    //         expect(helper.isValidAddress(address)).toEqual({
    //             isValid: false,
    //             error: "invalid_character"
    //         });
    //     }
    // });

    // it("should not validate addresses with an incorrect checksum", () => {
    //     for(let templateAddress of templatePublicKeys) {
    //         let address = templateAddress.address;

    //         // By changing the prefix we can easily trigger an invalid check sum
    //         let newPrefix = "S2";
    //         if(address.startsWith("S2"))
    //             newPrefix = "S3";

    //         address = newPrefix + address.substr(2);

    //         expect(helper.isValidAddress(address)).toEqual({
    //             isValid: false,
    //             error: "checksum"
    //         })
    //     }
    // });
});