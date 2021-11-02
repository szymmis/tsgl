const path = require("path")

module.exports = {
    entry: "./src/index.ts",
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(ts)$/i,
                use: 'ts-loader',
                exclude: /node-modules/
            },
            {
                test: /\.(glsl)$/i,
                type: "asset/source"
            },
            {
                test: /\.(png)$/i,
                type: "asset/resource"
            },
        ]
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
        extensions: ['.ts', '.js']
    },
    output: {
        filename: "main.js",
        path: path.join(__dirname, "./dist")
    }
}