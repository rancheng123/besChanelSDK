const path = require('path')
var webpack = require('webpack');
const version = require('./package.json').version
module.exports = {
    //插件项
    plugins:[
        new webpack.DefinePlugin({
            "global_timestamp": Date.now()
        })
    ],
    devtool: 'source-map',
  module: {
    rules: [
      // 编译es6
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "src")],
        use: {
          loader: "babel-loader",
          options:{
            presets:[
             '@babel/preset-env',
             '@babel/preset-react'
            ],
            plugins:[
             '@babel/plugin-syntax-dynamic-import',
             "@babel/plugin-transform-runtime",
             "@babel/plugin-transform-regenerator"
            ]
           }
        }
      },
    ]
  }
}
