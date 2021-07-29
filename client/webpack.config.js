
const webpack = require('webpack');
const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = [


	{
		node: false,
		mode: 'production',
		target: 'web',
		context: path.resolve(__dirname, 'src'),
		optimization: {
			minimize: true,
			minimizer: [new TerserPlugin()],
		},
		plugins: [
			new MiniCssExtractPlugin({ filename: "[name].css" }), // { filename: "[name].[contentHash].css" }
		],
		entry: {
			'ep-assignment.min': path.resolve(__dirname, './src/index.js'),
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].js',
			library: 'ep-assignment',
			libraryTarget: 'umd', 
			libraryExport: 'default',
			umdNamedDefine: true
		},
		externals: {
			react: {
				commonjs: 'react',
				commonjs2: 'react',
				amd: 'React',
				root: 'React',
			},
			'react-dom': {
				commonjs: 'react-dom',
				commonjs2: 'react-dom',
				amd: 'ReactDOM',
				root: 'ReactDOM',
			},
		},
		module: {
			rules: [

				{
					test: /\.less$/,
					use: [
						MiniCssExtractPlugin.loader, // extract css into files
						{
							loader: 'css-loader', // translates CSS into CommonJS
						},
						{
							loader: 'less-loader', // compiles Less to CSS
						},
					],
				},

				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: 'babel-loader'
				},
			]
		}
	},


]
