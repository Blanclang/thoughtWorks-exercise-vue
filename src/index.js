import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from "element-ui";
import {initRoutes} from './routes';
import store from './store'
// import './assets/css/elementui.css';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import apiMixins from './http/api';
import {formatDate,Format} from "./utils";

require('./utils/directive'); //引入自定义指令
// require('./mock'); //引入mock数据

//加载路由组件
Vue.use(VueRouter);
//加载 Element 组件
Vue.use(ElementUI, {size: 'small'}); //修改全局组件尺寸为small

Date.prototype.Format = Format;
Vue.prototype.formatDate = formatDate;

//实例化路由
const router = new VueRouter({
  routes: initRoutes
});

//实例化Vue
const vm = new Vue({
  mixins: [apiMixins],
  router,
  store,
  template: '<App/>',
  components: { App }
}).$mount("#root");
window.vm = vm;
