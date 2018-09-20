import { IThreadPool, ThreadPool } from "./ThreadPool";
import { LamportGeneratorThread, ILamportGeneratorThreadOutput, ILamportGeneratorThreadInput } from "./LamportGeneratorThread";
import { CryptoHelper } from "../crypto/CryptoHelper";
import { MerkleTree } from "./MerkleTree";
import { IPRNG } from "../random/IPRNG";
import { SHA1PRNG } from "../random/SHA1PRNG";

declare const safari: any;

export class MerkleTreeBuilder {
    private readonly KEYS_PER_JOB = 100;

    private cryptoHelper = new CryptoHelper();

    generate(privateKey: string, layerCount: number, isAndroid: boolean, isIos: boolean, progressUpdate?: (progress: number) => void): Promise<MerkleTree> {
        return this.generateLeafKeys(privateKey, layerCount, isAndroid, isIos, progressUpdate).then(
            (publicKeys) => {
                return new MerkleTree(this.generateLayers(publicKeys, layerCount));
            }
        );
    }

    generateLayers(publicKeys: string[], layerCount: number): string[][] {
        let layers: string[][] = [];

        // Add initial layer
        layers.push(publicKeys);

        for(let i = 1; i < layerCount; i++) {
            let previousLayer = layers[i - 1];

            let newLayer: string[] = [];

            for(let j = 0; j < previousLayer.length; j += 2) {
                let left = previousLayer[j];
                let right = previousLayer[j + 1];

                newLayer.push(this.cryptoHelper.sha256(left + right));
            }

            layers.push(newLayer);
        }

        return layers;
    }

    createThreadPool(): IThreadPool {
        return new ThreadPool();
    }

    createPRNG(seed): IPRNG {
        return new SHA1PRNG(seed);
    }

    generateLeafKeys(privateKey: string, layerCount: number, isAndroid: boolean, isIos:boolean, progressUpdate?: (progress: number) => void): Promise<string[]> {
        return new Promise((resolve, reject) => {
            let totalKeys = Math.pow(2, layerCount - 1);

            let scripts: string[];
            if(isAndroid) {
                // Android requires the scripts to be loaded as shown below.
                scripts = [
                    `file:///android_asset/www/assets/scripts/sjcl.js`,
                    `file:///android_asset/www/assets/scripts/SHA1PRNG.js`,
                    `file:///android_asset/www/assets/scripts/LamportGenerator.js`
                ];
            } else if (isIos) {
                // iOS requires the scripts to be loaded as shown below.
                scripts = [
                    `${ window.location.href.replace("/index.html", "") }/assets/scripts/sjcl.js`,
                    `${ window.location.href.replace("/index.html", "") }/assets/scripts/SHA1PRNG.js`,
                    `${ window.location.href.replace("/index.html", "") }/assets/scripts/LamportGenerator.js`
                ];
            } else if (window.location.protocol.includes("safari-extension:")) {
                // Safari requires the scripts to be loaded as shown below.
                scripts = [
                    `${ safari.extension.baseURI }assets/scripts/sjcl.js`,
                    `${ safari.extension.baseURI }assets/scripts/SHA1PRNG.js`,
                    `${ safari.extension.baseURI }assets/scripts/LamportGenerator.js`
                ];
            } else if (window.location.protocol.includes("extension")) {
                // Browser extensions requires the scripts to be loaded as shown below
                scripts = [
                    `${ window.location.protocol }//${ window.location.host }/www/assets/scripts/sjcl.js`,
                    `${ window.location.protocol }//${ window.location.host }/www/assets/scripts/SHA1PRNG.js`,
                    `${ window.location.protocol }//${ window.location.host }/www/assets/scripts/LamportGenerator.js`
                ];
            } else {
                // Web requires the scripts to be loaded as shown below.
                scripts = [
                    `${ window.location.protocol }//${ window.location.host }/assets/scripts/sjcl.js`,
                    `${ window.location.protocol }//${ window.location.host }/assets/scripts/SHA1PRNG.js`,
                    `${ window.location.protocol }//${ window.location.host }/assets/scripts/LamportGenerator.js`
                ];
            }

            // Create a thread pool
            let pool = this.createThreadPool();
            pool.run(LamportGeneratorThread, scripts);

            // Store job output here. Later we will concatenate it.
            let processedJobOutputs: ILamportGeneratorThreadOutput[] = [];

            pool.onJobDone((job, message: ILamportGeneratorThreadOutput) => {
                // Store job output without processing it any further at this point
                processedJobOutputs.push(message);

                totalJobsDone++;

                if(progressUpdate) {
                    // We only count to 99% because the last 1% is used
                    // to serialize the Merkle Tree.
                    progressUpdate((totalJobsDone / totalJobs) * 0.99);
                }
            });

            pool.onError((job, error) => {
                // A job failed, this means the entire Merkle Tree is worthless.
                // Abort and notify calling function about the failure...
                pool.killAll();

                reject(error);
            });

            pool.onFinished(() => {
                pool.killAll();

                // Sort job outputs so public keys are in order
                processedJobOutputs.sort((a, b) => a.startIndex - b.startIndex);

                // Concatenate
                let publicKeys = processedJobOutputs.reduce<string[]>(
                    (previous, current) => previous.concat(current.publicKeys),
                    []
                );

                resolve(publicKeys);
            });

            let totalJobs = Math.ceil(totalKeys / this.KEYS_PER_JOB);
            let totalJobsDone = 0;

            // Enqueue jobs for the thread pool
            let prng = this.createPRNG(privateKey);
            for(let i = 0; i < totalKeys; i += this.KEYS_PER_JOB) {
                // Determine how many keys are still left to be generated
                let keysThisIteration = Math.min(this.KEYS_PER_JOB, totalKeys - i);

                // Generate seeds
                let seeds: Int8Array[] = [];
                for(let j = 0; j < keysThisIteration; j++) {
                    let seed = prng.getRandomBytes(100);

                    seeds.push(seed);
                }

                // Prepare job input
                let jobInput: ILamportGeneratorThreadInput = {
                    startIndex: i,
                    seeds: seeds,
                    count: keysThisIteration
                };

                // Send to job queue
                pool.send(jobInput);
            }
        });
    }
}