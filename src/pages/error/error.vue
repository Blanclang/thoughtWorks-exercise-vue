/*
*  @描述：404页面
*  @作者：邱康松
*  @创建时间：2019/1/21
*/

<template>
  <div class="error-page">
    <div class="error-img"></div>
    <h4>哎呀！迷路了...</h4>
    <div class="reason">
      <p>可能的原因：</p>
      <ul>
        <li>你没有权限访问该页面</li>
        <li>原来的页面不存在了</li>
      </ul>
    </div>
    <div class="btn">
      <el-button type="primary" @click="toHome">返回首页</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      toHome() {
        location.href = '/#/home';
      }
    }
  }
</script>

<style scoped lang="scss">
  .error-page {
    text-align: center;
    margin: auto;
    padding-top: 50px;
    .error-img {
      background: url("../../assets/images/404.png") no-repeat;
      background-size: 100%;
      height: 200px;
      width: 200px;
      display: inline-block;
    }
    .btn {
      margin-top: 50px;
    }
    .reason {
      width: 200px;
      display: inline-block;
      text-align: left;
      margin-top: 30px;
      margin-left: 25px;
      color: #999999;
      ul {
        list-style: initial;
        li {
          margin-left: 30px;
        }
      }
    }
    h4 {
      font-size: 25px;
    }
  }
</style>