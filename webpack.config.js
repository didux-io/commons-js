const webpack = require("webpack");
const path = require("path");
const fs = require("fs-extra");
const CompileInfoPlugin = require("./webpack-plugins/CompileInfoPlugin");

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

    let forgeSourceCode = fs.readFileSync("./node_modules/node-forge/dist/forge.min.js").toString();

    return [
        // Web
        {
            entry: "./src/index.ts",
            target: "web",
            module: module,
            resolve: resolve,
            mode: mode,
            stats: "errors-only",
            plugins: [
                new CompileInfoPlugin("Web", () => {
                    // Copy output to example folders
                    fs.copySync("./dist/smilo-web.js", "./examples/web/smilo-web.js");
                }),
                new webpack.DefinePlugin({
                    "process.env": {
                        TARGET: "'web'"
                    }
                })
            ],
            output: {
                libraryTarget: "window",
                library: "Smilo",
                filename: "smilo-web.js",
                path: path.resolve(__dirname, "dist")
            },
            watch: watch,
            externals: {
                "./LamportGeneratorThread": "LamportGeneratorThread"
            }
        },
        // Node
        {
            entry: "./src/index.ts",
            target: "node",
            module: module,
            resolve: resolve,
            mode: mode,
            stats: "errors-only",
            plugins: [
                new CompileInfoPlugin("Node", () => {
                    // Copy output to example folders
                    fs.copySync("./dist/smilo-node.js", "./examples/node/smilo-node.js");
                }),
                new webpack.DefinePlugin({
                    "process.env": {
                        TARGET: "'node'"
                    }
                })
            ],
            output: {
                libraryTarget: "commonjs",
                filename: "smilo-node.js",
                path: path.resolve(__dirname, "dist")
            },
            watch: watch,
            externals: nodeExternals
        },
        // Worker for web
        {
            entry: "./src/merkle/LamportGeneratorThread.ts",
            target: "webworker",
            module: module,
            resolve: resolve,
            mode: mode,
            stats: "errors-only",
            plugins: [
                new CompileInfoPlugin("WebWorker", () => {
                    // Copy output to example folders
                    fs.copySync("./dist/smilo-web-worker.js", "./examples/web/smilo-web-worker.js");
                }),
                new webpack.DefinePlugin({
                    "process.env": {
                        TARGET: "'web'"
                    },
                    LamportGeneratorCode: "class LamportGenerator{}",
                    SHA1PRNGCode: "class SHA1PRNG{}",
                    ForgeCode: forgeSourceCode
                })
            ],
            output: {
                libraryTarget: "window",
                library: "LamportGeneratorThread",
                filename: "smilo-web-worker.js",
                path: path.resolve(__dirname, "dist")
            },
            watch: watch
        }
    ]
}
