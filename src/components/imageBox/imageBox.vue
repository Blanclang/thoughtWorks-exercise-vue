/*
*  @描述：图片显示卡片
*  @作者：邱康松
*  @创建时间：2018/1/5
*/

<template>
  <div class="img-box" >
    <el-image :src="url ? url : normalImg" fit="cover" :preview-src-list="previewList">
      <div slot="placeholder" class="image-slot">
        加载中...
      </div>
    </el-image>
    <p>{{title}}</p>
  </div>
</template>

<script>
  import normalImg from '../../assets/images/no-img.png';
  export default {
    props: {
      url: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      imgList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    watch: {
      imgList: {
        handler: function (val) {
          let list = [];
          (val||[]).forEach(item => {
            !!item && list.push(item); //去掉空图片
          });
          //把点击的图片放在预览列表第一位，实现打开预览就是当前点击的图片
          this.previewList = list;
          //如果只有一张图片或者没有图片，即不做处理
          if (this.previewList.length <= 1 || !this.url) {
            return false;
          }
          let index = this.previewList.findIndex(item => item === this.url);
          if (index === 0) {
            return false;
          }
          let left = this.previewList.splice(0,index);
          this.previewList = this.previewList.concat(left);
          this.$set(this.$data,'previewList',this.previewList);
        },
        immediate: true
      }
    },
    data() {
      return {
        normalImg,
        previewList: [] //预览图片列表
      }
    },
  }
</script>

<style scoped lang="scss">
  .img-box /deep/ {
    height: 150px;
    width: 150px;
    border-radius: 4px;
    position: relative;
    float: left;
    margin-right: 20px;
    margin-bottom: 10px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .el-image-viewer__close {
      color: #000000;
    }
  }
  .mongolia {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(48, 49, 51, 0.5);
    display: none;
    border-radius: 5px;
  }
  img {
    height: 100%;
    width: 100%;
    border-radius: 5px;
  }
  p {
    position: absolute;
    bottom: 0;
    text-align: center;
    line-height: 25px;
    font-size: 12px;
    background-color: #000000;
    color: #ffffff;
    width: 100%;
    border-radius: 0 0 5px 5px;
  }
</style>