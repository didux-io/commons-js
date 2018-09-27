const path = require("path");

module.exports = (env) => {
    return [
        // Web
        {
            entry: "./build/index.js",
            output: {
                libraryTarget: "window",
                library: "Smilo",
                filename: "smilo-web.js",
                path: path.resolve(__dirname, "dist")
            }
        },
        // Node
        {
            entry: "./build/index.js",
            output: {
                libraryTarget: "var",
                library: "Smilo",
                filename: "smilo-node.js",
                path: path.resolve(__dirname, "dist")
            }
        }
    ]
}
