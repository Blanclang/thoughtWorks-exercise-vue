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

    <!-- 小于768搜索 -->
    <div class="search-wrap__lit flex_cc">
      <el-input class="search" prefix-icon="el-icon-search"></el-input>
    </div>

    <div class="menu-wrap flex_cc">
      <div class="tab-nav">
        <div class="tab-item active">All</div>
        <div class="tab-item">Physical</div>
        <div class="tab-item">Virtual</div>
      </div>
      <div class="search-wrap flex_cc">
        <el-input class="search" prefix-icon="el-icon-search"></el-input>
      </div>
      <div class="btn-wrap flex_rc">
        <span class="el-icon-s-grid active"></span>
        <span class="el-icon-s-fold"></span>
      </div>
    </div>

    <div class="list-wrap">
      <div class="list-item">
        <div class="list-img">
          <img :src="win" alt="">
        </div>
        <div class="list-data">
          <div class="list-top">
            <div class="network-box flex_lc">
              <i class="el-icon-monitor text-item"></i>
              <span class="text-item network">www.bjstdmngbgr01.thoughtworks.com</span>
            </div>
            <div class="status-box">
              <span class="text-item">building</span>
            </div>
            <div class="ip-box flex_lc">
              <i class="el-icon-warning-outline text-item"></i>
              <span class="text-item">192.168.1.243</span>
            </div>
            <div class="file-box flex_lc">
              <i class="el-icon-folder text-item"></i>
              <span class="text-item">/var/lib/cruise-agent</span>
            </div>
          </div>
          <div class="list-bottom">
            <span class="add-btn">
              <i class="el-icon-plus"></i>
            </span>
            <div class="browser-wrap">
              <span class="browser-tag">
                Firefox<i class="el-icon-delete-solid"></i>
              </span>
              <span class="browser-tag">
                Safari<i class="el-icon-delete-solid"></i>
              </span>
              <span class="browser-tag">
                Ubuntu<i class="el-icon-delete-solid"></i>
              </span>
              <span class="browser-tag">
                Chrome<i class="el-icon-delete-solid"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="list-btn"><i class="el-icon-warning-outline"></i> Deny</div>
      </div>
      <div class="list-item">
        <div class="list-img">
          <img :src="win" alt="">
        </div>
        <div class="list-data">
          <div class="list-top">
            <div class="network-box flex_lc">
              <i class="el-icon-monitor text-item"></i>
              <span class="text-item network">www.bjstdmngbgr01.thoughtworks.com</span>
            </div>
            <div class="status-box">
              <span class="text-item">building</span>
            </div>
            <div class="ip-box flex_lc">
              <i class="el-icon-warning-outline text-item"></i>
              <span class="text-item">192.168.1.243</span>
            </div>
            <div class="file-box flex_lc">
              <i class="el-icon-folder text-item"></i>
              <span class="text-item">/var/lib/cruise-agent</span>
            </div>
          </div>
          <div class="list-bottom">
            <span class="add-btn">
              <i class="el-icon-plus"></i>
            </span>
            <div class="browser-wrap">
              <span class="browser-tag">
                Firefox<i class="el-icon-delete-solid"></i>
              </span>
              <span class="browser-tag">
                Safari<i class="el-icon-delete-solid"></i>
              </span>
              <span class="browser-tag">
                Ubuntu<i class="el-icon-delete-solid"></i>
              </span>
              <span class="browser-tag">
                Chrome<i class="el-icon-delete-solid"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="list-btn"><i class="el-icon-warning-outline"></i> Deny</div>
      </div>
      <div class="list-item">
        <div class="list-img">
          <img :src="win" alt="">
        </div>
        <div class="list-data">
          <div class="list-top">
            <div class="network-box flex_lc">
              <i class="el-icon-monitor text-item"></i>
              <span class="text-item network">www.bjstdmngbgr01.thoughtworks.com</span>
            </div>
            <div class="status-box">
              <span class="text-item">building</span>
            </div>
            <div class="ip-box flex_lc">
              <i class="el-icon-warning-outline text-item"></i>
              <span class="text-item">192.168.1.243</span>
            </div>
            <div class="file-box flex_lc">
              <i class="el-icon-folder text-item"></i>
              <span class="text-item">/var/lib/cruise-agent</span>
            </div>
          </div>
          <div class="list-bottom">
            <span class="add-btn">
              <i class="el-icon-plus"></i>
            </span>
            <div class="browser-wrap">
              <span class="browser-tag">
                Firefox<i class="el-icon-delete-solid"></i>
              </span>
              <span class="browser-tag">
                Safari<i class="el-icon-delete-solid"></i>
              </span>
              <span class="browser-tag">
                Ubuntu<i class="el-icon-delete-solid"></i>
              </span>
              <span class="browser-tag">
                Chrome<i class="el-icon-delete-solid"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="list-btn"><i class="el-icon-warning-outline"></i> Deny</div>
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
  }
  .top-wrap {
    display: grid;
    .top-item {
      position: relative;
      padding: 0 10px;
      .left-text {
        line-height: 40px;
        font-size: 18px;
        color: #fff;
        display: block;
        font-weight: bold;
      }
      .right-text {
        line-height: 60px;
        font-size: 48px;
        color: #fff;
        display: block;
        text-align: right;
        padding-right: 10px;
      }
      .iconfont{
        position:absolute;
        top: -16px;
        left: 25%;
        opacity: 0.2;
        color: #fff;
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
  .menu-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 15px 0;
    background-color: #fff;
    .tab-nav {
      display: flex;
      height: 50px;
      background-color: #fff;
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
    .search-wrap{
      padding-left:30px;
      height: 50px;
      background-color: #fff;
      .search{
        width: 200px;
      }
    }
    .btn-wrap {
      flex: 1;
      height: 50px;
      text-align: right;
      padding-right: 20px;
      background-color: #fff;
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
  .search-wrap__lit{
    margin-top: 20px;
    padding: 8px 16px;
    background-color: #fff;
  }

  .list-wrap{
    border:1px solid red;
    .list-item {
      margin-bottom: 10px;
      background-color: #fff;
      padding: 15px 12px 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      .list-img {
        margin-right: 25px;
        img {
          width: 60px;
        }
      }
      .list-data {
        display: flex;
        flex-direction: column;
        .list-top {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          .network-box{
            margin-right: 24px;
          }
          .status-box{
            margin-right: 40px;
            span {
              padding: 2px 8px;
              background-color: rgb(255,154,42);
              color: #fff;
            }
          }           
          .ip-box{
            margin-right: 24px;
          }         
          i {
            font-size: 18px;
            margin-right:8px;
          }
          .text-item {
            display: inline-block;
            vertical-align: middle;
          }
          .text-item.network {
            color: #00b4cf;
            font-weight: bold
          }
        }
        .list-bottom {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          .add-btn{
            background-color:#00b4cf;
            color: #fff;
            padding:1px 4px; 
            margin-top: 5px;
            i{
              font-size: 12px;
              font-weight: bold;
            }
          }
          .browser-wrap{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            .browser-tag {
              padding: 2px 6px;
              background-color:#efefef;
              margin-top: 5px;
              margin-left:6px; 
              i{
                margin-left: 4px;
              }
            }
          }
          
        }
        
      }
      .list-btn{
        position: absolute;
        right: 18px;
        bottom: 12px;
        padding: 6px 14px;
        background-color: #00b4cf;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
        i{
          margin-right: 4px;
        }
      }
    }
  }
  
</style>