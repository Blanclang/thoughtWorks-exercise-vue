/*
*  @描述：首页
*  @作者：白朗
*  @创建时间：2019/9/24
*/

<template>
  <div class="home">
    <!--上部栏 -->
    <div class="top-wrap">
      <div class="top-item building">
        <i class="iconfont iconshezhi1 building"></i>
        <span class="left-text">Building</span>
        <span class="right-text">3</span>
      </div>
      <div class="top-item idle">
        <i class="iconfont iconbeizi idle"></i>
        <span class="left-text">Idle</span>
        <span class="right-text">5</span>
      </div>
      <div class="top-item count">
        <div class="count-item">
          <span>ALL</span>
          <span>8</span>
        </div>
        <div class="count-item">
          <span>PHYSICAL</span>
          <span>4</span>
        </div>
        <div class="count-item">
          <span>VIRTUAL</span>
          <span>8</span>
        </div>
      </div>
    </div>

    <!-- 小于768搜索 -->
    <div class="search-wrap__lit flex_cc">
      <el-input class="search" prefix-icon="el-icon-search"></el-input>
    </div>
    <!-- tab -->
    <div class="menu-wrap flex_cc">
      <div class="tab-nav">
        <div class="tab-item" :class="{'active':currentTab === item.id}" v-for="item in tabData" :key="item.id" @click="tabSelect(item.id)">{{item.name}}</div>
      </div>
      <div class="search-wrap flex_cc">
        <el-input class="search" prefix-icon="el-icon-search"></el-input>
      </div>
      <div class="btn-wrap flex_rc">
        <span class="el-icon-s-grid active"></span>
        <span class="el-icon-s-fold"></span>
      </div>
    </div>
    <!-- 列表 -->
    <div class="list-wrap">
      <div class="list-item" :class="item.status?'building':'idle'" v-for="item in listData" :key="item.id">
        <div class="list-img">
          <img :src="item.image" alt="">
        </div>
        <div class="list-data">
          <div class="list-top">
            <div class="network-box flex_lc">
              <i class="el-icon-monitor text-item"></i>
              <span class="text-item network">{{item.url}}</span>
            </div>
            <div class="status-box">
              <span v-if="item.status" class="text-item building">building</span>
              <span v-else class="text-item idle">idle</span>
            </div>
            <div class="ip-box flex_lc">
              <i class="el-icon-warning-outline text-item"></i>
              <span class="text-item">{{item.ip}}</span>
            </div>
            <div class="file-box flex_lc">
              <i class="el-icon-folder text-item"></i>
              <span class="text-item">{{item.file}}</span>
            </div>
          </div>
          <div class="list-bottom">
            <span class="add-btn">
              <i class="el-icon-plus"></i>
            </span>
            <div class="browser-wrap">
              <span class="browser-tag" v-for="(itm,index) in item.browser" :key="index">
                {{itm}}<i class="el-icon-delete-solid"></i>
              </span>
            </div>
          </div>
        </div>
        <div v-if="item.status" class="list-btn"><i class="el-icon-warning-outline"></i> Deny</div>
      </div>
    </div>
    <!-- 手机模式弹出层 -->
    <div v-if="navPopupPhone" class="popup">
      <nav-phone v-on:closeCall="closeCall"></nav-phone>
    </div>
  </div>
</template>

<script>
  import navPhone from '@/components/nav-phone';
  export default {
    name: 'home',
    data() {
      return {
        navPopupPhone:true,
        tabData:[
          {
            id:1,
            name:'All'
          },
          {
            id:2,
            name:'Physical'
          },
          {
            id:3,
            name:'Virtual'
          }
        ],
        currentTab:1,
        listData: [
          {
            id:1,
            status:0,
            image:require('../../assets/images/list1.png'),
            url:'www.bjstdmngbgr01.thoughtworks.com',
            ip:'192.168.1.102',
            file:'/var/lib/cruise-agent',
            browser:['Firefox','Safari','Ubuntu','Chrome']
          },
          {
            id:2,
            status:1,
            image:require('../../assets/images/list1.png'),
            url:'www.bjstdmngbgr08.thoughtworks.com',
            ip:'192.168.1.243',
            file:'/var/lib/cruise-agent',
            browser:['Firefox','Safari','Ubuntu','Chrome']
          },
          {
            id:3,
            status:1,
            image:require('../../assets/images/list2.jpg'),
            url:'www.bjstdmngbgr10.thoughtworks.com',
            ip:'192.168.1.80',
            file:'/var/lib/cruise-agent',
            browser:['Firefox','Safari']
          },
          {
            id:4,
            status:1,
            image:require('../../assets/images/list3.jpg'),
            url:'www.bjstdmngbgr11.thoughtworks.com',
            ip:'192.168.1.243',
            file:'/var/lib/cruise-agent',
            browser:['Firefox','Safari','Ubuntu','Chrome']
          },
          {
            id:5,
            status:0,
            image:require('../../assets/images/list4.jpg'),
            url:'www.bjstdmngbgr15.thoughtworks.com',
            ip:'192.168.1.117',
            file:'/var/lib/cruise-agent',
            browser:[]
          },
          {
            id:6,
            status:1,
            image:require('../../assets/images/list1.png'),
            url:'www.bjstdmngbgr01.thoughtworks.com',
            ip:'192.168.1.110',
            file:'/var/lib/cruise-agent',
            browser:['Firefox','Safari','Ubuntu','Chrome']
          },
          {
            id:7,
            status:0,
            image:require('../../assets/images/list1.png'),
            url:'www.bjstdmngbgr01.thoughtworks.com',
            ip:'192.168.1.110',
            file:'/var/lib/cruise-agent',
            browser:['Firefox','Safari','Ubuntu','Chrome']
          },
          {
            id:8,
            status:0,
            image:require('../../assets/images/list1.png'),
            url:'www.bjstdmngbgr01.thoughtworks.com',
            ip:'192.168.1.110',
            file:'/var/lib/cruise-agent',
            browser:['Firefox','Safari','Ubuntu','Chrome']
          }
        ],
      }
    },
    created() {
      
    },
    methods: {
      //tab切换
      tabSelect(id){
        this.currentTab = id;
      },
      closeCall(value){
        console.log(value);
        this.navPopupPhone = false;
      }
      
    },
    components:{
      navPhone
    }
  }
</script>

<style scoped lang="scss">
  .home {
  }
  .top-wrap {
    display: grid;
    .top-item {
      position: relative;
      padding: 0 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      .left-text {
        position: absolute;
        top: 15px;
        left: 15px;
        font-size: 18px;
        color: #fff;
        font-weight: bold;
      }
      .right-text {
        position: absolute;
        right: 15px;
        bottom: 15px;
        font-size: 48px;
        color: #fff;
        text-align: right;
      }
      .iconfont{
        opacity: 0.2;
        color: #fff;
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
    .count-item span{
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
        cursor: pointer;
      }
      .tab-item:hover {
        color: #00b4cf;
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
    .list-item {
      margin-bottom: 15px;
      background-color: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      position: relative;
      padding: 15px 12px 15px;
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
            width: 70px;
            span {
              padding: 2px 8px;
              color: #fff;
            }
            span.building {
              background-color: rgb(255,154,42);
            }
            span.idle {
              background-color: #7fbc39;
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
            cursor: pointer;
            i{
              font-size: 12px;
              font-weight: bold;
            }
          }
          .add-btn:hover{
            opacity: 0.8;
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
        padding: 6px 14px;
        background-color: #00b4cf;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
        i{
          margin-right: 4px;
        }
      }
      .list-btn:hover{
        opacity: 0.8;
      }
    }
  }
  
  .popup{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    background: rgba(0,0,0,0.6);
    z-index: 10;
  }
</style>