const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: "asset/resource" }, // Penting untuk gambar
    ],
  },
  plugins: [
    // Cukup satu template utama untuk SPA
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "sw.js", to: "sw.js" },
        { from: "manifest.json", to: "manifest.json" },
        { from: "images", to: "images" },
      ],
    }),
  ],
  devServer: {
    static: "./dist", // Biasanya hasil build ditaruh di dist
    port: 8082,
    open: true,
    hot: false, // Nonaktifkan HMR untuk menghindari error saat reload SPA
    liveReload: false, // Matikan auto reload pada dev server
    historyApiFallback: true, // PENTING: Agar routing SPA tidak error saat di-refresh
  },
};
