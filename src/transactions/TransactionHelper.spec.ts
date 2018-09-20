import { TransactionHelper } from "./TransactionHelper";
import { ITransaction } from "../../models/ITransaction";
import { FixedBigNumber } from "../big-number/FixedBigNumber";

interface ITransactionHelperToStringTestVector {
    transaction: ITransaction;
    expectedOutput: string;
}

interface ITransactionHelperHashTestVector {
    /**
     * The transaction minus signature and hashed data
     */
    transaction: ITransaction;
    /**
     * The expected data before hashing
     */
    expectedHashableData: string;
    /**
     * The expected hashed data
     */
    expectedDataHash: string;
}

describe("TransactionHelper", () => {
    let helper: TransactionHelper;

    let toStringTestVectors: ITransactionHelperToStringTestVector[] = [
        {
            transaction: {
                timestamp: 1000,
                inputAddress: "inputAddress",
                fee: new FixedBigNumber(10, 0),
                assetId: "assetId",
                inputAmount: new FixedBigNumber(100, 0),
                dataHash: "hash",
                transactionOutputs: [
                    {
                        outputAddress: "outputAddress1",
                        outputAmount: new FixedBigNumber(100, 0)
                    }
                ]
            },
            expectedOutput: `1000;assetId;inputAddress;100;;outputAddress1;100;10;hash`
        },
        {
            transaction: {
                timestamp: 5000,
                inputAddress: "otherInputAddress",
                fee: new FixedBigNumber(10000, 0),
                assetId: "someAssetId",
                dataHash: "hash",
                inputAmount: new FixedBigNumber(1000000, 0),
                transactionOutputs: [
                    {
                        outputAddress: "otherOutputAddress1",
                        outputAmount: new FixedBigNumber(1000000, 0)
                    }
                ]
            },
            expectedOutput: `5000;someAssetId;otherInputAddress;1000000;;otherOutputAddress1;1000000;10000;hash`
        }
    ];

    let hashTestVector: ITransactionHelperHashTestVector[] = [
        {
            transaction: {
                timestamp: 1000,
                inputAddress: "inputAddress",
                fee: new FixedBigNumber(10, 0),
                assetId: "assetId",
                inputAmount: new FixedBigNumber(100, 0),
                transactionOutputs: [
                    {
                        outputAddress: "outputAddress1",
                        outputAmount: new FixedBigNumber(100, 0)
                    }
                ]
            },
            expectedHashableData: "1000;assetId;inputAddress;100;;outputAddress1;100;10",
            expectedDataHash: "BBFFA66F2B28D954DB2D8A37C55EC627F8014D2C1A435E88C9C86204558EDD93"
        }
    ];

    beforeEach(() => {
        helper = new TransactionHelper();
    })
    
    it("should serialize a transaction correctly", () => {
        for(let testVector of toStringTestVectors) {
            expect(helper.transactionToString(testVector.transaction)).toEqual(testVector.expectedOutput);
        }
    });

    it("should return the correct hashable data", () => {
        for(let testVector of hashTestVector) {
            let hashableData = helper.getHashableData(testVector.transaction);

            expect(hashableData).toBe(testVector.expectedHashableData);
        }
    });

    it("should return the correct data hash", () => {
        for(let testVector of hashTestVector) {
            let dataHash = helper.getDataHash(testVector.transaction);

            expect(dataHash).toBe(testVector.expectedDataHash);
        }
    });
});