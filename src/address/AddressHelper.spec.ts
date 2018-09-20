import { AddressHelper } from "./AddressHelper";

describe("AddressHelper", () => {
    let helper: AddressHelper;

    // we use the addresses shown below as test vectors.
    let templatePublicKeys = [
        {
            key: "PUBLIC_KEY_1",
            layerCount: 14,
            address: "",
            prefix: "S1",
            treeRoot: "PY77CNJF6SJ3ROTROMBDRM7VYYUU5NBC",
            checksum: "UM3Y"
        },
        {
            key: "PUBLIC_KEY_2",
            layerCount: 15,
            address: "",
            prefix: "S2",
            treeRoot: "J76P4G3QFUPW4KGXAVJLGC7QAYUW4OLC",
            checksum: "ED5Q"
        },
        {
            key: "PUBLIC_KEY_3",
            layerCount: 16,
            address: "",
            prefix: "S3",
            treeRoot: "3UFRIWSOTZDVRKAD3RFX2OYNNCDOPYMJ",
            checksum: "S4RL"
        },
        {
            key: "PUBLIC_KEY_4",
            layerCount: 17,
            address: "",
            prefix: "S4",
            treeRoot: "2PONVSKDYHOJMJHIDOQRWLLXZDTAMMQX",
            checksum: "YHBC"
        }
    ];

    beforeEach(() => {
        helper = new AddressHelper();
    });

    beforeEach(() => {
        // Construct final template addresses
        for(let templateAddress of templatePublicKeys) {
            templateAddress.address = `${ templateAddress.prefix }${ templateAddress.treeRoot }${ templateAddress.checksum }`;
        }
    });

    it("should generate correct addresses", () => {
        for(let addressTemplate of templatePublicKeys) {
            let address = helper.addressFromPublicKey(addressTemplate.key, addressTemplate.layerCount);

            expect(address).toBe(addressTemplate.address, `${ addressTemplate.key } should return ${ addressTemplate.address }`);
        }
    });

    it("should validate correct addresses as valid", () => {
        for(let templateAddress of templatePublicKeys) {
            let address = templateAddress.address;

            expect(helper.isValidAddress(address)).toEqual({
                isValid: true
            })
        }
    })

    it("should not validate addresses with an incorrect prefix", () => {
        for(let templateAddress of templatePublicKeys) {
            let address = templateAddress.address;

            // We sneakily change the address prefix.
            address = "X" + address.substr(1);

            expect(helper.isValidAddress(address)).toEqual({
                isValid: false,
                error: "prefix"
            });
        }
    });

    it("should not validate addresses with an invalid tree root size", () => {
        for(let templateAddress of templatePublicKeys) {
            let address = templateAddress.address;

            // We cut the address short
            address = address.substr(0, 30);

            expect(helper.isValidAddress(address)).toEqual({
                isValid: false,
                error: "tree_root_length"
            })
        }
    });

    it("should not validate addresses with invalid characters", () => {
        let invalidCharactersToTest = [
            "1", "8", "9", "0"
        ];
        for(let i = 0; i < templatePublicKeys.length; i++) {
            let templateAddress = templatePublicKeys[i];

            let address = templateAddress.address;

            // We sneakily change a character to an invalid value
            address = address.substr(0, 22) + invalidCharactersToTest[(i % invalidCharactersToTest.length)] + address.substr(23);

            expect(helper.isValidAddress(address)).toEqual({
                isValid: false,
                error: "invalid_character"
            });
        }
    });

    it("should not validate addresses with an incorrect checksum", () => {
        for(let templateAddress of templatePublicKeys) {
            let address = templateAddress.address;

            // By changing the prefix we can easily trigger an invalid check sum
            let newPrefix = "S2";
            if(address.startsWith("S2"))
                newPrefix = "S3";

            address = newPrefix + address.substr(2);

            expect(helper.isValidAddress(address)).toEqual({
                isValid: false,
                error: "checksum"
            })
        }
    });
});