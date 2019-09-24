/*
*  @描述：顶部页签
*  @作者：邱康松
*  @创建时间：2019/2/20
*/

<template>
  <div style="background-color: #ffffff" class="tab-view">
    <el-tabs :value="activeName" type="card" @tab-remove="handleRemove" @tab-click="handleClick">
      <el-tab-pane
              :closable="item.name !== 'home'"
              :key="item.name"
              v-for="(item, index) in tagsList"
              :label="item.meta.name"
              :name="item.name"
              :route="item"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    props: {
      tagActiveName: {
        type: String,
        default: ''
      }
    },
    computed: {
      tagsList() {
        return this.$store.getters.getTagsList
      },
      activeName() {
        return this.tagActiveName;
      },
    },
    methods: {
      handleRemove(name) {
        this.$store.dispatch('removeTagsView',name).then((route) => { // route:被删除的路由
          if (route.name === this.$route.name || route.meta.p === this.$route.meta.p) { // 如果删除的是当前显示的页面
            if (this.tagsList.length >= 1) { //如果剩余的页签多于1个，就取临近的一个显示，否则跳到欢迎页
              if (!!this.tagsList[route.index]) {
                this.$router.push(this.tagsList[route.index].fullPath);
              } else if (!!this.tagsList[route.index-1]) {
                this.$router.push(this.tagsList[route.index-1].fullPath);
              }
            } else {
              this.$router.push('/home');
            }
          }
        })
      },
      handleClick(item) {
        this.$router.push(item.$attrs.route.fullPath);
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-tag+.el-tag {
    margin-left: 10px;
  }
  .tab-view  {
    .el-tabs /deep/ {
      .el-tabs__nav-next, .el-tabs__nav-prev {
        line-height: 35px;
      }
      .el-tabs__header {
        margin-bottom: 0;
        background-color: #EFEFF4;
        border: none;
      }
      .el-tabs__nav {
        border: none;
      }
      .el-tabs__item {
        font-size: 12px;
        height: 35px;
        line-height: 35px;
        border: none;
        &:hover {
          background-color: #F9F9F9;
          border-radius: 4px 4px 0 0;
          color: #4A4A4A;
        }
        &.is-active {
          background-color: #ffffff;
          border-radius: 4px 4px 0 0;
        }
      }
    }
  }

</style>