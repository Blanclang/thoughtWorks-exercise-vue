
/*
*  @描述：运输明细查询
*  @作者：白朗
*  @创建时间：2019/3/26
*/

<template>
  <div class="vehicle-data page-normal">
    <el-form inline label-width="138px" class="search-form">
      <searchBoxFade>
        <template slot="show">
          <el-form-item label="编制日期：">
            <date-picker size="small" v-model="assignTime"></date-picker>
          </el-form-item>
          <el-form-item label="VIN码：">
            <el-input size="small" v-model="form.searchByVinCode" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" size="small">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </template>
        <template slot="hide">
          <el-form-item label="出发地：">
            <startLocation v-model="form.searchByOriginLocation"></startLocation>
          </el-form-item>
          <el-form-item label="目的地：">
            <el-input size="small" v-model="form.searchByTargetLocation" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="专营店：">
            <el-input size="small" v-model="form.searchByStore" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
         <!-- <el-form-item label="承运商：">
            <el-input size="small" v-model="form.searchByCarrierCompany" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>-->
          <el-form-item label="挂车车牌号：">
            <el-input size="small" v-model="form.searchByTrailerPlate" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="司机姓名：">
            <el-input size="small" v-model="form.searchByDriver" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="省份：">
            <el-input size="small" v-model="form.searchByProvince" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="城市：">
            <el-input size="small" v-model="form.searchByCity" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="拖车计划号：">
            <el-input size="small" v-model="form.searchByCode" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="送车通知单号：">
            <el-input size="small" v-model="form.searchByWaybillCode" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="运输方式：">
            <el-select size="small" v-model="form.searchByTransportWay" >
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="item in carryStatusList" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否交车：">
            <el-select size="small" v-model="form.searchByDeliveryStatus" placeholder="请选择" clearable>
              <el-option label="全部" :value="null"></el-option>
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="短驳目的地：">
            <el-select size="small" v-model="form.searchByBargeDestinationCode">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="item in bargeDesList" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="干线运输商：">
            <el-select size="small" v-model="form.searchByTrunkCarrierCode">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="item in trunkCarrierList" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="特殊计划：">
            <el-select size="small" v-model="form.searchByExceptionReasonCode">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="item in reasonList" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="更新预定运输到达日">
            <!-- <el-input size="small" v-model="form.searchByTrailerCode" placeholder="请输入"></el-input> -->
            <date-picker size="small" v-model="carryArriveTime"></date-picker>
          </el-form-item>
          <el-form-item label="预定订单到达日">
            <date-picker size="small" v-model="orderArriveTime"></date-picker>
            <!-- <el-input size="small" v-model="form.searchByTrailerCode" placeholder="请输入"></el-input> -->
          </el-form-item>
          <el-form-item label="出门日期">
            <date-picker size="small" v-model="outTime"></date-picker>
            <!-- <el-input size="small" v-model="form.searchByTrailerCode" placeholder="请输入"></el-input> -->
          </el-form-item>
        </template>
      </searchBoxFade>
    </el-form>
    <column-box no-title="" last class="parent-table-box">
      <template slot="body">
        <div class="flex_sc operation-box">
          <div>
            <el-button type="primary" @click="exportFun" v-has="'VRES54'">导出</el-button>
          </div>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter" :remove-num="1"></filterColumn>
        </div>
        <zt-table :max-height="tableHeight" :table-column="newColumn || tableColumn" ref="table" v-loading="loading" :request="requestTable" v-if="showTable" :request-params="form"></zt-table>
        <!-- <zt-table 
          :table-column="newColumn || tableColumn" 
          ref="table" 
          :tableData="tableData" 
          v-if="showTable" 
          :request-params="form" >
        </zt-table> -->
      </template>
    </column-box>
  </div>
</template>

<script>
  import ztTable from '@/components/zt-table';
  import columnBox from '../../../components/zt-column-box';
  import datePicker from '../../../components/datePicker';
  import filterColumn from '../../../components/filterColumn';
  import searchBoxFade from '../../../components/searchBoxFade';
  import {getDateStr,parseDate} from "@/utils";
  import startLocation from '@/components/startLocation';
  export default {
    name: 'detailsearch',
    data() {
      let t = this;
      return {
        tableHeight: 0,
        loading:false,
        reasonList: [],
        requestTable: this.$root.getTransDetail,
        form: {
          companyCode: this.$store.getters.getCompanyCode,
          userCode: this.$store.getters.getUserCode,
          searchByAssignStartDate:getDateStr(0) + ' 00:00:00',
          searchByAssignEndDate:getDateStr(0) + ' 23:59:59',
          searchByMainPlateNo: '',
          searchByVinCode: '',
          searchByOriginLocation: '',
          searchByTargetLocation: '',
          searchByStore: '',
          searchByCarrierCompany: '',
          searchByTrailerPlate: '',
          searchByDriver: '',
          searchByProvince:'',
          searchByCity:'',
          searchByCode:'',
          searchByWaybillCode:'',
          searchByTransportWay: null,
          searchByDeliveryStatus: null,
          searchByBargeDestinationCode: null,
          searchByTrunkCarrierCode: null,
          searchByUpdatedScheduleArriveStartDate:'',
          searchByUpdatedScheduleArriveEndDate:'',
          searchByScheduledArriveStartDate:'',
          searchByScheduledArriveEndDate:'',
          searchByOutStartDate:'',
          searchByOutEndDate:'',
          searchByExceptionReasonCode: null, //计划异常原因
          pageNum: 1
        },
        showTable: false,
        newColumn: null, //筛选后的列
        assignTime: { //编制日期
          startDate:getDateStr(0) + ' 00:00:00',
          endDate:getDateStr(0) + ' 23:59:59'
        },
        carryArriveTime: { //运输应到日期
          startDate: '',endDate: ''
        },
        orderArriveTime: { //订单应到日期
          startDate: '',endDate: ''
        },
        outTime: { //出门日期
          startDate: '',endDate: ''
        },
        tableColumn: [
          {type: 'index',label: '序号',align: 'center', },
          {prop: 'assignOn',label: '编制日期',align: 'center',
            formatter: (row) => {return row.assignOn? row.assignOn.substring(0,10) : ''}
          },
          {prop: 'code',label: '拖车计划号',align: 'center'},
          {prop: 'carrierCompanyName',label: '承运商',align: 'center'},
          {prop: 'trailerPlate',label: '挂车车牌号',align: 'center'},
          {prop: 'headPlate',label: '主车车牌号',align: 'center'},
          {prop: 'driverName',label: '司机姓名',align: 'center'},
          {prop: 'driverMobile',label: '司机手机号',align: 'center'},
          {prop: 'driverIdNo',label: '司机身份证号',align: 'center'},
          {prop: 'driverNo',label: '司机卡号',align: 'center'},
          {prop: 'assignName',label: '配板人',align: 'center'},
          {prop: 'publishName',label: '发布人',align: 'center'},
          {prop: 'carStatus',label: '车辆状态',align: 'center'},
          {prop: 'giveCarException',label: '交付异常描述',align: 'center'},
          {prop: 'remark',label: '备注',align: 'center'},
          {prop: 'carCity',label: '承运商上报位置',align: 'center'},
          {prop: 'carLocation',label: '车辆实际位置',align: 'center'},
          {prop: 'leaveDate',label: '离城日期',align: 'center',
            formatter: (row) => {return row.leaveDate? row.leaveDate.substring(0,10) : ''}
          },
          {prop: 'wayBillCode',label: '送车通知单号',align: 'center'},
          {prop: 'vinCode',label: 'VIN码',align: 'center'},
          {prop: 'vehicleType',label: '车型',align: 'center'},
          {prop: 'color',label: '颜色',align: 'center'},
          {prop: 'originLocation',label: '出发地',align: 'center'},
          {prop: 'targetLocation',label: '目的地',align: 'center'},
          {prop: 'moveLocation',label: '搬入地',align: 'center'},
          {prop: 'store',label: '专营店',align: 'center'},
          {prop: 'assignLocation',label: '配板地',align: 'center'},
          {prop: 'finalLocation',label: '最终搬入地',align: 'center'},        
          {prop: 'province',label: '省份',align: 'center'},
          {prop: 'city',label: '城市',align: 'center'},
          {prop: 'finalSettleLocation',label: '最终结算地',align: 'center'},
          {prop: 'moneyWay',label: '资金方式',align: 'center'},
          {prop: 'inventoryNumber',label: '库位号',align: 'center'},
          {prop: 'bigArea',label: '大区',align: 'center'},
          {prop: 'areaCode',label: '区域编码',align: 'center'},
          {prop: 'planPublishTime',label: '物流计划发布时间',align: 'center'},
          {prop: 'requireLeaveTime',label: '离城要求日期',align: 'center',
            formatter: (row) => {return row.requireLeaveTime? row.requireLeaveTime.substring(0,10) : ''}
          },
          {prop: 'requireStartTime',label: '出发要求日期',align: 'center',
            formatter: (row) => {return row.requireStartTime? row.requireStartTime.substring(0,10) : ''}
          },
          {prop: 'requireArriveTime',label: '要求到达日期',align: 'center',
            formatter: (row) => {return row.scheduleArriveTime? row.scheduleArriveTime.substring(0,10) : ''}
          },
          {prop: 'arriveTime',label: '到达时间',align: 'center'},
          {prop: 'deliveryStatus',label: '是否交车',align: 'center'},
          {prop: 'transportWay',label: '运输方式',align: 'center'},
          {prop: 'bargeDestinationName',label: '短驳目的地',align: 'center'},
          {prop: 'trunkCarrierName',label: '干线运输商',align: 'center'},
          {prop: 'isTransportOnTime',label: '运输是否准时交车',align: 'center'},
          {prop: 'isOrderOnTime',label: '订单是否准时交车',align: 'center'},
          {prop: 'isLeaveOnTime',label: '是否准时离城',align: 'center'},
          {prop: 'truckIntoTime',label: '进门时间',align: 'center'},
          {prop: 'truckOutTime',label: '出门时间',align: 'center'},
          {prop: 'truckRequireTime',label: '拖车要求出门时间',align: 'center'},
          {prop: 'isOutOnTime',label: '是否准时出门',align: 'center'},
          {prop: 'delayOutTime',label: '延时出门时长(小时)',align: 'center'},
          {prop: 'loadCarTime',label: '装车时长(小时)',align: 'center'},
          {prop: 'withholdDate',label: '扣款日期',align: 'center',
            formatter: (row) => {
              return this.formatDate(row.withholdDate);
            }
          },
          {prop: 'scheduledAcceptDate',label: '预定受入日期',align: 'center',
            formatter: (row) => {return row.scheduledAcceptDate? row.scheduledAcceptDate.substring(0,10) : ''}
          },
          {prop: 'vehicleOutTime',label: '商品车出门时间',align: 'center'},
          {prop: 'orderDelayDays',label: '订单延迟天数',align: 'center'},
          {prop: 'scheduledArriveDate',label: '预定订单到达日',align: 'center',
            formatter: (row) => {
              return this.formatDate(row.scheduledArriveDate);
            }
          },
          {prop: 'updatedScheduleArriveDate',label: '更新预定运输到达日',align: 'center',
            formatter: (row) => {
              return this.formatDate(row.updatedScheduleArriveDate);
            }
          },
          {prop: 'lineAttribute',label: '线路属性',align: 'center'},
          {prop: 'lineType',label: '线路类型',align: 'center'},
          {prop: 'isChangeBoard',label: '是否换板',align: 'center'},
          {prop: 'isChangeCompany',label: '是否换承运商',align: 'center'},
          {prop: 'cancelStatus',label: '取消状态',align: 'center'},
          {prop: 'cancelReason',label: '取消原因',align: 'center'},
          {prop: 'cancelOn',label: '取消时间',align: 'center'},
          {prop: 'assignDays',label: '配板天数',align: 'center'},
          {prop: 'transportDelayDays',label: '运输延迟天数',align: 'center'},
          {prop: 'waybillReceiveOn',label: '收单日期',align: 'center',
            formatter: (row) => {return row.waybillReceiveOn? row.waybillReceiveOn.substring(0,10) : ''}
          },
          {prop: 'configureScheduleDate',label: '配板预定日',align: 'center',
            formatter: (row) => {return row.configureScheduleDate? row.configureScheduleDate.substring(0,10) : ''}
          },
          {prop: 'deadlineDays',label: '配板时效(天)',align: 'center'},
          {prop: 'isAssignDelay',label: '是否延迟配板',align: 'center'},
          {prop: 'exceedDays',label: '超期时效(天)',align: 'center'},
          {prop: 'isAssignExceed',label: '是否超期配板',align: 'center'},
          {prop: 'isDeliveryDelay',label: '是否交付延迟',align: 'center'},
          {prop: 'isDelay2Days',label: '是否延迟2天',align: 'center'},
          {prop: 'isDelay7Days',label: '是否延迟7天',align: 'center'},
          {prop: 'isInsurance',label: '是否质损',align: 'center'},
          {prop: 'insuranceDate',label: '出险日期',align: 'center',
            formatter: (row) => {return row.insuranceDate? row.insuranceDate.substring(0,10) : ''}
          },
          {prop: 'isInsuranceReport',label: '是否上报厂家保险',align: 'center'},
          {prop: 'injuryLevel',label: '损伤级别',align: 'center'},
          {prop: 'exceptionReason',label: '特殊计划',align: 'center'},
          {prop: 'exceptionRemark',label: '特殊计划备注',align: 'center'},
          {prop: 'exceptionModifiedName',label: '操作特殊计划人',align: 'center'},
          {prop: 'exceptionModifiedOn',label: '操作特殊计划时间',align: 'center'}
        ],
        tableData:[],
        carryStatusList:[],//运输方式
        bargeDesList:[],//短驳目的地
        trunkCarrierList:[],//干线运输上
      }
    },
    watch: {
      assignTime(val) {
        this.form.searchByAssignStartDate = val.startDate;
        this.form.searchByAssignEndDate = val.endDate;
      },
      carryArriveTime(val) {
        this.form.searchByUpdatedScheduleArriveStartDate = val.startDate;
        this.form.searchByUpdatedScheduleArriveEndDate = val.endDate;
      },
      orderArriveTime(val) {
        this.form.searchByScheduledArriveStartDate = val.startDate;
        this.form.searchByScheduledArriveEndDate = val.endDate;
      },
      outTime(val) {
        this.form.searchByOutStartDate = val.startDate;
        this.form.searchByOutEndDate = val.endDate;
      }
    },
    mounted(){
      this.getDictByTypes(); //运输方式、短驳目的地、干线运输商、计划异常原因
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
      search() {
        this.form.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
      },
      reset() {
        this.form = {
          companyCode: this.$store.getters.getCompanyCode,
          userCode: this.$store.getters.getUserCode,
          searchByAssignStartDate:getDateStr(0) + ' 00:00:00',
          searchByAssignEndDate:getDateStr(0) + ' 23:59:59',
          searchByMainPlateNo: '',
          searchByVinCode: '',
          searchByOriginLocation: '',
          searchByTargetLocation: '',
          searchByStore: '',
          searchByCarrierCompany: '',
          searchByTrailerPlate: '',
          searchByDriver: '',
          searchByProvince:'',
          searchByCity:'',
          searchByCode:'',
          searchByWaybillCode:'',
          searchByTransportWay: null,
          searchByDeliveryStatus: null,
          searchByBargeDestinationCode: null,
          searchByTrunkCarrierCode: null,
          searchByUpdatedScheduleArriveStartDate:'',
          searchByUpdatedScheduleArriveEndDate:'',
          searchByScheduledArriveStartDate:'',
          searchByScheduledArriveEndDate:'',
          searchByOutStartDate:'',
          searchByOutEndDate:'',
          searchByExceptionReasonCode: null, //计划异常原因
          pageNum: 1
        };
        this.assignTime = {
          startDate:getDateStr(0) + ' 00:00:00',
          endDate:getDateStr(0) + ' 23:59:59'
        };
        this.carryArriveTime = {startDate:'',endDate:''};
        this.orderArriveTime = {startDate:'',endDate:''};
        this.outTime = {startDate:'',endDate: ''};
        this.$refs['table'].requestTableData(this.form);
      },
      doneFilter(list) {
        this.showTable = false;
        this.newColumn = [...list];
        setTimeout(() => {
          this.showTable = true;
        }, 0)
      },
      getDictByTypes() {
        this.$root.getDictByTypes({
          types: 'YSFS,18.16,18.17,18.20'
        }).then(res => {
          if (res.code === 0) {
            this.carryStatusList = res.data['YSFS'];
            this.bargeDesList=res.data['18.16'];
            this.trunkCarrierList=res.data['18.17'];
            this.reasonList = res.data['18.20'];
          }
        })
      },
      //导出excel
      exportFun(){
        let params = {...this.form};
        let requestPromise = this.$root.getTransDetailExport({
          companyCode: this.$store.getters.getCompanyCode,
          userCode: this.$store.getters.getUserCode,
          searchByAssignStartDate: params.searchByAssignStartDate,
          searchByAssignEndDate: params.searchByAssignEndDate,
          searchByMainPlateNo: params.searchByMainPlateNo,
          searchByVinCode: params.searchByVinCode,
          searchByOriginLocation: params.searchByOriginLocation,
          searchByTargetLocation: params.searchByTargetLocation,
          searchByStore: params.searchByStore,
          searchByCarrierCompany: params.searchByCarrierCompany,
          searchByTrailerPlate: params.searchByTrailerPlate,
          searchByDriver: params.searchByDriver,
          searchByProvince:params.searchByProvince,
          searchByCity:params.searchByCity,
          searchByCode:params.searchByCode,
          searchByWaybillCode:params.searchByWaybillCode,
          searchByTransportWay:params.searchByTransportWay,
          searchByDeliveryStatus:params.searchByDeliveryStatus,
          searchByBargeDestinationCode:params.searchByBargeDestinationCode,
          searchByTrunkCarrierCode:params.searchByTrunkCarrierCode,
          searchByUpdatedScheduleArriveStartDate:params.searchByUpdatedScheduleArriveStartDate,
          searchByUpdatedScheduleArriveEndDate:params.searchByUpdatedScheduleArriveEndDate,
          searchByScheduledArriveStartDate:params.searchByScheduledArriveStartDate,
          searchByScheduledArriveEndDate:params.searchByScheduledArriveEndDate,
          searchByOutStartDate:params.searchByOutStartDate,
          searchByOutEndDate:params.searchByOutEndDate
        });
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          let msg = res.message;
          if (!code) {
            let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `运输明细查询${parseDate()}.xls`;
            let evt = document.createEvent("MouseEvents");
             evt.initEvent("click",true,true);
             link.dispatchEvent(evt);
            this.$message.success("导出成功");
          }
        });
      }
    },
    components: {
      ztTable,
      columnBox,
      datePicker,
      filterColumn,
      searchBoxFade,
      startLocation
    }
  }
</script>

<style scoped lang="scss">
  .el-form .el-select, .el-form .el-input {
    width: 202px;
  }
  .flex_sc {
    margin-bottom: 10px;
  }
  .select_sty{
    width: 100%;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    height: 32px;
    line-height: 32px;
    padding: 0 12px;
  }
</style>