const Mock = require('mockjs');
import {
  settleObj,
  driverObj,
  driverDetail,
  planObj,
  fromObj
} from './data';
//格式： Mock.mock( url, post/get , 返回的数据)；

Mock.mock(/\/account\/enterprise\/getSettleList/, 'get', settleObj);
Mock.mock(/driver\/company\/list/, 'get', driverObj);
Mock.mock(/driver\/detail/, 'get', driverDetail);
Mock.mock(/\/lgs\/list/, 'get', planObj);
Mock.mock(/\/lgs\/ol\/list/, 'get', fromObj);
