/*
*  @描述：导航组件
*  @作者：白朗
*  @创建时间：2019/10/6
*/
<template>
  <div class="nav-warp">
    <div class="nav">
      <div class="nav-content">
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
    },
    data() {
      return {
				navData:[],
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
    created() {
      //获取导航菜单数据接口
      this.getNavData();
    },
    methods:{
      //获取导航菜单数据接口
      getNavData(){
        let requestPromise = this.$root.getNavList();
        requestPromise.then(res => {
          if(!res.code){
            this.navData = res.data.list;
          }
        });
      },
      // 导航切换
      navSelect(id){
        this.currentNav = id;
      }
    }
  }
</script>

<style lang="scss" scoped>
  
  .nav-warp{
    background-color: #2d4054;
    .nav{
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .nav-content{
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

  
</style>