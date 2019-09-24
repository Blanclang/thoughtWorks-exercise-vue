/*
*  @描述：证件详情弹窗
*  @作者：邱康松
*  @创建时间：2019/4/3
*/

<template>
  <div>
    <el-dialog title="证件详情" :visible.sync="visible" width="800px" :before-close="closeDialog">
      <div style="height: 300px" v-loading="loading">
        <image-box :url="item.url" :title="item.title" v-for="(item,index) in list" :key="index" @showImg="showImg" v-if="show" :img-list="list.map(v=>v.url)"></image-box>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import imageBox from '../imageBox';
  export default {
    name: '',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      list: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    watch: {
      visible(val) {
        if (val) {
          this.loading = true;
          setTimeout(() => {
            this.show = true;
            this.loading = false;
          },500)
        } else {
          this.show = false;
        }
      }
    },
    data() {
      return {
        loading: false,
        showVisible: false,
        imgUrl: '',
        show: false
      }
    },
    methods: {
      showImg(url) {
        this.imgUrl = url;
        this.showVisible = true;
      },
      closeDialog() {
        this.$emit('update:visible',false);
      }
    },
    components: {
      imageBox,
    }
  }
</script>

<style scoped>

</style>