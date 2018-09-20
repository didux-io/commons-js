import { MerkleTree } from "./MerkleTree";
import { Platform } from "ionic-angular/platform/platform";
import { MockKeyStoreService } from "../../../test-config/mocks/MockKeyStoreService";
import { Storage } from "@ionic/storage";
import { IKeyStoreService } from "../../services/key-store-service/key-store-service";

describe("MerkleTree", () => {
    let platformService: Platform;
    let storageService: Storage;
    let keyStoreService: IKeyStoreService;

    function generateDummyMerkleTree(layerCount: Number): MerkleTree {
        let layers: string[][] = [];

        for(let i = 0; i < layerCount; i++) {
            layers.push([]);
        }

        // Set root key
        layers[layers.length - 1][0] = "KEY";

        return new (<any>MerkleTree)(layers);
    }

    beforeEach(() => {
        platformService = new Platform();
        storageService = new Storage(null);
        keyStoreService = new MockKeyStoreService();
    });
});