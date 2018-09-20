import { MerkleTreeSerializer } from "./MerkleTreeSerializer";
import { MerkleTree } from "./MerkleTree";
import { Storage } from "@ionic/storage";
import { IKeyStoreService } from "../../services/key-store-service/key-store-service";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { ILocalWallet } from "../../models/ILocalWallet";

describe("MerkleTreeSerializer", () => {
    let serializer: MerkleTreeSerializer;
    let storageService: Storage;
    let keyStoreService: IKeyStoreService;

    beforeEach(() => {
        serializer = new MerkleTreeSerializer();
        storageService = new Storage(null);
        keyStoreService = new MockKeyStoreService();
    })

    it("should serialize the Merkle Tree correctly", (done) => {
        // Programmers hate this one trick! Save money now!
        let merkleTree: MerkleTree = new MerkleTree([
            ["1", "2", "3", "4"],
            ["1", "2"],
            ["1"]
        ]);

        let dummyWallet: ILocalWallet = <any>{
            id: "WALLET_ID"
        };

        spyOn(keyStoreService, "createKeyStore").and.callFake((data, password) => {
            // We parse the JSON string so we can determine which layer we are working on.
            // Next we return a simple object which we can use to validate the storage.set functionality.
            let parsed = JSON.parse(data);

            switch(parsed.length) {
                case(4):
                    return {length: 4};
                case(2):
                    return {length: 2};
                case(1):
                    return {length: 1};
            }
        });
        spyOn(storageService, "set").and.callFake((key, value) => {
            // Check if the key and value match
            switch(key) {
                case("WALLET_ID-config"):
                    expect(value).toEqual({
                        layerCount: 3,
                        version: 1
                    });
                    break;
                case("WALLET_ID-layer-0"):
                    expect(value).toEqual({length: 4});
                    break;
                case("WALLET_ID-layer-1"):
                    expect(value).toEqual({length: 2});
                    break;
                case("WALLET_ID-layer-2"):
                expect(value).toEqual({length: 1});
                    break;
            }

            return Promise.resolve();
        });

        serializer.serialize(merkleTree, dummyWallet, storageService, keyStoreService, "pass123").then(
            () => {
                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should never be called");

                done();
            }
        );
        
    });
});