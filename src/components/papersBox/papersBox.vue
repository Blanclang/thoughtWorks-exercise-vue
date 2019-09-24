/*
*  @描述：证件展示样式组件
*  @作者：邱康松
*  @创建时间：2019/1/2
*/

<template>
  <div class="papers-box" :class="last ? '' : 'show-border'">
    <div class="left-content">
      <h4 class="header-title">{{leftTitle}}<span v-if="required">*</span></h4>
      <slot name="left"></slot>
    </div>
    <div class="right-content">
      <h4 class="header-title">{{rightTitle}}</h4>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
  import columnBox from '@/components/zt-column-box';
  export default {
    props: {
      leftTitle: {
        type: String,
        default: ''
      },
      rightTitle: {
        type: String,
        default: ''
      },
      required: {
        type: Boolean,
        default: false
      },
      last: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    components: {
      columnBox
    }
  }
</script>

<style scoped lang="scss">
  .show-border {
    border-bottom: 1px solid #EAEEFB;
  }
  .papers-box /deep/ {
    background-color: #ffffff;
    padding: 20px !important;
    /*border-radius: 10px;*/
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    .left-content {
      margin-right: 50px;
    }
    .header-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 30px;
      /*color: #999999;*/
      span {
        color: #F56C6C;
      }
    }
    .upload-box {
      &:first-child {
        margin-bottom: 20px;
      }
      width: 148px;
      height: 148px;
      overflow: hidden;
    }
  }
</style>