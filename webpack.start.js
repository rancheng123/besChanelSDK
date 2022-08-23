const { merge }  = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');


let configMap = {
    'collect-web-tracing': {
        title: '埋点 + 推广跟踪'
    },
    'collect-web': {
        title: '单纯埋点'
    }
}

let SDK_TYPE = process.env.SDK_TYPE

let json
if(process.env.ACTION === 'demo'){

    json = {
        entry: `./demo/${SDK_TYPE}.js`,
        plugins:[
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname,'./demo/index.html'),
                title: configMap[SDK_TYPE].title,
            })
        ],
        devServer: {
            https: true,
            host: "127.0.0.1",
        },
        mode: "development",
    }
}else{
    //build
    json = {
        entry: `./sdk/src/${SDK_TYPE}.js`,
        mode: process.env.NODE_ENV === "production"?"production" : "development",
    }
}



module.exports = merge(common, json);
