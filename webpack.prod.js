const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CompressionPlugin()
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist'
    }
});