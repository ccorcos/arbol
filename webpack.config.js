const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  cache: true,
  devtool: "source-map",
  entry: {
    index: path.join(__dirname, "examples/index.js")
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
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
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["react", ["es2015", { modules: false }], "stage-0"]
            }
          },
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "examples/index.html")
    })
  ]
};
