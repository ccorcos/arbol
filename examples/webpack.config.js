const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  cache: true,
  devtool: "source-map",
  entry: {
    index: path.join(__dirname, "index.js")
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["react", "es2015", "stage-0"]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html")
    })
  ]
};
