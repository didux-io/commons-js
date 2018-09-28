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

    return [
        // Web
        {
            entry: "./src/index.ts",
            module: module,
            resolve: resolve,
            mode: mode,
            stats: "errors-only",
            plugins: [
                new CompileInfoPlugin("Web", () => {
                    // Copy output to example folders
                    fs.copySync("./dist/smilo-web.js", "./examples/web/smilo-web.js");
                })
            ],
            output: {
                libraryTarget: "window",
                library: "Smilo",
                filename: "smilo-web.js",
                path: path.resolve(__dirname, "dist")
            },
            watch: watch
        },
        // Node
        {
            entry: "./src/index.ts",
            module: module,
            resolve: resolve,
            mode: mode,
            stats: "errors-only",
            plugins: [
                new CompileInfoPlugin("Node", () => {
                    // Copy output to example folders
                    fs.copySync("./dist/smilo-node.js", "./examples/node/smilo-node.js");
                })
            ],
            output: {
                libraryTarget: "var",
                library: "Smilo",
                filename: "smilo-node.js",
                path: path.resolve(__dirname, "dist")
            },
            watch: watch
        }
    ]
}
