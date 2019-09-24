/*
*  @描述：搜索组件展开和收起
*  @作者：邱康松
*  @创建时间：2019/2/28
*/

<template>
  <div class="search-box">
    <div class="content">
      <slot name="show"></slot>
      <collapseTransition>
        <div class="collapse-wrap"
             v-show="showBox">
          <!-- @slot default -->
          <slot>
            <slot name="hide"></slot>
          </slot>
        </div>
      </collapseTransition>
    </div>
    <div class="click-box" v-if="showBtn">
      <i class="click-icon" :class="{'hide-icon': showBox}" @click="toggleBox"></i>
    </div>
  </div>
</template>

<script>
  import collapseTransition from './transition';
  export default {
    props: {
      showBtn: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        showBox: false
      }
    },
    methods: {
      toggleBox() {
        this.showBox = !this.showBox;
      }
    },
    components: {
      collapseTransition
    }
  }
</script>

<style scoped lang="scss">
  .click-box {
    text-align: center;
    .click-icon {
      cursor: pointer;
      display: inline-block;
      height: 20px;
      width: 160px;
      background: url("../../assets/images/show-nor.png") no-repeat;
      &:hover {
        background: url("../../assets/images/show-hover.png") no-repeat;
      }
    }
    .hide-icon {
      background: url("../../assets/images/hide-nor.png") no-repeat;
      &:hover {
        background: url("../../assets/images/hide-hover.png") no-repeat;
      }
    }
  }
  .el-button {
    padding-top: 0;
    padding-bottom: 0;
  }
  .search-box .content {
    background-color: #F9F9F9;
    padding: 10px;
    padding-bottom: 0;
    border-bottom: 1px solid #EFEFF4;
  }
</style>