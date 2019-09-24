/*
*  @描述：导入excel结果弹窗
*  @作者：邱康松
*  @创建时间：2019/1/10
*/

<template>
  <el-dialog title="导入结果" :visible.sync="visible" :before-close="closeDialog" width="1000px" top="5%" class="success-dialog">
    <div class="tip-box">
      <p class="tip">
        共导入：<span> {{resData.total || 0}} </span>条记录&nbsp;&nbsp;&nbsp;&nbsp;导入成功：<span> {{resData.success || 0}} </span>条记录&nbsp;&nbsp;&nbsp;&nbsp;失败：<span> {{resData.fail || 0}} </span>条记录
      </p>
    </div>
    <zt-table :table-column="tableColumn" :table-data="tableData" :pagination="false"></zt-table>
    <span slot="footer">
      <el-button size="small" @click="closeDialog" type="primary">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ztTable from '@/components/zt-table';
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      resData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      tableColumn: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        loading: false,
      }
    },
    computed: {
      tableData() {
        return this.resData.detail || [];
      }
    },
    methods: {
      closeDialog() {
        this.$emit('update:visible', false);
        this.$emit('close');
      },
    },
    components: {
      ztTable
    }
  }
</script>

<style scoped lang="scss">
  .success-dialog /deep/ {
    .tip-box {
      margin-bottom: 10px;
    }
    .tip {
      color: #666666;
      font-size: 12px;
      line-height: 25px;
      span {
        font-weight: bold;
      }
    }
    .el-icon-success {
      color: #67C23A;
    }
    .el-icon-error {
      color: #F56C6C;
    }
  }

</style>