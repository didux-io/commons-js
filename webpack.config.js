const path = require("path");

module.exports = (env) => {
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
            output: {
                libraryTarget: "window",
                library: "Smilo",
                filename: "smilo-web.js",
                path: path.resolve(__dirname, "dist")
            }
        },
        // Node
        {
            entry: "./src/index.ts",
            module: module,
            resolve: resolve,
            output: {
                libraryTarget: "var",
                library: "Smilo",
                filename: "smilo-node.js",
                path: path.resolve(__dirname, "dist")
            }
        }
    ]
}
