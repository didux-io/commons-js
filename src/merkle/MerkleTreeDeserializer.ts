import { MerkleTree } from "./MerkleTree";
import { IWallet } from "../../models/IWallet";
import { IKeyStoreService } from "../../services/key-store-service/key-store-service";
import { IKeyStore } from "../../models/IKeyStore";
import { IMerkleTreeConfig } from "./IMerkleTreeConfig";
import { Storage } from "@ionic/storage";
import { MerkleTreeHelper } from "./MerkleTreeHelper";

export class MerkleTreeDeserializer {
    fromDisk(wallet: IWallet, storage: Storage, keyStoreService: IKeyStoreService, password: string): Promise<MerkleTree> {
        // Retrieve the config
        return storage.get(
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
                            return storage.get(key).then(
                                (encryptedLayer: IKeyStore) => {
                                    if(!encryptedLayer)
                                        return Promise.reject("Missing layer: " + i);

                                    // Decrypt
                                    let decryptedLayer = keyStoreService.decryptKeyStore(encryptedLayer, password);
                                    if(!decryptedLayer)
                                        return Promise.reject("Could not decrypt Merkle Tree");

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