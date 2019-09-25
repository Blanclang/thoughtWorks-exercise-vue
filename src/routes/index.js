//默认路由
export let initRoutes = [
  {
    path: '/',
    name: 'index',
    redirect: {
      name: 'home'
    }
  },
  {
    path: '/home',
    name: 'home',
    component(resolve){
      require(["../pages/home"],resolve);
    },
    meta: {
      p: 'home',
      name: '首页'
    }
  },
];