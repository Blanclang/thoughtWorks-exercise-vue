/*
*  @描述：重置路由
*  @作者：邱康松
*  @创建时间：2019/1/21
*/

import { menuRoutes } from "../routes";
let routes = menuRoutes;

export default {
  data:{
    subMenu:null,
    permissionRoutes:{}
  },
  computed:{
    menuDone() { //菜单是否已经获取到，获取到就去执行resetRoute
      return this.$store.getters.getMenu.length > 0;
    }
  },
  watch:{
    menuDone: {
      handler: function (val) {
        if(val){
          this.$nextTick(()=> {
            this.subMenu = this.$store.getters.getMenu;
            this.permissionRoutes = this.getAllPermissionRoutes(this.subMenu);
            let newRoute = this.resetRoutes(routes,this.permissionRoutes);
            newRoute.push({
              path: '*',
              name: 'error',
              component(resolve){
                require(["@/pages/error"],resolve);
              },
            });
            this.$router.addRoutes(newRoute);
          });
        }
      },
      immediate: true
    }
  },
  methods:{
    getAllPermissionRoutes(menu){
      let permissionRoutes = {};
      (function recursivePermissionRoutes(menu){
        for(let i = 0;i<menu.length;i++){
          let children = menu[i].children;
          let url = menu[i].url;
          if (menu[i].resType === 'M' || menu[i].resType === 'PM') {
            if(children && children.length){
              permissionRoutes[url] = true;
              recursivePermissionRoutes(children);
            }else{
              permissionRoutes[url] = true;
            }
          }
        }
      })(menu);
      return permissionRoutes;
    },
    resetRoutes(nroutes,resource){
      function getRoutes(routes){
        for(let i = routes.length - 1;i>=0;i--){
          let currentRoutes = routes[i];
          let currentMeta = currentRoutes.meta && currentRoutes.meta.p || '';
          let hasResource = resource[currentMeta];
          let children = currentRoutes.children;
          if(hasResource){
            if(children && children.length){
              getRoutes(children);
            }else{
              if(!hasResource){
                routes.splice(i,1);
              }
            }
          } else {
            routes.splice(i,1);
          }
        }
      }
      getRoutes(nroutes);
      return routes;
    }
  }
}