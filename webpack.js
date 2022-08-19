const { merge }  = require("webpack-merge");
const common = require("./webpack.common.js");

let json = {
    entry: './sdk/src/index.js',
}


module.exports = merge(common, json);
