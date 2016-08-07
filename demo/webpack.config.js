/**
 * desc:webpck 标准配置文件
 */
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    //插件项
    plugins: [commonsPlugin, new ExtractTextPlugin("../css/[name].css",{allChunks: true})
    ],//获取打包css
    //页面入口文件配置
    entry: {

    },
    //入口文件输出配置
    output: {
        path: './build/js',
        filename: '[name].js',
    },
    module: {
        //加载器配置
        loaders: [
            //.css 文件使用 style-loader 和 css-loader 来处理,注意这里要引用ExtractTextPlugin
            { test:/\.(css)$/,  loader:ExtractTextPlugin.extract("style-loader","css-loader") },
            //.less$ 文件使用 style-loader、css-loader 和 less-loader 来编译处理,注意这里要引用ExtractTextPlugin
            { test: /\.less$/, loader:ExtractTextPlugin.extract("style-loader","css-loader!less-loader") },
            //.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理,注意这里要引用ExtractTextPlugin
            { test: /\.scss$/, loader:ExtractTextPlugin.extract("style-loader","css?modules&localIdentName=[local]!sass") },
            //.js 文件使用babel 来编译处理,"babel-loader"也是一个合法的名称,babel5.0预设插件不需要的
            { test: /\.jsx?$/,  loader: 'babel',query:{presets:["es2015","react","stage-0"]} },
            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            { test: /\.(png|jpg|gif)$/,loader: 'url-loader?limit=8192&name=../img/[name].[ext]'}
        ]
    },
    //其它解决方案配置
    resolve: {

        extensions: ['',  '.js',".jsx" ,'.json', '.scss'],
        alias: {

        }
    },
    devtool:'source-map'
};
