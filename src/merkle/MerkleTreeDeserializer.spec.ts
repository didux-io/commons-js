import { MerkleTreeDeserializer } from "./MerkleTreeDeserializer";
import { MerkleTreeHelper } from "./MerkleTreeHelper";
import { MerkleTree } from "./MerkleTree";
import { IStorageManager } from "../storage/IStorageManager";
import { MockStorageManager } from "../../mocks/MockStorageManager";
import { EncryptionHelper } from "../keystore/EncryptionHelper";

describe("MerkleTreeDeserializer", () => {
    let deserializer: MerkleTreeDeserializer;
    let storageManager: IStorageManager;
    let encryptionHelper: EncryptionHelper;

    beforeEach(() => {
        storageManager = new MockStorageManager();
        encryptionHelper = new EncryptionHelper();

        deserializer = new MerkleTreeDeserializer(storageManager, encryptionHelper);
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

        deserializer.fromDisk(<any>{}, "pass123").then(
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

        deserializer.fromDisk(<any>{}, "wrong_password").then(
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

        deserializer.fromDisk(<any>{}, "pass123").then(
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

        deserializer.fromDisk(<any>{}, "pass123").then(
            (merkleTree) => {
                expect(true).toBeFalsy("Promise resolve should never be called");

                done();
            },
            (error) => {
                expect(error).toBe("MerkleTree not found on disk");

                done();
            }
        );
    })
});