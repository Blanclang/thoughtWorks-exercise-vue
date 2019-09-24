/*
*  @描述：日期筛选
*  @作者：邱康松
*  @创建时间：2018/12/27
*/

<template>
  <el-date-picker
    :disabled="disabled"
    class="date-picker"
    v-model="dateRange"
    type="daterange"
    range-separator="至"
    :value-format="format"
    unlink-panels
    :picker-options="openDate?{}:options"
    :editable="false"
    @change="changeDate"
    :default-time="['00:00:00', '23:59:59']"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder">
  </el-date-picker>
</template>

<script>
  export default {
    props: {
      'disabled': {
        type: Boolean,
        default: false
      },
      'openDate': { //是否放开只能选择到今天的限制
        type: Boolean,
        default: true
      },
      'format': {
        type: String,
        default: 'yyyy-MM-dd HH:mm:ss'
      },
      'startPlaceholder': {
        type: String,
        default: '开始日期'
      },
      'endPlaceholder': {
        type: String,
        default: '结束日期'
      },
      'value': {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        dateRange: [],
        options: {
          disabledDate: function (time) {
            return time.getTime() > new Date(new Date().toLocaleDateString() + ' 23:59:59').getTime();
          }
        },
        isFirst: true
      }
    },
    methods: {
      clearDate() {
        this.dateRange = [];
        this.$emit('input',{
          startDate: '',
          endDate: ''
        })
      },
      changeDate(val) {
        if (val) {
          this.$emit('input',{
            startDate: val[0],
            endDate: val[1]
          })
        } else {
          this.$emit('input',{
            startDate: '',
            endDate: ''
          })
        }
      }
    },
    watch: {
      value:{
        handler:function(val,oldval){
          /*if (this.isFirst) { // 如果是第一次进来才做响应处理
            if (val && val.startDate) {
              this.dateRange = [val.startDate,val.endDate];
            } else {
              this.dateRange = [];
            }
            this.isFirst = false;
          }*/
          if (val && val.startDate) {
            this.dateRange = [val.startDate,val.endDate];
          } else {
            this.dateRange = [];
          }
        },
        immediate: true
      },
    }
  }
</script>

<style scoped>
  .date-picker /deep/ .el-range-separator {
    width: 6%;
  }
</style>