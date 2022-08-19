const { merge }  = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  plugins:[
    new HtmlWebpackPlugin()
  ],
  devtool: 'source-map',
  mode:"development",
  devServer: {
    https: true,
    open: true,
    disableHostCheck: true,
    progress: true,
    host: "127.0.0.1",
    contentBase: path.join(__dirname, "./"),
    publicPath: "/dist/",
    hot: false,
    inline: false
  },
});
