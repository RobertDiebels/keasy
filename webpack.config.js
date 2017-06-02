const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "keasy.js",
        publicPath: "/assets/",

        library: "Keasy",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                loader: "babel-loader",
                options: {
                    presets: ["env"]
                }
            }
        ],

    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        extensions: [".js", ".json", ".jsx", ".css"],
    },

    performance: {
        hints: "warning",
        maxAssetSize: 200000,
        maxEntrypointSize: 400000,
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },
    devtool: "source-map",
    context: __dirname,
    target: "web",
    stats: "errors-only",
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'
        },
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        historyApiFallback: true,
        hot: true,
        https: false,
        noInfo: true,
    },
    plugins: [
        new UglifyJSPlugin()
    ]
};
