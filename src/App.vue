<template>
  <div class="container">
    <!-- 头部组建 -->
    <zt-header></zt-header>
    <div class="wrap">
      <!-- 导航 -->
      <subNav></subNav>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import ztHeader from './components/zt-header.vue';
  import subNav from './components/zt-sub-nav';

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
      getSubNavOpen(){
        this.sysframeOpen = !data;
      },
    },
    components:{
      ztHeader,
      subNav
    }
  }
</script>

<style lang="scss">
  @import "./assets/css/common.css";
  .container{
    width: 100%;
    border:1px solid red;
    display:grid;
    grid-auto-rows: 1fr min-content;
    .wrap{
      margin: 0 auto;
      display: grid;
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
