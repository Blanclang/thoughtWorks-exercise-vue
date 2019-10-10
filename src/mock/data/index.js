/*
*  @描述：mock数据
*  @作者：白朗
*  @创建时间：2019/10/06
*/

const Mock  = require('mockjs');
const Random = Mock.Random;

//导航菜单数据
export let navData = {
  "code": 0,
  "data": {
    "list": [
      {
        id:1,
        icon:'icongongyezujian-yibiaopan',
        name:'DASHBOARD'
      },
      {
        id:2,
        icon:'iconzuzhi',
        name:'AGENT'
      },
      {
        id:3,
        icon:'iconhuoche',
        name:'MY CRUISE'
      },
      {
        id:4,
        icon:'iconhelpbuoy',
        name:'HELP'
      }
    ]
  }
}
//首页列表数据
export let tabListData = {
  "code": 0,
  "data": {
    "list": [
      {
        id:1,
        status:0,
        image:require('@/assets/images/list1.png'),
        url:'www.bjstdmngbgr01.thoughtworks.com',
        ip:'192.168.1.102',
        file:'/var/lib/cruise-agent',
        browser:['Firefox','Safari','Ubuntu','Chrome']
      },
      {
        id:2,
        status:1,
        image:require('@/assets/images/list1.png'),
        url:'www.bjstdmngbgr08.thoughtworks.com',
        ip:'192.168.1.243',
        file:'/var/lib/cruise-agent',
        browser:['Firefox','Safari','Ubuntu','Chrome']
      },
      {
        id:3,
        status:1,
        image:require('@/assets/images/list2.jpg'),
        url:'www.bjstdmngbgr10.thoughtworks.com',
        ip:'192.168.1.80',
        file:'/var/lib/cruise-agent',
        browser:['Firefox','Safari']
      },
      {
        id:4,
        status:1,
        image:require('@/assets/images/list3.jpg'),
        url:'www.bjstdmngbgr11.thoughtworks.com',
        ip:'192.168.1.243',
        file:'/var/lib/cruise-agent',
        browser:['Firefox','Safari','Ubuntu','Chrome']
      },
      {
        id:5,
        status:0,
        image:require('@/assets/images/list4.jpg'),
        url:'www.bjstdmngbgr15.thoughtworks.com',
        ip:'192.168.1.117',
        file:'/var/lib/cruise-agent',
        browser:[]
      },
      {
        id:6,
        status:1,
        image:require('@/assets/images/list1.png'),
        url:'www.bjstdmngbgr01.thoughtworks.com',
        ip:'192.168.1.110',
        file:'/var/lib/cruise-agent',
        browser:['Firefox','Safari','Ubuntu','Chrome']
      },
      {
        id:7,
        status:0,
        image:require('@/assets/images/list1.png'),
        url:'www.bjstdmngbgr01.thoughtworks.com',
        ip:'192.168.1.110',
        file:'/var/lib/cruise-agent',
        browser:['Firefox','Safari','Ubuntu','Chrome']
      },
      {
        id:8,
        status:0,
        image:require('@/assets/images/list1.png'),
        url:'www.bjstdmngbgr01.thoughtworks.com',
        ip:'192.168.1.110',
        file:'/var/lib/cruise-agent',
        browser:['Firefox','Safari','Ubuntu','Chrome']
      }
    ]
  }
}




