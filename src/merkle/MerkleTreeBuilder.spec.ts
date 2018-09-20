import { MerkleTreeBuilder } from "./MerkleTreeBuilder";
import { MerkleTree } from "./MerkleTree";
import { MockThreadPool } from "../../../test-config/mocks/MockThreadPool";
import { SeededRandom } from "../random/SeededRandom";
import { ILamportGeneratorThreadInput, ILamportGeneratorThreadOutput, LamportGeneratorThread } from "./LamportGeneratorThread";
import { CryptoHelper } from "../crypto/CryptoHelper";
import { ThreadPool } from "./ThreadPool";

describe("MerkleTreeBuilder", () => {
    let builder: MerkleTreeBuilder;
    let cryptoHelper: CryptoHelper;

    beforeEach(() => {
        builder = new MerkleTreeBuilder();
        cryptoHelper = new CryptoHelper();
    })

    it("should generate the Merkle Tree correctly", (done) => {
        let layers = [];

        spyOn(builder, "generateLeafKeys").and.returnValue(Promise.resolve(["1", "2", "3", "4"]));
        spyOn(builder, "generateLayers").and.returnValue(layers);

        builder.generate("PRIVATE_KEY", 2, true, true).then(
            (merkleTree) => {
                expect(merkleTree instanceof MerkleTree).toBeTruthy();
                expect(merkleTree.layers).toBe(layers);

                done();
            },
            (error) => {
                expect(true).toBeFalsy("Promise reject should never be called");

                done();
            }
        );
    });

    it("should generate the Merkle Tree layers correctly", () => {
        // Wrapper to make calling sha256 on Merkle Tree more pretty.
        function sha256(data: string): string {
            return cryptoHelper.sha256(data);
        }

        // Input public keys
        let publicKeys: string[] = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8"
        ];

        // Manually construct the layers
        let expectedOutput: string[][] = [
            ["1", "2", "3", "4", "5", "6", "7", "8"]
        ];
        expectedOutput.push([
            sha256(expectedOutput[0][0] + expectedOutput[0][1]),
            sha256(expectedOutput[0][2] + expectedOutput[0][3]),
            sha256(expectedOutput[0][4] + expectedOutput[0][5]),
            sha256(expectedOutput[0][6] + expectedOutput[0][7])
        ]);
        expectedOutput.push([
            sha256(expectedOutput[1][0] + expectedOutput[1][1]),
            sha256(expectedOutput[1][2] + expectedOutput[1][3])
        ]);
        expectedOutput.push([
            sha256(expectedOutput[2][0] + expectedOutput[2][1])
        ]);

        let output = builder.generateLayers(publicKeys, 4);
        expect(output).toEqual(expectedOutput);
    });

    it("should generate the Merkle Tree leaf nodes correctly", (done) => {
        let pool = new MockThreadPool();

        // Spy on the method which creates a thread pool and return our mocked version.
        spyOn(builder, "createThreadPool").and.returnValue(pool);

        // Mock the random number generator
        spyOn(builder, "createPRNG").and.callFake((seed) => {
            let prng = new SeededRandom(seed);

            spyOn(prng, "getRandomBytes").and.callFake((count) => {
                let bytes: number[] = [];

                for(let i = 0; i < count; i++) {
                    bytes.push(10);
                }

                return new Uint8Array(bytes);
            });

            return prng;
        });

        let jobInputs: ILamportGeneratorThreadInput[] = [];
        spyOn(pool, "send").and.callFake((job: ILamportGeneratorThreadInput) => {
            // We should never receive more than three jobs.
            // This is because each job has 100 keys and we need 256 keys.
            expect(jobInputs.length).toBeLessThan(3, "Too many jobs received");

            expect(pool.poolIsKilled).toBeFalsy("Pool should not be killed before all jobs are completed");

            // Store job input for later validation
            jobInputs.push(job);

            // Generate some public keys
            let publicKeys: string[] = [];
            for(let i = 0; i < job.count; i++) {
                publicKeys.push((i + job.startIndex).toString());
            }

            let output: ILamportGeneratorThreadOutput = {
                startIndex: job.startIndex,
                publicKeys: publicKeys
            };

            // Simulate job completion
            pool.notifyJobDoneListener({}, output);

            // All jobs completed?
            if(jobInputs.length == 3) {
                pool.notifyFinishedListener();
            }
        });

        builder.generateLeafKeys("PRIVATE_KEY", 9, true, false).then(
            (publicKeys) => {
                let expectedPublicKeys: string[] = [];
                for(let i = 0; i < 256; i++) {
                    expectedPublicKeys.push(i.toString());
                }

                expect(publicKeys).toEqual(expectedPublicKeys);

                expect(pool.poolIsKilled).toBeTruthy("Thread pool should be terminated");

                done();
            },
            (error) => {
                expect(true).toBe(false, "Promise reject should never be called: " + (error.message || error.toString()));
            }
        );
    });

    it("should handle errors when generating the Merkle Tree leaf nodes correctly", (done) => {
        let pool = new MockThreadPool();

        // Spy on the method which creates a thread pool and return our mocked version.
        spyOn(builder, "createThreadPool").and.returnValue(pool);

        // Mock the random number generator
        spyOn(builder, "createPRNG").and.callFake((seed) => {
            let prng = new SeededRandom(seed);

            spyOn(prng, "getRandomBytes").and.callFake((count) => {
                let bytes: number[] = [];

                for(let i = 0; i < count; i++) {
                    bytes.push(10);
                }

                return new Uint8Array(bytes);
            });

            return prng;
        });

        let jobInputs: ILamportGeneratorThreadInput[] = [];
        spyOn(pool, "send").and.callFake((job: ILamportGeneratorThreadInput) => {
            // Oh dear something went wrong!
            pool.notifyErrorListeners({}, "Some error");
        });

        builder.generateLeafKeys("PRIVATE_KEY", 9, true, false).then(
            (publicKeys) => {
                expect(true).toBeFalsy("Promise resolve should never be called");

                done();
            },
            (error) => {
                expect(error).toBe("Some error");
                expect(pool.poolIsKilled).toBeTruthy("Thread pool should be terminated");

                done();
            }
        );
    });

    it("should import the correct scripts on Android platforms", (done) => {
        let pool = new MockThreadPool();

        // Call through to mocked ThreadPool
        spyOn(pool, "run").and.callThrough();

        // Spy on the method which creates a thread pool and return our mocked version.
        spyOn(builder, "createThreadPool").and.returnValue(pool);

        spyOn(pool, "send").and.callFake((job: ILamportGeneratorThreadInput) => {
            pool.notifyErrorListeners(null, "this is meant to fail");
        });

        builder.generateLeafKeys("PRIVATE_KEY", 9, true, false).then(
            (publicKeys) => {
                expect(true).toBe(false, "Promise resolve should never be called");

                done();
            },
            (error) => {
                // Make sure the failure was triggered by us
                expect(error).toBe("this is meant to fail");

                expect(pool.run).toHaveBeenCalledWith(
                    LamportGeneratorThread,
                    [
                        `file:///android_asset/www/assets/scripts/sjcl.js`,
                        `file:///android_asset/www/assets/scripts/SHA1PRNG.js`,
                        `file:///android_asset/www/assets/scripts/LamportGenerator.js`
                    ]
                );

                done();
            }
        );
    });

    it("should import the correct scripts on non-Android platforms", (done) => {
        let pool = new MockThreadPool();

        // Call through to mocked ThreadPool
        spyOn(pool, "run").and.callThrough();

        // Spy on the method which creates a thread pool and return our mocked version.
        spyOn(builder, "createThreadPool").and.returnValue(pool);

        spyOn(pool, "send").and.callFake((job: ILamportGeneratorThreadInput) => {
            pool.notifyErrorListeners(null, "this is meant to fail");
        });

        builder.generateLeafKeys("PRIVATE_KEY", 9, false, false).then(
            (publicKeys) => {
                expect(true).toBe(false, "Promise resolve should never be called");

                done();
            },
            (error) => {
                // Make sure the failure was triggered by us
                expect(error).toBe("this is meant to fail");

                expect(pool.run).toHaveBeenCalledWith(
                    LamportGeneratorThread,
                    [
                        `${ window.location.protocol }//${ window.location.host }/assets/scripts/sjcl.js`,
                        `${ window.location.protocol }//${ window.location.host }/assets/scripts/SHA1PRNG.js`,
                        `${ window.location.protocol }//${ window.location.host }/assets/scripts/LamportGenerator.js`
                    ]
                );

                done();
            }
        );
    });

    it("should call the progress listener and in this case instantly return 0.99", (done) => {
        let pool = new MockThreadPool();
        spyOn(builder, "createThreadPool").and.returnValue(pool);

        spyOn(pool, "send").and.callFake((job: ILamportGeneratorThreadInput) => {
            pool.notifyJobDoneListener({}, "");
            pool.notifyFinishedListener();
        });

        builder.generateLeafKeys("PRIVATE_KEY", 2, true, true, (e) => {
            expect(e).toBe(0.99);
            done();
        });
    });

    it("should return an object of class ThreadPool", () => {
        expect(builder.createThreadPool() instanceof ThreadPool).toBeTruthy();
    });
});