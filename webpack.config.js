const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //分离js中的css
module.exports = {
  // 模块的入口文件
  entry: './src/index.js',
  output: {
    // 输出文件的名称
    filename: 'index.js',
    // 输出文件的存放目录
    path: path.resolve(__dirname, 'lib'),
    library: {
      name: "wasabiD",
      type: "umd"
    },
    clean: true, // 在生成文件之前清空 output 目录
  },
  // 通过正则命中所有以 react 或者 babel-runtime 开头的模块
  // 这些模块使用外部的，不能被打包进输出的代码里
  externals: /^(react|prop-types|xlsx|lodash)/,
  module: {
    // 加载器配置
    rules: [
      // // .js 文件使用babel 来编译处理,react 需要几个插件
      {
        test: /\.js[x]?$/,
        use: [
          {
            loader: 'babel-loader',
          },

        ],
      },
      //.css 文件使用 style-loader 和 css-loader 来处理,注意这里可以使用要引用MiniCssExtractPlugin,独立出来
      {
        test: /\.(css)$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, 'css-loader?minimize'],
      },
      {
        test: /\.(sass|scss)$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, 'css-loader?minimize', 'sass-loader'],
      },
      {
        test: /\.(less)$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, 'css-loader?minimize', 'less-loader'],
      },
      {
        test: /\.(ico|gif|png|jpg|jpeg|bmp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 400 * 1024
          }
        }
      },
      {
        test: /\.(svg|woff|woff2|eot|ttf|otf)$/i,
        type: "asset/inline",//使用这种才能导出字体
      },

    ],
  },
  mode: "production",
  optimization: {
    minimize: false
  },
  plugins: [
    //分离js中的css,独立打包
    new MiniCssExtractPlugin({
      ignoreOrder: true,//忽略警告
      filename: 'index.css', //对应于entry里面生成出来的文件名
    }),
  ],
  resolve: {
    //别名，快速访问
    alias: {
      '@': path.resolve(__dirname, './src'),

    },
    //指定模块路径，可以不设置，有默认值,方便更快的打包
    modules: ['node_modules', path.join(__dirname, './node_modules')],
    //其它解决方案配置 自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.sass', '.less'],
  },
};
