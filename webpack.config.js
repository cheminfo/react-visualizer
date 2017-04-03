'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
    entry: './test/app.js',
    output: {
        path: __dirname + '/test',
        publicPath: '/',
        filename: 'built.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './test/'
    }
};
