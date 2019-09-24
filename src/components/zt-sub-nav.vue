
/*
*  @描述：左边导航树状、一级结构
*  @作者：白朗
*  @创建时间：2018-04-20
*/
<template>
  <div class="frame-sub-nav">
    <div class="sub-nav-con sub-navcon-open">
      <!-- 树状导航 :background-color="backgroundColor"-->
      <el-menu class="el-menu-vertical-demo"
      :default-active="$route.meta.p"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      :text-color="textColor"
      :active-text-color="activeTextColor" 
      @select="handleSelect"
      :unique-opened="true"
      router>
        <template v-for="(menu,$index) in dSubmenu">
					<el-submenu  :class="currentFirstNav == $index?'submenu_sty':'submenunav_sty'" :index="$index.toString()" v-if="menu.children && menu.children.length && checkChildMenu(menu.children)" :key="$index"> 
            <template slot="title">
              <i class="navicon iconfont" :class="menu.itemIcon"></i><span>{{menu.name}}</span>
            </template>
            
            <!-- 三级菜单栏-->
            <template v-for="(mc,$index2) in menu.children">
              <el-submenu class="submenu_sty" :index="($index2*10).toString()" v-if="mc.children && mc.children.length && checkChildMenu(mc.children)" :key="$index2">
                <template slot="title">{{mc.name}}</template>
                <el-menu-item class="submenu_sty" v-for="(mc2,index) in mc.children" :route="{name:(mc2.url || '').trim()}" :index="(mc2.url || '').trim() || ''" :key="index">{{mc2.name}}</el-menu-item>
              </el-submenu>
              <el-menu-item class="submenu_sty" v-else :route="{name:(mc.url || '').trim()}" :index="(mc.url || '').trim() || ''" :key="$index2">{{mc.name}}</el-menu-item>
            </template>

          </el-submenu>

          <el-menu-item class="el-menu-nav"  v-else :route="{name:(menu.url || '').trim()}" :index="(menu.url || '').trim() || ''" :key="$index">
            <i class="navicon iconfont" :class="menu.itemIcon"></i><span slot="title">{{menu.name}}</span>
          </el-menu-item>

        </template>
      </el-menu>
    </div>
    <!-- 左边导航收缩 -->
    <div v-if="dHasNavToggle" class="open-close-btn" @click="subNavToggle">
      <i :class="isCollapse ? 'el-icon-caret-right' : 'el-icon-caret-left'"></i>
      <img :src="subNavBg"/>
    </div>
  </div>
</template>

<script>
  const subNavBg = require("./../assets/images/subnav-bg.png");
  export default {
    props:{
      submenu:{
        type:Array,
        default:function(){
          return [];
        }
      },
      platform:{
        type:String,
        default:"store"
      },
      hasresources:{
        type:Boolean,
        default:true
      },
      hasNavToggle:{
        type:Boolean,
        default:true
      },
      backgroundColor:{
        type:String,
        default:"#1c2b36"
      },
      textColor:{
        type:String,
        default:"#B2C6D4"
      },
      activeTextColor:{
        type:String,
        default:"#ffffff"
      }
    },
    data() {
      return {
				isCollapse:false,
        /*dSubmenu:[
          {
            name: '首页',
            url: 'home'
          },
          {
            name: '业务中心',
            url: 'businessCenter',
            children: [
              {
                name: '计划管理',
                resType: 'M',
                children: [
                  {
                    name: '物流执行计划',
                    url: 'logisticsPlan',
                    resType: 'M'
                  },
                  {
                    name: '运输计划',
                    url: 'transportPlan',
                    resType: 'M'
                  },
                  {
                    name: '物流执行计划取消通知',
                    url: 'planCancelNotice',
                    resType: 'M'
                  },
                  {
                    name: '拖车进门时间通知',
                    url: 'carInDoorNotice',
                    resType: 'M'
                  },
                  {
                    name: '计划发布状态跟踪',
                    url: 'planStatusTrack',
                    resType: 'M'
                  }
                ]
              }
            ]
          },
          {
            name: '资源库',
            url: 'resources',
            children: [
              {
                name: '司机资料',
                url: 'driverData',
                resType: 'M'
              },
              {
                name: '车辆资料',
                url: 'vehicleData',
                resType: 'M'
              },
              {
                name: '承运商资料',
                url: 'companyData',
                resType: 'M'
              },
              {
                name: '业务运力池查询',
                url: 'businessPool',
                resType: 'M'
              },
              {
                name: '字典管理',
                url: 'dictionary',
                children: [
                  {
                    name: '主机厂字典表',
                    url: 'enginefactory',
                    resType: 'M'
                  },
                  {
                    name: '本公司字典表',
                    url: 'company',
                    resType: 'M'
                  },
                  {
                    name: '物流公司字典',
                    url: 'logistics',
                    resType: 'M'
                  },
                  {
                    name: '区域城市对应表',
                    url: 'city',
                    resType: 'M'
                  },
                  {
                    name: '承运商线路表',
                    url: 'carrierline',
                    resType: 'M'
                  },
                  {
                    name: '结算城市对应表',
                    url: 'settlecity',
                    resType: 'M'
                  },
                  {
                    name: '地址管理',
                    url: 'address',
                    resType: 'M'
                  }
                ]
              }
            ]
          },
          {
            name: '品质管理',
            children: [
              {
                name: '运输出险报告',
                url: 'transportRiskReport',
                resType: 'M'
              }
            ]
          },
          {
            name: '报表中心',
            children: [
              {
                name: '线路汇总',
                url: 'lineSummary',
                resType: 'M'
              },
              {
                name: '专线统计',
                url: 'specialLineStatistics',
                resType: 'M'
              },
              {
                name: '轮板统计',
                url: 'assignSummary',
                resType: 'M'
              }
            ]
          },
          {
            name: '系统管理',
            url: 'systemManage',
            children: [
              {
                name: '通讯录查询',
                url: 'addressBook',
                resType: 'M'
              },
              {
                name: '成员管理',
                url: 'memberManage',
                resType: 'M'
              },
              {
                name: '用户组权限',
                url: 'userGroupAuth',
                resType: 'M'
              },
              {
                name: '我的设置',
                url: 'myselfSetting',
                resType: 'M'
              },
              {
                name: '操作日志',
                url: 'operationLog',
                resType: 'M'
              },
            ]
          },
				],*/
        subNavBg,
        dHasNavToggle:this.hasNavToggle,
        currentFirstNav:-1,
        firstNav:-1,
        secondNav:-1,
      };
    },
    computed:{
      dSubmenu() {
        return [{name: '首页', url: 'home', itemIcon: "zticon-index"}].concat(this.$store.getters.getMenu);
      }
    },
    mounted() {
      this.dealMenu();
    },
    methods:{
      //判断资源的children里面是否有菜单，有菜单才显示下拉，如果children里面的都为按钮，即不显示下拉
      checkChildMenu(arr) {
        return arr.some(item => item.resType === 'M' || item.resType === 'PM'); //resType为M/PM才是菜单，B为按钮
      },
      handleOpen(key, keyPath) {
        this.currentFirstNav = keyPath[0];
      },
      handleClose(key, keyPath) {
      },
      subNavToggle(){
        this.isCollapse = !this.isCollapse;
        this.$emit('subNavOpenFun',this.isCollapse);
        this.dealMenu();
      },
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
        this.currentFirstNav = keyPath[0];
      },
      //寻找第一级
      dealMenu(){
        var _this = this;
        this.currentFirstNav=0;
        var path = this.$route.path;
        if (path === '/') {
          return false;
        }
        var pathName = path?path.substr(1, path.length-1):'';
        var dSubmenu = this.dSubmenu;
        var firstFloor = 0;
        dSubmenu.forEach(( item1, n1 )=> {
          if(pathName == item1.url ){
            _this.currentFirstNav=n1;
            return;
          }
          if(item1.children){
            // 第二级
            let pro2= item1.children;
            pro2.forEach(( item2, n2 )=> {
              if(pathName == item2.url ){
                _this.currentFirstNav=n1;
                return;
              }
              if(item2.children){
                // 第三级
                let pro3= item2.children;
                pro3.forEach(( item3, n3 )=> {
                  if(pathName == item3.url ){
                    _this.currentFirstNav=n1;
                    return;
                  }
                });
              }
            });
          }
        });
      }
    },
    components:{

    }
  }
</script>

<style lang="scss" scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    // background-color: #1c2b36;
  }
  .frame-sub-nav {
    // width: 200px;
    height:100%;
    background-color: #1c2b36;
    color: #ffffff;
    position: relative;
    .el-menu-item, .el-submenu {
      // min-width: 200px;
    }
    .sub-nav-con{
      // width: 196px;
      font-size: 12px;
      // background-color:#1c2b36;
    }
    // 左边导航收缩
    .sub-nav-con.sub-navcon-close{
      opacity: 0;
      margin-left: -196px;
      transition:all 0.3s;
    }
    .sub-nav-con.sub-navcon-open{
      opacity: 1;
      margin-left: 0px;
      transition:all 0.5s;
      overflow-y: auto;
      overflow-x: hidden;
      height: 100%;
      /* 针对缺省样式 (必须的) */
      &::-webkit-scrollbar {
        width: 5px;
        height:0px;
      }
      /* 滚动条的滑轨背景颜色 */
      &::-webkit-scrollbar-track {
        background-color: #444448 !important;
        border-radius:5px;
      }
      /* 滑块颜色 */
      &::-webkit-scrollbar-thumb {
        background-color: #696979 !important;
        border-radius:10px;
        -webkit-box-shadow: none;
      }
      /*内层轨道的颜色*/
      &::-webkit-scrollbar-track-piece{
        background-color:#444448;
        border-radius:5px;
      }
      /* 滑轨两头的监听按钮颜色 */
      &::-webkit-scrollbar-button {
        background-color:#444448;
        width:0;
        height:0;
      }
      /* 横向滚动条和纵向滚动条相交处尖角的颜色 */
      &::-webkit-scrollbar-corner {
        background-color: black;
      }
    }
    .open-close-btn{
      position: absolute;
      top: 50%;
      right: -11px;
      height: 90px;
      margin-top: -45px;
      cursor: pointer;
      z-index: 99;
      img{
        height: 100%;
      }
      i{
        position: absolute;
        top: 50%;
        margin-top: -7px;
        left: -2px;
        color: #89a2b4;
      }
    }
    .open-close-btn:hover{
      i{
        color: #ffffff;
      }
    }
  }
  .frame-sub-nav.sub-nav-close{
    width: 0px;
    transition:all 0.3s;
  }
  .frame-sub-nav.sub-nav-open{
    width: 200px;
    transition:all 0.3s;
  }
  .el-menu{
    background-color:#1c2b36;
  }
  .el-menu-item {
    // min-width: 196px;
    color:#ffffff;
    height: 34px;
    line-height: 34px;
    font-size: 12px;
  }
  .el-menu-item:hover {
    color: #409EFF!important;
    // background-color:transparent!important;
  }
  .menu-item-first {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }
  .el-submenu /deep/ .el-submenu__title {
    line-height: 34px;
    font-size: 12px;
    height: 34px;
  }
  .el-submenu /deep/ .el-submenu__title:hover {
    color: #409EFF!important;
    background-color:transparent !important;
    .navicon{
      color: #409EFF!important;
    }
  }
  .el-menu-item.is-active {
    color: #409EFF;
    // border-left: 2px solid #409eff;
    background-color:#409EFF!important;
    // background: linear-gradient(90deg,rgba(64,158,255,0.3) 0%,rgba(64,158,255,0) 100%) !important;
  }
  .el-menu-item.is-active:hover {
    color: #ffffff!important;
    .navicon{
      color: #ffffff!important;
    }
  }
  .el-menu--collapse{
    width:54px;
  }
  .navicon{
    font-size:13px;
    margin-right:4px;
    color:#B2C6D4;
  }
  .submenu_sty{
    background-color:#000000!important;
  }
  .submenunav_sty{
    background-color:#1c2b36!important;
  }
  .el-menu-nav{
    background-color:#1c2b36;
  }
  .el-menu-nav:hover{
    .navicon{
      color: #409EFF!important;
    }
  }
</style>