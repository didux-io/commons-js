const webpack = require("webpack");
const path = require("path");
const fs = require("fs-extra");
const CompileInfoPlugin = require("./webpack-plugins/CompileInfoPlugin");
const DtsBundlePlugin = require("./webpack-plugins/DtsBundlePlugin");
const execSync = require("child_process").execSync;

module.exports = (env) => {
    env = env || {};
    let mode = env.MODE || "development";
    let watch = env.WATCH == "true";

    // Define shared module definition
    let module = {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    };

    // Define shared resolve definition
    let resolve = {
        extensions: ['.tsx', '.ts', '.js']
    };

    // Make sure all node_modules are marked as external
    // for node builds. This is needed because otherwise
    // they would be included in the single file output.
    // This greatly confuses node libraries...
    let nodeExternals = {};
    fs.readdirSync('node_modules')
        .filter(function (x) {
            return ['.bin'].indexOf(x) === -1;
        })
        .forEach(function (mod) {
            nodeExternals[mod] = 'commonjs ' + mod;
        }
    );

    // This part sucks!!!
    // Basically: we want the web worker to have access to the required library
    // without having to import them. Webpack does not allow us to easily do this.
    // Instead we use the DefinePlugin to 'inject' the source in the web worker function.
    // This way no extra scripts need to be imported and the user can use a single library file :)
    // However... this comes with a big downside:
    // Changing the source of LamportGenerator or SHA1PRNG does NOT cause Webpack to update
    // the sources in the web worker function. Effectively you need to stop the watch and restart webpack...
    execSync("./scripts/prepare-web-worker.sh");
    let forgeSourceCode = fs.readFileSync("./node_modules/node-forge/dist/forge.min.js").toString();
    let lamportGeneratorSourceCode = fs.readFileSync("./build/merkle/LamportGenerator.stripped.js").toString();
    let sha1PrngSourceCode = fs.readFileSync("./build/random/SHA1PRNG.stripped.js").toString();

    return [
        // Web
        {
            entry: "./src/index.ts",
            target: "web",
            module: module,
            resolve: resolve,
            mode: mode,
            stats: "errors-only",
            devtool: mode == "development" ? "inline-source-map" : "source-map",
            plugins: [
                new CompileInfoPlugin("Web", () => {
                    // Copy output to example folders
                    fs.copySync("./dist/web/smilo-web.js", "./examples/web/smilo-web.js");
                }),
                new webpack.DefinePlugin({
                    "process.env": {
                        TARGET: "'web'"
                    },
                    LamportGeneratorCode: lamportGeneratorSourceCode,
                    SHA1PRNGCode: sha1PrngSourceCode,
                    ForgeCode: forgeSourceCode
                }),
                new DtsBundlePlugin("smilo-commons-js-web", "../dist/web/smilo-web.d.ts")
            ],
            output: {
                libraryTarget: "window",
                library: "Smilo",
                filename: "smilo-web.js",
                path: path.resolve(__dirname, "dist/web")
            },
            watch: watch
        },
        // Node
        {
            entry: "./src/index.ts",
            target: "node",
            module: module,
            resolve: resolve,
            mode: mode,
            stats: "errors-only",
            devtool: mode == "development" ? "inline-source-map" : "source-map",
            plugins: [
                new DtsBundlePlugin("smilo-commons-js-node", "../dist/node/smilo-node.d.ts"),
                new CompileInfoPlugin("Node", () => {
                    // Copy output to example folders
                    fs.copySync("./dist/node/smilo-node.js", "./examples/node/smilo-node.js");
                }),
                new webpack.DefinePlugin({
                    "process.env": {
                        TARGET: "'node'"
                    },
                    LamportGeneratorCode: lamportGeneratorSourceCode,
                    SHA1PRNGCode: sha1PrngSourceCode,
                    ForgeCode: forgeSourceCode
                })
            ],
            output: {
                libraryTarget: "commonjs",
                filename: "smilo-node.js",
                path: path.resolve(__dirname, "dist/node")
            },
            watch: watch,
            externals: nodeExternals
        }
    ]
}
