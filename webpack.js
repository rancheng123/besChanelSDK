const { merge }  = require("webpack-merge");
const common = require("./webpack.common.js");

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

let json = {
    plugins:[
        new HtmlWebpackPlugin({
            title: 'My App',
        })
    ],
    mode: process.env.NODE_ENV === "production"?"production" : "development",
    devtool: 'source-map',
    devServer: {
        https: true,
        host: "127.0.0.1",
    },
}


module.exports = merge(common, json);
