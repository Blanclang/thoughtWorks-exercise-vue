/*
*  @描述：接口api
*  @作者：白朗
*  @创建时间：2019/10/5
*/
import Http from "./http";

export default {
  methods:{
    // 获取导航数据接口
    getNavList(options) {
      return Http.get('/nav/list',options);
    },
    // 获取首页列表接口
    getHomeTabList(options) {
      return Http.get('/home/tab/list',options);
    }
  }
}