import axios from 'axios';

axios.defaults.baseURL ='/';
axios.defaults.loginHome = "/#/home";

//http request 拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  (error) => {
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