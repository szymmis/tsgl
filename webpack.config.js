const path = require("path")
const fs = require("fs")

const CopyPlugin = require("copy-webpack-plugin");

function getTypeScriptConfigPaths() {
    const json = fs.readFileSync(path.resolve(__dirname, "tsconfig.json"), "utf8")
    const tsconfig = JSON.parse(json.replace(/\/\/.+$|\/\*.*\*\//gm, ""))
    return Object.fromEntries(Object.entries(tsconfig?.compilerOptions?.paths).map(([key, value]) => {
        return [key.replace(/\/\*/g, ""), value.map(val => path.resolve(__dirname, val.replace(/\/\*/g, "")))]
    }))
}

module.exports = {
    entry: "./src/index.ts",
    // devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: 'ts-loader',
                exclude: /node-modules/
            },
            {
                test: /\.(json|glsl)$/i,
                type: "asset/source"
            },
            {
                test: /\.(png)$/i,
                type: "asset/inline"
            },
        ]
    },
    resolve: {
        alias: getTypeScriptConfigPaths(),
        extensions: ['.ts', '.js']
    },
    output: {
        filename: "index.js",
        path: path.join(__dirname, "./dist"),
        library: {
            type: "umd",
            name: "TSGL"
        },
        globalObject: "this",
        publicPath: ""
    },
    plugins: [
        new CopyPlugin({ patterns: [{ from: "./src/ts/index.d.ts" }] })
    ]
}