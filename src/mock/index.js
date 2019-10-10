const Mock = require('mockjs');
import {
  navData,
  tabListData
} from './data';

//导航mock数据
Mock.mock('/nav/list', 'get', navData);
//tab列表mock数据
Mock.mock('/home/tab/list', 'get', tabListData);
