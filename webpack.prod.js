const merge = require('webpack-merge');
const common = require('./webpack.dev.js');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CompressionPlugin()
    ],
    devtool: 'source-map'
});
