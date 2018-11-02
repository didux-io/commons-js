import { ITransactionOutput } from "./ITransactionOutput";
import { FixedBigNumber } from "../big-number/FixedBigNumber";

export interface ITransaction {
    /**
     * The creation timestamp of this transaction.
     */
    timestamp: number;
    /**
     * The sender address.
     */
    inputAddress: string;
    /**
     * The transaction fee send with the transaction.
     */
    fee: FixedBigNumber;
    /**
     * The signature.
     */
    signatureData?: string;
    /**
     * The Merkle signature index used when signing.
     */
    signatureIndex?: number;
    /**
     * The hash of the transaction.
     */
    dataHash?: string;
    /**
     * The asset sent with this transaction.
     */
    assetId: string;
    /**
     * The total amount sent minus the fee.
     */
    inputAmount: FixedBigNumber;
    /**
     * A list of transaction outputs.
     */
    transactionOutputs: ITransactionOutput[];
    /**
     * Extra input data part of the transaction. This is assumed to be a hex string.
     */
    inputData?: string;
}