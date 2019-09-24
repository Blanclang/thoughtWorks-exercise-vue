import Cookie from 'js-cookie';
export default {
  userInfo: JSON.parse(localStorage.getItem('data')) || {},
  token: Cookie.get('vlsCompanyToken') || '',
  tagsList: [{
    fullPath: '/home',
    name: 'home',
    meta: {name: '首页',p: 'home'}
  }],
  cacheList: [], //keep-alive需要缓存的页面
}