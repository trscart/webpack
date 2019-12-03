const path = require('path')
const webpack = require('webpack')
const devMode = process.env.NODE_ENV !== 'production'
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

module.exports = {
    entry: { // https://webpack.js.org/concepts/entry-points/
        index: './src/index.js'
    },
    output: { // https://webpack.js.org/concepts/output/
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: { // https://webpack.js.org/concepts/loaders/
        rules: [
            {
                test: /\.js$/,
                use: { // https://webpack.js.org/loaders/babel-loader
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.s?css$/,
                use: [
                    { loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader }, // https://webpack.js.org/plugins/mini-css-extract-plugin
                    { loader: "css-loader", options: { importLoaders: 1 } }, // https://webpack.js.org/loaders/css-loader/
                    {
                        loader: 'postcss-loader', // https://webpack.js.org/loaders/postcss-loader
                        options: {
                            ident: 'postcss',
                            plugins: (loader) => [
                                require('postcss-import')({ root: loader.resourcePath }),
                                require('postcss-preset-env')()
                            ]
                        }
                    },
                    "sass-loader" // https://webpack.js.org/loaders/sass-loader/
                ],
            }
        ]
    },
    plugins: [ // https://webpack.js.org/concepts/plugins/
        new HtmlWebpackPlugin({ // https://webpack.js.org/plugins/html-webpack-plugin
            template: './src/index.html',
            filename: 'index.html',
            title: 'Webpack v4 Scaffold (production)'
        }),
        new MiniCssExtractPlugin({ // https://webpack.js.org/plugins/mini-css-extract-plugin
            filename: "[name].bundle.css",
            chunkFilename: "[id].css"
        }),
        new webpack.HotModuleReplacementPlugin() // https://webpack.js.org/plugins/hot-module-replacement-plugin
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({ // https://webpack.js.org/plugins/uglifyjs-webpack-plugin
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({}) // https://github.com/NMFR/optimize-css-assets-webpack-plugin
        ]
    },
    target: 'web', // https://webpack.js.org/concepts/targets/
    mode: devMode ? 'development' : 'production', // https://webpack.js.org/concepts/mode/
    devServer: { // https://webpack.js.org/configuration/dev-server/
        contentBase: path.join(__dirname, 'dist'),
        host: 'localhost',
        port: 8080,
        progress: true,
        compress: true,
        hot: true, 
        inline: true,
        before(app, server) { // https://github.com/webpack/webpack-dev-server/issues/1271#issuecomment-379792541
            server._watch(`./src/*.html`);
        }
    }
}