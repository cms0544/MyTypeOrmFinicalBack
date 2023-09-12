const path = require('path')
const webpack = require("webpack")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const nodeExternals = require('webpack-node-externals');
const dotenvWebpack = require('dotenv-webpack')
const SwaggerJSDocWebpackPlugin = require('swagger-jsdoc-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const UglifyjsWebpackPlugin= require("uglifyjs-webpack-plugin")

const node = process.env.NODE_ENV;
console.log(node)
module.exports = {
    entry: './src/index.ts',
    mode:'production',
    output:{
        path: path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    resolve:{
        extensions:[".ts",".js"],
        //不需要node polyfill
        modules: [path.resolve(__dirname, 'node_modules')]
    },
   
    module:{
        rules:[
            {
                test:/\.ts$/,
                use: 'ts-loader'
            },
            {
                test:/\.js$/,
                use: 'babel-loader'
            }
        ]
    },
    context: __dirname,
    plugins:[
        new NodePolyfillPlugin(),
        new dotenvWebpack({
            path:`.env.${node}`
        }),
        new SwaggerJSDocWebpackPlugin({
            swaggerDefinition:{
              openapi: '3.0.0',
              info: {
                title: '后台系统',
                version: '1.0.0',
                description: 'Description',
              },
            },
            apis: ['./src/controller/*.ts'],
          }),
         new UglifyjsWebpackPlugin({
            sourceMap: true,
            parallel: 4,
            uglifyOptions:{
                keep_classnames:true,
                keep_fnames:true
            }
         })
    ],
    externals:[nodeExternals()],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({ terserOptions: { keep_classnames: true }})],
    }

}