const path = require("path")
const fs = require("fs")

function getTypeScriptConfigPaths() {
    const json = fs.readFileSync(path.resolve(__dirname, "tsconfig.json"), "utf8")
    const tsconfig = JSON.parse(json.replace(/\/\/.+$|\/\*.*\*\//gm, ""))
    return Object.fromEntries(Object.entries(tsconfig?.compilerOptions?.paths).map(([key, value]) => {
        return [key.replace(/\/\*/g, ""), value.map(val => path.resolve(__dirname, val.replace(/\/\*/g, "")))]
    }))
}

module.exports = {
    entry: "./src/main.ts",
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(ts)$/i,
                use: 'ts-loader',
                exclude: /node-modules/
            },
            {
                test: /\.(json)$/i,
                type: "asset/source"
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
        alias: getTypeScriptConfigPaths(),
        extensions: ['.ts', '.js']
    },
    output: {
        filename: "main.js",
        path: path.join(__dirname, "./dist")
    }
}