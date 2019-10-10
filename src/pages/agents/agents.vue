/*
*  @描述：首页
*  @作者：白朗
*  @创建时间：2019/10/5
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
      <div class="list-item" :class="item.status?'building':'idle'" v-for="(item,index) in listTabData" :key="item.id">
        <div class="list-img">
          <img :src="require(`@/assets/images/${item.os}.jpg`)" alt="">
        </div>
        <div class="list-data">
          <div class="list-top">
            <div class="network-box flex_lc">
              <i class="el-icon-monitor text-item"></i>
              <span class="text-item network">{{item.name}}</span>
            </div>
            <div class="status-box">
              <span v-if="item.status == 'building'" class="text-item building">building</span>
              <span v-else class="text-item idle">idle</span>
            </div>
            <div class="ip-box flex_lc">
              <i class="el-icon-warning-outline text-item"></i>
              <span class="text-item">{{item.ip}}</span>
            </div>
            <div class="file-box flex_lc">
              <i class="el-icon-folder text-item"></i>
              <span class="text-item">{{item.location}}</span>
            </div>
          </div>
          <div class="list-bottom">
            <span class="add-btn" @click="addBrowser(index)" >
              <i class="el-icon-plus"></i>
            </span>
            <div class="browser-wrap">
              <span class="browser-tag" v-for="(itm,idx) in item.resources" :key="idx">
                {{itm}}<i class="el-icon-delete-solid" @click="deleteBrowser(index,idx)"></i>
              </span>
            </div>
          </div>
        </div>
        <div v-if="item.status == 'building'" class="list-btn"><i class="el-icon-warning-outline"></i> Deny</div>
      </div>
    </div>
    <!-- 手机模式导航弹出层 -->
    <div class="nav-popup" :class="getNavStatus?'show':'hide'">
      <nav-phone></nav-phone>
    </div>
    <!--添加浏览器弹框-->
    <div class="browser-popup flex_cc" :class="browserStatus?'show':'hide'">
      <div class="browser-box">
        <span class="close" @click="cancelBrowser">×</span>
        <div class="browser-con">
          <p class="directions">Separate multiple resource name with commas</p>
          <input type="text" v-model="browserText" placeholder="Input value">
        </div>
        <div class="browser-footer flex_lc">
          <div class="footer-btn sure" @click="submitBrowser">Add Resources</div>
          <div class="footer-btn cancel" @click="cancelBrowser">Cancel</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import navPhone from '@/components/nav-phone';

  export default {
    name: 'agents',
    data() {
      return {
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
        listTabData: [],
        browserStatus:false,
        browserText:'',
        browserIdx:null
      }
    },
    computed: {
      //获取左边菜单栏显示隐藏状态
      getNavStatus() {
        return this.$store.getters.getNavStatus;
      }
    },
    created() {
      //获取tab列表接口
      this.getHomeTabList();
    },
    methods: {
      //获取tab列表接口
      getHomeTabList(){
        let requestPromise = this.$root.getHomeTabList();
        requestPromise.then(res => {
          console.log(res);
          if(!res.code){
            this.listTabData = res.data.list;
          }
        });
      },
      //tab切换
      tabSelect(id){
        this.currentTab = id;
      },
      //添加浏览器
      addBrowser(index){
        this.browserIdx = index;
        this.browserStatus=true;
      },
      //删除浏览器
      deleteBrowser(index,idx){
        this.listTabData[index].resources.splice(idx,1);
      },
      //添加浏览器
      submitBrowser(){
        if(this.browserText){
          let addArr = this.browserText.split(',');
          this.listTabData[this.browserIdx].resources = this.listTabData[this.browserIdx].resources.concat(addArr);
          this.cancelBrowser();
        }
      },
      //浏览器
      cancelBrowser(){
        this.browserStatus=false;
        this.browserText = '';
      }
    },
    components:{
      navPhone
    }
  }
</script>

<style scoped lang="scss">
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
      padding: 20px 12px;
      .list-img {
        margin-right: 25px;
        img {
          width: 80px;
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
                cursor: pointer;
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
  /* 弹出层导航栏 */
  .nav-popup{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    background: rgba(0,0,0,0.6);
    transition:opacity 0.4s,z-index 0.6s;
  }
  .nav-popup.show{
    z-index: 5;
    opacity: 1;
  }
  .nav-popup.hide{
    z-index: -1;
    opacity: 0;
  }
  /* 添加浏览器弹框 */
  .browser-popup{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    background: rgba(0,0,0,0.6);
    transition:opacity 0.4s,z-index 0.6s;
  }
  .browser-box{
    position: relative;
    background-color: #fff;
    width: 570px;
    box-shadow:0 3 5px (#000,30%);
    padding: 15px;
    .close{
      position: absolute;
      top: 5px;
      right: 10px;
      color: #00b4cf;
      font-size: 30px;
      font-weight: bold;
      cursor: pointer;
    }
    .browser-con{
      padding-top:10px; 
      input{
        display: block;
        margin-top: 10px;
        padding:0 10px;
        color: #00b4cf;
        width: 100%;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    }
    .browser-footer{
      margin-top: 20px;
      .footer-btn{
        text-align: center;
        line-height: 30px;
        height: 30px;
        color: #f3f3f3;
        cursor: pointer;
      }
      .footer-btn:hover{
        opacity: 0.8;
      }
      .footer-btn.sure{
        background-color: #00b4cf;
      }
      .footer-btn.cancel{
        background-color: #435466;
      }
    }      
  }
  .browser-popup.show{
    z-index: 4;
    opacity: 1;
  }
  .browser-popup.hide{
    z-index: -1;
    opacity: 0;
  }
</style>