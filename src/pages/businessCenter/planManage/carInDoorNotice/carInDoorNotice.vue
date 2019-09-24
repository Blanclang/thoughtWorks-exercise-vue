/*
*  @描述：拖车进门时间通知
*  @作者：邱康松
*  @创建时间：2019/3/27
*/

<template>
  <div class="page-normal">
    <el-form inline label-width="100px">
      <searchBoxFade>
        <template slot="show">
          <el-form-item label="编制日期：">
            <date-picker v-model="filterTime"></date-picker>
          </el-form-item>
          <el-form-item label="出发地：">
            <startLocation v-model="form.searchByOriginLocation"></startLocation>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </template>
        <template slot="hide">
          <el-form-item label="拖车计划号：">
            <el-input placeholder="请输入" clearable v-model="form.searchByTransPlanCode" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="挂车车牌号：">
            <el-input placeholder="请输入" clearable v-model="form.searchByTrailerPlate" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="司机姓名：">
            <el-input placeholder="请输入" clearable v-model="form.searchByDriverName" :maxlength="50"></el-input>
          </el-form-item>
        </template>
      </searchBoxFade>
    </el-form>
    <column-box no-title="" last class="parent-table-box">
      <template slot="body">
        <div class="flex_sc" style="padding-bottom: 10px">
          <el-button type="primary" @click="exportExcel" v-has="'VRES52'">导出</el-button>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter"></filterColumn>
        </div>
        <zt-table :table-column="newColumn || tableColumn" v-if="showTable" ref="table" :request-params="form" :request="requestTable"></zt-table>
      </template>
    </column-box>
  </div>
</template>

<script>
  import columnBox from '../../../../components/zt-column-box';
  import datePicker from '../../../../components/datePicker';
  import filterColumn from '../../../../components/filterColumn';
  import searchBoxFade from '../../../../components/searchBoxFade';
  import ztTable from '../../../../components/zt-table';
  import {getDateStr,parseDate} from "../../../../utils";
  import startLocation from '@/components/startLocation';

  export default {
    name: 'carInDoorNotice',
    data() {
      return {
        requestTable: this.$root.getCarInDoorNotice,
        showTable: false,
        newColumn: null,
        form: {
          pageNum: 1,
          searchByAssignStartOn: getDateStr(0) + ' 00:00:00',
          searchByAssignOnEndOn: getDateStr(0) + ' 23:59:59',
          searchByCarrierCompanyName: '', //承运商
          searchByTrailerPlate: '', //挂车车牌号
          searchByDriverName: '', //司机姓名
          searchByTransPlanCode: '', //拖车计划号
          searchByOriginLocation: '', //出发地
          searchByCompanyCode: this.$store.getters.getCompanyCode
        },
        filterTime: {
          startDate: getDateStr(0) + ' 00:00:00',
          endDate: getDateStr(0) + ' 23:59:59'
        },
        tableColumn: [
          {
            type: 'index',
            label: '序号'
          },
          {
            prop: 'transPlanCode',
            label: '拖车计划号',
            align: 'center'
          },
          {
            prop: 'isReceiveName',
            label: '是否已收单',
            align: 'center'
          },
          {
            prop: 'assignOn',
            label: '编制日期',
            align: 'center',
            formatter: (row) => {
              return this.formatDate(row.assignOn)
            }
          },
          {
            prop: 'originLocationName',
            label: '出发地',
            align: 'center'
          },
          {
            prop: 'trailerPlate',
            label: '挂车车牌号',
            align: 'center'
          },
          {
            prop: 'headPlate',
            label: '主车车牌号',
            align: 'center'
          },
          {
            prop: 'vehicleType',
            label: '拖车车型',
            align: 'center'
          },
          {
            prop: 'departFactory',
            label: '工厂',
            align: 'center'
          },
          {
            prop: 'scheduleIntoTime',
            label: '预排进门时间',
            align: 'center'
          },
          {
            prop: 'requireIntoTime',
            label: '要求进门时间',
            align: 'center'
          },
          {
            prop: 'readySendRoad',
            label: '代发道',
            align: 'center'
          },
          {
            prop: 'truckRoad',
            label: '拖车道',
            align: 'center'
          },
          {
            prop: 'carrierCompanyName',
            label: '承运商',
            align: 'center'
          },
          {
            prop: 'driverName',
            label: '司机姓名',
            align: 'center'
          },
          {
            prop: 'driverMobile',
            label: '司机手机号',
            align: 'center'
          },
          {
            prop: 'driverIdNo',
            label: '司机身份证号',
            align: 'center'
          },
          {
            prop: 'driverNo',
            label: '司机卡号',
            align: 'center'
          },
          {
            prop: 'intoTime',
            label: '进门时间',
            align: 'center'
          },
          {
            prop: 'outTime',
            label: '出门时间',
            align: 'center'
          },
          {
            prop: 'requireTime',
            label: '拖车要求出门时间',
            align: 'center'
          },
          {
            prop: 'bargeDestinationName',
            label: '短驳目的地',
            align: 'center'
          },
          {
            prop: 'trunkCarrierName',
            label: '干线运输商',
            align: 'center'
          },
          {
            prop: 'lineAttribute',
            label: '线路属性',
            align: 'center'
          },
          {
            prop: 'transPType',
            label: '运输方式',
            align: 'center'
          },
        ]
      }
    },
    watch: {
      filterTime(val) {
        this.form.searchByAssignStartOn = val.startDate;
        this.form.searchByAssignOnEndOn = val.endDate;
      }
    },
    methods: {
      exportExcel() {
        let obj = {...this.form};
        this.$root.exportCarInDoorNotice(obj).then(res => {
          if (!res.code) {
            let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `拖车进门时间通知${parseDate()}.xls`;
            let evt = document.createEvent("MouseEvents");
             evt.initEvent("click",true,true);
             link.dispatchEvent(evt);
            this.$message.success("导出成功");
          }
        })
      },
      search() {
        this.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
      },
      reset() {
        this.form = {
          pageNum: 1,
          searchByAssignStartOn: getDateStr(0) + ' 00:00:00',
          searchByAssignOnEndOn: getDateStr(0) + ' 23:59:59',
          searchByCarrierCompanyName: '', //承运商
          searchByTrailerPlate: '', //挂车车牌号
          searchByDriverName: '', //司机姓名
          searchByTransPlanCode: '', //拖车计划号
          searchByOriginLocation: '', //出发地
          searchByCompanyCode: this.$store.getters.getCompanyCode
        };
        this.filterTime = {
          startDate: getDateStr(0) + ' 00:00:00',
          endDate: getDateStr(0) + ' 23:59:59'
        };
        this.$refs['table'].requestTableData(this.form);
      },
      doneFilter(list) {
        this.showTable = false;
        this.newColumn = [...list];
        setTimeout(() => {
          this.showTable = true;
        }, 0)
      }
    },
    components: {
      columnBox,
      datePicker,
      filterColumn,
      searchBoxFade,
      ztTable,
      startLocation
    }
  }
</script>

<style scoped>

</style>