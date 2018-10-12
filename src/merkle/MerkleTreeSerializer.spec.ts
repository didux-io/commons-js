import { MerkleTreeSerializer } from "./MerkleTreeSerializer";
import { MerkleTree } from "./MerkleTree";
import { IStorageManager } from "../storage/IStorageManager";
import { EncryptionHelper } from "../keystore/EncryptionHelper";
import { MockStorageManager } from "../../mocks/MockStorageManager";
import { ILocalWallet } from "../wallet/ILocalWallet";
import { MerkleTreeHelper } from "./MerkleTreeHelper";
import { IMerkleTreeConfig } from "./IMerkleTreeConfig";

describe("MerkleTreeSerializer", () => {
    let serializer: MerkleTreeSerializer;
    let storageManager: IStorageManager;
    let encryptionHelper: EncryptionHelper;

    beforeEach(() => {
        storageManager = new MockStorageManager();
        encryptionHelper = new EncryptionHelper();

        serializer = new MerkleTreeSerializer(storageManager, encryptionHelper);
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

        spyOn(encryptionHelper, "createKeyStore").and.callFake((data, password) => {
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
        spyOn(storageManager, "writeJSON").and.callFake((key, value) => {
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

        serializer.serialize(merkleTree, dummyWallet, "pass123").then(
            () => {
                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should never be called");

                done();
            }
        ); 
    });

    it("should read the Merkle Tree from disk correctly", (done) => {
        spyOn(MerkleTreeHelper, "getConfigStorageKey").and.returnValue("config");
        spyOn(MerkleTreeHelper, "getLayerStorageKeys").and.returnValue(["layer1", "layer2", "layer3"]);
        spyOn(storageManager, "readJSON").and.callFake((key: string) => {
            switch(key) {
                case("config"):
                    return Promise.resolve({
                        layerCount: 3
                    });
                case("layer1"):
                    return Promise.resolve({
                        name: "layer1"
                    });
                case("layer2"):
                    return Promise.resolve({
                        name: "layer2"
                    });
                case("layer3"):
                    return Promise.resolve({
                        name: "layer3"
                    });
                default:
                    expect(true).toBeFalsy("Unexpected key: " + key);
                    break;
            }
        });
        spyOn(encryptionHelper, "decryptKeyStore").and.callFake((keyStore, password) => {
            expect(password).toBe("pass123");

            switch(keyStore.name) {
                case("layer1"):
                    return JSON.stringify(["1", "2", "3", "4"]);
                case("layer2"):
                    return JSON.stringify(["1", "2"]);
                case("layer3"):
                    return JSON.stringify(["1"]);
            }
        });

        serializer.deserialize(<any>{}, "pass123").then(
            (merkleTree) => {
                expect(merkleTree instanceof MerkleTree).toBeTruthy();
                expect(merkleTree.layers).toEqual([
                    ["1", "2", "3", "4"],
                    ["1", "2"],
                    ["1"]
                ]);

                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should never be called");

                done();
            }
        );
    });

    it("should fail when reading a Merkle Tree from disk with the wrong password", (done) => {
        spyOn(MerkleTreeHelper, "getConfigStorageKey").and.returnValue("config");
        spyOn(MerkleTreeHelper, "getLayerStorageKeys").and.returnValue(["layer1", "layer2", "layer3"]);
        spyOn(storageManager, "readJSON").and.callFake((key: string) => {
            switch(key) {
                case("config"):
                    return Promise.resolve({
                        layerCount: 3
                    });
                case("layer1"):
                    return Promise.resolve({
                        name: "layer1"
                    });
                case("layer2"):
                    return Promise.resolve({
                        name: "layer2"
                    });
                case("layer3"):
                    return Promise.resolve({
                        name: "layer3"
                    });
                default:
                    expect(true).toBeFalsy("Unexpected key: " + key);
                    break;
            }
        });
        spyOn(encryptionHelper, "decryptKeyStore").and.callFake((keyStore, password) => {
            // Oops wrong password!
            return null;
        });

        serializer.deserialize(<any>{}, "wrong_password").then(
            (merkleTree) => {
                expect(true).toBeFalsy("Promise resolve should never be called");

                done();
            },
            (error) => {
                expect(error).toBe("Could not decrypt Merkle Tree");

                done();
            }
        );
    });

    it("should fail when reading a Merkle Tree from disk with missing layers", (done) => {
        spyOn(MerkleTreeHelper, "getConfigStorageKey").and.returnValue("config");
        spyOn(MerkleTreeHelper, "getLayerStorageKeys").and.returnValue(["layer1", "layer2", "layer3"]);
        spyOn(storageManager, "readJSON").and.callFake((key: string) => {
            switch(key) {
                case("config"):
                    return Promise.resolve({
                        layerCount: 3
                    });
                case("layer1"):
                    return Promise.resolve({
                        name: "layer1"
                    });
                case("layer2"):
                    // Missing layer!
                    return Promise.resolve(null);
                case("layer3"):
                    return Promise.resolve({
                        name: "layer3"
                    });
                default:
                    expect(true).toBeFalsy("Unexpected key: " + key);
                    break;
            }
        });
        spyOn(encryptionHelper, "decryptKeyStore").and.callFake((keyStore, password) => {
            switch(keyStore.name) {
                case("layer1"):
                    return JSON.stringify(["1", "2", "3", "4"]);
                case("layer2"):
                    return JSON.stringify(["1", "2"]);
                case("layer3"):
                    return JSON.stringify(["1"]);
            }
        });

        serializer.deserialize(<any>{}, "pass123").then(
            (merkleTree) => {
                expect(true).toBeFalsy("Promise resolve should never be called");

                done();
            },
            (error) => {
                expect(error).toBe("Missing layer: 1");

                done();
            }
        );
    });

    it("should fail when reading a Merkle Tree with no config", (done) => {
        spyOn(MerkleTreeHelper, "getConfigStorageKey").and.returnValue("config");
        spyOn(storageManager, "readJSON").and.callFake((key: string) => {
            switch(key) {
                case("config"):
                    // No config found!
                    return Promise.resolve(null);
                default:
                    expect(true).toBeFalsy("Unexpected key: " + key);
                    break;
            }
        });

        serializer.deserialize(<any>{}, "pass123").then(
            (merkleTree) => {
                expect(true).toBeFalsy("Promise resolve should never be called");

                done();
            },
            (error) => {
                expect(error).toBe("MerkleTree not found on disk");

                done();
            }
        );
    });

    it("should not fail when cleaning a Merkle Tree with no config", (done) => {
        spyOn(MerkleTreeHelper, "getConfigStorageKey").and.returnValue("CONFIG_KEY");
        spyOn(storageManager, "readJSON").and.callFake(
            (key) => {
                expect(key).toBe("CONFIG_KEY");

                return Promise.resolve(null);
            }
        );

        let wallet: ILocalWallet = <ILocalWallet>{};

        serializer.clean(wallet).then(
            () => {
                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should not be called");

                done();
            }
        );
    });

    it("should not fail when some layers cannot be removed", (done) => {
        // Mock merkle tree config
        spyOn(MerkleTreeHelper, "getConfigStorageKey").and.returnValue("CONFIG_KEY");
        spyOn(storageManager, "readJSON").and.callFake(
            (key) => {
                if(key == "CONFIG_KEY") {
                    let config: IMerkleTreeConfig = {
                        version: 1,
                        layerCount: 3
                    };
    
                    return Promise.resolve(config);
                }
                else {
                    return Promise.resolve(null);
                }
            }
        );

        // Mock merkle tree layers
        spyOn(MerkleTreeHelper, "getLayerStorageKeys").and.returnValue(["LAYER_1", "LAYER_2", "LAYER_3"]);

        spyOn(storageManager, "remove").and.callFake(
            (key) => {
                switch(key) {
                    case("LAYER_1"):
                        return Promise.resolve();
                    case("LAYER_2"):
                        return Promise.reject("OOPS!");
                    case("LAYER_3"):
                        return Promise.reject("OOPS!");
                    default:
                        return Promise.resolve();
                }
            }
        );

        // Silence error messages output to console
        spyOn(console, "error");

        let wallet: ILocalWallet = <ILocalWallet>{};

        serializer.clean(wallet).then(
            () => {
                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should not be called");
                done();
            }
        );
    });

    it("should remove all layers from a Merkle Tree", (done) => {
        // Mock merkle tree config
        spyOn(MerkleTreeHelper, "getConfigStorageKey").and.returnValue("CONFIG_KEY");
        spyOn(storageManager, "readJSON").and.callFake(
            (key) => {
                if(key == "CONFIG_KEY") {
                    let config: IMerkleTreeConfig = {
                        version: 1,
                        layerCount: 3
                    };
    
                    return Promise.resolve(config);
                }
                else {
                    return Promise.resolve(null);
                }
            }
        );

        // Mock merkle tree layers
        spyOn(MerkleTreeHelper, "getLayerStorageKeys").and.returnValue(["LAYER_1", "LAYER_2", "LAYER_3"]);

        let removedLayers: string[] = [];
        spyOn(storageManager, "remove").and.callFake(
            (key) => {
                if(key != "CONFIG_KEY")
                    removedLayers.push(key);

                return Promise.resolve();
            }
        );

        let wallet: ILocalWallet = <ILocalWallet>{};

        serializer.clean(wallet).then(
            () => {
                expect(removedLayers.length).toBe(3);
                expect(removedLayers.indexOf("LAYER_1")).not.toBe(-1);
                expect(removedLayers.indexOf("LAYER_2")).not.toBe(-1);
                expect(removedLayers.indexOf("LAYER_3")).not.toBe(-1);
                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should not be called");
                done();
            }
        );
    });

    it("should remove the config when removing a Merkle Tree", (done) => {
        // Mock merkle tree config
        spyOn(MerkleTreeHelper, "getConfigStorageKey").and.returnValue("CONFIG_KEY");
        spyOn(storageManager, "readJSON").and.callFake(
            (key) => {
                if(key == "CONFIG_KEY") {
                    let config: IMerkleTreeConfig = {
                        version: 1,
                        layerCount: 3
                    };
    
                    return Promise.resolve(config);
                }
                else {
                    return Promise.resolve(null);
                }
            }
        );

        // Mock merkle tree layers
        spyOn(MerkleTreeHelper, "getLayerStorageKeys").and.returnValue(["LAYER_1", "LAYER_2", "LAYER_3"]);

        let configRemoved = false;
        spyOn(storageManager, "remove").and.callFake(
            (key) => {
                if(key == "CONFIG_KEY")
                    configRemoved = true;

                return Promise.resolve();
            }
        );

        let wallet: ILocalWallet = <ILocalWallet>{};

        serializer.clean(wallet).then(
            () => {
                expect(configRemoved).toBeTruthy();
                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should not be called");
                done();
            }
        );
    });
});