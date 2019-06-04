const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'production',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'main.js'
    },
    externals: {
        "path": "require('path')"
    },
    resolve: {
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },
    plugins: [
        new copyWebpackPlugin([
            {
                from: './src/views',
                to: 'views'
            },
            {
                from: './src/public',
                to: 'public'
            },
        ]),
        new Dotenv(),
    ]
};