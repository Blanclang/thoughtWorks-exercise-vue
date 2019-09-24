/*
*  @描述：图片放大弹窗
*  @作者：邱康松
*  @创建时间：2018/12/27
*/

<template>
  <el-dialog :visible.sync="visible" title="图片查看" width="800px" :before-close="closeDialog" top="5%">
    <img :src="imgUrl" alt="">
  </el-dialog>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      imgUrl: {
        type: String,
        default: ''
      }
    },
    data() {
      return {}
    },
    methods: {
      closeDialog() {
        this.$emit('update:visible', false);
      }
    }
  }
</script>

<style scoped>
  img {
    width: 100%;
  }
</style>