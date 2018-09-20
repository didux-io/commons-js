import { IWallet } from "../../models/IWallet";

export class MerkleTreeHelper {
    private constructor() {}

    static getConfigStorageKey(wallet: IWallet): string {
        return `${ wallet.id }-config`; 
    }

    static getLayerStorageKeys(wallet: IWallet, layerCount: number): string[] {
        let layerKeys: string[] = []; 
     
        for(let i = 0; i < layerCount; i++) { 
            layerKeys.push(`${ wallet.id }-layer-${ i }`); 
        } 
            
        return layerKeys; 
    }
}