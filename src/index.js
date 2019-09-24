import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from "element-ui";
import { initRoutes } from './routes';
import store from './store'
import VueDND from 'awe-dnd';
// import './assets/css/elementui.css';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import apiMixins from './http/api';
import api_baiMixins from './http/api_bai';
import resetRoutes from './mixins/resetRoutes';
import VueVirtualScroller from 'vue-virtual-scroller';
import Cookie from 'js-cookie';
import {formatDate,Format} from "./utils";

require('./utils/directive'); //引入自定义指令
// require('./mock'); //引入mock数据

//加载虚拟列表插件
Vue.use(VueVirtualScroller);
//加载路由组件
Vue.use(VueRouter);
//加载 Element 组件
Vue.use(ElementUI, {size: 'small'}); //修改全局组件尺寸为small
//加载拖拽排序插件
Vue.use(VueDND);

Date.prototype.Format = Format;
Vue.prototype.formatDate = formatDate;

//实例化路由
const router = new VueRouter({
  routes: initRoutes
});
//路由拦截，未登陆统一跳转到login页面
router.beforeEach((to,from,next) => {
  if (!!Cookie.get('vlsCompanyToken')) {
    next();
    // 如果已经登录了，再打开登录页就自动跳转到首页
    if (to.name === 'login') {
      next({
        name: 'home'
      })
    }
  } else {
    if (to.name === 'login') {
      next();
    } else {
      next({
        name: 'login'
      })
    }
  }
});
router.onError((error) => {
  console.log(error);
  alert('版本已更新，请刷新下！');
});
//实例化Vue
const vm = new Vue({
  mixins: [apiMixins,api_baiMixins,resetRoutes],
  router,
  store,
  template: '<App/>',
  components: { App }
}).$mount("#root");
window.vm = vm;
