const path = require("path");

module.exports = (env) => {
    env = env || {};
    let mode = env.MODE || "development";
    let watch = env.WATCH == "true";

    let module = {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    };
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
