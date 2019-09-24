/*
*  @描述：车辆选择组件
*  @作者：白朗
*  @创建时间：2019/3/20
*/
<template>
  <el-dialog title="车辆选择" width="1000px" :visible.sync="carselVisible" :before-close="close">
    <div class="content">
      <column-box no-title="">
        <template slot="body">
          <el-form inline label-width="90px">
            <el-form-item label="车辆编码">
              <el-input size="small" placeholder="请输入" :maxlength="50" v-model="requestParams.searchByVehicleNo"></el-input>
            </el-form-item>
            <el-form-item label="挂车车牌号">
              <el-input size="small" placeholder="请输入" :maxlength="50" v-model="requestParams.searchByTrailerPlateNo"></el-input>
            </el-form-item>
            <el-form-item label="主车车牌号">
              <el-input size="small" placeholder="请输入" :maxlength="50" v-model="requestParams.searchByMainPlateNo"></el-input>
            </el-form-item>
            <el-form-item label="司机姓名">
              <el-input size="small" placeholder="请输入" :maxlength="50" v-model="requestParams.searchByName"></el-input>
            </el-form-item>
            <el-form-item label="司机手机号">
              <el-input size="small" placeholder="请输入" :maxlength="50" v-model="requestParams.searchByMobile"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="queryTableData">查询</el-button>
              <el-button size="small" @click="resetFun">重置</el-button>
            </el-form-item>
          </el-form>
        </template>
      </column-box>
      <column-box no-title="" last>
        <template slot="body">
          <zt-table 
            ref="table" 
            :request="requestTable"
            :requestParams="requestParams"
            :page-size="10"
            highlight-current-row 
            :loading="loading"
            :current.sync="currentChange"  
            @rowDblclick="dbSave" 
            :tableColumn="tableColumn"
            :getClickRow.sync="selTabList"
            radio-label="vehicleNo"
          >
          </zt-table>
        </template>
      </column-box>
    </div>
    <span slot="footer">
      <el-button type="primary" size="small" :loading="loading" @click="save">确定</el-button>
      <el-button size="small" @click="close">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import importDic from '@/components/importDic';
  import ztTable from '@/components/zt-table';
  import {getDateStr,parseDate} from "@/utils";
  import columnBox from '@/components/zt-column-box';
  export default {
    props: {
      carselVisible: {
        type: Boolean,
        default: false
      },
      code: { //承运商编码
        type: String,
        default: ''
      }
    },
    data() {
      var _this = this;
      return {
        loading:false,
        requestTable: this.$root.getBusinessPowerList,
        requestParams:{
          searchByCompanyCode:this.code,
          searchByVehicleNo: '',
          searchByTrailerPlateNo: '' ,
          searchByMainPlateNo: '',
          searchByName: '',
          searchByMobile:'',
          pageNum:1,//当前页码
          pageSize:10
        },
        tableColumn: [
          {
            type: 'index',
            label: '序号',
            align: 'center',

          },
          {
            type: 'radio',
            label: '选择',
            align: 'center',

          },
          {
            prop: 'companyNo',
            label: '承运商编码',
            align: 'center',
            width:'90'
          },
          {
            prop: 'companyName',
            label: '承运商',
            align: 'center'
          },
          {
            prop: 'vehicleNo',
            label: '车辆编码',
            align: 'center',
            width:'110'
          },
          {
            prop: 'mainPlateNo',
            label: '主车车牌号',
            align: 'center',
            width:'110'
          },
          {
            prop: 'trailerPlateNo',
            label: '挂车车牌号',
            align: 'center',
            width:'110'
          },
          {
            prop: 'name',
            label: '司机姓名',
            align: 'center'
          },
          {
            prop: 'mobile',
            label: '手机号',
            align: 'center'
          },
          {
            prop: 'idNo',
            label: '身份证号',
            align: 'center',
          },
          {
            prop: 'vehicleAttribute',
            label: '车辆属性',
            align: 'center',
          },
          {
            prop: 'vehicleType',
            label: '车辆类别',
            align: 'center',
            formatter: (row) => {
              return +row.vehicleType === 1 ? '中置轴' : '平板车'
            }
          },
          {
            prop: 'carryQuantity',
            label: '最大装载台数',
            align: 'center',
            width:'110'
          },
          {
            prop: 'regularVehicle',
            label: '是否合规车',
            align: 'center',
            width:'110',
            formatter: (row) => {
              return +row.regularVehicle === 1 ? '是' : '否'
            }
          },
          {
            prop: 'gpsNo',
            label: 'GPS/BDS编号',
            align: 'center',
            width:'110'
          }
        ],
        selTabList:[],//选择框
        tableData:[],
        currentChange:null // 当前选中的项
      }
    },
    created(){
      this.getList();
    },
    watch:{
      currentChange(n,o){
        console.log(n);
      },
      //监听code
      code(n,o){
        if(n){
          this.requestParams.searchByCompanyCode=n;
          this.resetFun();
        }else{
          this.requestParams.searchByCompanyCode=0;
          this.requestParams.pageNum=1;
          this.$refs['table'] && this.$refs['table'].requestTableData(this.requestParams);
        }
      }
    },
    methods: {
      // 获取列表数据
      getList() {
        this.loading = true;
        let requestPromise = this.$root.getBusinessPowerList(this.requestParams);
        requestPromise.then(res => {
          this.loading = false;
          if (res.code === 0) {
            this.tableData = res.data.list || [];
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      //查询
      queryTableData(){
        this.requestParams.pageNum=1;
        this.$refs['table'].requestTableData(this.requestParams);
      },
      //重置
      resetFun(){
        this.requestParams={
          searchByCompanyNo:this.code,
          searchByVehicleNo: '',
          searchByTrailerPlateNo: '' ,
          searchByMainPlateNo: '',
          searchByName: '',
          searchByMobile:'',
          pageNum:1,//当前页码
          pageSize:10
        }
        this.$refs['table'].requestTableData(this.requestParams);
      },
      //提交
      save(){
        this.$emit('carSelData',this.currentChange);
        this.close();
      },
      //双击提交
      dbSave(e){
        this.save();
      },
      //取消
      close() {
        this.$emit('update:carselVisible',false);
      }
    },
    components: {
      ztTable,
      columnBox,
      importDic
    }
  }
</script>

<style scoped lang="scss">
  .logistics-plan /deep/ {
    .sub-total-column td {
      color: #409EFF;
    }
    .el-select {
      width: 202px;
    }

  }
  .btn_style{
    color: #409EFF;
    span{margin: 0px 6px;cursor: pointer;}
  }
</style>