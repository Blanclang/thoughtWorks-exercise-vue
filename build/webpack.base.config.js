
/*
*  @描述：项目构建基础配置
*  @作者：白朗
*  @创建时间：2019-03-20
*/
const webpack = require("webpack");
const path = require("path");
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require("html-webpack-plugin");// html插件
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");// 压缩插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");// 分离CSS插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");// 分离CSS插件

const env = process.argv[4];
const wxUrlObj = {
  "--dev":"http://172.16.32.182:8994",
  "--test":"http://172.16.32.181:8994",
  "--online":"http://stsc.zhengtongauto.com"
};
const wxAgentObj = {
  "--dev":"1000002",
  "--test":"1000003",
  "--online":"1000008"
};
let wxUrl = wxUrlObj[env];
let wxAgentId = wxAgentObj[env];
const baseConfig = {
  entry:{
    app:path.resolve(__dirname,'./../src/index.js'),
    vendor:["vue","vue-router"]
  },
  output:{
    filename:"static/js/[name].[hash].js",
    path:path.resolve(__dirname,'./../dist')
  },
  optimization:{
    minimizer:[
      new UglifyJsPlugin({
        cache:true,
        parallel:true,
        // sourceMap:false //是否生成.map文件
      })
    ],
    splitChunks:{
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name:"vendor",
          chunks: "all"
        }
      }
    }
  },
  module:{
    rules:[
      {
        test: /\.vue$/,
        use:[{
          loader:"vue-loader",
          options:{
            loaders:{
              css:ExtractTextPlugin.extract({
                use:'css-loader',
                fallback: 'vue-style-loader'
              })
            }
          }
        }]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test:/\.(jsx|js)$/,
        use:[
          {
            loader:"babel-loader",
            options:{presets:["env"]}
          }
        ],
        exclude:/node_modules/
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name:'static/fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test:/\.(png|jpg|gif|jpeg)/,
        use:[{
          loader:'url-loader',
          options:{
            limit:15000,
            name:'static/images/[name].[ext]?[hash]'
          }
        }],
        exclude:/node_modules/
      }
      // {
      //   test: /\.(sa|sc|c)ss$/,
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader,
      //       options: {
      //         publicPath: '../'
      //       }
      //     },
      //     'css-loader',
      //     'postcss-loader',
      //     'sass-loader',
      //   ],
      // }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      // hash:true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
      template:path.resolve(__dirname,'./../src/template/index.html'), // 指定模板html文件
      filename:'index.html',
      inject:'true',
      favicon: path.resolve(__dirname,'./../favicon.ico')
    }),
    new VueLoaderPlugin(),
    new ExtractTextPlugin({
      filename:'static/css/style.css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      baseURL:JSON.stringify("/v1"),
      wxUrl:JSON.stringify(wxUrl),
      wxAgentId:JSON.stringify(wxAgentId),
      env:JSON.stringify(env)
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.json', '.vue', '.css', '.scss'],
    modules: [ //优化压缩
      path.resolve(__dirname, '../src'),
      path.resolve(__dirname, '../node_modules')
    ],
    alias: {
      "vue":"vue/dist/vue.js",
      '@': path.resolve(__dirname, '../src'),
      'asset':path.resolve(__dirname, '../src/assets'),
      'component':path.resolve(__dirname, '../src/components')
    }
  }
}

module.exports = baseConfig;









