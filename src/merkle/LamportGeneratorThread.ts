import { LamportGenerator } from "./LamportGenerator";

export interface ILamportGeneratorThreadInput {
    startIndex: number,
    seeds: Int8Array[],
    count: number
}

export interface ILamportGeneratorThreadOutput {
    startIndex: number,
    publicKeys: string[]
}

export function LamportGeneratorThread(input: ILamportGeneratorThreadInput, done: (publicKeys: ILamportGeneratorThreadOutput) => void) {
    // Create the LamportGenerator. We use this unusual syntax because otherwise UglifyJS will uglify this
    // piece of code causing it to not call the correct constructor. This is a bit hacky but no better solution
    // (including messing with the UglifyJS config) so far presented a better method.
    let lamportGenerator = <LamportGenerator>(new this["LamportGenerator"](input.seeds, input.count));

    lamportGenerator.fill();

    done(
        {
            startIndex: input.startIndex,
            publicKeys: lamportGenerator.publicKeys
        }
    );
}

