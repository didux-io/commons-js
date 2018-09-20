import { ITransaction } from "../../models/ITransaction";
import { CryptoHelper } from "../crypto/CryptoHelper";

export class TransactionHelper {
    private cryptoHelper = new CryptoHelper();

    /**
     * Converts the given transaction to a string. This string formatted transaction
     * can be used as the base for signing a transaction.
     * @param transaction 
     */
    transactionToString(transaction: ITransaction): string {
        return this.getHashableData(transaction) + ";" + transaction.dataHash;
    }

    /**
     * Returns the data, as a single string, which can be hashed into
     * the 'dataHash' property of the given transaction.
     * @param transaction 
     */
    getHashableData(transaction: ITransaction): string {
        let data = "";

        data += `${ transaction.timestamp };${ transaction.assetId };${ transaction.inputAddress };${ transaction.inputAmount.toBigIntegerString() };`;

        for(let output of transaction.transactionOutputs) {
            data += `;${ output.outputAddress };${ output.outputAmount.toBigIntegerString() }`;
        }

        return `${ data };${ transaction.fee.toBigIntegerString() }`;
    }

    /**
     * Gets the data hash for the given transaction.
     */
    getDataHash(transaction: ITransaction): string {
        return this.cryptoHelper.sha256Hex(this.getHashableData(transaction)).toUpperCase();
    }
}