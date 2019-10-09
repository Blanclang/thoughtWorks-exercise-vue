<template>
  <div class="container">
    <!-- 头部组建 -->
    <Header></Header>
    <div class="wrap">
      <!-- 导航 -->
      <Nav></Nav>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from './components/header';
  import Nav from './components/nav';

  export default {
    data() {
      return {
        sysframeOpen:false,
      };
    },
    computed: {
      
    },
    watch: {
      
    },
    methods:{
      getnavOpen(){
        this.sysframeOpen = !data;
      },
    },
    components:{
      Header,
      Nav
    }
  }
</script>

<style lang="scss">
  @import "./assets/css/common.css";
  .container{
    width: 100%;
    display:grid;
    grid-auto-rows: 50px auto;
    overflow: hidden;
    .wrap{
      margin: 0 auto;
      display: grid;
      .content{
        height: calc(100vh - 50px);
        overflow: auto;
      }
    }
  }

  // 过渡效果
  .fade-enter {
    opacity:0;
  }
  .fade-leave{
    opacity:1;
  }
  .fade-enter-active{
    transition:opacity .5s;
  }
  .fade-leave-active{
    opacity:0;
    transition:opacity .5s;
  }
</style>
