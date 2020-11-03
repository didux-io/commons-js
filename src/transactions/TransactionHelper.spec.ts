import { TransactionHelper } from "./TransactionHelper";
import { FixedBigNumber } from "../big-number/FixedBigNumber";
import { ITransaction } from "./ITransaction";

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
            expectedOutput: `1000;assetId;inputAddress;100;;outputAddress1;100;10;;hash`
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
                ],
                inputData: "INPUT_DATA"
            },
            expectedOutput: `5000;someAssetId;otherInputAddress;1000000;;otherOutputAddress1;1000000;10000;INPUT_DATA;hash`
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
            expectedHashableData: "1000;assetId;inputAddress;100;;outputAddress1;100;10;",
            expectedDataHash: "C2349D948112AEEA93FC80103A64C65E9397615ACE48AB2A57A171143CAEADB3"
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