import Vue from "vue";
import axios from 'axios';
import Cookie from 'js-cookie';

axios.defaults.baseURL ='/v1';
axios.defaults.loginHome = "/#/login";

//http request 拦截器
axios.interceptors.request.use(
  config => {
    let token = Cookie.get('vlsCompanyToken');
    let authorization = token ? 'vlsCompany ' + token : '';
    let _key = '';
    config.headers.Authorization = authorization;
    // 去除参数的前后空格
    if (config.data) {
      _key = 'data';
    } else if (config.params) {
      _key = 'params';
    }
    if (_key) {
      for (let i in config[_key]) {
        if (typeof config[_key][i] === 'string') {              
          config[_key][i] = config[_key][i].trim();
        }
      }
    }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  response => {
    let _vm = window.vm || {};
    let res = response.data;
    let code = parseInt(res.code);
    let msg = res.message || '请求失败!';
    msg = /mysql|fallback|error|exception|com.zhengt/.test(msg.toLowerCase()) ? '系统错误，请联系管理员' : msg;
    if(code){
      if(_vm.$message){
        _vm.$message.error(msg);
      }
      if(code === 11003 || code === 11004){
        window.alert('登录状态过期，请重新登录');
        Cookie.remove("vlsCompanyToken",{domain:""});
        window.location.href = axios.defaults.loginHome;
        location.reload(); //刷新页面，重新实例化router，防止路由重复
      }
    }
    return response;
  },
  (error) => {
    let _vm = window.vm || {};
    if(error.response){
      let status = error.response.status;
      let resData = error.response.data;
      let code = resData.code;
      let msg = resData.message || '请求失败！';
      msg = /mysql|fallback|error|exception|com.zhengt/.test(msg.toLowerCase()) ? '系统错误，请联系管理员' : msg;
      if(_vm.$message){
        _vm.$message.error(msg);
      }
      if(status === 401){
        if(code === 11003 || code === 11004){
          window.alert('登录状态过期，请重新登录');
          Cookie.remove("vlsCompanyToken",{domain:""});
          window.location.href = axios.defaults.loginHome;
          location.reload(); //刷新页面，重新实例化router，防止路由重复
        }
      }
      return Promise.reject(error);
    }
    if(_vm.$message) _vm.$message.error("网络请求失败，请稍后重试")
    return Promise.reject(error)
  }
);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

function get(url,params={},config){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    },config)
    .then(response => {
      resolve(response.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

function post(url,data = {},config){
  return new Promise((resolve,reject) => {
    axios.post(url,data,config)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
    .then(response => {
      resolve(response.data);
    },err => {
      reject(err)
    })
  })
}
/**
 * 封装delete请求
 * @param  url
 * @param  params
 * @returns {Promise}
 */
function Delete(url,params={}){
  return new Promise((resolve,reject) => {
    axios.delete(url,{
      params:params
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}

export default {
  axios,
  get,
  post,
  patch,
  put,
  Delete,
}