
/*
*  @描述：项目构建生产配置
*  @作者：白朗
*  @创建时间：2019-10-04
*/
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const prodWebpackConfig = merge(baseWebpackConfig,{
  mode: 'production'
})

module.exports = prodWebpackConfig;



