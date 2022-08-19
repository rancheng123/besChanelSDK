const { merge }  = require("webpack-merge");
const common = require("./webpack.common.js");

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');




let json = {
    entry: './demo/index.js',
    plugins:[
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'./demo/index.html'),
            title: 'My App',
        })
    ],
    devServer: {
        https: true,
        host: "127.0.0.1",
    },
}


module.exports = merge(common, json);
