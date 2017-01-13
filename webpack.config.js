"use strict";


const {
    resolve
} = require('path');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        'index': [
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://127.0.0.1:9876',
            'webpack/hot/only-dev-server',
            './demo/index.js'
        ]
    },
    output: {
        filename: '[name].js',
        sourceMapFilename: '[file].map',
        path: resolve(__dirname, 'dist'),
        publicPath: '/dist'
    },
    devtool: 'cheap-module-eval-source-map',

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9876,
        host: "0.0.0.0",
        hot: true,
        inline: true,
        publicPath: "/dist/",
        historyApiFallback: {
            rewrites: [{
                from: /^\/$/,
                to: '/views/index.html'
            }]
        }
    },
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
            },{
                test: /\.(png|jpg|jpeg|gif|woff|svg|eot|ttf|woff2)$/i,
                use: ['url-loader']
            }
        ]
    },
    externals: {
        jquery: 'jQuery',
        lodash: '_'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dist/vendor-manifest.json')
        })
    ]
};