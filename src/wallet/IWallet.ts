export declare type WalletType = "local" | "hardware";

export interface IWallet {
    /**
     * Id of this wallet.
     */
    id: string;
    /**
     * Name of the wallet.
     */
    name: string;
    /**
    * The public key
    */
    publicKey: string;
    /**
     * The wallet type. Based on the type a USB connection prompt or a password promt could be shown
     * when it is time to sign a transaction.
     */
    type: WalletType;
    /**
     * Last time this wallet's transactions was updated.
     * 
     * This value can be used to query for new transactions which occured after this time.
     */
    lastUpdateTime: Date;
}
