/*
*  @描述：离城日期更改查询
*  @作者：白朗
*  @创建时间：2019/4/4
*/

<template>
  <el-dialog title="离城日期更改记录" :visible.sync="visible" width="900px" :before-close="closeDialog">
    <column-box no-title="" last>
      <template slot="body">
        <ztTable
          ref="carrytable"
          v-loading="loading"
          :requestParams="form"
          :tableColumn="tableColumn"
          :tableData="tableData"
          :pagination='false'
        >
        </ztTable>
      </template>
    </column-box>
    <span slot="footer">
      <el-button type="primary" size="small" @click="closeDialog">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ztTable from '@/components/zt-table';
  import columnBox from '@/components/zt-column-box';
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      parma: {
        type: Object,
        default:null
      }
    },
    watch:{
      parma(n,o){
        this.form={
          transPlanCode:n.transPlanCode,
          waybillCode:n.waybillCode,
          waybillVersion:n.waybillVersion
        }
        this.getData();
        // this.$refs['carrytable'].requestTableData(this.form);
      }
    },
    data() {
      return {
        loading:false,
        selectData: {},
        tableData:[],
        form: {
          transPlanCode:this.parma.transPlanCode,
          waybillCode:this.parma.waybillCode,
          waybillVersion:this.parma.waybillVersion
        },
        tableColumn: [
          {type: 'index',label: '序号'},
          {prop: 'carrierCompanyName',label: '承运商',align: 'center'},
          {prop: 'trailerNo',label: '挂车车牌号',align: 'center'},
          {prop: 'driverName',label: '司机姓名',align: 'center'},
          {prop: 'driverMobile',label: '联系电话',align: 'center'},
          {prop: 'leaveDate',label: '离城日期',align: 'center'},
          {prop: 'reportOn',label: '上报时间',align: 'center'},
          {prop: 'reportName',label: '上报人',align: 'center'}
        ]
      }
    },
    mounted(){
      // this.$refs.table.$emit("requestTable", this.requestParams);
    },
    methods: {
      getData() {
        this.loading = true;
        let requestPromise = this.$root.getLeaveDateUpdate(this.form);
        requestPromise.then(res => {
          this.loading = false;
          let code = parseInt(res.code);
          let data = res.data;
          let msg = res.message;
          if (!code) {
            this.tableData = data;
          }
        });
      },
      closeDialog() {
        this.$emit('update:visible',false);
      }
    },
    components: {
      ztTable,
      columnBox
    }
  }
</script>

<style scoped>

</style>