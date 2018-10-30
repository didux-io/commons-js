import { BIP32 } from "./BIP32";

describe("BIP32", () => {
    let bip32: BIP32;

    beforeEach(() => {
        bip32 = new BIP32();
    });

    it("should return correct private keys", () => {
        for(let testVector of testVectors) {
            for(let variation of testVector.variations) {
                // Use coin type 0 (e.g. Bitcoin)
                expect(bip32.getPrivateKey(testVector.seed, variation.index, testVector.coinType)).toBe(variation.privateKey);
            }
        }
    });
});

let testVectors = [
    {
        // Mnemonic: abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
        // Passphrase: TREZOR
        seed: "c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04",
        coinType: 0, // Bitcoin
        variations: [
            {
                index: 0,
                privateKey: "L47qcNDdda3QMACwfisBm5XHrXvzTLd9H9Cxz3LBH2J8EBPFvMGo"
            },
            {
                index: 10,
                privateKey: "Kwq9q38wfkuVZXVDcAruUUvH9xNERaxvMUkrTRu8uJVp25xEnAyg"
            },
            {
                index: 100,
                privateKey: "L1NFeg57MtYerQw3AVVvvx6TvbnJ4UdcQkuEvKUEYJ4bXWkREEJe"
            }
        ]
    },
    {
        // Mnemonic: abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
        // Passphrase: TREZOR
        seed: "c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04",
        coinType: 160, // Bitcore
        variations: [
            {
                index: 0,
                privateKey: "L3DXNgPsemZxYHte4u3XJ6dnMSAWRjZe4JYuVNSZ1NWmMf3hundd"
            },
            {
                index: 10,
                privateKey: "KxBurKYJ9uY2w2H2CfAEcBg7W7QFWw7o7PupBq2igWRQTSWcMBQt"
            },
            {
                index: 100,
                privateKey: "KyYxMmCePhE5JoKDvdW6rPHYaVprVprF3Z7BE1U1husQHLT6psYK"
            }
        ]
    },
    {
        // Mnemonic: region symbol tornado defense profit eight soldier layer census consider gift slice mass accident rice
        // Passphrase: 
        seed: "ccc94674946e64975659e3676ddb4e81fe3764e0c82b11a4d8bb79e7d52bd25d37d7b23b8647a0cb5bfcb80647d1f6216682f1faf826fddb50e95ea075574797",
        coinType: 0, // Bitcoin
        variations: [
            {
                index: 0,
                privateKey: "KxQENCeTJnrM5twUi3sgwFmpDXdHAhmZqk8CovT2mk2HXv9gg5ie"
            },
            {
                index: 10,
                privateKey: "KxE8Uc4SPRFJjDQ6XJ9iqCvnYNbcGo5U3U1Es8MpJi1kddgW2fCW"
            },
            {
                index: 100,
                privateKey: "L3PhDQt1jeaWEpSCCySyhHETEa6FtyjhFTjionBtTnugqzVYStUA"
            }
        ]
    }
]