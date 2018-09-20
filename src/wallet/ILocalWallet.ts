import { IWallet } from "./IWallet";
import { IKeyStore } from "../keystore/IKeyStore";

export interface ILocalWallet extends IWallet {
    type: "local";
    /**
     * The attached key store.
     */
    keyStore: IKeyStore;
    /**
     * The next signature index to use when signing a transaction.
     * 
     * Important: before signing a transaction always make sure to check the signature index returned by the API.
     * Otherwise you risk re-using a sigature index if this wallet is used on multiple devices.
     * 
     * Basic logic: if this signature index is higher than the API's use this signature index. Otherwise use the API signature index.
     */
    signatureIndex?: number;
}
