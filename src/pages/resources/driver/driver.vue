/*
*  @描述：司机资料列表
*  @作者：邱康松
*  @创建时间：2019/3/4
*/

<template>
  <div class="driver-data page-normal">
    <el-form inline label-width="110px">
      <searchBoxFade>
        <template slot="show">
          <el-form-item label="司机姓名：">
            <el-input v-model="form.searchByName" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="司机手机号：">
            <el-input v-model="form.searchByMobile" placeholder="请输入" :maxlength="11" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </template>
        <template slot="hide">
          <el-form-item label="审核状态：">
            <el-select v-model="form.searchByAuditStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="新建" :value="0"></el-option>
              <el-option label="待审核" :value="1"></el-option>
              <el-option label="审核未通过" :value="3"></el-option>
              <el-option label="已审核" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建人：">
            <el-input placeholder="请输入" v-model="form.searchByCreatedName" clearable></el-input>
          </el-form-item>
          <el-form-item label="启用停用状态：">
            <el-select v-model="form.searchByStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="黑名单：">
            <el-select v-model="form.searchByBlackStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已添加" :value="1"></el-option>
              <el-option label="未添加" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提交定位系统：">
            <el-select v-model="form.searchBySubmitStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已提交" :value="1"></el-option>
              <el-option label="未提交" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号是否注册：">
            <el-select v-model="form.searchByMobileStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已注册" :value="9009"></el-option>
              <el-option label="未注册" :value="9010"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建日期：">
            <date-picker v-model="filterTime"></date-picker>
          </el-form-item>
        </template>
      </searchBoxFade>
    </el-form>
    <column-box no-title="" last class="parent-table-box">
      <template slot="body">
        <div class="flex_sc">
          <div>
            <el-button size="small" type="primary" @click="addDriver" v-has="'VRES4'">新增</el-button>
            <el-button size="small" @click="batchApply" :loading="loading" v-has="'VRES7'">批量提交审核</el-button>
            <el-button size="small" @click="batchDelete" :loading="loading" v-has="'VRES8'">批量删除</el-button>
            <el-button size="small" @click="importFun" v-has="'VRES6'">导入</el-button>
            <el-button size="small" @click="exportFun" v-has="'VRES5'">导出</el-button>
          </div>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter" :remove-num="2"></filterColumn>
        </div>
        <zt-table :table-column="newColumn || tableColumn" ref="table" :request="requestTable" v-if="showTable" :getSelection.sync="selectionList" :request-params="form"></zt-table>
      </template>
    </column-box>

    <!--导入excel-->
    <import-dic :visible.sync="importVisible" title="导入司机资料" @success="importSuccess" :action="importAction" code="MTP0001"></import-dic>
    <!--证件详情-->
    <papersDetail :visible.sync="visible" :list="licenceList"></papersDetail>
    <!--导入结果弹窗-->
    <successDialog :visible.sync="successVisible" :resData="successData" @close="search" :tableColumn="importColumn"></successDialog>
  </div>
</template>

<script>
  import ztTable from '@/components/zt-table';
  import columnBox from '../../../components/zt-column-box';
  import datePicker from '../../../components/datePicker';
  import filterColumn from '../../../components/filterColumn';
  import searchBoxFade from '../../../components/searchBoxFade';
  import {getDateStr,parseDate} from "@/utils";
  import importDic from '@/components/importExcel';
  import successDialog from '@/components/successDialog'
  import papersDetail from '../../../components/papersDetail';
  export default {
    name: 'driverData',
    data() {
      return {
        visible: false,
        licenceList: [], //证件列表
        requestTable: this.$root.getDriverList,
        showBox: false,
        loading: false,
        isFirst: true,
        form: {
          searchByCompanyCode: this.$store.getters.getCompanyCode,
          searchByName: '',
          searchByCreatedName: '',
          searchByAuditStatus: null,
          searchByMobile: '',
          searchByCreatedStartOn: '',
          searchByCreatedStartEndOn: '',
          searchByBlackStatus: null, //黑名单
          searchBySubmitStatus:null,
          searchByMobileStatus:null,
          searchByStatus: null, //启用停用
          pageNum: 1
        },
        showTable: false,
        tableData: [],
        selectionList: [],
        newColumn: null, //筛选后的列
        filterTime: {
          startDate: '',
          endDate: ''
        },
        successData: {},
        successVisible: false,
        importColumn: [
          { type: 'index', label: '序号'},
          { prop: 'companyNo', label: '承运商编码',align: 'center' },
          { prop: 'name', label: '姓名',align: 'center' },
          { prop: 'sex', label: '性别',align: 'center' },
          { prop: 'idNo', label: '身份证号',align: 'center' },
          { prop: 'birthday', label: '出生日期',align: 'center',
            formatter: (row) => {
              return this.formatDate(row.birthday);
            }
          },
          { prop: 'driverType', label: '主副驾',align: 'center' },
          { prop: 'mobile', label: '手机号',align: 'center' },
          { prop: 'importStatus', label: '导入结果',align: 'center',width: 250,
            formatter: (row) => {
              return (
                  <i class={+row.importStatus === 1 ? 'el-icon-success' : 'el-icon-error'}>{+row.importStatus === 1 ? '导入成功' : row.errMsg}</i>
              )
            }
          },
        ],
        tableColumn: [
          {
            type: 'index',
            label: '序号'
          },
          {
            type: 'selection',
            selectable: (row) => {
              return row.auditStatus !== 2 && row.auditStatus !== 1 //待审核、已审核不能勾选
            }
          },
          {
            label: '操作',
            prop: 'auditStatus',
            align: 'center',
            width: '100',
            formatter: (row) => {
              if (row.auditStatus === 0) { //新建
                return (
                    <div>
                      <el-button type="text" onClick={this.toEdit.bind(this,row)} v-has="VRES9">修改</el-button>
                      <el-button type="text" onClick={this.handleDelete.bind(this,row)} v-has="VRES8">删除</el-button>
                    </div>
                )
              } else if (row.auditStatus === 1) { //待审核
                return ''
              } else {
                return (
                    <el-button type="text" onClick={this.toEdit.bind(this,row)} v-has="VRES9">修改</el-button>
                )
              }
            }
          },
          {
            prop: 'auditStatusName',
            label: '审核状态',
            align: 'center',
          },
          {
            prop: 'auditComment',
            label: '审核说明',
            align: 'center',
          },
          {
            prop: 'status',
            label: '启用停用状态',
            align: 'center',
            formatter: (row) => {
              if (row.status === 0) {
                return (
                    <el-button type="text" class="text-danger" onClick={this.changeStatus.bind(this,row)} v-has="VRES10">已停用</el-button>
                )
              } else {
                return (
                    <el-button type="text" onClick={this.changeStatus.bind(this,row)} v-has="VRES10">已启用</el-button>
                )
              }
            }
          },
          {
            prop: 'blackStatus',
            label: '黑名单',
            align: 'center',
            formatter: (row) => {
              if (row.blackStatus === 1) {
                return '已添加'
              } else {
                return '未添加'
              }
            }
          },
          {
            prop: 'submitStatusName',
            label: '提交定位系统',
            align: 'center'
          },
          {
            prop: 'mobileStatusName',
            label: '手机号是否注册',
            align: 'center',
            formatter: (row) => {
              if (row.mobileStatusName === '未注册') {
                return <span class="text-danger">未注册</span>
              }
              return row.mobileStatusName;
            }
          },
          {
            prop: 'bindStatusName',
            label: '绑定状态',
            align: 'center'
          },
          {
            prop: 'companyNo',
            label: '承运商编码',
            align: 'center'
          },
          {
            prop: 'companyName',
            label: '承运商全称',
            align: 'center'
          },
          {
            prop: 'companyAbbreviation',
            label: '承运商简称',
            align: 'center'
          },
          {
            prop: 'name',
            label: '姓名',
            align: 'center'
          },
          {
            prop: 'sex',
            label: '性别',
            align: 'center'
          },
          {
            prop: 'idNo',
            label: '身份证号',
            align: 'center'
          },
          {
            prop: 'birthday',
            label: '出生日期',
            align: 'center',
            formatter: (row) => {
              return this.formatDate(row.birthday);
            }
          },
          {
            prop: 'mobile',
            label: '手机号',
            align: 'center'
          },
          {
            prop: 'driverType',
            label: '主副驾',
            align: 'center'
          },
          {
            prop: 'driverAge',
            label: '驾龄(年)',
            align: 'center'
          },
          {
            prop: 'employType',
            label: '用工类型',
            align: 'center'
          },
          {
            prop: 'agreeStartOn',
            label: '劳动合同起始日期',
            align: 'center',
            formatter: (row) => {
              return this.formatDate(row.agreeStartOn);
            }
          },
          {
            prop: 'agreeEndOn',
            label: '劳动合同截止日期',
            align: 'center',
            formatter: (row) => {
              return this.formatDate(row.agreeEndOn);
            }
          },
          {
            prop: 'driverLicenseType',
            label: '驾照类型',
            align: 'center'
          },
          {
            prop: 'bankAccount',
            label: '银行卡号',
            align: 'center'
          },
          {
            prop: 'bankName',
            label: '发卡银行',
            align: 'center'
          },
          {
            prop: 'driverNo',
            label: '司机卡号',
            align: 'center'
          },
          {
            prop: 'detail',
            label: '证件详情',
            align: 'center',
            formatter: (row) => {
              return (
                  <el-button type="text" onClick={this.showPaperDetail.bind(this,row)}>证件详情</el-button>
              )
            }
          },
          {
            prop: 'remark',
            label: '备注',
            align: 'center'
          },
          {
            prop: 'createdName',
            label: '创建人',
            align: 'center'
          },
          {
            prop: 'createdOn',
            label: '创建时间',
            align: 'center'
          },
          {
            prop: 'modifiedName',
            label: '最新修改人',
            align: 'center'
          },
          {
            prop: 'modifiedOn',
            label: '最新修改时间',
            align: 'center'
          },
        ],
        importVisible:false,//导入显示隐藏
        importAction:"/v1/driCom/driver/import"
      }
    },
    activated() {
      if (!this.isFirst) {
        this.$refs['table'].requestTableData(this.form);
      } else {
        this.isFirst = false;
      }
    },
    watch: {
      filterTime(val) {
        this.form.searchByCreatedStartOn = val.startDate;
        this.form.searchByCreatedStartEndOn = val.endDate;
      }
    },
    methods: {
      showPaperDetail(data) {
        this.$root.getDriverLicence({
          driverId: data.driverId
        }).then(res => {
          if (res.code === 0) {
            this.licenceList = [];
            this.licenceList.push({
              title: '身份证正面',
              url: res.data.cardUrl
            });
            this.licenceList.push({
              title: '身份证反面',
              url: res.data.cardReverseUrl
            });
            this.licenceList.push({
              title: '驾驶证',
              url: res.data.licenceUrl
            });
            this.licenceList.push({
              title: '从业资格证',
              url: res.data.qualificationUrl
            });
            this.licenceList.push({
              title: '其他证件',
              url: res.data.otherLicenceUrl
            });
          }
        });
        this.visible = true;
      },
      search() {
        this.form.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
      },
      reset() {
        this.form = {
          searchByCompanyCode: this.$store.getters.getCompanyCode,
          searchByName: '',
          searchByCreatedName: '',
          searchByAuditStatus: null,
          searchByMobile: '',
          searchByCreatedStartOn: '',
          searchByCreatedStartEndOn: '',
          searchByBlackStatus: null, //黑名单
          searchBySubmitStatus:null,
          searchByMobileStatus:null,
          searchByStatus: null, //启用停用
          pageNum: 1
        };
        this.filterTime = {};
        this.$refs['table'].requestTableData(this.form);
      },
      doneFilter(list) {
        this.showTable = false;
        this.newColumn = [...list];
        setTimeout(() => {
          this.showTable = true;
        }, 0)
      },
      toEdit(data) {
        this.$router.push('driverDetail?id=' + data.driverId);
      },
      handleDelete(data) {
        this.$confirm('确认删除该司机？','提示',{
          confirmButtonText: '确定删除',
          cancelButtonText: '取消'
        }).then(() => {
          this.$root.deleteDriver({
            driverId: [data.driverId]
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('删除成功');
              this.$refs['table'].requestTableData();
            }
          })
        }).catch(() => {})
      },
      changeStatus(data) {
        let text = '';
        if (data.status === 0) {
          text = '司机启用后，可重新绑定车辆。'
        } else {
          text = '司机停用后，如有绑定车辆，司机车辆绑定关系将自动解绑，如需绑定，需要先启用司机。'
        }
        this.$confirm(text,'提示',{
          confirmButtonText: data.status === 0 ? '确认启用' : '确认停用',
          cancelButtonText: '取消'
        }).then(() => {
          this.$root.updateDriverStatus({
            driverId: data.driverId,
            status: data.status === 0 ? 1 : 0
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('修改成功');
              this.$refs['table'].requestTableData(this.form);
            }
          }).catch(() => {})
        })
      },
      addDriver() {
        this.$router.push('driverDetail');
      },
      batchApply() {
        if (this.selectionList.length === 0) {
          this.$message.warning('请先勾选司机');
          return false;
        }
        /*let text = '';
        if (this.selectionList.some(item => item.mobileStatusName === '未注册')) {
          text = '所选择的记录中存在手机号未注册的记录，是否继续提交审核？';
        } else {
          text = '确定提交审核？';
        }*/
        this.$confirm('确定提交审核？','提示').then(() => {
          this.$root.applyDriverAudit({
            driverId: this.selectionList.map(item => item.driverId)
          }).then(res => {
            if (res.code === 0) {
              this.$message.success("提交成功");
              this.selectionList = [];
              this.$refs['table'].requestTableData(this.form);
            }
          })
        })
      },
      batchDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning('请先勾选司机');
          return false;
        }
        if (this.selectionList.some(item => +item.auditStatus !== 0)) {
          this.$message.warning('选择的记录中存在不是新建的记录，无法删除！');
          return false;
        }
        this.$confirm('确定删除选中的司机？', '提示').then(() => {
          this.loading = true;
          this.$root.deleteDriver({
            driverId: this.selectionList.map(item => item.driverId)
          }).then(res => {
            this.loading = false;
            if (res.code === 0) {
              this.$message.success("删除成功");
              this.selectionList = [];
              this.$refs['table'].requestTableData(this.form);
            }
          }).catch(() => {
            this.loading = false;
          })
        }).catch(() => {});
      },
      //导入
      importFun(){
        this.importAction = this.importAction;
        this.importVisible = true;
      },
      //导入成功返回
      importSuccess(data) {
        this.successData = data;
        this.successVisible = true;
      },
      //导出
      exportFun() {
        let params = {...this.form};
        console.log(params);
        let requestPromise = this.$root.getDriverExport({
          searchByCompanyCode:params.searchByCompanyCode,
          searchByAbbreviation:params.searchByAbbreviation,
          searchByName:params.searchByName,
          searchByAuditStatus:params.searchByAuditStatus,
          searchByMobile:params.searchByMobile,
          searchBySubmitStartOn:params.searchByCreatedStartOn,
          searchBySubmitEndOn:params.searchByCreatedStartEndOn,
          searchBySubmitStatus: params.searchBySubmitStatus,
          searchByMobileStatus: params.searchByMobileStatus
        });
        requestPromise.then(res => {
          let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `司机资料${parseDate()}.xls`;
          let evt = document.createEvent("MouseEvents");
             evt.initEvent("click",true,true);
             link.dispatchEvent(evt);
          this.$message.success("导出成功");
        });
      }
    },
    components: {
      ztTable,
      columnBox,
      datePicker,
      filterColumn,
      searchBoxFade,
      importDic,
      papersDetail,
      successDialog
    }
  }
</script>

<style scoped lang="scss">
  .driver-data /deep/ {
    .el-form .el-select, .el-form .el-input {
      width: 202px;
    }
    .flex_sc {
      margin-bottom: 10px;
      p.text-danger {
        color: #ff4d51;
      }
    }
  }
</style>