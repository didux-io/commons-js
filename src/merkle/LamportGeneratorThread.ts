export interface ILamportGeneratorThreadInput {
    startIndex: number,
    seeds: Int8Array[],
    count: number
}

export interface ILamportGeneratorThreadOutput {
    startIndex: number,
    publicKeys: string[]
}

// Placeholders. The actual content will be set by Webpack.
// These placeholders are just here to prevent Typescript from
// throwing syntax errors.
declare const LamportGeneratorCode: string;
declare const SHA1PRNGCode: string;
declare const ForgeCode: string;

export function LamportGeneratorThread(input: ILamportGeneratorThreadInput, done: (publicKeys: ILamportGeneratorThreadOutput) => void) {
    if(!this.initialized) {
        {
            // This is strange but we do this to trick forge into exporting
            // in our own custom defined module. Otherwise it might fail on
            // some platforms.
            let module = {
                exports: {}
            };
            let exports = {};

            ForgeCode;

            this["forge"] = module["exports"];
        }

        // SHA1PRNG and LamportGenerator will be inserted here.
        // Since these are not global libraries they must be assigned
        // to the global worker scope.
        this.SHA1PRNG = SHA1PRNGCode;
        this.LamportGenerator = LamportGeneratorCode;

        // Prevent script initialization to run twice.
        this.initialized = true;
    }

    let generator = new this.LamportGenerator(input.seeds, input.count);

    generator.fill();

    done(
        {
            startIndex: input.startIndex,
            publicKeys: generator.publicKeys
        }
    );
}

