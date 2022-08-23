const { merge }  = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');


let configMap = {
    'collect-web-tracing': {
        demo: {
            title: '埋点 + 推广跟踪',
            template: path.resolve(__dirname,'./demo/collect-web-tracing/index.html'),
            entry: path.resolve(__dirname,'./demo/collect-web-tracing/index.js')
        },
        build: {
            entry: path.resolve(__dirname,'./sdk/reportSDK/src/collect-web-tracing/collect-web-tracing.js')
        },

    },
    'collect-web': {
        demo: {
            title: '单纯埋点',
            template: path.resolve(__dirname,'./demo/collect-web/index.html'),
            entry: path.resolve(__dirname,'./demo/collect-web/index.js')
        },
        build: {
            entry: path.resolve(__dirname,'./sdk/reportSDK/src/collect-web/collect-web.js')
        }

    }
}

let SDK_TYPE = process.env.SDK_TYPE

let json
if(process.env.ACTION === 'demo'){
    json = {
        entry: configMap[SDK_TYPE].demo.entry,
        plugins:[
            new HtmlWebpackPlugin({
                template: configMap[SDK_TYPE].demo.template,
                title: configMap[SDK_TYPE].demo.title,
            })
        ],
        devServer: {
            https: true,
            host: "127.0.0.1",
            historyApiFallback: {
                rewrites: [
                    {
                        from: /.*/,  // 访问任何地址
                        to: '/index.html'  // 都转向index.html页面（根路径页面）
                    }
                ]
            }
        },
        mode: "development",
    }
}else{
    //build
    json = {
        entry: configMap[SDK_TYPE].build.entry,
        mode: process.env.NODE_ENV === "production"?"production" : "development",
    }
}






module.exports = merge(common, {
    ...json,
    // 出口文件
    output: {
        path: path.resolve(__dirname, `dist/${SDK_TYPE}/`), // 输出路径
        filename:`besChannel-${process.env.NODE_ENV}.js`, // 输出文件名
        library: "collect",
        libraryTarget: "umd",
        libraryExport: 'default',
        publicPath: "/"
    },
});
