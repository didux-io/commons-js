import { MerkleTree } from "./MerkleTree";
import { MERKLE_TREE_VERSION } from "./MerkleTreeVersion";
import { IMerkleTreeConfig } from "./IMerkleTreeConfig";
import { MerkleTreeHelper } from "./MerkleTreeHelper";
import { EncryptionHelper } from "../keystore/EncryptionHelper";
import { IStorageManager } from "../storage/IStorageManager";
import { ILocalWallet } from "../wallet/ILocalWallet";

export class MerkleTreeSerializer {
    private encryptionHelper: EncryptionHelper;

    constructor(private storageManager: IStorageManager) {

    }

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
}