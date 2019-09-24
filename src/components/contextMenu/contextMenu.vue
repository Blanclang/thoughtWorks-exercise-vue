/*
*  @描述：右键自定义菜单组件
*  @作者：邱康松
*  @创建时间：2019/3/22
*/

<template>
  <div class="menu-box" @contextmenu="showMenu" @mouseup="hideMenu">
    <slot name="body"></slot>
    <div class="right-menu" ref="rightMenu">
      <span v-for="(item,index) in menuList" :key="index" @click="menuClick(item)">{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      menuList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {}
    },
    methods: {
      menuClick(name) {
        this.$emit('menuClick',name);
      },
      showMenu(event) {
        event.preventDefault();
        this.$refs['rightMenu'].style.display = 'block';
        this.$refs['rightMenu'].style.top = event.clientY + 'px';
        this.$refs['rightMenu'].style.left = event.clientX + 'px';
      },
      hideMenu(event) {
        if (event.button === 0) { //鼠标左键
          this.$refs['rightMenu'].style.display = 'none';
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .menu-box {
    position: relative;
  }
  .right-menu {
    display: none;
    position: fixed;
    z-index: 999;
    background-color: #ffffff;
    border: 1px solid #eee;
    box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
    border-radius: 1px;
    span {
      display: block;
      padding: 0 20px;
      line-height: 40px;
      &:hover {
        background-color: #409EFF;
        color: #ffffff;
        cursor: pointer;
      }
    }
  }
</style>