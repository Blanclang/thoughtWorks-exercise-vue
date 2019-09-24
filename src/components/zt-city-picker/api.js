/*
*  @描述：接口文件
*  @作者：邱康松
*  @创建时间：2019/1/4
*/

import Http from "@/http/http";

Http.axios.defaults.baseURL = "/v1";

export default {
  methods:{
    // 获取省份列表
    getProvinces() {
      return Http.get( "/sysAdm/area/listProvinces",{});
    },
    //根据code获取区域列表
    getArea(options){
      return Http.get( "/sysAdm/area/listCityAreas",options);
    }
  }
}