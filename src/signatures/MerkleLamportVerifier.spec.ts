import { MerkleLamportVerifier } from "./MerkleLamportVerifier";

interface IMerkleLamportVerifierTestVector {
    name: string;
    message: string;
    signature: string;
    address: string;
    index: number;
    layerCount: number;
    bitCount: number;
}

describe("MerkleLamportVerifier", () => {
    let verifier: MerkleLamportVerifier;

    let validSignatures: IMerkleLamportVerifierTestVector[] = [
        {
            name: "valid1",
            message: "hello world",
            signature: "Zkr6ceBStsK/jY1R:i0p2::i0p3:yFvfFWOHDl5IV8ci::FLkoqREiltsnt0Ys:i0p6::m5lOjM+LbdPcUp+fImJcGP37+D770pepFXFg6noqr2BhVw0M+arvg5Uqr/DK+ZqgXf5jvHHklll/4Zi+vsTZZw==:i0p8,T0+9R9cF7s0JBndiweE4MdNObXhICiZhH1OE80LTcYI=:lQVcLuQ9bnl7txitMfkDtTs9YCuATHk534lS5tVwc0g=:2NbVkchUbqrHxILSiQlofWKk40acTCBD4ZJu9RzdLXk=",
            address: "X15KPMFXINX6HPCYR7Y2FA2JX7HF54FDMWAJFD",
            index: 0,
            layerCount: 4,
            bitCount: 4
        },
        {
            name: "valid2",
            message: "hello world",
            signature: "8JXWdDRRGpAyquix:i4p2::i4p3:7bNwxEvpsYenDTIB::e+e1oV/Pi+i8IZD6:i4p6::Zg+mVsWZMFwO5IY4jCKzrgk3XdIf1/JytNzna2AAxSPBPUmcl6alEVOL+x4ouHh3ffKDGysPBAkFlj1GlctEEQ==:i4p8,+5UWCyLdX6QfSMXi8Mi+2dol7vW9p1Nw542lC3O/jOk=:+7SKGMfQhSPYNe6NNPLcYmB2T4hAJZ6RlNWO3lXdKpQ=:2+dr9t4+562ysmWkmNMmU3Qpjaj7Vk2657siQNMcOLM=",
            address: "X15KPMFXINX6HPCYR7Y2FA2JX7HF54FDMWAJFD",
            index: 4,
            layerCount: 4,
            bitCount: 4
        }
    ];
    let invalidSignatures: IMerkleLamportVerifierTestVector[] = [
        {
            name: "invalid1",
            // Invalid message
            message: "goodbye world",
            signature: "Zkr6ceBStsK/jY1R:i0p2::i0p3:yFvfFWOHDl5IV8ci::FLkoqREiltsnt0Ys:i0p6::m5lOjM+LbdPcUp+fImJcGP37+D770pepFXFg6noqr2BhVw0M+arvg5Uqr/DK+ZqgXf5jvHHklll/4Zi+vsTZZw==:i0p8,T0+9R9cF7s0JBndiweE4MdNObXhICiZhH1OE80LTcYI=:lQVcLuQ9bnl7txitMfkDtTs9YCuATHk534lS5tVwc0g=:2NbVkchUbqrHxILSiQlofWKk40acTCBD4ZJu9RzdLXk=",
            address: "X15KPMFXINX6HPCYR7Y2FA2JX7HF54FDMWAJFD",
            index: 0,
            layerCount: 4,
            bitCount: 4
        },
        {
            name: "invalid2",
            message: "hello world",
            // Invalid signature
            signature: "Zkr6ceBStsK/jY1R:i0p1::i0p3:yFvfFWOHDl5IV8ci::FLkoqREiltsnt0Ys:i0p6::m5lOjM+LbdPcUp+fImJcGP37+D770pepFXFg6noqr2BhVw0M+arvg5Uqr/DK+ZqgXf5jvHHklll/4Zi+vsTZZw==:i0p8,T0+9R9cF7s0JBndiweE4MdNObXhICiZhH1OE80LTcYI=:lQVcLuQ9bnl7txitMfkDtTs9YCuATHk534lS5tVwc0g=:2NbVkchUbqrHxILSiQlofWKk40acTCBD4ZJu9RzdLXk=",
            address: "X15KPMFXINX6HPCYR7Y2FA2JX7HF54FDMWAJFD",
            index: 0,
            layerCount: 4,
            bitCount: 4
        },
        {
            name: "invalid3",
            message: "hello world",
            signature: "Zkr6ceBStsK/jY1R:i0p2::i0p3:yFvfFWOHDl5IV8ci::FLkoqREiltsnt0Ys:i0p6::m5lOjM+LbdPcUp+fImJcGP37+D770pepFXFg6noqr2BhVw0M+arvg5Uqr/DK+ZqgXf5jvHHklll/4Zi+vsTZZw==:i0p8,T0+9R9cF7s0JBndiweE4MdNObXhICiZhH1OE80LTcYI=:lQVcLuQ9bnl7txitMfkDtTs9YCuATHk534lS5tVwc0g=:2NbVkchUbqrHxILSiQlofWKk40acTCBD4ZJu9RzdLXk=",
            // Invalid address
            address: "X1EPATTSSQASHGLLLMUMOS3OFDCXVBS5GABP5N",
            index: 0,
            layerCount: 4,
            bitCount: 4
        },
        {
            name: "invalid4",
            message: "hello world",
            signature: "Zkr6ceBStsK/jY1R:i0p2::i0p3:yFvfFWOHDl5IV8ci::FLkoqREiltsnt0Ys:i0p6::m5lOjM+LbdPcUp+fImJcGP37+D770pepFXFg6noqr2BhVw0M+arvg5Uqr/DK+ZqgXf5jvHHklll/4Zi+vsTZZw==:i0p8,T0+9R9cF7s0JBndiweE4MdNObXhICiZhH1OE80LTcYI=:lQVcLuQ9bnl7txitMfkDtTs9YCuATHk534lS5tVwc0g=:2NbVkchUbqrHxILSiQlofWKk40acTCBD4ZJu9RzdLXk=",
            address: "X15KPMFXINX6HPCYR7Y2FA2JX7HF54FDMWAJFD",
            // Invalid index
            index: 3,
            layerCount: 4,
            bitCount: 4
        }
    ];

    beforeEach(() => {
        verifier = new MerkleLamportVerifier();
    });

    it("should mark correct signatures as valid", () => {
        for(let valid of validSignatures) {
            expect(verifier.verifyMerkleSignature(
                valid.message,
                valid.signature,
                valid.index,
                valid.layerCount,
                valid.address,
                valid.bitCount
            )).toBeTruthy(valid.name);
        }
    });

    it("should mark incorrect signatures as invalid", () => {
        for(let invalid of invalidSignatures) {
            expect(verifier.verifyMerkleSignature(
                invalid.message,
                invalid.signature,
                invalid.index,
                invalid.layerCount,
                invalid.address,
                invalid.bitCount
            )).toBeFalsy(invalid.name);
        }
    });
});