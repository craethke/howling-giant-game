const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src') + '/js/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js",
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            Assets: path.resolve(__dirname, 'src/assets/')
        }
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: '0.0.0.0',
        public: 'localhost:8080',
        disableHostCheck: true
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: [
                    { loader: "ts-loader" }
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|mp3)$/i,
                exclude: /node_modules/,
                use: [
                    { loader: 'file-loader' }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
}
