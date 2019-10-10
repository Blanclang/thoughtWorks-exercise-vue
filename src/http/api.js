/*
*  @描述：接口api
*  @作者：白朗
*  @创建时间：2019/10/5
*/
import Http from "./http";

export default {
  methods:{
    // 获取首页接口
    getHomeList(options) {
      return Http.get('/home/list',options);
    }
  }
}