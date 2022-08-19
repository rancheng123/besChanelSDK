const { merge }  = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');


let json
if(process.env.action === 'demo'){

    json = {
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
        mode: "development",
    }
}else{
    json = {
        entry: './sdk/src/index.js',
        mode: process.env.NODE_ENV === "production"?"production" : "development",
    }
}



module.exports = merge(common, json);
