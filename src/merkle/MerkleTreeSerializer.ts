import { MerkleTree } from "./MerkleTree";
import { IKeyStoreService } from "../../services/key-store-service/key-store-service";
import { MERKLE_TREE_VERSION } from "./MerkleTreeVersion";
import { IMerkleTreeConfig } from "./IMerkleTreeConfig";
import { ILocalWallet } from "../../models/ILocalWallet";
import { Storage } from "@ionic/storage";
import { MerkleTreeHelper } from "./MerkleTreeHelper";

export class MerkleTreeSerializer {
    serialize(merkleTree: MerkleTree, wallet: ILocalWallet, storage: Storage, keyStoreService: IKeyStoreService, password: string): Promise<void> {
        let promises: Promise<void>[] = [];

        let config: IMerkleTreeConfig = {
            layerCount: merkleTree.layers.length,
            version: MERKLE_TREE_VERSION
        };

        promises.push(
            storage.set(MerkleTreeHelper.getConfigStorageKey(wallet), config)
        );

        let layerStorageKeys = MerkleTreeHelper.getLayerStorageKeys(wallet, merkleTree.layers.length);
        for(let i = 0; i < merkleTree.layers.length; i++) {
            let layer = merkleTree.layers[i];

            let encrypted = keyStoreService.createKeyStore(
                JSON.stringify(layer),
                password
            );

            promises.push(
                storage.set(layerStorageKeys[i], encrypted)
            );
        }

        return Promise.all(promises).then<void>();
    }
}