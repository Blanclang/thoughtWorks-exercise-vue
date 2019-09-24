/*
*  @描述：运输计划
*  @作者：邱康松
*  @创建时间：2019/2/27
*/

<template>
  <div class="transport-plan page-normal" style="height: 100%">
    <el-form inline label-width="160px" class="search-form">
      <searchBoxFade>
        <template slot="show">
          <el-form-item label="编制日期：">
            <date-picker v-model="filterTime" style="width: 300px"></date-picker>
          </el-form-item>
          <el-form-item label="VIN码：" label-width="75px">
            <el-input clearable placeholder="请输入" v-model="form.searchByVinCode" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </template>
        <template slot="hide">
          <el-form-item label="拖车计划号：">
            <el-input clearable placeholder="请输入" v-model="form.searchByCode" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="出发地：">
            <startLocation v-model="form.searchByOriginLocation"></startLocation>
          </el-form-item>
          <el-form-item label="挂车车牌号：">
            <el-input clearable placeholder="请输入" v-model="form.searchByTrailerPlate" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="司机姓名：">
            <el-input clearable placeholder="请输入" v-model="form.searchByDriver" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="配板人：">
            <el-input clearable placeholder="请输入" v-model="form.searchByAssignName" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="配板方：">
            <el-input clearable placeholder="请输入" v-model="form.searchByAssignCompanyName" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="短驳目的地：">
            <el-select v-model="form.searchByBargeDestinationCode">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="item in duanBo" :key="item.code" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="干线运输商：">
            <el-select v-model="form.searchByTrunkCarrierCode">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="item in ganXian" :key="item.code" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态：">
            <el-select v-model="form.searchByPublishStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="未发布" :value="0"></el-option>
              <el-option label="已发布" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="承运商配板审核状态：">
            <el-select v-model="form.searchByAssignAuditStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="无需审核" :value="-1"></el-option>
              <el-option label="未审核" :value="0"></el-option>
              <el-option label="已审核" :value="1"></el-option>
              <el-option label="审核未通过" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布前审核状态：">
            <el-select v-model="form.searchByPublishAuditStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="无需审核" :value="-1"></el-option>
              <el-option label="未审核" :value="0"></el-option>
              <el-option label="已审核" :value="1"></el-option>
              <el-option label="审核未通过" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="抽单状态：">
            <el-select v-model="form.searchByDetachStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="正常" :value="false"></el-option>
              <el-option label="抽单" :value="true"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线路类型：">
            <el-select v-model="form.searchByLineType">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="专线" value="18.18.01"></el-option>
              <el-option label="轮板" value="18.18.02"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </searchBoxFade>
    </el-form>
    <column-box no-title="" last class="parent-table-box">
      <template slot="body">
        <div class="flex_sc operation-box" style="padding-bottom: 10px">
          <div>
            <el-button size="small" @click="updatePlan" type="primary" v-has="'VRES46'">修改</el-button>
            <el-button size="small" @click="exportFun" :loading="btnLoading" v-has="'VRES48'">导出</el-button>
          </div>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter"
                        :remove-num="2"></filterColumn>
        </div>
        <zt-table
                data-key="data"
                resize
                @tableResize="tableResize"
                :height="tableHeight"
                @getResData="getResData"
                highlight-current-row
                @getClickRow="getClickRow"
                ref="table"
                v-if="showTable"
                :request="requestTable"
                :request-params="form"
                :get-selection.sync="selectionList"
                :table-column="newColumn || tableColumn">
        </zt-table>
      </template>
    </column-box>
    <column-box no-title="" last class="child-table-box" style="position: relative">
      <template slot="body">
        <div class="total-box">
          <span>商品车总数：{{responseData.vehicleTotalNum || 0}}</span>
          <span>已选：{{selectionList.reduce((total,item) => total + item.vehicleNum*1,0)}}</span>
        </div>
        <zt-table
                ref="secondTable"
                v-loading="vehicleLoading"
                :table-column="childColumn"
                :pagination="false"
                :height="childHeight"
                row-key="id"
                :table-data="vehicleData">
        </zt-table>
      </template>
    </column-box>
    <data-fixed>
      <template slot="body">
        <span>小计：{{vehicleData.length}}条</span>
        <span>目的地：{{targetLocationNum}}个</span>
      </template>
    </data-fixed>
    <!--修改弹窗-->
    <peiBan :visible.sync="visible" :code="selectionList[0] && selectionList[0].code" @success="auditCallback"></peiBan>
  </div>
</template>

<script>
  import columnBox from '../../../../components/zt-column-box';
  import datePicker from '../../../../components/datePicker';
  import filterColumn from '../../../../components/filterColumn';
  import searchBoxFade from '../../../../components/searchBoxFade';
  import ztTable from '../../../../components/zt-table';
  import peiBan from './peiBan';
  import dataFixed from '@/components/dataFixed';
  import {getDateStr,getBetweenDay,parseDate} from "../../../../utils";
  import startLocation from '@/components/startLocation';

  export default {
    name: 'transportPlan',
    data() {
      return {
        responseData: {},
        targetLocationNum: 0,
        parentClickRow: {}, //主表选中的行数据
        btnLoading: false,
        auditFun: null,
        auditVisible: false,
        auditTitle: '',
        isNoAssign: false, //是否点击了历时未发布
        noAssignNum: 0, //历时未发布数量
        vinList: [],
        duanBo: [],
        ganXian: [],
        tableHeight: 0,
        childHeight: 170,
        visible: false,
        vehicleLoading: false,
        vehicleData: [], //车辆信息
        requestTable: this.$root.getTransportsList,
        loading: false,
        form: {
          pageNum: 1,
          companyCode: this.$store.getters.getCompanyCode,
          userCode: this.$store.getters.getUserCode,
          searchByAssignStartDate: getDateStr(0) + ' 00:00:00',
          searchByAssignEndDate: getDateStr(0) + ' 23:59:59',
          searchByVinCode: '', //vinCode
          searchByCode: '', //拖车计划号
          searchByOriginLocation: '', //出发地
          searchByTrailerPlate: '', //车牌号
          searchByDriver: '', //司机姓名
          searchByAssignName: '', //配板人
          searchByAssignCompanyName: '', //配板方
          searchByBargeDestinationCode: null, //短驳目的地
          searchByTrunkCarrierCode: null, //干线运输商
          searchByPublishStatus: null, //发布状态
          searchByAssignAuditStatus: null, //承运商配板审核状态 -1:无需审核,0:待审核, 1:已审核, 2:审核失败
          searchByPublishAuditStatus: null, //发布前审核状态
          searchByDetachStatus: null, //抽单状态
          searchByLineType: null //线路类型
        },
        showTable: false,
        tableData: [],
        selectionList: [],
        selectChild: [], //子表勾选记录
        newColumn: null, //筛选后的列
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
            prop: 'edit',
            label: '操作',
            align: 'center',
            width: 50,
            formatter: (row) => {
              //运输计划没有取消才能删除商品车
              if (!this.parentClickRow.isCancel) {
                return <el-button type="text" onClick={this.handleDelete.bind(this,row)} v-has="VRES47">删除</el-button>
              }
            }
          },
          {
            prop: 'factory',
            label: '工厂',
            align: 'center',
            width: 50
          },
          {
            prop: 'code',
            label: '物流执行计划号',
            align: 'center',
          },
          {
            prop: 'transPlanCode',
            label: '拖车计划号',
            align: 'center',
          },
          {
            prop: 'vinCode',
            label: 'VIN码',
            align: 'center',
            width: 160
          },
          {
            prop: 'vehicleName',
            label: '车型',
            align: 'center'
          },
          {
            prop: 'color',
            label: '颜色',
            align: 'center',
            width: 100
          },
          {
            prop: 'originLocation',
            label: '出发地',
            align: 'center'
          },
          {
            prop: 'targetLocation',
            label: '目的地',
            align: 'center'
          },
          {
            prop: 'finalLocation',
            label: '最终搬入地',
            align: 'center',
          },
          {
            prop: 'province',
            label: '省份',
            align: 'center',
            width: 100
          },
          {
            prop: 'city',
            label: '城市',
            align: 'center',
            width: 100
          },
          {
            prop: 'requireArriveTime',
            label: '到达要求时间',
            align: 'center',
          },
          {
            prop: 'scheduledArriveDate',
            label: '预定订单到达日',
            align: 'center',
            formatter: (row) => {
              return this.formatDate(row.scheduledArriveDate)
            }
          },
          {
            prop: 'withholdDate',
            label: '扣款日期',
            align: 'center',
            width: 100,
            formatter: (row) => {
              return this.formatDate(row.withholdDate)
            }
          },
          {
            prop: 'cancelOn',
            label: '取消时间',
            align: 'center',
          },
          {
            prop: 'cancelReason',
            label: '取消原因',
            align: 'center'
          },
          {
            prop: 'cancelReceiveOn',
            label: '取消通知接收时间',
            align: 'center',
          },
          {
            prop: 'outTime',
            label: '商品车出门时间',
            align: 'center',
          },
          {
            prop: 'waybillCode',
            label: '送车通知单号',
            align: 'center',
          },
          {
            prop: 'waybillReceiveOn',
            label: '运单生成时间',
            align: 'center',
          },
          {
            prop: 'arriveTime',
            label: '到达时间',
            align: 'center'
          },
          {
            prop: 'qualificationStatus',
            label: '质量状态',
            align: 'center',
            width: 100
          },
          {
            prop: 'inventoryNumber',
            label: '库位号',
            align: 'center'
          },
          {
            prop: 'bigArea',
            label: '大区',
            align: 'center',
            width: 80
          },
        ],
        tableColumn: [
          {
            type: 'index',
            label: '序号'
          },
          {
            type: 'selection',
          },
          {
            label: '发布前审核状态',
            prop: 'publishAuditStatusName',
            align: 'center',
            checked: true
          },
          {
            label: '承运商配板审核状态',
            prop: 'assignAuditStatusName',
            align: 'center',
            checked: true
          },
          {
            label: '发布状态',
            prop: 'publishStatusName',
            checked: true,
            align: 'center',
            width: 80,
            formatter: (row) => {
              if (row.publishStatusName === '未发布') {
                return <span class="text-danger">未发布</span>
              } else {
                return '已发布';
              }
            }
          },
          {
            label: '发布日期',
            prop: 'publishOn1',
            checked: true,
            align: 'center',
            width: 100,
            formatter: (row) => {
              return this.formatDate(row.publishOn)
            }
          },
          {
            label: '抽单状态',
            prop: 'detachStatusName',
            checked: true,
            align: 'center',
            width: 80
          },
          {
            label: '编制日期',
            prop: 'assignOn1',
            checked: true,
            align: 'center',
            width: 100,
            formatter: (row) => {
              return this.formatDate(row.assignOn);
            }
          },
          {
            label: '拖车计划号',
            prop: 'code',
            checked: true,
            align: 'center',
          },
          {
            label: '承运商',
            prop: 'carrierCompanyName',
            checked: true,
            align: 'center',
          },
          {
            label: '线路类型',
            prop: 'lineTypeName',
            align: 'center',
          },
          {
            label: '承运原因',
            prop: 'carrierReason',
            checked: true,
            align: 'center',
          },
          {
            label: '商品车数',
            prop: 'vehicleNum',
            checked: true,
            align: 'center',
            width: 80
          },
          {
            label: '出发地',
            prop: 'originLocationName',
            checked: true,
            align: 'center',
          },
          {
            label: '挂车车牌号',
            prop: 'trailerPlate',
            checked: true,
            align: 'center',
          },
          {
            label: '司机姓名',
            prop: 'driverName',
            checked: true,
            align: 'center',
            width: 80
          },
          {
            label: '司机手机号',
            prop: 'driverMobile',
            checked: true,
            align: 'center',
          },
          {
            label: '司机身份证',
            prop: 'driverIdNo',
            checked: true,
            align: 'center',
            width: 180
          },
          {
            label: '拖车到达日期',
            prop: 'trailerEarliestDate',
            checked: true,
            align: 'center',
            width: 100
          },
          {
            label: '拖车最早到达时间',
            prop: 'trailerEarliestTime',
            checked: true,
            align: 'center',
          },
          {
            label: '司机卡号',
            prop: 'driverNo',
            checked: true,
            align: 'center',
            width: 100
          },
          {
            label: 'gps设备id号',
            prop: 'driverMobile1',
            checked: true,
            align: 'center',
            formatter: (row) => {
              return row.driverMobile;
            }
          },
          {
            label: '短驳目的地',
            prop: 'bargeDestinationName',
            checked: true,
            align: 'center',
          },
          {
            label: '干线运输商',
            prop: 'trunkCarrierName',
            checked: true,
            align: 'center',
            width: 150
          },
          {
            label: '配板方',
            prop: 'assignCompanyName',
            checked: true,
            align: 'center',
            width: 200
          },
          {
            label: '配板人',
            prop: 'assignName',
            checked: true,
            align: 'center',
            width: 80
          },
          {
            label: '配板时间',
            prop: 'assignOn',
            checked: true,
            align: 'center',
          },
          {
            label: '承运商配板审核人',
            prop: 'assignAuditName',
            checked: true,
            align: 'center',
            width: 120
          },
          {
            label: '承运商配板审核时间',
            prop: 'assignAuditOn',
            checked: true,
            align: 'center',
          },
          {
            label: '承运商配板审核说明',
            prop: 'assignAuditComment',
            checked: true,
            align: 'center',
            overflowTooltip: true
          },
          {
            label: '发布前审核人',
            prop: 'publishAuditName',
            checked: true,
            align: 'center',
            width: 100
          },
          {
            label: '发布前审核时间',
            prop: 'publishAuditOn',
            checked: true,
            align: 'center',
          },
          {
            label: '发布前审核说明',
            prop: 'publishAuditComment',
            checked: true,
            align: 'center',
            overflowTooltip: true
          },
          {
            label: '发布人',
            prop: 'publishName',
            checked: true,
            align: 'center',
            width: 80
          },
          {
            label: '发布时间',
            prop: 'publishOn',
            checked: true,
            align: 'center',
          },
        ]
      }
    },
    mounted() {
      this.getDictByTypes(); //获取短驳目的地、干线运输商
      this.getTableHeight();
      window.onresize = this.getTableHeight;
    },
    deactivated() {
      window.onresize = null;
    },
    watch: {
      filterTime(val) {
        this.form.searchByAssignStartDate = val.startDate;
        this.form.searchByAssignEndDate = val.endDate;
      },
      vehicleData(val) {
        if (val && val.length > 0) {
          let arr = [];
          val.forEach(item => {
            if (arr.indexOf(item.targetLocation) === -1) {
              arr.push(item.targetLocation);
            }
          });
          this.targetLocationNum = arr.length;
        } else {
          this.targetLocationNum = 0;
        }
      }
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
      exportFun() {
        this.btnLoading = true;
        let obj = {...this.form};
        this.$root.exportTransPlan(obj).then(res => {
          this.btnLoading = false;
          if (!res.code) {
            let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `运输计划${parseDate()}.xls`;
            let evt = document.createEvent("MouseEvents");
             evt.initEvent("click",true,true);
             link.dispatchEvent(evt);
            this.$message.success("导出成功");
          }
        }).catch(() => {
          this.btnLoading = false;
        })
      },
      auditCallback() {
        this.$refs['table'].requestTableData(this.form);
      },
      handleDelete(row) { //删除
        if (this.parentClickRow.publishStatusName === '已发布') {
          this.$message.warning('该计划已发布，不能删除');
          return false;
        }
        //发布前审核为未通过或者已通过，即不能删除车辆
        if (this.parentClickRow.publishAuditStatus !== 0 && this.parentClickRow.publishAuditStatus !== -1) {
          this.$message.warning('发布前审核未通过或已通过，不能删除');
          return false;
        }
        // 如果承运商配板审核是审核通过或审核不通过，不能删除
        if (this.parentClickRow.assignAuditStatus === 1 || this.parentClickRow.assignAuditStatus === 2) {
          this.$message.warning('承运商配板审核通过或者不通过，不能删除');
          return false;
        }
        // 如果不是承运商配板的，即不能删除车辆
        if (this.parentClickRow.assignCompanyCode !== this.$store.getters.getCompanyCode) {
          this.$message.warning('一级物流商配板不能删除');
          return false;
        }
        let flag = false;
        if (this.vehicleData.length === 1) {
          flag = true;
        }
        this.$confirm('确定删除？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$root.deletePlan({
            "companyCode":this.$store.getters.getCompanyCode,
            "userCode":this.$store.getters.getUserCode,
            "id": this.parentClickRow.id,
            "code":this.parentClickRow.code,
            "children":row.code
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('删除成功');
              // 如果是删除了全部的车辆，即刷新主表和子表，反之只刷新子表
              if (flag) {
                this.auditCallback();
              } else {
                this.getClickRow(this.parentClickRow);
              }
            }
          })
        })
      },
      reset() {
        this.form = {
          pageNum: 1,
          companyCode: this.$store.getters.getCompanyCode,
          userCode: this.$store.getters.getUserCode,
          searchByAssignStartDate: getDateStr(0) + ' 00:00:00',
          searchByAssignEndDate: getDateStr(0) + ' 23:59:59',
          searchByVinCode: '', //vinCode
          searchByCode: '', //拖车计划号
          searchByOriginLocation: '', //出发地
          searchByTrailerPlate: '', //车牌号
          searchByDriver: '', //司机姓名
          searchByAssignName: '', //配板人
          searchByAssignCompanyName: '', //配板方
          searchByBargeDestinationCode: null, //短驳目的地
          searchByTrunkCarrierCode: null, //干线运输商
          searchByPublishStatus: null, //发布状态
          searchByAssignAuditStatus: null, //承运商配板审核状态
          searchByPublishAuditStatus: null, //发布前审核状态
          searchByDetachStatus: null, //抽单状态
          searchByLineType: null //线路类型
        };
        this.filterTime = {
          startDate: getDateStr(0) + ' 00:00:00',
          endDate: getDateStr(0) + ' 23:59:59'
        };
        this.$refs['table'].requestTableData(this.form);
      },
      getDictByTypes() {
        this.$root.getDictByTypes({
          types: '18.16,18.17'
        }).then(res => {
          if (res.code === 0) {
            this.duanBo = res.data['18.16'];
            this.ganXian = res.data['18.17'];
          }
        })
      },
      getTableHeight() {
        this.$nextTick(() => {
          let height = document.getElementsByClassName('page-content')[0].clientHeight;
          let formHeight = document.getElementsByClassName('search-form')[0].clientHeight;
          let btnHeight = document.getElementsByClassName('operation-box')[0].clientHeight;
          let cTableHeight = document.getElementsByClassName('child-table-box')[0].clientHeight;
          this.tableHeight = height - formHeight - btnHeight - cTableHeight - 45 - 30; //45：翻页加一些margin值
        })
      },
      getResData(res) {
        this.responseData = res || {};
        let data = res.data || {};
        let list = data.list || [];
        if (list.length === 0) { //如果主表数据没了，即清空子表，防止子表显示错误的数据
          this.vehicleData = [];
        }
        this.$refs['table'].setCurrentRow(list[0]); //默认选中第一条计划获取车辆信息
        list[0] && this.getClickRow(list[0]);
        if (!this.form.searchByAssignStartDate && this.form.searchByPublishStatus === 0) {
          this.noAssignNum = data.total; //重置历史未发布数量
        }
      },
      search() {
        if (getBetweenDay(this.form.searchByAssignStartDate,this.form.searchByAssignEndDate) > 90) {
          this.$message.warning('查询区间不能超过90天!');
          return false;
        }
        this.form.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
      },
      updatePlan() { //修改计划
        if (this.selectionList.length === 0) {
          this.$message.warning('请先选择计划！');
          return false;
        }
        if (this.selectionList.length > 1) {
          this.$message.warning('一次只能修改一条记录！');
          return false;
        }
        if (this.selectionList[0].publishStatus === 1) {
          this.$message.warning('该记录已发布，不能修改');
          return false;
        }
        if (this.selectionList[0].assignCompanyCode !== this.$store.getters.getCompanyCode) {
          this.$message.warning('该记录为一级物流商配板，不能修改');
          return false;
        }
        if (this.selectionList[0].assignAuditStatus === 1 || this.selectionList[0].assignAuditStatus === 2) {
          this.$message.warning('承运商配板审核通过或审核不通过，不能修改');
          return false;
        }
        if (this.selectionList[0].publishAuditStatus === 1 || this.selectionList[0].publishAuditStatus === 2) {
          this.$message.warning('发布前审核通过或不通过，不能修改');
          return false;
        }
        this.visible = true;
      },
      getClickRow(row) { //单击表格
        this.parentClickRow = row;
        this.vehicleLoading = true;
        this.$root.getTransportChild({
          code: row.code
        }).then(res => {
          this.vehicleLoading = false;
          if (res.code === 0) {
            this.vehicleData = res.data || [];
          }
        }).catch(() => {
          this.vehicleLoading = false;
        })
      },
      doneFilter(list) {
        this.showTable = false;
        this.newColumn = [...list];
        setTimeout(() => {
          this.showTable = true;
        }, 0)
      },
      getSelection(selection) {
        this.selectionList = selection;
      },
    },
    components: {
      columnBox,
      datePicker,
      filterColumn,
      searchBoxFade,
      ztTable,
      peiBan,
      dataFixed,
      startLocation
    }
  }
</script>

<style scoped lang="scss">
  .transport-plan /deep/ {
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
    .sub-total-column td {
      color: #409EFF;
    }

    .search-form .el-form-item {
      margin-bottom: 10px;
    }

    .el-badge__content.is-fixed {
      right: 20px;
    }

    .lineDiv:hover {
      cursor: s-resize;
    }
    .line {
      height:10px;
      background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);
      opacity:0.1;
    }
  }
</style>