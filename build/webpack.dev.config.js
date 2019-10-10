
/*
*  @描述：项目构建开发配置
*  @作者：白朗
*  @创建时间：2019-10-04
*/
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const devWebpackConfig = merge(baseWebpackConfig,{
  mode:'development',
  devServer:{
    // contentBase:path.resolve(__dirname,'./../dist'),
    contentBase:false,
    host:'localhost',
    compress:true,
    port:8030,
    open: true,
    overlay: true, // 开启错误调试,
    inline: true,
    hot: true,  //是否开启hot-module-replacement
    proxy: {
      '/v1': {
        target: 'http://172.16.32.182:8994/',
        secure: false,
        onProxyReq(proxyReq, req, res){
          let cookie = req.headers.cookie;
          if(cookie){
            let cookieAry = cookie.split("; ");
            let obj = {};
            cookieAry.forEach(item=>{
              let itemAry = item.split("=");
              obj[itemAry[0]] = itemAry[1];
            });
            proxyReq.setHeader("Authorization","vlsCompany "+obj.vlsCompanyToken);
          }
        }
      }
    }
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = devWebpackConfig;


