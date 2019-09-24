<template>
  <div style="height: 100%" v-cloak @mouseover="hasOperation" @mousedown="hasOperation" @keydown="hasOperation">
    <div class="sysframe-box" v-if="!showMenu">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <div class="sysframe-box" v-else>
      <!-- 头部组建 -->
      <zt-header></zt-header>
      <!-- 导航组件 -->
      <!-- <frameNav :navData="navData" :currentNav ="currentNav"></frameNav> -->
      <!-- 大内容区 -->
      <div class="sysframe-content flex_lt">
        <subNav @subNavOpenFun="getSubNavOpen"></subNav>
        <!-- 内容区 -->
        <div class="sysframe-con" :class="{'sysframe-open':!sysframeOpen}">
          <!-- 历史记录 -->
          <tagsView v-if="showTabsView" :tagActiveName="tagActiveName"></tagsView>

          <div class="page-content webkit-scrollbar">
            <keep-alive :include="includeList">
              <router-view></router-view>
            </keep-alive>
            <!--<div class="push"></div>&lt;!&ndash;push在此为footer占位，高度和footer的一样&ndash;&gt;-->
          </div>
          <!--<div class="page-footer">
            <p>copyright © 2019 众云物流</p>
            <p>
              <span class="btn-item">帮助</span>
              <span class="btn-item">隐私</span>
              <span class="btn-item">条款</span>
            </p>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ztHeader from './components/zt-header.vue';
  import frameNav from './components/zt-frame-nav';
  import subNav from './components/zt-sub-nav';
  import Cookie from 'js-cookie';
  import tagsView from './components/tagsView';

  export default {
    data() {
      return {
        lTime: new Date().getTime(), // 最后一次操作的时间
        cTime: new Date().getTime(), // 当前操作的时间
        tOut: 1000 * 60 * 60 * 4,   //超时时间4小时
        sysframeOpen:false,
        tagActiveName: '' //当前高亮的页签名
      };
    },
    computed: {
      showMenu() {
        // 登录、注册、忘记密码、404页面不显示头部和菜单栏
        return this.$route.name !== 'login' && this.$route.name !== 'resetPassword' && this.$route.name !== 'register' && this.$route.name !== 'error';
      },
      showTabsView() {
        return this.showMenu && this.$route.name !== 'welcome';
      },
      includeList() {
        return this.$store.getters.getCacheList.map(item => item.name).join(',')
      }
    },
    watch: {
      $route(val,old) {
        if (this.showMenu && this.$route.name !== 'welcome' && !this.$route.meta.hiddenTag) {
          this.$store.commit('ADD_TAG_VIEW',val);
          this.tagActiveName = val.name;
        }
      }
    },
    methods:{
      getSubNavOpen(data){
        this.sysframeOpen = !data;
      },
      hasOperation() {
        if (!this.showMenu) { //如果不是需要登录的页面，即不做判断
          this.lTime = new Date().getTime();
          return false;
        }
        this.cTime = new Date().getTime(); // 记录当前操作的时间
        if (this.cTime - this.lTime > this.tOut) { //如果超时了，就退出
          // 清除缓存数据
          Cookie.remove("vlsCompanyToken",{domain:""});
          localStorage.removeItem('data');
          this.$store.commit('CLEAR_USER_INFO');
          this.lTime = new Date().getTime(); //如果已经超时了，重置最后一次操作时间
          window.alert('页面超时，请重新登录');
          location.href = '/#/login';
          location.reload(); //刷新页面，重新实例化router，防止路由重复
        } else { // 如果没有超时，就把当前时间记录为最后一次操作的时间
          this.lTime = new Date().getTime();
        }
      },
    },
    components:{
      ztHeader,
      frameNav,
      subNav,
      tagsView
    }
  }
</script>

<style lang="scss">
  @import "./assets/css/common.css";
  //引入通用样式
  .sysframe-box{
    width: 100%;
    height: 100%;
    min-width: 1200px;
    margin: 0 auto;
    // height: 100vh;
    .sysframe-content{
      width: 100%;
      height: calc(100% - 40px);
      overflow: hidden;
      .sysframe-con{
        width: calc(100% - 200px);
        transition:all 0.6s;
        padding:10px 12px;
        min-width:1000px;
        height:100%;
        background-color:#EFEFF4;
        position: relative;
        .el-tabs__new-tab {
          display: none;
        }
        .push{padding-bottom: 116px;}
        .page-content{
          width: 100%;
          height:calc(100% - 35px);
          overflow: hidden;
          overflow-y: auto;
          background: #ffffff;
        }
        .page-footer {
          position: relative;
          margin-top: -106px;
          width: 100%;
          padding: 0 50px;
          height: 60px;
          background-color: #f0f3f4;
          border-top: 1px solid #E3E6EB;
          color: #999999;
          z-index: 99;
          .btn-item {
           display: inline-block;
            cursor: pointer;
            &:hover {
              color: #c0c4cc;
            }
            +.btn-item {
              margin-left: 40px;
            }
          }
          p {
            line-height: 60px;
          }
          p:first-child {
            float: left;
          }
          p:last-child {
            float: right;
          }
        }
      }
      .sysframe-con.sysframe-open{
        width: calc(100% - 54px);
        transition:all 0.6s;
      }
    }
  }
  .button__box{padding: 20px 10px 0;}
  .search__box{
    position: relative;
    .search__form{
      .search__input--text{
        width: 300px;
      }
      .el-form-item{
        margin-bottom: 0;
      }
    }
  }
  .column__info{
    .column__info-item{
      display: block;
      padding-left: 100px;
      overflow: hidden;
      margin: 0;
      margin-bottom: 10px;
      .column__info-head{
        float: left;
        margin-left: -100px;
        color: #999;
      }
      .column__info-body{
        float: left;
        margin-left: 0;
        color: #333;
      }
    }
  }
  // 过渡效果
  .fade-enter {
    opacity:0;
  }
  .fade-leave{
    opacity:1;
  }
  .fade-enter-active{
    transition:opacity .5s;
  }
  .fade-leave-active{
    opacity:0;
    transition:opacity .5s;
  }
</style>
