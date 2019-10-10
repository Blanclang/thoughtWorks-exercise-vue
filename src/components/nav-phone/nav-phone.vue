/*
*  @描述：导航-手机端组件
*  @作者：白朗
*  @创建时间：2019/10/6
*/
<template>
  <div class="nav-warp__phone" :class="getNavStatus?'show':'hide'">
    <div class="nav">
      <div class="nav-content">
        <div class="close"><span @click="closePopup">×</span></div>
        <ul class="nav-frame" >
          <li v-for="item in navData" :key="item.id" :class="{'active' : item.id===currentNav}" @click="navSelect(item.id)">
            <i class="iconfont" :class="item.icon"></i> {{item.name}}
          </li>
        </ul>
      </div>
      <div class="history">
        <p>History</p>
        <ul>
          <li v-for="(item,index) in historyDada" :key="index">
            <i class="iconfont icondian"></i> <span>{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    props:{
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
				navData:[
          {
            id:1,
            icon:'icongongyezujian-yibiaopan',
            name:'DASHBOARD'
          },
          {
            id:2,
            icon:'iconzuzhi',
            name:'AGENT'
          },
          {
            id:3,
            icon:'iconhuoche',
            name:'MY CRUISE'
          },
          {
            id:4,
            icon:'iconhelpbuoy',
            name:'HELP'
          }
        ],
        currentNav:1,
        historyDada:[
          'bjstdmngbgr02/Acceptance_test',
          'bjstdmngbgr02/Acceptance_test',
          'bjstdmngbgr02/Acceptance_testasdgadfag',
          'bjstdmngbgr02/Acceptance_test',
          'bjstdmngbgr02/Acceptance_test',
          'bjstdmngbgr02/Acceptance_test',
          'bjstdmngbgr02/Acceptance_test',
          'bjstdmngbgr02/Acceptance_test',
          'bjstdmngbgr02/Acceptance_test',
          'bjstdmngbgr02/Acceptance_testasdgadfag',
          'bjstdmngbgr02/Acceptance_test',
        ]
      };
    },
    computed: {
      //获取左边菜单栏显示隐藏状态
      getNavStatus() {
        return this.$store.getters.getNavStatus;
      }
    },
    mounted() {
    },
    methods:{
      // 导航切换
      navSelect(id){
        this.currentNav = id;
        this.closePopup();
      },
      //dispatch关闭导航状态
      closePopup(){
        this.$store.dispatch('changeStatusNavPhone',false);
      }
    },
    components:{

    }
  }
</script>

<style lang="scss" scoped>
  
  .nav-warp__phone{
    position: absolute;
    top:0px;
    width: 210px;
    height: 100%;
    background-color: #2d4054;
    .nav{
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .nav-content{
        .close{
          text-align: right;
          padding-top: 10px;
          padding-right: 10px;
          margin-bottom: 35px;
          span{
            cursor: pointer;
            font-size: 26px;
            color: #00B4CF;
          }
          span:hover{
            opacity: 0.8;
          }
        }
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
          }
          li.active{
            background-color: #435466;
            color: #00B4CF;
          }
        }
      }
      .history{
        margin-bottom: 15px;
        p{
          padding-left:10px;
          font-size: 24px;
          color: #ccc;
        }
        ul{
          margin-top: 10px;
          padding-left: 5px;
          li{
            margin-top: 6px;
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
      
    }
    
  }
  .nav-warp__phone.show{
    left: 0px;
    transition:left 0.4s;
  }
  .nav-warp__phone.hide{
    left:-210px;
    transition:left 0.4s;
  }

  
</style>