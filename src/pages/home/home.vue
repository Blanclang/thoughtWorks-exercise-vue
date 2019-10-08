/*
*  @描述：首页
*  @作者：白朗
*  @创建时间：2019/9/24
*/

<template>
  <div class="home">
    <div class="top-wrap">
      <div class="top-item building">
        <i class="iconfont iconshezhi1 building"></i>
        <span class="left-text">Building</span>
        <span class="right-text">3</span>
      </div>
      <div class="top-item idle">
        <i class="iconfont iconbeizi idle"></i>
        <span class="left-text">Idle</span>
        <span class="right-text">3</span>
      </div>
      <div class="top-item count">
        <div class="flex-item">
          <span>ALL</span>
          <span>8</span>
        </div>
        <div class="flex-item">
          <span>PHYSICAL</span>
          <span>4</span>
        </div>
        <div class="flex-item">
          <span>VIRTUAL</span>
          <span>8</span>
        </div>
      </div>
    </div>

    <div class="menu-box">
      <div class="tab-box">
        <div class="tab-item active">All</div>
        <div class="tab-item">Physical</div>
        <div class="tab-item">Virtual</div>
      </div>
      <div class="search-box">
        <el-input prefix-icon="el-icon-search" style="width: 200px;"></el-input>
      </div>
      <div class="btn-box">
        <span class="el-icon-s-grid active"></span>
        <span class="el-icon-s-fold"></span>
      </div>
    </div>

    <div class="list-content">
      <div class="list-item">
        <div class="img-box">
          <img :src="win" alt="">
        </div>
        <div class="data-box">
          <div class="top">
            <div class="status-box">
              <i class="el-icon-monitor text-item"></i>
              <span class="text-item" style="color: #00b4cf;font-weight: bold">www.asdsad.com</span>
              <span class="tag text-item">building</span>
            </div>
            <div class="file-address">
              <i class="el-icon-warning-outline text-item"></i>
              <span class="text-item">192.168.1.243</span>
              <i class="el-icon-folder text-item"></i>
              <span class="text-item">/var/lib/cruise-agent</span>
            </div>
          </div>
          <div class="bottom">
            <span class="add-btn">
              <i class="el-icon-plus"></i>
            </span>
            <span class="tag">
              Firefox<span class="el-icon-delete-solid"></span>
            </span>
            <span class="tag">
              Safari<span class="el-icon-delete-solid"></span>
            </span>
            <span class="tag">
              Chrome<span class="el-icon-delete-solid"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import win from '../../assets/images/windows.png';
  export default {
    name: 'home',
    data() {
      return {
        win,
        checkResource: [], //已经勾选的资源
        
      }
    },
    created() {
      
    },
    computed: {
      
    },
    methods: {
      handleSubmit() {
        
      }
      
    }
  }
</script>

<style scoped lang="scss">
  .home {
    border:2px solid green;
    padding: 10px 16px;
  }
  .top-wrap {
    display: grid;
    .top-item {
      position: relative;
      padding: 0 10px;
      .left-text {
        line-height: 40px;
        font-size: 18px;
        color: #ffffff;
        display: block;
        font-weight: bold;
      }
      .right-text {
        line-height: 60px;
        font-size: 48px;
        color: #ffffff;
        display: block;
        text-align: right;
        padding-right: 10px;
      }
      .iconfont{
        position:absolute;
        top: -16px;
        left: 25%;
        opacity: 0.2;
        color: #ffffff;
      }
      .iconfont.building{
        font-size:120px;
      }
      .iconfont.idle{
        font-size:130px;
      }
    }
    .top-item.building {
      background-color: #ff9a2a;
    }
    .top-item.idle {
      background-color: #7fbc39;
    }
    .top-item.count{
      background-color: #fff;
      display: grid;
    }
    .flex-item span{
      &:first-child {
        font-size: 13px;
      }
      &:last-child {
        font-weight: bold;
      }
    }
  }
  .menu-box {
    background-color: #ffffff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 15px 0;
    .tab-box {
      display: flex;
      width: 300px;
      height: 50px;
      margin-right: 30px;
      .tab-item {
        flex: 1;
        border-right: 1px solid #efefef;
        line-height: 50px;
        text-align: center;
      }
      .active {
        color: #00b4cf;
        border-bottom: 3px solid #01869a;
      }
    }
    .btn-box {
      flex: 1;
      text-align: right;
      padding-right: 20px;
      span {
        font-size: 25px;
        display: inline-block;
        &:first-child {
          margin-right: 10px;
        }
      }
      .active {
        color: #00b4cf;
      }
    }
  }
  .list-item {
    margin-bottom: 10px;
    background-color: #ffffff;
    padding: 15px;
    display: flex;
    .img-box {
      margin-right: 30px;
      img {
        width: 80px;
      }
    }
    .data-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .top {
        i {
          font-size: 18px;
        }
        .tag {
          padding: 2px 8px;
          background-color: rgb(255,154,42);
          color: #ffffff;
        }
        .text-item {
          display: inline-block;
          margin-right: 10px;
          vertical-align: middle;
        }
      }
      .bottom {
        .add-btn{
          background-color:#00b4cf;
          color: #ffffff;
          padding:1px 4px; 
          i{
            font-size: 12px;
            font-weight: bold;
          }
        }
        .tag {
          padding: 2px 8px;
          background-color:#efefef;
          margin-left:6px; 
        }
      }
      
    }
  }
  
</style>