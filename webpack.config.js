var HtmlWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/views/index.html',
    filename: 'index.html',
    inject: 'body',
    favicon: __dirname + '/src/views/favicon.ico'
});

module.exports = {
    entry: [
        'babel-polyfill',
        './src/views/index.js'
    ],
    module: {
        rules: [
            {test: /\.js$/, exclude: /node_modules/, use: 'babel-loader'},
            { test: /\.css$/, use: [{ loader: 'style-loader'},
                { loader: 'css-loader' } 
            ]}
        ]
    },
    output: {
        path: __dirname + '/public',
        filename: 'index_bundle.js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [HTMLWebpackPluginConfig]
};