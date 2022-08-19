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

    // 通用修改 start
	// 入口文件
	//entry: './sdk/src/index.js',
    // 通用修改 end

  // 出口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出路径
    filename:`besChannel-${process.env.NODE_ENV}.js`, // 输出文件名
    library: "collect",
    libraryTarget: "umd",
    libraryExport: 'default',
    publicPath: "/"
  },
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
