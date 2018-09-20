import { LamportGeneratorThread, ILamportGeneratorThreadInput } from "./LamportGeneratorThread";
import { LamportGenerator } from "./LamportGenerator";

describe("LamportGeneratorThread", () => {
    it("call the callback function", () => {
        let input: ILamportGeneratorThreadInput = {
            startIndex: 1337,
            seeds: [
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]),
                new Int8Array([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ])
            ],
            count: 10
        };

        // Mock the WebWorker global scope
        let webWorkerScope = {
            LamportGenerator: LamportGenerator
        }

        let callbackSpy = jasmine.createSpy("callback", () => {});

        LamportGeneratorThread.call(webWorkerScope, input, callbackSpy);

        expect(callbackSpy).toHaveBeenCalled();
    });
});