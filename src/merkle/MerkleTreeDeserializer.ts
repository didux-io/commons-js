import { MerkleTree } from "./MerkleTree";
import { IMerkleTreeConfig } from "./IMerkleTreeConfig";
import { MerkleTreeHelper } from "./MerkleTreeHelper";
import { IKeyStore } from "../keystore/IKeyStore";
import { IStorageManager } from "../storage/IStorageManager";
import { EncryptionHelper } from "../keystore/EncryptionHelper";
import { ILocalWallet } from "../wallet/ILocalWallet";

export class MerkleTreeDeserializer {
    constructor(private storageManager: IStorageManager,
                private encryptionHelper: EncryptionHelper = new EncryptionHelper()) {

    }

    fromDisk(wallet: ILocalWallet, password: string): Promise<MerkleTree> {
        // Retrieve the config
        return this.storageManager.readJSON<IMerkleTreeConfig>(
            MerkleTreeHelper.getConfigStorageKey(wallet)
        ).then(
            (config: IMerkleTreeConfig) => {
                if(!config)
                    return Promise.reject("MerkleTree not found on disk");

                let layerCount = config.layerCount;

                let readLayerPromise = Promise.resolve();
                let layers: string[][] = [];
                let layerKeys: string[] = MerkleTreeHelper.getLayerStorageKeys(wallet, layerCount);
                for(let i = 0; i < layerCount; i++) {
                    readLayerPromise = readLayerPromise.then(
                        () => {
                            let key = layerKeys[i];
                            return this.storageManager.readJSON<IKeyStore>(key).then(
                                (encryptedLayer: IKeyStore) => {
                                    if(!encryptedLayer)
                                        return Promise.reject("Missing layer: " + i);

                                    // Decrypt
                                    let decryptedLayer = this.encryptionHelper.decryptKeyStore(encryptedLayer, password);
                                    if(!decryptedLayer)
                                        return Promise.reject("Could not decrypt Merkle Tree");

                                    // Parse the decrypted JSON string
                                    let layer = JSON.parse(decryptedLayer);

                                    layers.push(layer);
                                }
                            );
                        }
                    );
                }

                return readLayerPromise.then(
                    () => new MerkleTree(layers)
                );
            }
        );
    }
}