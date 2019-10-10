//默认路由
export let initRoutes = [
  {
    path: '/',
    name: 'index',
    redirect: {
      name: 'agents'
    }
  },
  {
    path: '/agents',
    name: 'agents',
    component(resolve){
      require(["../pages/agents"],resolve);
    },
    meta: {
      p: 'agents',
      name: '首页'
    }
  },
];