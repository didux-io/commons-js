import { MerkleLamportSigner } from "./MerkleLamportSigner";
import { MerkleTree } from "../merkle/MerkleTree";

interface IMerkleLamportSignerTestVector {
    name: string;
    input: {
        bitCount: number;
        lamportPrivateKeys: string[][];
        merkleTree: MerkleTree;
        message: string;
        privateKey: string;
        index: number;
    };
    output: {
        signature: string;
    };
}

describe("MerkleLamportSigner", () => {
    let signer: MerkleLamportSigner;

    // ALl tests assume a 4 bit message. Real world uses 100 bits but
    // the algorithm remains the same. 
    // The generated lamport private keys are mocked.
    let testVectors: IMerkleLamportSignerTestVector[] = [
        {
            name: "basic",
            input: {
                bitCount: 4,
                lamportPrivateKeys: [
                    [
                        "i0p1", "i0p2", "i0p3", "i0p4",
                        "i0p5", "i0p6", "i0p7", "i0p8"
                    ],
                    [
                        "i1p1", "i1p2", "i1p3", "i1p4",
                        "i1p5", "i1p6", "i1p7", "i1p8"
                    ],
                    [
                        "i2p1", "i2p2", "i2p3", "i2p4",
                        "i2p5", "i2p6", "i2p7", "i2p8"
                    ],
                    [
                        "i3p1", "i3p2", "i3p3", "i3p4",
                        "i3p5", "i3p6", "i3p7", "i3p8"
                    ],
                    [
                        "i4p1", "i4p2", "i4p3", "i4p4",
                        "i4p5", "i4p6", "i4p7", "i4p8"
                    ],
                    [
                        "i5p1", "i5p2", "i5p3", "i5p4",
                        "i5p5", "i5p6", "i5p7", "i5p8"
                    ],
                    [
                        "i6p1", "i6p2", "i6p3", "i6p4",
                        "i6p5", "i6p6", "i6p7", "i6p8"
                    ],
                    [
                        "i7p1", "i7p2", "i7p3", "i7p4",
                        "i7p5", "i7p6", "i7p7", "i7p8"
                    ]
                ],
                merkleTree: new MerkleTree([
                    [
                        "MInCpFCkAy9FtdLyaOkzrCUGQr9SwBawdsuFl+fGztw=",
                        "T0+9R9cF7s0JBndiweE4MdNObXhICiZhH1OE80LTcYI=", 
                        "MuThec9PDdKaLJPlSaFw3weKYpOPVUuoz65V8zLk9Rw=", 
                        "TPrnSqnVHFUAxgjuYXFzbzvzWROjZ/SlKyQTasKYLYo=", 
                        "hvCC22ehsGD+8D0p/JiLJtrftl2oOlE4j7ICDaJOydM=", 
                        "+5UWCyLdX6QfSMXi8Mi+2dol7vW9p1Nw542lC3O/jOk=", 
                        "MVM6LnyQIqOxNKKayPrihan0O5LPJzbCUWD24kdK3Hk=", 
                        "XkDU8VlRGPVtQ/fmEqRlboH+CgBvJC/Cf7FnwhlmGQg="
                    ],
                    [
                        "wxh5iEyZ9NcoTA1HYAO0H306ydRENvLl60LvXAq0rAI=",
                        "lQVcLuQ9bnl7txitMfkDtTs9YCuATHk534lS5tVwc0g=",
                        "ZwlepbUdDYWoo9QR9vLFV/HXbwBaB5TPMYdxpsAvCt8=",
                        "+7SKGMfQhSPYNe6NNPLcYmB2T4hAJZ6RlNWO3lXdKpQ="
                    ],
                    [
                        "2+dr9t4+562ysmWkmNMmU3Qpjaj7Vk2657siQNMcOLM=",
                        "2NbVkchUbqrHxILSiQlofWKk40acTCBD4ZJu9RzdLXk="
                    ],
                    [
                        "6p7C3Q2/jvFiP8aKDSb/OXvCjZZ9UVSc7Hu/BGrCIns="
                    ]
                ]),
                message: "hello world", // 1011
                privateKey: "PRIVATE_KEY",
                index: 0
            },
            output: {
                signature: "Zkr6ceBStsK/jY1R:i0p2::i0p3:yFvfFWOHDl5IV8ci::FLkoqREiltsnt0Ys:i0p6::m5lOjM+LbdPcUp+fImJcGP37+D770pepFXFg6noqr2BhVw0M+arvg5Uqr/DK+ZqgXf5jvHHklll/4Zi+vsTZZw==:i0p8,T0+9R9cF7s0JBndiweE4MdNObXhICiZhH1OE80LTcYI=:lQVcLuQ9bnl7txitMfkDtTs9YCuATHk534lS5tVwc0g=:2NbVkchUbqrHxILSiQlofWKk40acTCBD4ZJu9RzdLXk="
            }
        },
        // Same as above but with different index
        {
            name: "basic-different-index",
            input: {
                bitCount: 4,
                lamportPrivateKeys: [
                    [
                        "i0p1", "i0p2", "i0p3", "i0p4",
                        "i0p5", "i0p6", "i0p7", "i0p8"
                    ],
                    [
                        "i1p1", "i1p2", "i1p3", "i1p4",
                        "i1p5", "i1p6", "i1p7", "i1p8"
                    ],
                    [
                        "i2p1", "i2p2", "i2p3", "i2p4",
                        "i2p5", "i2p6", "i2p7", "i2p8"
                    ],
                    [
                        "i3p1", "i3p2", "i3p3", "i3p4",
                        "i3p5", "i3p6", "i3p7", "i3p8"
                    ],
                    [
                        "i4p1", "i4p2", "i4p3", "i4p4",
                        "i4p5", "i4p6", "i4p7", "i4p8"
                    ],
                    [
                        "i5p1", "i5p2", "i5p3", "i5p4",
                        "i5p5", "i5p6", "i5p7", "i5p8"
                    ],
                    [
                        "i6p1", "i6p2", "i6p3", "i6p4",
                        "i6p5", "i6p6", "i6p7", "i6p8"
                    ],
                    [
                        "i7p1", "i7p2", "i7p3", "i7p4",
                        "i7p5", "i7p6", "i7p7", "i7p8"
                    ]
                ],
                merkleTree: new MerkleTree([
                    [
                        "MInCpFCkAy9FtdLyaOkzrCUGQr9SwBawdsuFl+fGztw=",
                        "T0+9R9cF7s0JBndiweE4MdNObXhICiZhH1OE80LTcYI=", 
                        "MuThec9PDdKaLJPlSaFw3weKYpOPVUuoz65V8zLk9Rw=", 
                        "TPrnSqnVHFUAxgjuYXFzbzvzWROjZ/SlKyQTasKYLYo=", 
                        "hvCC22ehsGD+8D0p/JiLJtrftl2oOlE4j7ICDaJOydM=", 
                        "+5UWCyLdX6QfSMXi8Mi+2dol7vW9p1Nw542lC3O/jOk=", 
                        "MVM6LnyQIqOxNKKayPrihan0O5LPJzbCUWD24kdK3Hk=", 
                        "XkDU8VlRGPVtQ/fmEqRlboH+CgBvJC/Cf7FnwhlmGQg="
                    ],
                    [
                        "wxh5iEyZ9NcoTA1HYAO0H306ydRENvLl60LvXAq0rAI=",
                        "lQVcLuQ9bnl7txitMfkDtTs9YCuATHk534lS5tVwc0g=",
                        "ZwlepbUdDYWoo9QR9vLFV/HXbwBaB5TPMYdxpsAvCt8=",
                        "+7SKGMfQhSPYNe6NNPLcYmB2T4hAJZ6RlNWO3lXdKpQ="
                    ],
                    [
                        "2+dr9t4+562ysmWkmNMmU3Qpjaj7Vk2657siQNMcOLM=",
                        "2NbVkchUbqrHxILSiQlofWKk40acTCBD4ZJu9RzdLXk="
                    ],
                    [
                        "6p7C3Q2/jvFiP8aKDSb/OXvCjZZ9UVSc7Hu/BGrCIns="
                    ]
                ]),
                message: "hello world", // 1011
                privateKey: "PRIVATE_KEY",
                index: 4
            },
            output: {
                signature: "8JXWdDRRGpAyquix:i4p2::i4p3:7bNwxEvpsYenDTIB::e+e1oV/Pi+i8IZD6:i4p6::Zg+mVsWZMFwO5IY4jCKzrgk3XdIf1/JytNzna2AAxSPBPUmcl6alEVOL+x4ouHh3ffKDGysPBAkFlj1GlctEEQ==:i4p8,+5UWCyLdX6QfSMXi8Mi+2dol7vW9p1Nw542lC3O/jOk=:+7SKGMfQhSPYNe6NNPLcYmB2T4hAJZ6RlNWO3lXdKpQ=:2+dr9t4+562ysmWkmNMmU3Qpjaj7Vk2657siQNMcOLM="
            }
        }
    ];

    beforeEach(() => {
        signer = new MerkleLamportSigner();
    });

    it("should create correct signatures", () => {
        // We must mock the generated private keys
        let testVectorIndex = 0;
        let testVectorSubIndex = 0;
        
        spyOn((<any>signer), "getLamportPrivateKeys").and.callFake(() => {
            return testVectors[testVectorIndex].input.lamportPrivateKeys[testVectorSubIndex];
        });

        for(let testVector of testVectors) {
            testVectorSubIndex = testVector.input.index;

            let signature = signer.getSignature(
                testVector.input.merkleTree,
                testVector.input.message,
                testVector.input.privateKey,
                testVector.input.index,
                testVector.input.bitCount
            );

            expect(signature).toBe(testVector.output.signature, testVector.name + " failed");

            testVectorIndex++;
        }
    });
});