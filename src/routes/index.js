//默认路由
export let initRoutes = [
  {
    path: '/',
    name: 'index',
    redirect: {
      name: 'login'
    }
  },
  // 登录
  {
    path: '/login',
    name: 'login',
    component(resolve){
      require(["../pages/login"],resolve);
    }
  },
  // 重置密码
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component(resolve){
      require(["../pages/login/resetPassword"],resolve);
    },
  },
  // 欢迎页
  {
    path: '/welcome',
    name: 'welcome',
    component(resolve){
      require(["../pages/welcome"],resolve);
    },
  },
  {
    path: '/home',
    name: 'home',
    component(resolve){
      require(["../pages/home"],resolve);
    },
    meta: {
      p: 'home',
      name: '首页'
    }
  },
];
export let menuRoutes = [
  {
    path: '/businessCenter',
    name: 'businessCenter',
    redirect: {
      name: 'logisticsPlan'
    },
    meta: {
      p: 'businessCenter',
      name: '业务中心'
    },
  },
  {
    path: '/logisticsPlan',
    name: 'logisticsPlan',
    component(resolve) {
      require(["../pages/businessCenter/planManage/logisticsPlan"],resolve);
    },
    meta: {
      p: 'logisticsPlan',
      name: '物流执行计划'
    }
  },
  {
    path: '/transportPlan',
    name: 'transportPlan',
    component(resolve) {
      require(["../pages/businessCenter/planManage/transportPlan"],resolve);
    },
    meta: {
      p: 'transportPlan',
      name: '运输计划'
    }
  },
  {
    path: '/carInDoorNotice',
    name: 'carInDoorNotice',
    component(resolve) {
      require(["../pages/businessCenter/planManage/carInDoorNotice"],resolve);
    },
    meta: {
      p: 'carInDoorNotice',
      name: '拖车进门时间通知'
    }
  },
  {
    path: '/planStatusTrack',
    name: 'planStatusTrack',
    component(resolve) {
      require(["../pages/businessCenter/planManage/planStatusTrack"],resolve);
    },
    meta: {
      p: 'planStatusTrack',
      name: '计划发布状态跟踪'
    }
  },
  {
    path: '/changeedition',
    name: 'changeedition',
    component(resolve) {
      require(["../pages/businessCenter/changeedition"],resolve);
    },
    meta: {
      p: 'changeedition',
      name: '出门后换板'
    }
  },
  {
    path: '/transportRiskManage',
    name: 'transportRiskManage',
    component(resolve) {
      require(["../pages/businessCenter/transportRiskManage"],resolve);
    },
    meta: {
      p: 'transportRiskManage',
      name: '运输保险管理'
    }
  },
  // 资源库
  {
    path: '/driverData',
    name: 'driverData',
    component(resolve) {
      require(["../pages/resources/driver"],resolve);
    },
    meta: {
      p: 'driverData',
      name: '司机管理'
    },
  },
  {
    path: '/driverDetail',
    name: 'driverDetail',
    component(resolve) {
      require(["../pages/resources/driver/detail"],resolve);
    },
    meta: {
      p: 'driverData',
      name: '司机详情'
    },
  },
  {
    path: '/vehicleData',
    name: 'vehicleData',
    component(resolve) {
      require(["../pages/resources/vehicle"],resolve);
    },
    meta: {
      p: 'vehicleData',
      name: '车辆管理'
    }
  },
  {
    path: '/vehicleDetail',
    name: 'vehicleDetail',
    component(resolve) {
      require(["../pages/resources/vehicle/detail"],resolve);
    },
    meta: {
      p: 'vehicleData',
      name: '车辆详情'
    }
  },
  {
    path: '/companyData',
    name: 'companyData',
    component(resolve) {
      require(["../pages/resources/company"],resolve);
    },
    meta: {
      p: 'companyData',
      name: '承运商资料'
    }
  },
  {
    path: '/companyDetail',
    name: 'companyDetail',
    component(resolve) {
      require(["../pages/resources/company/detail"],resolve);
    },
    meta: {
      p: 'companyData',
      name: '承运商详情',
      noCache: true
    }
  },
  {
    path: '/driverBindVehicle',
    name: 'driverBindVehicle',
    component(resolve) {
      require(["../pages/resources/driverBindVehicle"],resolve);
    },
    meta: {
      p: 'driverBindVehicle',
      name: '司机车辆关系绑定'
    }
  },
  {
    path: '/detailsearch',
    name: 'detailsearch',
    component(resolve) {
      require(["../pages/businessCenter/detailsearch"],resolve);
    },
    meta: {p: 'detailsearch',name: '运输明细查询'}
  },
  {
    path: '/onwayInfo',
    name: 'onwayInfo',
    component(resolve) {
      require(["../pages/businessCenter/onwayInfo"],resolve);
    },
    meta: {p: 'onwayInfo',name: '运输在途信息维护'}
  },
  {
    path: '/companyLine',
    name: 'companyLine',
    component(resolve) {
      require(["../pages/resources/companyLine"],resolve);
    },
    meta: {
      p: 'companyLine',
      name: '承运商线路查询'
    }
  },
  {
    path: '/carinsurance',
    name: 'carinsurance',
    component(resolve) {
      require(["../pages/resources/carinsurance/list"],resolve);
    },
    meta: {
      p: 'carinsurance',
      name: '车型保险查询'
    }
  },
  // 系统设置
  {
    path: '/systemManage',
    name: 'systemManage',
    redirect: {
      name: 'memberManage'
    },
    meta: {
      p: 'systemManage',
      name: '系统管理'
    }
  },
  {
    path: '/memberManage',
    name: 'memberManage',
    component(resolve) {
      require(["../pages/systemManage/memberManage"],resolve);
    },
    meta: {
      p: 'memberManage',
      name: '成员设置'
    }
  },
  {
    path: '/userGroupAuth',
    name: 'userGroupAuth',
    component(resolve) {
      require(["../pages/systemManage/userGroupAuth"],resolve);
    },
    meta: {
      p: 'userGroupAuth',
      name: '用户组权限'
    }
  },
  {
    path: '/myselfSetting',
    name: 'myselfSetting',
    component(resolve) {
      require(["../pages/systemManage/myselfSetting"],resolve);
    },
    meta: {
      p: 'myselfSetting',
      name: '我的设置'
    }
  },
  {
    path: '/operationLog',
    name: 'operationLog',
    component(resolve) {
      require(["../pages/systemManage/operationLog"],resolve);
    },
    meta: {
      p: 'operationLog',
      name: '操作日志'
    }
  },
  {
    path: '/transportArriveSearch',
    name: 'transportArriveSearch',
    component(resolve) {
      require(["../pages/businessCenter/transportArriveSearch"], resolve);
    },
    meta: {
      p: 'transportArriveSearch',
      name: '运输到达查询'
    }
  }
]
