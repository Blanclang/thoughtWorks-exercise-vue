/*
*  @描述：固定在底部的数据展示条
*  @作者：邱康松
*  @创建时间：2019/6/20
*/

<template>
  <div class="total-fixed">
    <slot name="body"></slot>
  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .total-fixed {
    position: absolute;
    bottom: 10px;
    width: calc(100% - 24px);
    padding: 0 10px;
    color: #1989FA;
    line-height: 30px;
    left: 12px;
    z-index: 99;
    background-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .total-fixed span {
    display: inline-block;
    margin-right: 20px;
  }
</style>