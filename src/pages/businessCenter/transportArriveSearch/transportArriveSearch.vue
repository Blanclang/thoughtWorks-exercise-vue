/*
*  @描述：运输到达查询
*  @作者：邱康松
*  @创建时间：2019/6/25
*/

<template>
  <div class="page-normal">
    <el-form inline label-width="120px">
      <search-box-fade>
        <template slot="show">
          <el-form-item label="到达预定日期：">
            <date-picker v-model="filterTime_yd"></date-picker>
          </el-form-item>
          <el-form-item label="VIN码：">
            <el-input placeholder="请输入" :maxlength="50" clearable v-model="form.searchByVinCode"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </template>
        <template slot="hide">
          <el-form-item label="出发地：">
            <startLocation v-model="form.searchByOriginLocation"></startLocation>
          </el-form-item>
          <el-form-item label="拖车计划号：">
            <el-input placeholder="请输入" :maxlength="50" clearable v-model="form.searchByTransPlanCode"></el-input>
          </el-form-item>
          <el-form-item label="挂车车牌号：">
            <el-input placeholder="请输入" :maxlength="50" clearable v-model="form.searchByTrailerPlate"></el-input>
          </el-form-item>
          <el-form-item label="司机姓名：">
            <el-input placeholder="请输入" :maxlength="50" clearable v-model="form.searchByDriverName"></el-input>
          </el-form-item>
          <el-form-item label="送车通知单号：">
            <el-input placeholder="请输入" :maxlength="50" clearable v-model="form.searchByWaybillCode"></el-input>
          </el-form-item>
          <el-form-item label="搬入地：">
            <el-input placeholder="请输入" :maxlength="50" clearable v-model="form.searchByMoveLocation"></el-input>
          </el-form-item>
          <el-form-item label="是否到达：">
            <el-select v-model="form.searchByIsArrive">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否准时：">
            <el-select v-model="form.searchByIsOnTime">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="到达日期：">
            <date-picker v-model="filterTime"></date-picker>
          </el-form-item>
        </template>
      </search-box-fade>
    </el-form>
    <column-box no-title="" last class="parent-table-box">
      <template slot="body">
        <div class="flex_sc operation-box" style="padding-bottom: 10px">
          <el-button type="primary" v-has="'VRES101'" @click="exportExcel" :loading="exportLoading">导出</el-button>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter"></filterColumn>
        </div>
        <zt-table :table-column="newColumn || tableColumn" v-if="showTable" :request="requestTable" :request-params="form" ref="table"></zt-table>
      </template>
    </column-box>
  </div>
</template>

<script>
  import datePicker from '../../../components/datePicker';
  import columnBox from '../../../components/zt-column-box';
  import ztTable from '../../../components/zt-table';
  import searchBoxFade from '../../../components/searchBoxFade';
  import filterColumn from '../../../components/filterColumn';
  import {getDateStr,parseDate} from "../../../utils";
  import startLocation from '@/components/startLocation';

  export default {
    name: 'transportArriveSearch',
    data() {
      return {
        exportLoading: false,
        requestTable: this.$root.getArriveList,
        form: {
          searchByArriveStartOn: '', //到达日期
          searchByArriveEndOn: '',
          searchByOriginLocation: '', //出发地
          searchByVinCode: '', //vinCode
          searchByCompanyName: '', //承运商
          searchByMoveLocation: '', //搬入地
          searchByWaybillCode: '', //送车通知单
          searchByTrailerPlate: '', //挂车车牌
          searchByDriverName: '', //司机姓名
          searchByTransPlanCode: '', //拖车计划号
          searchByIsArrive: null, //是否到达
          searchByIsOnTime: null, //是否准时
          searchByReserveStartOn: getDateStr(0) + ' 00:00:00', //到达预定日期
          searchByReserveEndOn: getDateStr(0) + ' 23:59:59',
          pageNum: 1
        },
        showTable: false,
        newColumn: null,
        filterTime_yd: {
          startDate: getDateStr(0) + ' 00:00:00',
          endDate: getDateStr(0) + ' 23:59:59'
        },
        filterTime: {},
        tableColumn: [
          { type: 'index', label: '序号' },
          { label: '拖车计划号', prop: 'transPlanCode', align: 'center' },
          { label: '承运商', prop: 'companyName', align: 'center' },
          { label: '挂车车牌号', prop: 'trailerPlate', align: 'center' },
          { label: '司机姓名', prop: 'driverName', align: 'center' },
          { label: '送车通知单号', prop: 'waybillCode', align: 'center' },
          { label: 'VIN码', prop: 'vinCode', align: 'center' },
          { label: '出发地', prop: 'originLocation', align: 'center' },
          { label: '目的地', prop: 'targetLocation', align: 'center' },
          { label: '搬入地', prop: 'moveLocation', align: 'center' },
          { label: '资金方式', prop: 'moneyType', align: 'center' },
          { label: '配板日期', prop: 'assignOn', align: 'center',
            formatter: (row) => {
              return this.formatDate(row.assignOn);
            }
          },
          { label: '商品车出门时间', prop: 'vehicleOutTime', align: 'center' },
          { label: '出货预定时间', prop: 'scheduleOutTime', align: 'center' },
          { label: '到达预定时间', prop: 'scheduleArriveTime', align: 'center' },
          { label: '到达目的地', prop: 'arriveLocation', align: 'center' },
          { label: '到达时间', prop: 'arriveTime', align: 'center' },
          { label: '质量状态', prop: 'qualificationStatus', align: 'center' },
          { label: '是否准时', prop: 'isOnTime', align: 'center' },
        ]
      }
    },
    watch: {
      filterTime(val) {
        this.form.searchByArriveStartOn = val.startDate;
        this.form.searchByArriveEndOn = val.endDate;
      },
      filterTime_yd(val) {
        this.form.searchByReserveStartOn = val.startDate;
        this.form.searchByReserveEndOn = val.endDate;
      }
    },
    methods: {
      search() {
        this.form.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
      },
      reset() {
        this.form = {
          searchByArriveStartOn: '', //到达日期
          searchByArriveEndOn: '',
          searchByOriginLocation: '', //出发地
          searchByVinCode: '', //vinCode
          searchByCompanyName: '', //承运商
          searchByMoveLocation: '', //搬入地
          searchByWaybillCode: '', //送车通知单
          searchByTrailerPlate: '', //挂车车牌
          searchByDriverName: '', //司机姓名
          searchByTransPlanCode: '', //拖车计划号
          searchByIsArrive: null, //是否到达
          searchByIsOnTime: null, //是否准时
          searchByReserveStartOn: getDateStr(0) + ' 00:00:00', //到达预定日期
          searchByReserveEndOn: getDateStr(0) + ' 23:59:59',
          pageNum: 1
        };
        this.filterTime_yd = {
          startDate: getDateStr(0) + ' 00:00:00',
          endDate: getDateStr(0) + ' 23:59:59'
        };
        this.filterTime = {};
        this.$refs['table'].requestTableData(this.form);
      },
      exportExcel() {
        this.exportLoading = true;
        let params = {...this.form};
        delete params.pageSize;
        delete params.pageNum;
        let requestPromise = this.$root.exportArriveList(params);
        requestPromise.then(res => {
          this.exportLoading = false;
          let code = parseInt(res.code);
          let msg = res.message;
          if (!code) {
            let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `运输到达查询${parseDate()}.xls`;
            let evt = document.createEvent("MouseEvents");
            evt.initEvent("click",true,true);
            link.dispatchEvent(evt);
            this.$message.success("导出成功");
          }
        }).catch((err) => {
          this.exportLoading = false;
        })
      },
      doneFilter(list) {
        this.showTable = false;
        this.newColumn = [...list];
        setTimeout(() => {
          this.showTable = true;
        }, 0)
      },
    },
    components: {
      datePicker,
      columnBox,
      ztTable,
      searchBoxFade,
      filterColumn,
      startLocation
    }
  }
</script>

<style scoped>

</style>