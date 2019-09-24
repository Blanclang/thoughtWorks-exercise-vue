<template>
  <div style="height: 100%" >
    <div class="sysframe-box">
      <!-- 头部组建 -->
      <zt-header></zt-header>
      <!-- 大内容区 -->
      <div class="sysframe-content flex_lt">
        <subNav @subNavOpenFun="getSubNavOpen"></subNav>
        <!-- 内容区 -->
        <div class="sysframe-con" :class="{'sysframe-open':!sysframeOpen}">

          <div class="page-content webkit-scrollbar">
              <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ztHeader from './components/zt-header.vue';
  import subNav from './components/zt-sub-nav';

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
      
    },
    watch: {
      
    },
    methods:{
      getSubNavOpen(data){
        this.sysframeOpen = !data;
      },
    },
    components:{
      ztHeader,
      subNav
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
