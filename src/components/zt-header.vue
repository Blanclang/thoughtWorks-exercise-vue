/*
*  @描述：页面结构的头部组件
*  @作者：白朗
*  @创建时间：2019-09-27
*/
<template>
  <div class="header">
    <div class="open-wrap flex_cc">
      <span class="el-icon-s-fold"></span>
    </div>
    <!-- logo -->
    <div class="logo-wrap flex_cc">
      <img class="icon" :src="logo"/>
    </div>
    <div class="person-wrap flex_cc">
      <el-dropdown>
        <div class="el-dropdown-link">
          <img :src="userIcon" alt="">
          <span style="color: #fff;font-size: 12px">
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
        </div>
          <el-dropdown-menu class="dropsty" slot="dropdown" style="min-width: 100px">
            <el-dropdown-item>Profile</el-dropdown-item>
            <el-dropdown-item>Sign Out</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import ztLogo from "@/assets/images/logo.jpg";
  import userIcon from "@/assets/images/head.jpg";

  export default {
    components:{
    },
    data() {
      return {
				logo:ztLogo,
        userIcon,
      };
    },
    created(){

    },
    methods:{
      
    }
  }
</script>

<style lang="scss" scoped>
  .header /deep/ {
    height: 50px;
    background: #fff;
    border-bottom: 1px solid #ccc; 
    display: grid;
    grid-template-columns: 100px auto 100px;



    .el-dropdown-link {
      cursor: pointer;
      span {
        display: inline-block;
        vertical-align: middle;
      }
      img {
        height: 28px;
        width: 28px;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .open-wrap{
      border:1px solid red;
      span{
        font-size:28px;
        cursor: pointer;
      }
    }
    .logo-wrap{
      border:1px solid blue;
      img{
        width: 100px;
      }
    }
    .person-wrap{
      border:1px solid red;
      
      padding-right: 18px;
      p{
        margin: 0px 10px;
        color: #666666;
      }
      .under-line{
        margin: 0px 10px;
        text-decoration: underline;
        cursor: pointer;
        span{
          color:#409EFF;
        }
      }
      .blue-color{
        color: #409eff;
      }
    }
  }
  
</style>