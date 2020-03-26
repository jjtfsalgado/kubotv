const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        './src/client/index.tsx'
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: "[local]___[hash:base64:5]"
                        }
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            }
        ]
    },
    devtool: 'eval',
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.jsx' ]
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './dist',
        hot: true,
        port: process.env.PORT || 5000
    },
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },
};
