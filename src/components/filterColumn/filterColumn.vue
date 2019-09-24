/*
*  @描述：表格列筛选弹窗
*  @作者：邱康松
*  @创建时间：2019/2/21
*/

<template>
  <div style="display: inline-block" class="filter-box">
    <i class="setting-btn" @click="visible=true" title="设置"></i>
    <el-dialog :visible.sync="visible" title="设置显示字段" width="900px" @close="closeDialog" top="5vh" append-to-body>
      <div class="content">
        <div class="left">
          <p class="title">可选字段</p>
          <el-checkbox-group v-model="checkList" class="check-box">
            <el-checkbox v-for="item in checkboxArr" :label="item" :key="item.prop" :disabled="item.disabled">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="right">
          <p class="title" style="margin-left: 10px">当前选定的字段</p>
          <ul v-if="showList" class="webkit-scrollbar">
            <li v-for="item in checkList" v-dragging="{item: item, list: checkList, group: 'label'}" :key="item.prop">
              <i class="can-drag"></i>
              {{item.label}}
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" style="float: left" @click="handleToNormal" :loading="loading">恢复默认设置</el-button>
        <el-button type="primary" size="small" @click="handleSubmit" :loading="loading">保存</el-button>
        <el-button size="small" @click="handleCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        showList: true,
        visible: false,
        checkList: [],
        newColumn: [], //拖拽排序后的列表
        lastColumn: [] //最终点击保存的列表
      }
    },
    props: {
      tableColumn: {
        type: Array,
        default: function () {
          return []
        }
      },
      removeNum: { //需要过滤开始的多少列，如序号，多选框
        type: Number,
        default: 1
      }
    },
    mounted() {
      this.getColumn();
      this.$dragging.$on('dragged', ({ value }) => {
        this.newColumn = value.list;
      })
    },
    computed: {
      checkboxArr() {
        return this.tableColumn.slice(this.removeNum); //把首列的序号或者多选框去除
      }
    },
    watch: {
      checkList(val) {
        this.newColumn = [...val];
      },
      tableColumn: {
        handler: function (val) {
          this.checkList = val.slice(this.removeNum); //一开始默认选中所有
          this.lastColumn = [...this.checkList]; //最终的列表一开始与checkList保持一致
        },
        immediate: true
      }
    },
    methods: {
      // 从服务器获取之前设置的列头
      getColumn() {
        this.$root.getColumnByName({
          name: this.$route.name
        }).then(res => {
          if (res.code === 0) {
            let normalList = [];
            for (let i = 0; i < this.removeNum; i++) { //获取过滤掉的列
              normalList.push({
                ...this.tableColumn[i],
                fixed: true
              });
            }
            if (!!res.data && res.data.length > 0) {
              this.lastColumn = res.data.map(item => {
                return this.tableColumn.find(v => v.label === item) || {label: '',prop: ''};
              });
              this.checkList = [...this.lastColumn];
            }
            this.lastColumn[0].fixed = true;
            this.$emit('doneFilter',normalList.concat(this.lastColumn)); // 默认把过滤的列添加上
          }
        })
      },
      handleSubmit() {
        this.loading = true;
        let normalList = [];
        for (let i = 0; i < this.removeNum; i++) { //获取过滤掉的列
          normalList.push({
            ...this.tableColumn[i],
            fixed: true
          });
        }
        this.lastColumn = [...this.newColumn];
        this.lastColumn.forEach(item => {
          delete item.fixed;
        });
        this.lastColumn[0].fixed = true;
        this.$root.saveColumn({
          name: this.$route.name,
          value: this.lastColumn.map(item => item.label)
        }).then(res => {
          this.loading = false;
          if (res.code === 0) {
            this.$emit('doneFilter',normalList.concat(this.lastColumn)); // 默认把过滤的列添加上
            this.visible= false;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      handleCancel() {
        this.visible = false;
      },
      handleToNormal() {
        this.checkList = this.tableColumn.slice(this.removeNum);
        this.lastColumn = [...this.checkList];
        this.$nextTick(() => {
          this.handleSubmit();
        });
      },
      closeDialog() {
        this.showList = false;
        this.checkList = [...this.lastColumn]; //关闭弹窗后，可能勾选了字段，但不点击保存，所以checkList要与lastColumn保持一致
        this.showList = true;
      }
    }
  }
</script>

<style scoped lang="scss">
  .check-box {
    max-height: 400px;
    overflow-y: auto;
  }
  .filter-box /deep/ {
    .setting-btn {
      display: inline-block;
      cursor: pointer;
      padding-left: 10px;
      border-left: 1px solid #e0e0e0;
      height: 18px;
      width: 28px;
      background: url("../../assets/images/icon_set.png") right no-repeat;
    }
    .el-dialog__body {
      height: 500px;
      .el-checkbox {
        margin-bottom: 5px;
      }
    }
  }
  .content {
    display: flex;
    .title {
      line-height: 40px;
      font-weight: bold;
    }
    .left {
      flex: 2;
      border-right: 1px solid #e0e0e0;
      .el-checkbox {
        width: 150px;
      }
    }
    .right {
      flex: 1;
      ul {
        overflow-y: auto;
        max-height: 400px;
        li {
          line-height: 30px;
          cursor: move;
          padding-left: 10px;
          i {
            background: url('../../assets/images/drag.gif') no-repeat;
            height: 16px;
            width: 10px;
            display: inline-block;
            line-height: 30px;
            vertical-align: -4px;
          }
          &:hover {
            background-color: #F7F7F7;
          }
        }
      }
    }
  }
</style>