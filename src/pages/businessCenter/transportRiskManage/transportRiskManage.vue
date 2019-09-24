/*
*  @描述：运输保险管理
*  @作者：邱康松
*  @创建时间：2019/4/30
*/

<template>
  <div class="page-normal">
    <el-form inline label-width="100px" class="search-form">
      <search-box-fade>
        <template slot="show">
          <el-form-item label="编制日期：">
            <datePicker v-model="filterTime"></datePicker>
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
            <el-input clearable :maxlength="50" placeholder="请输入" v-model="form.searchByTransPlanCode"></el-input>
          </el-form-item>
          <el-form-item label="挂车车牌号：">
            <el-input clearable :maxlength="50" placeholder="请输入" v-model="form.searchByTrailerPlate"></el-input>
          </el-form-item>
          <el-form-item label="司机姓名：">
            <el-input clearable :maxlength="10" placeholder="请输入" v-model="form.searchByDriverName"></el-input>
          </el-form-item>
          <el-form-item label="确认状态：">
            <el-select v-model="form.searchByCompanyConfirmStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已确认" :value="1"></el-option>
              <el-option label="未确认" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-box-fade>
    </el-form>
    <column-box no-title="" last class="parent-table-box">
      <template slot="body">
        <div class="flex_sc operation-box" style="padding-bottom: 10px">
          <div>
            <el-button type="primary" @click="handleConfirm" v-has="'VRES63'">保险确认</el-button>
            <el-button @click="handleEdit" v-has="'VRES64'">修改保险公司</el-button>
            <el-button v-has="'VRES65'" @click="handleExport">导出</el-button>
          </div>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter" :remove-num="2"></filterColumn>
        </div>
        <zt-table
                ref="table"
                resize
                @tableResize="tableResize"
                redio-default
                highlight-current-row
                :request="requestTable"
                :request-params="form"
                :get-selection.sync="selectList"
                :getClickRow.sync="selectRow"
                :table-column="newColumn || tableColumn"
                v-if="showTable"
                :height="tableHeight">
        </zt-table>
      </template>
    </column-box>
    <column-box no-title="" last class="child-table-box">
      <template slot="body">
        <zt-table :table-column="childColumn" :pagination="false" :height="childHeight" :table-data="childList" :loading="childLoading"></zt-table>
      </template>
    </column-box>

    <!--修改保险公司弹窗-->
    <el-dialog title="修改保险公司" :visible.sync="visible" width="500px">
      <el-form>
        <el-form-item label="保险公司：">
          <el-select v-model="insuranceCompany">
            <el-option v-for="item in riskCompanyList" :key="item.id" :value="item.name" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="handleUpdate" :loading="loading">保存并退出</el-button>
        <el-button @click="visible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import datePicker from '../../../components/datePicker';
  import ztTable from '../../../components/zt-table';
  import filterColumn from '../../../components/filterColumn';
  import searchBoxFade from '../../../components/searchBoxFade';
  import columnBox from '../../../components/zt-column-box';
  import {getMonthToNow,parseDate} from "../../../utils";
  import startLocation from '@/components/startLocation';

  export default {
    name: 'transportRiskManage',
    data() {
      return {
        childList: [],
        selectList: [],
        selectRow: null,
        visible: false,
        childLoading: false,
        loading: false,
        requestTable: this.$root.getRiskMainList,
        tableHeight: 0,
        childHeight: 170,
        form: {
          searchByAssignStartOn: getMonthToNow().startDate,
          searchByAssignOnEndOn: getMonthToNow().endDate,
          searchByOriginLocation: '',
          searchByTransPlanCode: '',
          searchByTrailerPlate: '',
          searchByDriverName: '',
          searchByCompanyConfirmStatus: null,
          pageNum: 1
        },
        showTable: false,
        newColumn: null,
        insuranceCompany: null,
        riskCompanyList: [],
        filterTime: getMonthToNow(),
        tableColumn: [
          { type: 'index', label: '序号' },
          { type: 'selection' },
          { prop: 'companyConfirmStatusName', label: '确认状态', align: 'center' },
          { prop: 'insuranceCompany', label: '保险公司', align: 'center' },
          { prop: 'transPlanCode', label: '拖车计划号', align: 'center' },
          { prop: 'assignOn', label: '编制日期', align: 'center',
            formatter: (row) => {
              return this.formatDate(row.assignOn);
            }
          },
          { prop: 'companyName', label: '承运商', align: 'center' },
          { prop: 'carrierReason', label: '承运原因', align: 'center' },
          { prop: 'vehicleNum', label: '商品车数', align: 'center' },
          { prop: 'originLocation', label: '出发地', align: 'center' },
          { prop: 'trailerPlate', label: '挂车车牌号', align: 'center' },
          { prop: 'driverName', label: '司机姓名', align: 'center' },
          { prop: 'driverMobile', label: '司机手机号', align: 'center' },
          { prop: 'driverIdNo', label: '司机身份证', align: 'center' },
          { prop: 'driverNo', label: '司机卡号', align: 'center' },
          { prop: 'bargeDestination', label: '短驳目的地', align: 'center' },
          { prop: 'trunkCarrier', label: '干线运输商', align: 'center' },
        ],
        childColumn: [
          { type: 'index', label: '序号' },
          { prop: 'insuranceCompany', label: '保险公司', align: 'center' },
          { prop: 'vehicleValuation', label: '车辆估值', align: 'center' },
          { prop: 'insuranceMoney', label: '保险金额', align: 'center' },
          { prop: 'factory', label: '工厂', align: 'center' },
          { prop: 'lgsPlanCode', label: '物流执行计划号', align: 'center' },
          { prop: 'waybillCode', label: '送车通知单号', align: 'center' },
          { prop: 'vinCode', label: 'VIN码', align: 'center' },
          { prop: 'vehicleType', label: '车型', align: 'center' },
          { prop: 'color', label: '颜色', align: 'center' },
          { prop: 'originLocation', label: '出发地', align: 'center' },
          { prop: 'targetLocation', label: '目的地', align: 'center' },
          { prop: 'finalLocation', label: '最终搬入地', align: 'center' },
          { prop: 'province', label: '省份', align: 'center' },
          { prop: 'city', label: '城市', align: 'center' },
          { prop: 'requireArriveTime', label: '到达要求时间', align: 'center' },
          { prop: 'scheduledArriveDate', label: '预定订单到达日', align: 'center',
            formatter: (row) => {
              return this.formatDate(row.scheduledArriveDate)
            }
          },
          { prop: 'withholdDate', label: '扣款日期', align: 'center',
            formatter: (row) => {
              return this.formatDate(row.withholdDate)
            }
          },
          { prop: 'inventoryNumber', label: '库位号', align: 'center' },
          { prop: 'bigArea', label: '大区', align: 'center' },
        ]
      }
    },
    watch: {
      filterTime(val) {
        this.form.searchByAssignStartOn = val.startDate;
        this.form.searchByAssignOnEndOn = val.endDate;
      },
      selectRow(val) {
        if (val) {
          this.getChildList();
        } else {
          this.childList = [];
        }
      },
      visible(val) {
        if (val && this.riskCompanyList.length === 0) {
          // 获取保险公司
          this.$root.getDictByTypes({
            types: '18.09'
          }).then(res => {
            if (res.code === 0) {
              this.riskCompanyList = res.data['18.09'];
            }
          });
        } else if (!val) {
          this.insuranceCompany = null;
        }
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
      handleUpdate() {
        if (!this.insuranceCompany) {
          this.$message.warning('请先选择保险公司！');
          return false;
        }
        this.loading = true;
        this.$root.updateRiskCompany({
          insuranceCompany: this.insuranceCompany,
          insuranceCode: this.riskCompanyList.find(item => item.name === this.insuranceCompany).code,
          id: this.selectList[0].id
        }).then(res => {
          this.loading = false;
          if (res.code === 0) {
            this.visible = false;
            this.$message.success('修改成功！');
            this.$refs['table'].requestTableData(this.form);
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      handleEdit() {
        if (this.selectList.length === 0) {
          this.$message.warning('请先选择一条运输计划！');
          return false;
        }
        if (this.selectList.length > 1) {
          this.$message.warning('一次只能修改一条运输计划！');
          return false;
        }
        if (this.selectList[0].companyConfirmStatus === 1) {
          this.$message.warning('已确认的运输计划不能修改保险公司！');
          return false;
        }
        this.insuranceCompany = this.selectList[0].insuranceCompany;
        this.visible = true;
      },
      handleConfirm() {
        if (this.selectList.length === 0) {
          this.$message.warning('请先选择一条运输计划！');
          return false;
        }
        if (this.selectList.some(item => item.companyConfirmStatus === 1)) {
          this.$message.warning('选中的记录中存在已确认的运输计划，请重新选择！');
          return false;
        }
        this.$confirm('是否对选中的记录进行已够保险确认？', '保险确认').then(() => {
          this.$root.confirmRisk({
            id: this.selectList.map(item => item.id)
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功');
              this.$refs['table'].requestTableData(this.form);
            }
          })
        }).catch(() => {})
      },
      handleExport() {
        this.exportLoading = true;
        let params = {...this.form};
        let requestPromise = this.$root.exportRiskManage(params);
        requestPromise.then(res => {
          this.exportLoading = false;
          let code = parseInt(res.code);
          let msg = res.message;
          if (!code) {
            let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `运输保险管理${parseDate()}.xls`;
            let evt = document.createEvent("MouseEvents");
            evt.initEvent("click",true,true);
            link.dispatchEvent(evt);
            this.$message.success("导出成功");
          }
        }).catch((err) => {
          this.exportLoading = false;
        })
      },
      getChildList() {
        this.childLoading = true;
        this.$root.getRiskChildList({
          transPlanCode: this.selectRow.transPlanCode
        }).then(res => {
          this.childLoading = false;
          if (res.code === 0) {
            this.childList = res.data || [];
          }
        }).catch(() => {
          this.childLoading = false;
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
          searchByAssignStartOn: getMonthToNow().startDate,
          searchByAssignOnEndOn: getMonthToNow().endDate,
          searchByOriginLocation: '', //出发地
          searchByCompanyName: '', //承运商
          searchByTransPlanCode: '', //拖车计划号
          searchByTrailerPlate: '', //挂车车牌号
          searchByDriverName: '', //司机姓名
          searchByCompanyConfirmStatus: null, //承运商确认状态
          searchByQualityConfirmStatus: null, //品质确认状态
          pageNum: 1
        };
        this.filterTime = getMonthToNow();
        this.$refs['table'].requestTableData(this.form);
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
      datePicker,
      ztTable,
      filterColumn,
      searchBoxFade,
      columnBox,
      startLocation
    }
  }
</script>

<style scoped>

</style>