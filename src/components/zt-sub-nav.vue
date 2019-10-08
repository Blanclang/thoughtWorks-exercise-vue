
/*
*  @描述：左边导航
*  @作者：白朗
*  @创建时间：2019-09-27
*/
<template>
  <div class="nav-warp">
    <ul class="nav-frame">
      <li><i class="iconfont icongongyezujian-yibiaopan"></i> DASHBOARD</li>
      <li><i class="iconfont iconzuzhi"></i> AGENT</li>
      <li><i class="iconfont iconhuoche"></i> MY CRUISE</li>
      <li><i class="iconfont iconhelpbuoy"></i> HELP</li>
    </ul>
    <div class="history">
      <p>History</p>
      <ul>
        <li><i class="iconfont icondian"></i> <span>bjstdmngbgr02/Acceptance_testasdgadfag</span></li>
        <li><i class="iconfont icondian"></i> <span>bjstdmngbgr02/Acceptance_test</span></li>
        <li><i class="iconfont icondian"></i> <span>bjstdmngbgr02/Acceptance_test</span></li>
        <li><i class="iconfont icondian"></i> <span>bjstdmngbgr02/Acceptance_test</span></li>
      </ul>
    </div>
    


  </div>
</template>

<script>

  export default {
    props:{
      submenu:{
        type:Array,
        default:function(){
          return [];
        }
      }
    },
    data() {
      return {
				isCollapse:false
      };
    },
    computed:{
    },
    mounted() {
    },
    methods:{
      
    },
    components:{

    }
  }
</script>

<style lang="scss" scoped>
  
  .nav-warp{
    background-color: #2d4054;
    .nav-frame{
      margin-top: 10px;
      li{
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        padding-left: 20px;
        color: #ccc;
        cursor: pointer;
        i{
          margin-right: 8px;
        }
      }
      li:hover{
        background-color: #435466;
        color: #00B4CF;
      }
    }
  }
  .history{
    p{
      padding-left:10px;
      font-size: 24px;
      color: #ccc;
    }
    ul{
      margin-top: 10px;
      padding-left: 5px;
      li{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        color: #999;
        cursor: pointer;
        span{
          padding:0 10px;
          width: calc(100% - 16px);
          overflow: hidden;
          white-space:nowrap;
          text-overflow: ellipsis;
        }
      }
      li:hover{
        color: #00b4cf;
      }
    }
  }


  // .el-submenu /deep/ .el-submenu__title {
  //   line-height: 34px;
  //   font-size: 12px;
  //   height: 34px;
  // }
  // .el-submenu /deep/ .el-submenu__title:hover {
  //   color: #409EFF!important;
  //   background-color:transparent !important;
  //   .navicon{
  //     color: #409EFF!important;
  //   }
  // }
  
</style>