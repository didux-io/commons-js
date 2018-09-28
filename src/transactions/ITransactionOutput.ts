import { FixedBigNumber } from "../big-number/FixedBigNumber";

export interface ITransactionOutput {
    /**
     * The receiver address.
     */
    outputAddress: string;
    /**
     * The received amount.
     */
    outputAmount: FixedBigNumber;
}
