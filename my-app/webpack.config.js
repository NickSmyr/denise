const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    index : "./src/react.js",
    chat : "./src/chat.js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i, 
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/,
         loader: 'url-loader?limit=100000' }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname + "/public/", "dist/"),
    publicPath: "/",
    filename: "[name].bundle.js"
  },

  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
    hotOnly: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}