import { MerkleTreeHelper } from "./MerkleTreeHelper";

describe("MerkleTreeHelper", () => {
    it("should return correct config storage keys", () => {
        let dummyWallet = {
            id: "WALLET_ID"
        };

        expect(MerkleTreeHelper.getConfigStorageKey(<any>dummyWallet)).toBe("WALLET_ID-config");
    });

    it("should return correct layer storage keys", () => {
        let dummyWallet = {
            id: "WALLET_ID"
        };

        expect(MerkleTreeHelper.getLayerStorageKeys(<any>dummyWallet, 4)).toEqual([
            "WALLET_ID-layer-0",
            "WALLET_ID-layer-1",
            "WALLET_ID-layer-2",
            "WALLET_ID-layer-3"
        ]);
    });
})