/*
*  @描述：首页卡片组件
*  @作者：邱康松
*  @创建时间：2019/1/5
*/

<template>
  <div class="home-box">
    <!--公司logo和名字-->
    <div class="logo-box" v-if="showLogo">
      <div class="logo">
        <img :src="logo" alt="">
      </div>
      <div class="name">
        {{companyName}}
      </div>
      <div class="check">
        <i class="el-icon-check"></i>已认证
      </div>
    </div>
    <!--统计卡片-->
    <div class="card-box" v-else>
      <h4>{{title}}</h4>
      <div class="flex-box" v-if="icon">
        <div class="icon-box">
          <slot name="icon"></slot>
        </div>
        <div class="num-box">
          <slot name="num"></slot>
        </div>
      </div>
      <div class="flex-box item-box" v-else>
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import logo from '../../assets/images/login_logo.png';
  export default {
    props: {
      icon: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '标题'
      },
      showLogo: {
        type: Boolean,
        default: false
      },
      companyName: {
        type: String,
        default: '企业名称'
      }
    },
    data() {
      return {
        logo
      }
    }
  }
</script>

<style scoped lang="scss">
  .home-box {
    flex: 1;
    &+.home-box {
      margin-left: 20px;
    }
  }
  .logo-box {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 4px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    div {
      margin-right: 20px;
    }
    .name {
      font-weight: bold;
      font-size: 18px;
    }
    .check {
      color: #409EFF;
      font-size: 10px;
      border: 1px solid #409EFF;
      padding: 0 3px;
      border-radius: 3px;
    }
    .logo {
      height: 60px;
      width: 60px;
      border-radius: 50%;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .card-box {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 4px;
    h4 {
      color: #666666;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .flex-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon-box {
        height: 60px;
        width: 60px;
        background-color: #F2F6FC;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 30px;
          width: 28px;
        }
      }
      .num-box {
        color: #666666;
        span {
          font-weight: bold;
          font-size: 30px;
          display: inline-block;
          margin-right: 10px;
          color: #409EFF;
        }
      }
      &.item-box {
        div {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          &+div {
            border-left: 1px solid #EAEEFB;
          }
          span {
            color: #666666;
          }
          span:first-child {
            font-size: 25px;
            font-weight: bold;
            color: #409EFF;
            display: inline-block;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>