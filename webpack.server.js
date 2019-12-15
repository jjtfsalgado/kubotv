const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: [
        './src/server/index.ts'
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.jsx' ]
    },
    plugins: [
        new NodemonPlugin(),
    ],
    target: 'node',
    output: {
        filename: "server.js",
        path: __dirname
    },
};