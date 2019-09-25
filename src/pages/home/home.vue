/*
*  @描述：首页
*  @作者：白朗
*  @创建时间：2019/9/24
*/

<template>
  <div class="home">
    <div class="top">
      <div class="top-item">
        <span class="left-text">Building</span>
        <span class="right-text">3</span>
      </div>
      <div class="top-item">
        <span class="left-text">Idle</span>
        <span class="right-text">3</span>
      </div>
      <div class="top-item">
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
    max-width: 900px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    .top-item {
      flex: 1;
      height: 100px;
      padding: 0 10px;
      &+.top-item {
        margin-left: 30px;
      }
      &:nth-child(1) {
        background-color: #ff9a2a;
      }
      &:nth-child(2) {
        background-color: #7fbc39;
      }
      &:nth-child(3) {
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        .flex-item {
          flex: 1;
          span {
            display: block;
            text-align: center;
            line-height: 50px;
            &:first-child {
              font-size: 12px;
            }
            &:last-child {
              font-size: 20px;
              font-weight: bold;
            }
          }
        }
      }
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
      }
      .text-item {
        display: inline-block;
        margin-right: 10px;
        vertical-align: middle;
      }
    }
  }
  
</style>