const path = require("path");
const webpack = require("webpack");

module.exports = (paths) => ({
  entry: {
    main: path.resolve(__dirname, paths.scripts.src),
  },
  output: {
    path: path.resolve(__dirname, paths.dest),
    filename: "bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, 'src'),  // Alterado para incluir toda a pasta 'src' para usar modules
        use: "ts-loader",
      },
    ],
  },
  plugins: [],
  resolve: { //Corrigir erro "no extension" nos imports
    extensions: ['.ts', '.js'],
  },
});
