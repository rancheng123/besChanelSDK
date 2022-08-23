const { merge }  = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');


let configMap = {
    'collect-web-tracing': {
        title: '埋点 + 推广跟踪',
        template: path.resolve(__dirname,'./demo/collect-web-tracing/index.html'),
        entry: path.resolve(__dirname,'./demo/collect-web-tracing/index.js')
    },
    'collect-web': {
        title: '单纯埋点',
        template: path.resolve(__dirname,'./demo/collect-web/index.html'),
        entry: path.resolve(__dirname,'./demo/collect-web/index.js')
    }
}

let SDK_TYPE = process.env.SDK_TYPE

let json
if(process.env.ACTION === 'demo'){

    json = {
        entry: configMap[SDK_TYPE].entry,
        plugins:[
            new HtmlWebpackPlugin({
                template: configMap[SDK_TYPE].template,
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
