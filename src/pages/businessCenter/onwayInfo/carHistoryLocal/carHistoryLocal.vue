/*
*  @描述：车辆历史位置查询弹窗
*  @作者：白朗
*  @创建时间：2019/4/4
*/

<template>
  <el-dialog title="车辆历史位置查询" :visible.sync="visible" width="900px" :before-close="closeDialog">
    <column-box no-title="" last>
      <template slot="body">
        <el-button type="primary" size="small" style="margin-bottom:10px;"  @click="getNewLocaltion" :loading="btnloading">获取最新位置</el-button>
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
        btnloading:false,
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
          {prop: 'trailerNo',label: '挂车车牌号',width:'100px',align: 'center'},
          {prop: 'driverName',label: '司机姓名',width:'80px',align: 'center'},
          {prop: 'driverMobile',label: '联系电话',width:'110px',align: 'center'},
          {prop: 'locationOn',label: '定位时间',align: 'center'},
          {prop: 'carLocation',label: '车辆位置',width:'80px',align: 'center'},
          {prop: 'detailLocation',label: '详细地址',width:'250px',align: 'left'}
        ]
      }
    },
    mounted(){
      // this.$refs.table.$emit("requestTable", this.requestParams);
    },
    methods: {
      getData() {
        this.loading = true;
        let requestPromise = this.$root.getCarHistoryLocation(this.form);
        requestPromise.then(res => {
          this.loading = false;
          if (!res.code) {
            this.tableData = res.data;
          }
        });
      },
      getNewLocaltion(){
        this.btnloading = true;
        let requestPromise = this.$root.getCarNewLocation(this.form);
        requestPromise.then(res => {
          this.btnloading = false;
          if (!res.code) {
            this.$message.success('定位成功');
            this.getData();
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