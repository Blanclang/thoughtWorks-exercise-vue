/*
*  @描述：车辆列表
*  @作者：邱康松
*  @创建时间：2019/3/5
*/

<template>
  <div class="vehicle-data page-normal">
    <el-form inline label-width="150px">
      <searchBoxFade>
        <template slot="show">
          <el-form-item label="主车车牌号：">
            <el-input v-model="form.searchByMainPlateNo" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="挂车车牌号：">
            <el-input v-model="form.searchByTrailerPlateNo" placeholder="请输入" :maxlength="50" clearable></el-input>
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
          <el-form-item label="发动机号：">
            <el-input v-model="form.searchByEngineNo" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="GPS/BDS编号：">
            <el-input v-model="form.searchByGpsNo" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="主车车辆识别代码：">
            <el-input v-model="form.searchByMainCode" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="挂车车辆识别代码：">
            <el-input v-model="form.searchByTrailerCode" placeholder="请输入" :maxlength="50" clearable></el-input>
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
          <el-form-item label="创建人：">
            <el-input v-model="form.searchByCreatedName" placeholder="请输入" :maxlength="50" clearable></el-input>
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
            <el-button size="small" type="primary" @click="addVehicle" v-has="'VRES12'">新增</el-button>
            <el-button size="small" @click="batchApply" :loading="loading" v-has="'VRES15'">批量提交审核</el-button>
            <el-button size="small" @click="batchDelete" :loading="loading" v-has="'VRES16'">批量删除</el-button>
            <el-button size="small" @click="importFun" v-has="'VRES14'">导入</el-button>
            <el-button size="small" @click="exportFun" v-has="'VRES13'">导出</el-button>
          </div>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter" :remove-num="2"></filterColumn>
        </div>
        <zt-table
          rowKey="vehicleId"
          :table-column="newColumn || tableColumn"
          ref="table"
          :request="requestTable"
          :request-params="form"
          v-if="showTable"
          :getSelection.sync="selectionList">
        </zt-table>
      </template>
    </column-box>
    <!--导入excel-->
    <import-dic :visible.sync="importVisible" title="导入车辆资料" @success="importSuccess" :action="importAction" code="MTP0003"></import-dic>
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
  import successDialog from '@/components/successDialog';
  import papersDetail from '../../../components/papersDetail';
  export default {
    name: 'vehicleData',
    data() {
      return {
        visible: false,
        licenceList: [], //证件列表
        requestTable: this.$root.getVehicleList,
        showBox: false,
        loading: false,
        isFirst: true,
        successData: {},
        successVisible: false,
        importColumn: [
          { type: 'index', label: '序号'},
          { prop: 'companyNo', label: '承运商编码',align: 'center' },
          { prop: 'mainPlateNo', label: '主车车牌号',align: 'center' },
          { prop: 'trailerPlateNo', label: '挂车车牌号',align: 'center' },
          { prop: 'mainCode', label: '主车车辆识别码',align: 'center' },
          { prop: 'trailerCode', label: '挂车车辆识别码',align: 'center' },
          { prop: 'importStatus', label: '导入结果',align: 'center',width: 250,
            formatter: (row) => {
              return (
                  <i class={+row.importStatus === 1 ? 'el-icon-success' : 'el-icon-error'}>{+row.importStatus === 1 ? '导入成功' : row.errMsg}</i>
              )
            }
          },
        ],
        form: {
          searchByCreatedName: '',
          searchByCompanyCode: this.$store.getters.getCompanyCode,
          searchByTrailerPlateNo: '',
          searchByMainPlateNo: '',
          searchByEngineNo: '',
          searchByTrailerCode: '',
          searchByMainCode: '',
          searchByGpsNo: '',
          searchByAuditStatus: null,
          searchByCreatedStartOn: '',
          searchByCreatedEndOn: '',
          searchByBlackStatus: null, //黑名单
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
            width: 100,
            formatter: (row) => {
              if (row.auditStatus === 0) { //新建
                return (
                    <div>
                      <el-button type="text" onClick={this.toEdit.bind(this,row)} v-has="VRES17">修改</el-button>
                      <el-button type="text" onClick={this.handleDelete.bind(this,row)} v-has="VRES16">删除</el-button>
                    </div>
                )
              } else if (row.auditStatus === 1) { //待审核
                return ''
              } else {
                return (
                    <el-button type="text" onClick={this.toEdit.bind(this,row)} v-has="VRES17">修改</el-button>
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
                    <el-button type="text" class="text-danger" onClick={this.changeStatus.bind(this,row)} v-has="VRES18">已停用</el-button>
                )
              } else {
                return (
                    <el-button type="text" onClick={this.changeStatus.bind(this,row)} v-has="VRES18">已启用</el-button>
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
            prop: 'vehicleNo',
            label: '车辆编码',
            align: 'center'
          },
          {
            prop: 'mainPlateNo',
            label: '主车车牌号',
            align: 'center'
          },
          {
            prop: 'mainBrand',
            label: '主车品牌型号',
            align: 'center'
          },
          {
            prop: 'trailerPlateNo',
            label: '挂车车牌号',
            align: 'center'
          },
          {
            prop: 'trailerBrand',
            label: '挂车品牌型号',
            align: 'center'
          },
          {
            prop: 'vehicleAttribute',
            label: '车辆属性',
            align: 'center'
          },
          {
            prop: 'engineNo',
            label: '发动机号码',
            align: 'center'
          },
          {
            prop: 'mainCode',
            label: '主车车辆识别代码',
            align: 'center'
          },
          {
            prop: 'trailerCode',
            label: '挂车车辆识别代码',
            align: 'center'
          },
          {
            prop: 'vehicleStartOn',
            label: '车辆启用日期',
            align: 'center',
            formatter: (row) => {
              return this.formatDate(row.vehicleStartOn)
            }
          },
          {
            prop: 'vehicleType',
            label: '车辆类别',
            align: 'center'
          },
          {
            prop: 'carryQuantity',
            label: '最大装载台数',
            align: 'center'
          },
          {
            prop: 'trailerLength',
            label: '挂车尺寸长(m)',
            align: 'center'
          },
          {
            prop: 'trailerWidth',
            label: '挂车尺寸宽(m)',
            align: 'center'
          },
          {
            prop: 'trailerHigh',
            label: '挂车尺寸高(m)',
            align: 'center'
          },
          {
            prop: 'vehicleLicenseUnit',
            label: '行驶证所属单位',
            align: 'center'
          },
          {
            prop: 'gpsDomainName',
            label: 'GPS域名',
            align: 'center'
          },
          {
            prop: 'gpsNo',
            label: 'GPS/BDS编号',
            align: 'center'
          },
          {
            prop: 'regularVehicle',
            label: '是否合规车',
            align: 'center',
            formatter: (row) => {
              return +row.regularVehicle === 0 ? '是' : '否'
            }
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
        importAction:"/v1/driCom/vehicle/import"
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
        this.form.searchByCreatedEndOn = val.endDate;
      }
    },
    methods: {
      showPaperDetail(data) {
        this.$root.getVehicleLicence({
          vehicleId: data.vehicleId
        }).then(res => {
          if (res.code === 0) {
            this.licenceList = [];
            this.licenceList.push({
              title: '主车行驶证',
              url: res.data.mainLicenceUrl
            });
            this.licenceList.push({
              title: '挂车行驶证',
              url: res.data.trailerLicenceUrl
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
          searchByCreatedName: '',
          searchByCompanyCode: this.$store.getters.getCompanyCode,
          searchByTrailerPlateNo: '',
          searchByMainPlateNo: '',
          searchByEngineNo: '',
          searchByTrailerCode: '',
          searchByMainCode: '',
          searchByGpsNo: '',
          searchByAuditStatus: null,
          searchByCreatedStartOn: '',
          searchByCreatedEndOn: '',
          searchByBlackStatus: null, //黑名单
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
        this.$router.push('vehicleDetail?id=' + data.vehicleId);
      },
      handleDelete(data) {
        this.$confirm('确定删除该车辆？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$root.deleteVehicle({
            vehicleId: [data.vehicleId]
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('删除成功');
              this.$refs['table'].requestTableData(this.form);
            }
          })
        }).catch(() => {})
      },
      changeStatus(data) {
        let text = '';
        if (data.status === 0) {
          text = '车辆启用后，可重新绑定司机。';
        } else {
          text = '车辆停用后，如有绑定司机，司机车辆绑定关系将自动解绑，如需绑定，需要先启用车辆。';
        }
        this.$confirm(text,'提示',{
          confirmButtonText: data.status === 0 ? '确认启用' : '确认停用',
          cancelButtonText: '取消'
        }).then(() => {
          this.$root.updateVehicleStatus({
            vehicleId: data.vehicleId,
            status: data.status === 0 ? 1 : 0
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('修改成功');
              this.$refs['table'].requestTableData(this.form);
            }
          })
        }).catch(() => {})
      },
      addVehicle() {
        this.$router.push('vehicleDetail');
      },
      batchApply() {
        if (this.selectionList.length === 0) {
          this.$message.warning('请先勾选车辆');
          return false;
        }
        this.loading = true;
        this.$root.applyVehicle({
          vehicleId: this.selectionList.map(item => item.vehicleId)
        }).then(res => {
          this.loading = false;
          if (res.code === 0) {
            this.$message.success('提交成功');
            this.$refs['table'].requestTableData(this.form);
            this.selectionList = [];
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      batchDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning('请先勾选车辆');
          return false;
        }
        if (this.selectionList.some(item => +item.auditStatus !== 0)) {
          this.$message.warning('选择的记录中存在不是新建的记录，无法删除！');
          return false;
        }
        this.$confirm('确定删除选中的车辆？','提示').then(() => {
          this.loading = true;
          this.$root.deleteVehicle({
            vehicleId: this.selectionList.map(item => item.vehicleId)
          }).then(res => {
            this.loading = false;
            if (res.code === 0) {
              this.$message.success('提交成功');
              this.$refs['table'].requestTableData(this.form);
              this.selectionList = [];
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
        let requestPromise = this.$root.getVehicleExport({
          searchByCompanyCode:params.searchByCompanyCode,
          searchByCreatedName:params.searchByCreatedName,
          searchByTrailerPlateNo:params.searchByTrailerPlateNo,
          searchByMainPlateNo:params.searchByMainPlateNo,
          searchByEngineNo:params.searchByEngineNo,
          searchByTrailerCode:params.searchByTrailerCode,
          searchByMainCode:params.searchByMainCode,
          searchByGpsNo:params.searchByGpsNo,
          searchByAuditStatus:params.searchByAuditStatus,
          searchBySubmitStartOn:params.searchBySubmitStartOn,
          searchBySubmitEndOn:params.searchBySubmitEndOn
        });
        requestPromise.then(res => {
          let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `车辆资料${parseDate()}.xls`;
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
  .vehicle-data /deep/ {
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