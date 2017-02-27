var path = require('path');
var webpack = require('webpack');

//定义路径
var ROOT_PATH = path.resolve(__dirname);
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var DIST_PATH = path.resolve(ROOT_PATH, 'dist');

//自动生成html，并且可以引入打包好的js和css
var HtmlWebpackPlugin = require('html-webpack-plugin')

//分离出css到单独文件
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var scssLoader = new ExtractTextWebpackPlugin("css/[name].[contenthash].css");
var cssLoader = new ExtractTextWebpackPlugin("css/[name].[contenthash].css");

//自动补全css前缀
var autoprefixer = require('autoprefixer');

//优化&压缩css
var optimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

//替换之前的dist文件
//在package.json里设置的

//删除之前的dist文件，而不是每次都生成新的
//利用dos命令，在package.json中

//可接受 img 等格式
//
//static资源怎么放

//babel
// 完成

//dev
//有待完善


//按需加载


module.exports = {
	entry: path.resolve(ROOT_PATH,'src/main.js'),
	output: {
		filename: 'js/[name].[chunkhash].js',
		publicPath: './',
		path: path.resolve(ROOT_PATH,"dist")
	},
	module:{
		rules:[
		{
			test:/\.scss$/,
			use: scssLoader.extract({
				fallback: "style-loader",
				use:["css-loader","sass-loader","postcss-loader"],
				publicPath:DIST_PATH + "/"//通过设置ExtractTextWebpackPlugin这个loader的publicPath路径，来改变提取出来的css中的背景图片的路径，哇哈哈哈
				
			})
		},
		{
			test:/\.css$/,
			use:cssLoader.extract({
				fallback: "style-loader",
				use:["css-loader","postcss-loader"],
				publicPath:DIST_PATH + "/"//同上
			})
		},
		{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		},

		//url-loader
		{
			test: /\.(jpg|jpeg|png|gif|svg)$/, 
			loader: "url-loader",
			query:{
				limit:10000,
				name:"images/[hash:8].[name].[ext]"
			}
		},
		{
			test: /\.(woff|woff2|ttf|eot)$/, 
			loader: "url-loader",
			query:{
				limit:10000,
				name:"fonts/[hash:8].[name].[ext]"
			}
		},

		// 处理img插件，这个重要啊，我曹，找了一天
		{
			test: /\.(htm|html)$/i,
			loader: 'html-withimg-loader'
		}
		]
	},
	plugins:[
	new HtmlWebpackPlugin({
		template:"index.html",
		//src下的这个文件是假的，纯粹是往打包好的html里加东西
		inject: true,
		minify: {
			removeComments: true,
			collapseWhitespace: true,
			removeAttributeQuotes: true
		}
	}),
	new webpack.optimize.UglifyJsPlugin({//压缩js
		compress: {
			warnings: false
		}
	}),
	new webpack.LoaderOptionsPlugin({//webpack2不能直接在webpack.config.js里的配置项直接写了
		options: {
			postcss: function () {
				return [autoprefixer];
			},
		}
	}),
	new optimizeCssAssetsWebpackPlugin({//压缩css
		cssProcessorOptions: { 
			discardComments: {removeAll: true } 
		},
	}),
	scssLoader,cssLoader,
	],
};