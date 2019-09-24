/*
*  @描述：运输在途信息维护
*  @作者：白朗
*  @创建时间：2019/3/22
*/
<template>
  <div class="vehicle-data page-normal">
    <el-form ref="table" inline label-width="130px" class="search-form">
      <searchBoxFade>
        <template slot="show">
          <el-form-item label="编制日期：">
            <date-picker v-model="filterTime"></date-picker>
          </el-form-item>
          <el-form-item label="出发地：">
            <startLocation v-model="form.originLocationCode"></startLocation>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" size="small">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </template>
        <template slot="hide">
          <el-form-item label="拖车计划号：">
            <el-input v-model="form.transPlanCode" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="挂车车牌号：">
            <el-input v-model="form.trailerPlate" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="司机姓名：">
            <el-input v-model="form.driverName" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="送车通知单号：">
            <el-input v-model="form.waybillCode" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="目的地：">
            <el-input v-model="form.targetLocation" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="专营店：">
            <el-input v-model="form.store" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="全部交车：">
            <el-select v-model="form.isAllDelivery">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="干线运输商：">
            <el-select size="small" v-model="form.truckCarrierName">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="item in trunkCarrierList" :label="item.name" :value="item.name" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </searchBoxFade>
    </el-form>
    <column-box no-title="" last  class="parent-table-box">
      <template slot="body">
        <div class="flex_sc operation-box">
          <div>
            <el-button type="primary" @click="editFun" v-has="'VRES57'">修改</el-button>
            <el-button @click="exportFun" v-has="'VRES58'">导出</el-button>
          </div>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter" :remove-num="0"></filterColumn>
        </div>
        <!-- 列表 -->
        <div>
          <zt-table
            :max-height="tableHeight"
            :table-column="newColumn || tableColumn"
            ref="table"
            v-loading="loading"
            :request="requestTable"
            v-if="showTable"
            :request-params="form"
            :getSelection.sync="selectData">
          </zt-table>
        </div>
      </template>
    </column-box>
    <!-- 承运商上报历史位置 -->
    <carryHistoryLocal :visible.sync="carryLocalPopup" :parma="carryLocalParmas"></carryHistoryLocal>
    <!-- 车辆上报历史位置 -->
    <carHistoryLocal :visible.sync="carLocalPopup" :parma="carLocalParmas"></carHistoryLocal>
    <!-- 离开日期记录 -->
    <leaveDateUpdate :visible.sync="leaveDatePopup" :parma="leaveDateParmas"></leaveDateUpdate>
    <!-- 修改 -->
    <el-dialog title="在途信息维护" :visible.sync="editPopup" width="600px" :before-close="closeDialog">
      <column-box no-title="" last>
        <template slot="body">
          <div class="page-normal flex_cc" style="padding-right:10px">
            <el-form label-width="120px" style="width: 500px" ref="form" :model="editform" :rules="editrules">
              <el-form-item label="车辆状态：" prop="carStatusCode">
                <el-select size="mini" placeholder="请选择" v-model="editform.carStatusCode" style="width: 350px" filterable clearable >
                  <el-option v-for="item in carStatusList" :label="item.name" :value="item.code" :key="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="离城日期：" prop="leaveCityDate">
                <el-date-picker
                    style="width: 350px"
                    v-model="editform.leaveCityDate"
                    type="date"
                    size="mini"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
              </el-form-item>
              <el-form-item label="车辆位置：" prop="carLocationCode">
                <el-select 
                  size="mini" 
                  placeholder="请选择"
                  remote 
                  :remote-method="remoteMethod"
                  :loading="searchLoading" v-model="editform.carLocationCode" style="width: 350px" filterable clearable >
                  <el-option v-for="item in cityList" :label="item.city" :value="String(item.id)" :key="String(item.id)">
                    <span>{{item.city}}({{item.province}})</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发车异常原因：">
                <el-select size="mini" placeholder="请选择" v-model="editform.dispatchCarExceptionReasonCode" style="width: 350px" filterable clearable>
                  <el-option v-for="item in carWrongList" :label="item.name" :value="item.code" :key="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="交付异常描述：">
                <el-select size="mini" placeholder="请选择" v-model="editform.deliveryExceptionDescriptionCode" style="width: 350px" filterable clearable>
                  <el-option v-for="item in payWrongList" :label="item.name" :value="item.code" :key="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注：">
                <el-input placeholder="请输入备注" v-model="editform.remark" type="textarea" :rows="2" :maxlength="100" style="width: 350px"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </column-box>
      <span slot="footer">
        <el-button type="default" size="small" @click="closeDialog">关闭</el-button>
        <el-button type="primary" size="small" @click="saveFun">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ztTable from '@/components/zt-table';
  import columnBox from '@/components/zt-column-box';
  import datePicker from '@/components/datePicker';
  import filterColumn from '@/components/filterColumn';
  import searchBoxFade from '@/components/searchBoxFade';
  import {getDateStr,parseDate} from "@/utils";
  import carryHistoryLocal from './carryHistoryLocal';
  import carHistoryLocal from './carHistoryLocal';
  import leaveDateUpdate from './leaveDateUpdate';
  import startLocation from '@/components/startLocation';
  export default {
    name: 'onwayInfo',
    data() {
      let t = this;
      return {
        tableHeight: 0,
        requestTable:this.$root.getTransportingInfo,
        selectData:[],
        loading: false,
        searchLoading: false,
        trunkCarrierList: [],
        form: {
          editStart:getDateStr(0) + ' 00:00:00',
          editEnd:getDateStr(0) + ' 23:59:59',
          vinCode: '',
          originLocationCode: '',
          transPlanCode: '',
          trailerPlate:'',
          driverName: null,
          waybillCode: '',
          store: '',
          truckCarrierName: null,
          targetLocation: '',
          isAllDelivery:null,
          pageNum: 1,
          pageSize:20
        },
        showTable: false,
        newColumn: null, //筛选后的列
        filterTime: {
          startDate:getDateStr(0) + ' 00:00:00',
          endDate:getDateStr(0) + ' 23:59:59'
        },
        // 列表参数
        tableColumn: [
          {prop: 'transPlanCode',label: '拖车计划号',align:'center',width:'130'},
          {prop: 'waybillCode',label: '送车通知单号',align:'center',width:'130'},
          {prop: 'trailerPlate',label: '挂车车牌号',align:'center',width:'110'},
          {prop: 'driverName',label: '司机姓名',align:'center',width:'90'},
          {prop: 'driverMobile',label: '司机手机号',align:'center',width:'120'},
          {prop: 'leaveCityDate',label: '离城日期',align:'center',width:'146',
            formatter: (row) => {return row.leaveCityDate ? row.leaveCityDate.substring(0,10) : ''}
          },
          {prop: 'carStatus',label: '车辆状态',align:'center',width:'150'},
          {prop: 'carLocation',label: '车辆位置',align:'center',width:'130'},
          {prop: 'dispatchCarExceptionReason',label: '发车异常原因',align:'center',width:'180'},
          {prop: 'deliveryExceptionDescription',label: '交付异常描述',align:'center',width:'180'},
          {prop: 'remark',label: '备注',align:'center',width:'200'},
          {prop: 'assignOn',label: '编制日期',align:'center',width:'110',
            formatter: (row) => {return row.assignOn? row.assignOn.substring(0,10) : ''}
          },
          {prop: 'waybillVehicleNum',label: '运单台数',align:'center',width:'70'},
          {prop: 'outVehicleNum',label: '发车台数',align:'center',width:'70'},
          {prop: 'arrivedVehicleNum',label: '到达台数',align:'center',width:'70'},
          {prop: 'detachNum',label: '抽单台数',align:'center',width:'70'},
          {prop: 'leaveInTime',label: '是否准时离城',align:'center',width:'100'},
          {prop: 'requireLeaveCityDate',label: '离城要求日期',align:'center',width:'110',
            formatter: (row) => {return row.requireLeaveCityDate? row.requireLeaveCityDate.substring(0,10) : ''}
          },
          {prop: 'carrierCompanyName',label: '承运商',align:'center',width:'200'},
          {prop: 'originLocation',label: '出发地',align:'center',width:'130'},
          {prop: 'targetLocation',label: '目的地',align:'center',width:'130'},
          {prop: 'moveLocation',label: '搬入地',align:'center',width:'160'},
          {prop: 'finalLocation',label: '最终搬入地',align:'center',width:'200'},
          {prop: 'store',label: '专营店',align:'center',width:'200'},
          {prop: 'intoTime',label: '进门时间',align:'center',width:'140'},
          {prop: 'outTime',label: '出门时间',align:'center',width:'140'},
          {prop: 'updateTime',label: '更新时间',align:'center',width:'140'},
          {prop: 'bargeDestinationName',label: '短驳目的地',align:'center',width:'130'},
          {prop: 'truckCarrierName',label: '干线运输商',align:'center'},
        ],
        editform: {
          leaveCityDate:'',
          carStatusCode:'',
          carLocationCode:'',
          dispatchCarExceptionReasonCode:'',
          deliveryExceptionDescriptionCode:'',
          remark:''
        },
        editrules: {
          carStatusCode: [{ required: true, message: '请选择车辆状态', trigger: 'change' }],
          carLocationCode: [{ required: true, message: '请选择车辆位置', trigger: 'change' }]
        },
        //承运商上报历史位置
        carryLocalPopup:false,
        carryLocalParmas:{
          transPlanCode:'',
          waybillCode:'',
        },
        //车辆上报历史位置
        carLocalPopup:false,
        carLocalParmas:{
          transPlanCode:'',
          waybillCode:'',
        },
        //离开日期记录
        leaveDatePopup:false,
        leaveDateParmas:{
          transPlanCode:'',
          waybillCode:'',
        },
        //城市列表
        cityList:[], 
        //车辆状态列表
        carStatusList:[],
        //发车异常原因列表
        carWrongList:[], 
        //城交付异常描述列表
        payWrongList:[],
        editPopup:false
      }
    },
    watch: {
      filterTime(val) {
        this.form.editStart = val.startDate;
        this.form.editEnd = val.endDate;
      },
      'editPopup': function (val) {
        if (val) {
          this.remoteMethod(this.editform.carLocation);
        }
      }
    },
    created(){
      this.getLogisticsDict();
    },
    mounted() {
      this.getTableHeight();
      window.onresize = this.getTableHeight;
    },
    deactivated() {
      window.onresize = null;
    },
    methods: {
      getTableHeight() {
        this.$nextTick(() => {
          let height = document.getElementsByClassName('page-content')[0].clientHeight;
          let formHeight = document.getElementsByClassName('search-form')[0].clientHeight;
          let btnHeight = document.getElementsByClassName('operation-box')[0].clientHeight;
          this.tableHeight = height - formHeight - btnHeight - 55;
        })
      },
      remoteMethod(query) {
        if (query !== '') {
          this.searchLoading = true;
          let requestPromise = this.$root.getStoreCitylist({
            city: query
          });
          requestPromise.then(res => {
            this.searchLoading = false;
            let code = parseInt(res.code);
            let data = res.data;
            if (!code) {
              this.cityList = data;
            }
          }).catch(() => {
            this.searchLoading = false;
          })
        } else {
          this.cityList = [];
        }
      },
      closeDialog() {
        this.$refs['form'].resetFields();
        this.editPopup=false;
      },
      search() {
        this.form.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
      },
      reset() {
        this.form = {
          editStart:getDateStr(0) + ' 00:00:00',
          editEnd:getDateStr(0) + ' 23:59:59',
          vinCode: '',
          originLocationCode: '',
          transPlanCode: '',
          trailerPlate:'',
          driverName: null,
          truckCarrierName: null,
          waybillCode: '',
          store: '',
          targetLocation: '',
          isAllDelivery:null,
          pageNum: 1,
          pageSize:20
        };
        this.filterTime = {
          startDate:getDateStr(0) + ' 00:00:00',
          endDate:getDateStr(0) + ' 23:59:59'
        };
        this.$refs['table'].requestTableData(this.form);
      },
      //获取城市列表
      getCitylist(){
        let requestPromise = this.$root.getStoreCitylist();
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          if (!code) {
            this.cityList = data;
          }
        });
      },
      //物流公有字段
      getLogisticsDict(type){
        this.$root.getDictByTypes({
          types: '18.02,18.03,18.04,18.17'
        }).then(res => {
          if (res.code === 0) {
            this.carStatusList = res.data['18.02'];
            this.carWrongList = res.data['18.03'];
            this.payWrongList = res.data['18.04'];
            this.trunkCarrierList = res.data['18.17'];
          }
        });
      },
      doneFilter(list) {
        this.showTable = false;
        this.newColumn = [...list];
        setTimeout(() => {
          this.showTable = true;
        }, 0)
      },
      //修改编辑
      editFun(){
        if (this.selectData.length<1) {
          this.$message.warning('至少选择一条记录');
          return;
        }
        let firstItem = this.selectData[0];
        this.editform={
          leaveCityDate:firstItem.leaveCityDate,
          carStatusCode:firstItem.carStatusCode,
          carLocationCode:firstItem.carLocationCode,
          carLocation: firstItem.carLocation,
          dispatchCarExceptionReasonCode:firstItem.dispatchCarExceptionReasonCode,
          deliveryExceptionDescriptionCode:firstItem.deliveryExceptionDescriptionCode,
          remark:firstItem.remark
        }
        if(firstItem.carLocationCode){
          this.cityList=[{id:firstItem.carLocationCode,city:firstItem.carLocation}];
        }
        this.editPopup = true;
      },
      //修改保存
      saveFun(){
        this.$refs['form'].validate(valid => {
          if (valid) {
            //根据车辆状态判断离城日期是否必填， 车辆状态为 （已配未出库和出库未出城，离城日期可选填；其他状态为必填）
            if (this.editform.carStatusCode !== '18.02.01' && this.editform.carStatusCode !== '18.02.02' && !this.editform.leaveCityDate) {
              this.$message.warning('请选择离城日期');
              return false;
            }
            let params = [],updatefrom = this.editform;
            this.selectData.forEach((item,index)=>{
              params.push({
                transPlanCode:item.transPlanCode,
                waybillCode:item.waybillCode,
                waybillVersion:item.waybillVersion,
                leaveCityDate:updatefrom.leaveCityDate,
                carStatus:updatefrom.carStatusCode,
                carLocation:updatefrom.carLocationCode,
                dispatchCarExceptionReason:updatefrom.dispatchCarExceptionReasonCode,
                deliveryExceptionDescription:updatefrom.deliveryExceptionDescriptionCode,
                remark:updatefrom.remark
              });
            });
            let requestPromise = this.$root.getTransportingUpdateboard(params);
            requestPromise.then(res => {
              let code = parseInt(res.code);
              let data = res.data;
              if (!code) {
                this.$message.success('保存成功');
                this.closeDialog();
                this.$refs['table'].requestTableData(this.form);
              }
            });
          }
        })
      },
      //导出excel
      exportFun(){
        let params = {...this.form};
        let requestPromise = this.$root.getIntransitExport(params);
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          if (!code) {
            let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `运输在途信息${parseDate()}.xls`;
            let evt = document.createEvent("MouseEvents");
             evt.initEvent("click",true,true);
             link.dispatchEvent(evt);
            this.$message.success("导出成功");
          }
        });
      },
      //承运商上报历史位置
      carryHistoryLocalFun(row){
        this.carryLocalParmas ={
          transPlanCode:row.transPlanCode,
          waybillCode:row.waybillCode,
          waybillVersion:row.waybillVersion
        };
        this.carryLocalPopup = true;
      },
      //车辆历史位置
      carHistoryLocalFun(row, index,value){
        this.carLocalParmas ={
          transPlanCode:row.transPlanCode,
          waybillCode:row.waybillCode,
          waybillVersion:row.waybillVersion
        };
        this.carLocalPopup = true;
      },
      //离城日期更改记录
      leaveHistoryLocalFun(row, index,value){
        this.leaveDateParmas ={
          transPlanCode:row.transPlanCode,
          waybillCode:row.waybillCode,
          waybillVersion:row.waybillVersion
        };
        this.leaveDatePopup = true;
      }
    },
    components: {
      ztTable,
      columnBox,
      datePicker,
      filterColumn,
      searchBoxFade,
      carryHistoryLocal,
      carHistoryLocal,
      leaveDateUpdate,
      startLocation
    }
  }
</script>

<style scoped lang="scss">
  .el-table /deep/ {
    &.nowrap-table .cell {
      /*white-space: nowrap !important;
      text-overflow: initial !important;*/
      .el-button {
        padding: 0;
      }
    }
    th {
      background-color: #EBEEF5;
    }
    .cell {
      line-height: normal !important;
    }
  }
  .el-form .el-select, .el-form .el-input {
    width: 202px;
  }
  .flex_sc {
    margin-bottom: 10px;
  }
  .tablechild_box{
    padding-top: 30px;
  }
  .select_sty{
    width: 100%;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    height: 28px;
    // line-height: 32px;
    padding: 0 12px;
  }
  .blue_font{color: #409EFF; cursor: pointer;}
  .radio_sty{
    width:14px;
    height:14px;
    border: 1px solid #dcdfe6;
    border-radius:50%;
    background-color: #fff;
    display:flex;
    justify-content:center;
    align-items: center;
    span{
      display:block;
      width:4px;
      height:4px;
      border-radius:50%;
      background-color: #fff;
    }
  }
  .sel_center{
    text-align: center;
    width: 100%;
  }
  .radio_sty:hover{
    border: 1px solid #409EFF;
  }
  .radio_sty.sel_active{
    border: 1px solid #409EFF;
    background-color: #409EFF;
  }
</style>