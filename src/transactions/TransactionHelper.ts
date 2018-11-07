import { CryptoHelper } from "../crypto/CryptoHelper";
import { ITransaction } from "./ITransaction";

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

        return `${ data };${ transaction.fee.toBigIntegerString() };${ transaction.inputData || ""}`;
    }

    /**
     * Gets the data hash for the given transaction.
     */
    getDataHash(transaction: ITransaction): string {
        return this.cryptoHelper.sha256Hex(this.getHashableData(transaction)).toUpperCase();
    }

    /**
     * Formats the input data so it is rewritten as a hex string.
     */
    formatInputData(inputData: string): string {
        let result = "";

        for(let i = 0; i < inputData.length; i++) {
            let charCode = inputData.charCodeAt(i);

            result += charCode.toString(16);
        }

        return result;
    }
}