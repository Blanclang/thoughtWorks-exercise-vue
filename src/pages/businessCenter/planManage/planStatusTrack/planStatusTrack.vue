/*
*  @描述：计划发布状态跟踪
*  @作者：邱康松
*  @创建时间：2019/3/27
*/

<template>
  <div class="page-normal">
    <el-form inline label-width="100px" class="search-form">
      <searchBoxFade>
        <template slot="show">
          <el-form-item label="编制日期：">
            <date-picker v-model="filterTime"></date-picker>
          </el-form-item>
          <el-form-item label="VIN码：">
            <el-input placeholder="请输入" clearable v-model="form.vinCode" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </template>
        <template slot="hide">
          <el-form-item label="出发地：">
            <startLocation v-model="form.originLocationCode"></startLocation>
          </el-form-item>
          <el-form-item label="挂车车牌号：">
            <el-input placeholder="请输入" clearable v-model="form.trailerPlate" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="司机姓名：">
            <el-input placeholder="请输入" clearable v-model="form.driverName" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="拖车计划号：">
            <el-input placeholder="请输入" clearable v-model="form.transPlanCode" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="送车通知单号：">
            <el-input placeholder="请输入" clearable v-model="form.waybillCode" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="是否抽单：">
            <el-select v-model="form.isDrawSheet">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="正常" :value="0"></el-option>
              <el-option label="抽单" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否已收单：">
            <el-select v-model="form.isAccept">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </searchBoxFade>
    </el-form>
    <column-box no-title="" last class="parent-table-box">
      <template slot="body">
        <div class="flex_sc operation-box" style="padding-bottom: 10px">
          <div>
            <el-button type="primary" @click="exportExcel" :loading="btnLoading" v-has="'VRES50'">导出</el-button>
          </div>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter"></filterColumn>
        </div>
        <zt-table
                data-key="data"
                resize
                @tableResize="tableResize"
                @getResData="getResData"
                @getClickRow="rowClick"
                highlight-current-row=""
                ref="table"
                :table-column="newColumn || tableColumn"
                v-if="showTable"
                :height="tableHeight"
                :request-params="form"
                :request="requestTable">
        </zt-table>
      </template>
    </column-box>
    <column-box no-title="" last class="child-table-box" style="position: relative">
      <template slot="body">
        <div class="total-box">
          <span>商品车数：{{responseData.vehicleTotalNum || 0}}</span>
          <span>运单台数：{{responseData.waybillTotalNum || 0}}</span>
        </div>
        <zt-table :table-column="childColumn" :height="childHeight" :pagination="false" ref="childTable" :table-data="tableData" v-loading="loading"></zt-table>
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
  import {getDateStr,renderHeader,parseDate} from "../../../../utils";
  import startLocation from '@/components/startLocation';

  export default {
    name: 'planStatusTrack',
    data() {
      return {
        responseData: {},
        selectRow: {}, //选中的计划数据
        loading: false,
        btnLoading: false,
        requestTable: this.$root.getPublishStatusList,
        tableHeight: 0,
        childHeight: 170,
        showTable: false,
        newColumn: null,
        tableData: [],
        form: {
          pageNum: 1,
          editStart: getDateStr(0) + ' 00:00:00',
          editEnd: getDateStr(0) + ' 23:59:59',
          vinCode: '', //vin码
          originLocationCode: '', //出发地
          carriersName: '', //承运商
          trailerPlate: '', //挂车车牌号
          driverName: '', //司机姓名
          transPlanCode: '', //拖车计划号
          isDrawSheet: null, //是否抽单
          isAccept: null, //是否已收单
          waybillCode: ''
        },
        filterTime: {
          startDate: getDateStr(0) + ' 00:00:00',
          endDate: getDateStr(0) + ' 23:59:59'
        },
        childColumn: [
          {
            type: 'index',
            label: '序号'
          },
          {
            prop: 'departFactory',
            label: '工厂',
            align: 'center'
          },
          {
            prop: 'transPlanCode',
            label: '拖车计划号',
            align: 'center',
            renderHeader
          },
          {
            prop: 'lgsPlanCode',
            label: '物流执行计划号',
            align: 'center',
            renderHeader
          },
          {
            prop: 'transDeliveryCode',
            label: '送车通知单号',
            align: 'center',
            renderHeader
          },
          {
            prop: 'vinCode',
            label: 'VIN码',
            align: 'center'
          },
          {
            prop: 'vehicleType',
            label: '车型',
            align: 'center'
          },
          {
            prop: 'color',
            label: '颜色',
            align: 'center'
          },
          {
            prop: 'originLocationCode',
            label: '出发地',
            align: 'center'
          },
          {
            prop: 'targetLocationCode',
            label: '目的地',
            align: 'center'
          },
          {
            prop: 'finalLocationCode',
            label: '最终搬入地',
            align: 'center',
            renderHeader
          },
          {
            prop: 'province',
            label: '省份',
            align: 'center'
          },
          {
            prop: 'city',
            label: '城市',
            align: 'center'
          },
          {
            prop: 'moneyType',
            label: '资金方式',
            align: 'center'
          },
          {
            prop: 'scheduleArriveTime',
            label: '预定订单到达日',
            align: 'center',
            formatter: (row) => {
              return this.formatDate(row.scheduleArriveTime);
            }
          },
          {
            prop: 'outTime',
            label: '商品车出门时间',
            align: 'center',
            renderHeader
          },
          {
            prop: 'cancelReason',
            label: '取消原因',
            align: 'center'
          },
          {
            prop: 'cancelTime',
            label: '取消时间',
            align: 'center'
          },
          {
            prop: 'inventoryNumber',
            label: '库位号',
            align: 'center'
          },
          {
            prop: 'bigArea',
            label: '大区',
            align: 'center'
          },
        ],
        tableColumn: [
          {
            type: 'index',
            label: '序号'
          },
          {
            prop: 'docStatus',
            label: '运单状态',
            align: 'center',
            width: 100,
            formatter: (row) => {
              if (+row.docStatus === 0) {
                return <span class="text-danger">运单未全收到</span>
              }
              return '运单全收到';
            }
          },
          {
            prop: 'drawStatus',
            label: '抽单状态',
            align: 'center',
            formatter: (row) => {
              return +row.drawStatus === 1 ? '抽单' : '正常'
            }
          },
          {
            prop: 'isAccept',
            label: '是否已收单',
            align: 'center',
            formatter: (row) => {
              return +row.isAccept === 1 ? '已收单' : '未收单'
            }
          },
          {
            prop: 'transPlanCode',
            label: '拖车计划号',
            align: 'center',
            renderHeader
          },
          {
            prop: 'carNum',
            label: '商品车数',
            align: 'center'
          },
          {
            prop: 'docCarNum',
            label: '运单台数',
            align: 'center'
          },
          {
            prop: 'docNum',
            label: '运单数',
            align: 'center'
          },
          {
            prop: 'preComingTime',
            label: '预排进门时间',
            align: 'center',
            renderHeader
          },
          {
            prop: 'goNum',
            label: '已出门台数',
            align: 'center',
            renderHeader
          },
          {
            prop: 'originLocationCode',
            label: '出发地',
            align: 'center'
          },
          {
            prop: 'lineType',
            label: '线路类型',
            align: 'center'
          },
          {
            prop: 'lineProperty',
            label: '线路属性',
            align: 'center'
          },
          {
            prop: 'carriersName',
            label: '承运商',
            align: 'center'
          },
          {
            prop: 'trailerPlate',
            label: '挂车车牌号',
            align: 'center',
            renderHeader
          },
          {
            prop: 'mainPlate',
            label: '主车车牌号',
            align: 'center',
            renderHeader
          },
          {
            prop: 'driverName',
            label: '司机姓名',
            align: 'center'
          },
          {
            prop: 'driverMobile',
            label: '司机手机号',
            align: 'center',
            renderHeader
          },
          {
            prop: 'driverIdentity',
            label: '司机身份证号',
            align: 'center',
            renderHeader
          },
          {
            prop: 'driverNo',
            label: '司机卡号',
            align: 'center'
          },
          {
            prop: 'assignOn',
            label: '编制日期',
            align: 'center',
            formatter: (row) => {
              return this.formatDate(row.assignOn);
            }
          }
        ]
      }
    },
    watch: {
      filterTime(val) {
        this.form.editStart = val.startDate;
        this.form.editEnd = val.endDate;
      }
    },
    mounted() {
      this.getTableHeight();
      window.onresize = this.getTableHeight;
    },
    deactivated() {
      window.onresize = null;
    },
    methods: {
      tableResize(e) {
        let clientY = e.clientY;
        let self = this;
        let height = self.tableHeight;
        let childHeight = self.childHeight;
        document.onmousemove = function (ev) {
          let y = ev.clientY;
          if (clientY > y + 10) { //向上拖
            if (self.tableHeight <= 100) {
              return false;
            }
            self.tableHeight = height - (clientY - y);
            self.childHeight = childHeight + (clientY - y);
          } else if (clientY < y + 10) { //向下拖
            if (self.childHeight <= 100) {
              return false;
            }
            self.tableHeight = height + (y - clientY);
            self.childHeight = childHeight - (y - clientY);
          }
        };
        document.onmouseup=function(){
          document.onmousedown=null;
          document.onmousemove=null;
        };
      },
      exportExcel() {
        this.btnLoading = true;
        let obj = {...this.form};
        this.$root.exportPublishStatus(obj).then(res => {
          this.btnLoading = false;
          if (!res.code) {
            let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `计划发布状态跟踪${parseDate()}.xls`;
            let evt = document.createEvent("MouseEvents");
             evt.initEvent("click",true,true);
             link.dispatchEvent(evt);
            this.$message.success("导出成功");
          }
        }).catch(() => {
          this.btnLoading = false;
        })
      },
      search() {
        this.form.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
        // 强制变换一下表格高度，防止固定列错位问题
        this.$nextTick(() => {
          this.tableHeight = this.tableHeight - 1;
          setTimeout(() => {
            this.tableHeight = this.tableHeight + 1;
          },1000)
        })
      },
      reset() {
        this.form = {
          pageNum: 1,
          editStart: getDateStr(0) + ' 00:00:00',
          editEnd: getDateStr(0) + ' 23:59:59',
          vinCode: '', //vin码
          originLocationCode: '', //出发地
          carriersName: '', //承运商
          trailerPlate: '', //挂车车牌号
          driverName: '', //司机姓名
          transPlanCode: '', //拖车计划号
          isDrawSheet: null, //是否抽单
          isAccept: null, //是否已收单
          waybillCode: ''
        };
        this.filterTime = {
          startDate: getDateStr(0) + ' 00:00:00',
          endDate: getDateStr(0) + ' 23:59:59'
        };
        this.$refs['table'].requestTableData(this.form);
      },
      rowClick(row) {
        this.getChildTableList(row);
      },
      getResData(res) {
        this.responseData = res;
        let data = res.data || {};
        this.$nextTick(() => {
          this.tableData = [];
          this.$refs['table'].setCurrentRow(data.list[0]);
          data.list[0] && this.getChildTableList(data.list[0]);
        })
      },
      getChildTableList(row) { //获取子表数据
        this.selectRow = row;
        this.loading = true;
        this.$root.getPublishDetail({
          transPlanCode: row.transPlanCode
        }).then(res => {
          this.loading = false;
          if (res.code === 0) {
            this.tableData = res.data || [];
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      getTableHeight() {
        this.$nextTick(() => {
          let height = document.getElementsByClassName('page-content')[0].clientHeight;
          let formHeight = document.getElementsByClassName('search-form')[0].clientHeight;
          let btnHeight = document.getElementsByClassName('operation-box')[0].clientHeight;
          let cTableHeight = document.getElementsByClassName('child-table-box')[0].clientHeight;
          this.tableHeight = height - formHeight - btnHeight - cTableHeight - 45; //45：翻页加一些margin值
        })
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

<style scoped lang="scss">
  .hide {
    display: none;
  }
  .total-box {
    color: #409EFF;
    position: absolute;
    right: 10px;
    top: -30px;
    span {
      display: inline-block;
      margin-right: 10px;
    }
  }
</style>