/*
*  @描述：mock数据
*  @作者：邱康松
*  @创建时间：2019/1/16
*/

const Mock  = require('mockjs');
const Random = Mock.Random;

// 司机列表
export let driverObj = {
  "code": 0,
  "data": {
    "total": 10,
    "list|10": [{
      "driverId|+1": 1,
      "name": "@cname",
      "mobile": /^1[385][1-9]\\d{8}/,
      "mobileStatusName": "已验证",
      "idNo": "@float",
      "birthday": "@date",
      "bankAccount": "@cword(3,10)",
      "bankName": "@cword(3,10)",
      "companyNo": "@cword(3,10)",
      "companyAbbreviation": "@cword(3,10)",
      "driverAge": "@cword(3,10)",
      "driverLicenseType": "@cword(3,10)",
      "driverType": "@cword(3,10)",
      "employType": "@cword(3,10)",
      "agreeStartOn": "@cword(3,10)",
      "agreeEndOn": "@cword(3,10)",
      "blackStatus": "@integer(0,1)",
      "blackStatusName": "@cword(3,10)",
      "remark": "@cword(3,10)",
      "createdName": "@cname",
      "createdOn": "@datetime",
      "auditStatus": "@integer(0,3)",
      "auditStatusName": "@cword(3,10)",
      "updateOn": "@datetime",
      "updateName": "@cname",
      "status": "@integer(0,1)",
      "statusName": "@cword(3,10)"
    }]
  }
};

// 司机详情
export let driverDetail = {
  "code": 0,
  "data": {
    "auditStatus": 2,
    "driverName": "@cname",
    "mobile": /^1[385][1-9]\\d{8}/,
    "sex": "04001",
    "idNo": "@float(18)",
    "birthday": "@date",
    "driverAge": "@integer(18,30)",
    "driverLicenseType": "09001",
    "driverType": "10001",
    "employType": "08001",
    "bankAccount": "@float(18)",
    "bankName": "@cword(10)",
    "agreeStartOn": "@date",
    "agreeEndOn": "@date",
    "companyName": "@cword(5,10)",
    "companyNo": "@float(5)",
    "companyAbbreviation": "@cword(2,5)",
    "card":{
      "cardId":"",
      "cardUrl": 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg',
      "cardReverseUrl": Random.image('150x150', '#ffd5c4')
    },
    "licence":{
      "licenceId":"",
      "licenceUrl": Random.image('150x150', '#44caff')
    },
    "qualification":{
      "qualificationId": "",
      "qualificationUrl": Random.image('150x150', '#ff4828')
    },
    "other":{
      "otherLicenceId": "",
      "otherLicenceUrl": Random.image('150x150', '#FF6600'),
    },
    "remark": "@cword(5,10)"
  }
}

//结算管理列表
export let settleObj = {
  "code": 0,
  "data": {
    "total": 10,
    "list": [{
      "a1": '深圳南山厂',
      "a2": '@integer(1,100)',
      "a3": '@integer(1,100)',
      "a4": '@integer(1,100)',
      "a5": '@integer(1,100)',
      "a6": '@integer(1,100)',
      "a7": '@integer(1,100)',
      "a8": '@integer(1,100)',
      "a9": '@integer(1,100)',
      "a10": '@integer(1,100)',
    },{
      "a1": '深圳南山厂',
      "a2": '@integer(1,100)',
      "a3": '@integer(1,100)',
      "a4": '@integer(1,100)',
      "a5": '@integer(1,100)',
      "a6": '@integer(1,100)',
      "a7": '@integer(1,100)',
      "a8": '@integer(1,100)',
      "a9": '@integer(1,100)',
      "a10": '@integer(1,100)',
    },{
      "a1": '深圳南山厂',
      "a2": '@integer(1,100)',
      "a3": '@integer(1,100)',
      "a4": '@integer(1,100)',
      "a5": '@integer(1,100)',
      "a6": '@integer(1,100)',
      "a7": '@integer(1,100)',
      "a8": '@integer(1,100)',
      "a9": '@integer(1,100)',
      "a10": '@integer(1,100)',
    },{
      "a1": '北京厂',
      "a2": '@integer(1,100)',
      "a3": '@integer(1,100)',
      "a4": '@integer(1,100)',
      "a5": '@integer(1,100)',
      "a6": '@integer(1,100)',
      "a7": '@integer(1,100)',
      "a8": '@integer(1,100)',
      "a9": '@integer(1,100)',
      "a10": '@integer(1,100)',
    },{
      "a1": '北京厂',
      "a2": '@integer(1,100)',
      "a3": '@integer(1,100)',
      "a4": '@integer(1,100)',
      "a5": '@integer(1,100)',
      "a6": '@integer(1,100)',
      "a7": '@integer(1,100)',
      "a8": '@integer(1,100)',
      "a9": '@integer(1,100)',
      "a10": '@integer(1,100)',
    },]
  }
};

// 物流执行计划列表
export let planObj = {
  "code": 0,
  "data": [{
    "name": '专营店1',
    "count": 3,
    "details|100": [
      {
        "id|+1": 1,
        "factory": "A厂",
        "store": '专营店1',
        "city": '广州',
        "vinCode": 'VX2321321321',
        "lineTypeName": '轮板',
        "lineAttribute": '花都中心库-北京）轮板',
        "noAssignDays": "@integer(1,16)",
        "originLocation": '花都中心库',
        "transportType": '海上',
        "realNoAssignDays": "@integer(1,16)"
      }
    ]
  }]
};

// 物流执行计划-出发地列表
export let fromObj = {
  "code": 0,
  "data": [{
    "name":"花都中心库",
    "code":"123",
    "count":"400"
  },{
    "name":"上海中心库",
    "code":"1234",
    "count":"500"
  }]
};


