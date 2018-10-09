import { MerkleTree } from "./MerkleTree";
import { MERKLE_TREE_VERSION } from "./MerkleTreeVersion";
import { IMerkleTreeConfig } from "./IMerkleTreeConfig";
import { MerkleTreeHelper } from "./MerkleTreeHelper";
import { EncryptionHelper } from "../keystore/EncryptionHelper";
import { IStorageManager } from "../storage/IStorageManager";
import { ILocalWallet } from "../wallet/ILocalWallet";
import { IKeyStore } from "../keystore/IKeyStore";

export class MerkleTreeSerializer {
    constructor(private storageManager: IStorageManager,
                private encryptionHelper: EncryptionHelper = new EncryptionHelper()) {

    }

    /**
     * Serializes the given Merkle Tree for the given wallet using the pre defined storage manager.
     * 
     * The given password will be used to fully encrypt the Merkle Tree.
     */
    serialize(merkleTree: MerkleTree, wallet: ILocalWallet, password: string): Promise<void> {
        let promises: Promise<void>[] = [];

        let config: IMerkleTreeConfig = {
            layerCount: merkleTree.layers.length,
            version: MERKLE_TREE_VERSION
        };

        promises.push(
            this.storageManager.writeJSON(MerkleTreeHelper.getConfigStorageKey(wallet), config)
        );

        let layerStorageKeys = MerkleTreeHelper.getLayerStorageKeys(wallet, merkleTree.layers.length);
        for(let i = 0; i < merkleTree.layers.length; i++) {
            let layer = merkleTree.layers[i];

            let encrypted = this.encryptionHelper.createKeyStore(
                JSON.stringify(layer),
                password
            );

            promises.push(
                this.storageManager.writeJSON(layerStorageKeys[i], encrypted)
            );
        }

        return Promise.all(promises).then<void>();
    }

    /**
     * Deserializes the Merkle Tree for the given wallet using the given password.
     */
    deserialize(wallet: ILocalWallet, password: string): Promise<MerkleTree> {
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

    /**
     * Cleans the stored Merkle Tree for the given wallet using the pre defined storage manager.
     */
    clean(wallet: ILocalWallet) {
        // Remove from disk
        return this.storageManager.readJSON<IMerkleTreeConfig>(
            MerkleTreeHelper.getConfigStorageKey(wallet)
        ).then(
            (config) => {
                if(!config)
                    return Promise.resolve();

                let layerKeys = MerkleTreeHelper.getLayerStorageKeys(wallet, config.layerCount);

                let promises: Promise<void>[] = [];

                for(let layerKey of layerKeys) {
                    promises.push(
                        this.storageManager.remove(layerKey).then(
                            () => {
                                // Layer removed
                            },
                            (error) => {
                                // Failed to remove layer.
                                // We silently ignore this error...
                                console.error(error);
                            }
                        )
                    );
                }

                // Finaly remove the config
                promises.push(
                    this.storageManager.remove(MerkleTreeHelper.getConfigStorageKey(wallet))
                );

                return Promise.all(promises).then<void>();
            }
        );
    }
}