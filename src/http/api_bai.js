/*
*  @描述：接口api
*  @作者：白朗
*  @创建时间：2019/3/6
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
  
    //导出司机资料
    getDriverExport(options) {
      return Http.post(driApi+'/driver/company/export',options,{responseType: 'arraybuffer'});
    },
    //导出车辆资料
    getVehicleExport(options) {
      return Http.post(driApi+'/vehicle/company/export',options,{responseType: 'arraybuffer'});
    },
    //导出司机与车辆关系导出
    getDriVehicleExport(options) {
      return Http.post(driApi+'/driVehicle/export',options,{responseType: 'arraybuffer'});
    },
    //导出承应商资料
    getCarriersExport(options) {
      return Http.post(cerApi+'/carriers/enterprise/carriersExport',options,{responseType: 'arraybuffer'});
    },
    //导出承应商线路查询
    getCarrierRoutesExport(options) {
      return Http.post(cerApi+'/carriers/enterprise/carrierRoutesExport',options,{responseType: 'arraybuffer'});
    },
    //车型保险查询
    getVehicleinsuranceList(options) {
      return Http.get(dictApi+'/dict/vehicleinsurance/getlist',options);
    },
    //获取出发地
    getStoreStart(options) {
      return Http.get(dictApi+'/dict/store/getLocations',options);
    },
    //导出车型保险查询
    exportVehicleinsurance(options) {
      return Http.post(dictApi+'/dict/vehicleinsurance/export',options,{responseType: 'arraybuffer'});
    },
    //运输明细查询
    getTransDetail(options) {
      return Http.get(transApi+'/transDetail/listPage',options);
    },
    //获取主机厂字典列表
    getFactoryDictList(options) {
      return Http.get(dictApi+'/dict/factory/getlist',options);
    },
    //获取物流公有字典列表
    getLogisticsDictList(options) {
      return Http.get(dictApi+'/dict/logistics/getlist',options);
    },
    //运输明细查询-导出
    getTransDetailExport(options) {
      return Http.post(transApi+'/transDetail/export',options,{responseType: 'arraybuffer'});
    },
    //运输在途信息导出
    getIntransitExport(options) {
      return Http.post(transApi+'/transport/transportation/export',options,{responseType: 'arraybuffer'});
    },
    //获取门店城市列表
    getStoreCitylist(options) {
      return Http.get(dictApi+'/dict/store/getCities',options);
    },
    
    //所有已审核承运商列表
    getListConfirmCarriers(options) {
      return Http.get(cerApi+'/carriers/platform/listConfirmCarriers',options);
    },
    //车辆列表
    getVehiclePlatformList(options) {
      return Http.get(driApi+'/vehicle/enterprise/list',options);
    },
    //拖车变更列表
    getTruckchangeList(options) {
      return Http.get(transApi+'/transport/truckchange/getlist',options);
    },
    //运输在途信息维护
    getTransportingInfo(options) {
      return Http.get(transApi+'/transport/transportation/getlist',options);
    },
    //运输在途信息换板
    getTransportingChangeboard(options) {
      return Http.post(transApi+'/intransit/enterprise/changeboard',options);
    },
    //运输在途信息修改
    getTransportingUpdateboard(options) {
      return Http.post(transApi+'/transport/transportation/update',options);
    },
    //运输在途信息-详情(字表)
    getTransportingDetail(options) {
      return Http.get(transApi+'/intransit/enterprise/detail',options);
    },
    //运输在途信息维护审核
    getConfirmboard(options) {
      return Http.post(transApi+'/intransit/enterprise/confirmboard',options);
    },
    //承运商上报历史位置查询
    getCarryHistoryLocation(options) {
      return Http.get(transApi+'/transport/transportation/getHistoryLocation',options);
    },
    //车辆历史位置查询
    getCarHistoryLocation(options) {
      return Http.get(transApi+'/transport/transportation/getHistoryDriverMobileLocation',options);
    },
    //车辆历史获得最新定位
    getCarNewLocation(options) {
      return Http.post(transApi+'/transport/transportation/getNewestMobileLocation',options);
    },
    //离城日期更改查询
    getLeaveDateUpdate(options) {
      return Http.get(transApi+'/transport/transportation/getHistoryDriverMobileLocation',options);
    },
    //出门后换板
    // getChangeboardList(options) {
    //   return Http.get(transApi+'/transport/changeboard/getlist',options);
    // },
    // getChangeboardChildList(options) {
    //   return Http.get(transApi+'/transport/changeboard/getsublist',options);
    // },
    // getChangeboardChange(options) {
    //   return Http.post(transApi+'/transport/changeboard/change',options);
    // },
    getChangeboardList(options) {
      return Http.get(transApi+'/transport/changeboard/getCarrierList',options);
    },
    getChangeboardChildList(options) {
      return Http.get(transApi+'/transport/changeboard/getCarrierSubList',options);
    },
    getChangeboardChange(options) {
      return Http.post(transApi+'/transport/changeboard/carrierChange',options);
    },
    getChangeboardAudit(options) {
      return Http.post(transApi+'/transport/changeboard/audit',options);
    },
    getChangeboardExport(options) {
      return Http.post(transApi+'/transport/changeboard/carrierExport',options,{responseType: 'arraybuffer'});
    },
    getDictCompanyList(options) {
      return Http.get(dictApi+'/dict/company/getlist',options);
    },
    // 承运商资料-用户调查表
    getCarrierGetPowers(options) {
      return Http.get(cerApi+'/carrier/enterprise/getPowers',options);
    },
    getCarrierDeletePowers(options) {
      return Http.get(cerApi+'/carrier/enterprise/deletePower',options);
    },
    getCarrierAddPower(options) {
      return Http.post(cerApi+'/carrier/enterprise/addPower',options);
    },
    getPowerDetail(options) {
      return Http.get(cerApi+'/carrier/platform/lookPower',options);
    },
    getCarrierUpdatePower(options) {
      return Http.post(cerApi+'/carrier/enterprise/updatePower',options);
    },
  }
}
