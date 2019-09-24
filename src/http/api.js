/*
*  @描述：接口api
*  @作者：邱康松
*  @创建时间：2019/1/14
*/
import Http from "./http";
let sysApi = '/sysCom'; //系统管理模块
let aliApi = '/upl'; //阿里模块
let logApi = '/log'; //日志模块
let driApi = '/driCom'; //司机模块
let cerApi = '/cer'; //承运商模块
let lgsApi = '/lgs'; //物流执行计划模块
let transApi = '/trans'; //运输计划模块
let dictApi = '/dictcenter'; //字典管理模块

export default {
  methods:{
    // 通用获取下载模板接口
    getTemplate(options) {
      return Http.get(aliApi + '/aliyun/oss/template/getTemplateByCode',options);
    },
    // 通用上传图片接口
    uploadImage(options) {
      return Http.post('/upl/aliyun/oss/image/uploadFileWithThumbnail',options);
    },
    // 根据token获取公司信息
    getUserByToken(options) {
      return Http.get(sysApi + '/user/getUserByToken/white',options);
    },
    //司机列表
    getDriverList(options) {
      return Http.get(driApi + '/driver/company/list',options);
    },
    // 司机启用停用
    updateDriverStatus(options) {
      return Http.post(driApi + '/driver/updateStatus',options);
    },
    // 司机删除
    deleteDriver(options) {
      return Http.post(driApi + '/driver/delete',options);
    },
    //司机提交审核
    applyDriverAudit(options) {
      return Http.post(driApi + '/driver/submitAudit',options);
    },
    // 司机详情
    getDriverDetail(options) {
      return Http.get(driApi + '/driver/detail',options);
    },
    // 司机新增
    addDriver(options) {
      return Http.post(driApi + '/driver/add',options);
    },
    // 司机修改
    updateDriver(options) {
      return Http.post(driApi + '/driver/update',options);
    },
    // 车辆列表
    getVehicleList(options) {
      return Http.get(driApi + '/vehicle/company/list',options);
    },
    // 车辆新增
    addVehicle(options) {
      return Http.post(driApi + '/vehicle/add',options);
    },
    // 车辆删除
    deleteVehicle(options) {
      return Http.post(driApi + '/vehicle/delete',options);
    },
    // 车辆修改
    updateVehicle(options) {
      return Http.post(driApi + '/vehicle/update',options);
    },
    // 车辆启用禁用
    updateVehicleStatus(options) {
      return Http.post(driApi + '/vehicle/updateStatus',options);
    },
    // 车辆提交审核
    applyVehicle(options) {
      return Http.post(driApi + '/vehicle/submitAudit',options);
    },
    // 车辆详情
    getVehicleDetail(options) {
      return Http.get(driApi + '/vehicle/detail',options);
    },
    // 司机车辆绑定列表
    getBindList(options) {
      return Http.get(driApi + '/driVehicle/list',options);
    },
    // 司机车辆绑定
    bindDriverVehicle(options) {
      return Http.post(driApi + '/driVehicle/bind',options);
    },
    // 司机车辆绑定导出
    exportBindList(options) {
      return Http.post(driApi + '/driVehicle/export',options);
    },
    // 司机列表（车辆绑定专用）
    getBindDriverList(options) {
      return Http.get(driApi + '/driVehicle/driver/list',options);
    },
    // 承运商列表
    getCompanyList(options) {
      return Http.get(cerApi + '/carrier/platform/getlist',options);
    },
    // 承运商详情
    getCompanyDetail(options) {
      return Http.get(cerApi + '/carriers/all/seekCarriersDetail',options);
    },
    // 承运商提交审核
    applyCompany(options) {
      return Http.post(cerApi + '/carriers/enterprise/requestConfirmCarrier',options);
    },
    // 承运商导出
    exportCompany(options) {
      return Http.post(cerApi + '/carriers/enterprise/carriersExport',options);
    },
    // 承运商修改
    updateCompany(options) {
      return Http.post(cerApi + '/carriers/enterprise/updateCarrier',options);
    },
    // 承运商线路查询
    getCompanyLineList(options) {
      return Http.get(dictApi + '/dict/line/getlist',options);
    },
    // 承运商线路导出
    exportCompanyLine(options) {
      return Http.get(dictApi + '/dict/line/export',options);
    },
    // 成员管理列表
    getUserList(options) {
      return Http.get(sysApi + '/user/list',options);
    },
    // 添加成员
    addUser(options) {
      return Http.post(sysApi + '/user/add',options);
    },
    // 角色列表
    getRoleList(options) {
      return Http.get(sysApi + '/role/list',options);
    },
    // 添加成员-搜索成员列表
    getWxUserList(options) {
      return Http.get(sysApi + '/user/listSameDepartmentWxUser',options);
    },
    // 移出用户
    removeUser(options) {
      return Http.post(sysApi + '/user/out',options);
    },
    // 角色详情
    getRoleDetail(options) {
      return Http.get(sysApi + '/role/detail',options);
    },
    // 新增角色
    addRole(options) {
      return Http.post(sysApi + '/role/add',options);
    },
    // 删除角色
    deleteRole(options) {
      return Http.get(sysApi + '/role/delete',options);
    },
    // 重命名角色
    renameRole(options) {
      return Http.post(sysApi + '/role/rename',options);
    },
    // 更改成员角色
    updateUserRole(options) {
      return Http.post(sysApi + '/role/updateUserRole',options);
    },
    // 更改角色权限
    updateRoleAuth(options) {
      return Http.post(sysApi + '/role/updateResource',options);
    },
    // 我的设置-更新信息接口
    updateMyData(options) {
      return Http.post(sysApi + '/user/update',options);
    },
    // 操作日志
    getLogList(options) {
      return Http.get(logApi + '/logger/listPage',options);
    },
    // 我的设置-获取用户信息
    getUserInfo(options) {
      return Http.get(sysApi + '/user/detailByToken',options);
    },
    // 通用-查看承运商证件详情
    getCompanyLicence(options) {
      return Http.get(cerApi + '/carriers/all/seekCarriersPermits', options);
    },
    // 通用-查看车辆证件详情
    getVehicleLicence(options) {
      return Http.get(driApi + '/vehicle/licence', options);
    },
    // 通用-查看司机证件详情
    getDriverLicence(options) {
      return Http.get(driApi + '/driver/licence', options);
    },
    // 获取物流执行计划列表
    getLogisticsPlan(options) {
      return Http.post(lgsApi + '/lgs/list',options);
    },
    // 物流执行计划-出发地列表
    getFromList(options) {
      return Http.post(lgsApi + '/lgs/ol/list',options);
    },
    // 物流执行计划-插入计划列表接口
    insertPlanList(options) {
      return Http.get(transApi + '/trans/insertPlanList',options);
    },
    // 物流执行计划-确定插入计划
    confirmInsertPlan(options) {
      return Http.post(lgsApi + '/lgs/insertPlan',options);
    },
    // 配板
    planAssign(options) {
      return Http.post(lgsApi + '/lgs/assign',options);
    },
    // 物流执行计划导出
    exportLgsPlan(options) {
      return Http.post(lgsApi + '/lgs/export',options,{responseType: 'arraybuffer'});
    },
    // 公共接口-一次性获取多个字典
    getDictByTypes(options) {
      return Http.get(dictApi + '/dict/common/getDictByTypes',options);
    },
    // 业务运力池查询
    getBusinessPowerList(options) {
      return Http.get(cerApi + '/carriers/platform/seekCarPowerInfo',options);
    },
    // 运输计划列表
    getTransportsList(options) {
      return Http.get(transApi + '/trans/listPage',options);
    },
    // 运输计划-子表
    getTransportChild(options) {
      return Http.get(transApi + '/trans/lgsList',options);
    },
    // 运输计划-根据VIN码获取运输计划id
    getIdByVin(options) {
      return Http.get(transApi + '/trans/vin/list',options);
    },
    // 配板详情
    getPlanDetail(options) {
      return Http.get(transApi + '/trans/assignInfo',options);
    },
    // 修改运输计划
    updatePlan(options) {
      return Http.post(transApi + '/trans/update',options);
    },
    // 删除运输计划
    deletePlan(options) {
      return Http.get(transApi + '/trans/delete',options);
    },
    // 运输计划导出
    exportTransPlan(options) {
      return Http.post(transApi + '/trans/export',options,{responseType: 'arraybuffer'});
    },
    // 获取历时未发布红点数量
    historyNoPublish(options) {
      return Http.get(transApi + '/trans/historyNoPublish',options);
    },
    // 拖车进门时间通知
    getCarInDoorNotice(options) {
      return Http.get(transApi + '/transport/company/truck_into_notice/list',options);
    },
    // 拖车进门时间通知导出
    exportCarInDoorNotice(options) {
      return Http.post(transApi + '/transport/company/truck_into_notice/export',options,{responseType: 'arraybuffer'});
    },
    // 计划发布状态跟踪
    getPublishStatusList(options) {
      return Http.get(transApi + '/intransit/enterprise/publishStatusList',options);
    },
    // 计划发布状态导出
    exportPublishStatus(options) {
      return Http.post(transApi + '/intransit/enterprise/publishStatusExport',options,{responseType: 'arraybuffer'});
    },
    // 计划发布状态跟踪子表
    getPublishDetail(options) {
      return Http.get(transApi + '/intransit/enterprise/publishStatusDetail',options);
    },
    // 首页-获取团队列表
    getTeamList(options) {
      return Http.get(sysApi + '/user/home/depart/list',options);
    },
    // 首页-便捷导航列表
    getFastNavList(options) {
      return Http.get(sysApi + '/user/home/menu/list',options);
    },
    // 首页-新增便捷导航
    addFastNav(options) {
      return Http.post(sysApi + '/user/home/menu/add',options);
    },
    // 首页-获取访问次数
    getLoginInfo(options) {
      return Http.get(logApi + '/logger/login/count',options);
    },
    // 运输保险管理-主表
    getRiskMainList(options) {
      return Http.get(transApi + '/transport/insurance/company/transList',options);
    },
    // 运输保险管理-子表
    getRiskChildList(options) {
      return Http.get(transApi + '/transport/insurance/company/lgsList',options);
    },
    // 运输保险管理-导出
    exportRiskManage(options) {
      return Http.post(transApi + '/transport/insurance/company/transList/export',options,{responseType: 'arraybuffer'});
    },
    // 运输保险管理-保险确认
    confirmRisk(options) {
      return Http.post(transApi + '/transport/insurance/company/confirm',options);
    },
    // 运输保险管理-修改保险公司
    updateRiskCompany(options) {
      return Http.post(transApi + '/transport/insurance/insuranceCompany/update',options);
    },
    // 通用接口-保存自定义列头
    saveColumn(options) {
      return Http.post( sysApi + '/user/customColumn',options);
    },
    // 根据页面获取保存的自定义列头
    getColumnByName(options) {
      return Http.get( sysApi + '/user/listUserCustomColumn',options);
    },
    // 到达预定查询列表
    getArriveList(options) {
      return Http.get( transApi + '/trans/arrive/list',options);
    },
    // 到达预定查询-导出
    exportArriveList(options) {
      return Http.post(transApi + '/trans/arrive/export',options,{responseType: 'arraybuffer'});
    },
    //承运商资料-联系人-新增
    addLink(options) {
      return Http.post( cerApi + '/carrier/enterprise/addLink',options);
    },
    //承运商资料-联系人-修改
    updateLink(options) {
      return Http.post( cerApi + '/carrier/enterprise/updateLink',options);
    },
    //承运商资料-联系人-删除
    deleteLink(options) {
      return Http.get( cerApi + '/carrier/enterprise/deleteLink',options);
    },
    //承运商资料-联系人-获取列表
    getLinkList(options) {
      return Http.get( cerApi + '/carrier/enterprise/getLinks',options);
    },
    // 承运商资料-获取所有的信息
    getCompanyAllData(options) {
      return Http.get( cerApi + '/carrier/platform/look',options);
    },
    // 承运商资料-财务报表-新增
    addFinanceReport(options) {
      return Http.post( cerApi + '/carrier/enterprise/addReport',options);
    },
    // 承运商资料-财务报表-删除
    deleteFinanceReport(options) {
      return Http.get( cerApi + '/carrier/enterprise/deleteReport',options);
    },
    // 承运商资料-财务报表-获取列表
    getFinanceList(options) {
      return Http.get( cerApi + '/carrier/enterprise/getReports',options);
    },
    // 承运商资料-提交审核
    applyAudit(options) {
      return Http.post( cerApi + '/carrier/platform/updateCarrierBase',options);
    },
    // 物流执行计划-获取超期未配板筛选颜色列表
    getColorsList(options) {
      return Http.get( lgsApi + '/lgs/colorList',options);
    },
  }
}