/*
*  @描述：司机车辆关系绑定
*  @作者：邱康松
*  @创建时间：2019/3/5
*/

<template>
  <div class="driver-data page-normal">
    <el-form inline label-width="110px">
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
          <el-form-item label="司机姓名：">
            <el-input v-model="form.searchByName" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model="form.searchByMobile" placeholder="请输入" :maxlength="11" clearable></el-input>
          </el-form-item>
          <el-form-item label="绑定状态：">
            <el-select v-model="form.searchByBindStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已绑定" :value="1"></el-option>
              <el-option label="未绑定" :value="0"></el-option>
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
        </template>
      </searchBoxFade>
    </el-form>
    <column-box no-title="" last class="parent-table-box">
      <template slot="body">
        <div class="flex_sc">
          <el-button size="small" @click="exportFun()" v-has="'VRES20'" type="primary">导出</el-button>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter"></filterColumn>
        </div>
        <zt-table :table-column="newColumn || tableColumn" ref="table" :request="requestTable" v-if="showTable" :request-params="form"></zt-table>
      </template>
    </column-box>

    <!--绑定弹窗-->
    <binding-dialog :visible.sync="visible" :vehicleData="vehicleData" @success="success"></binding-dialog>
  </div>
</template>

<script>
  import ztTable from '@/components/zt-table';
  import columnBox from '../../../components/zt-column-box';
  import filterColumn from '../../../components/filterColumn';
  import searchBoxFade from '../../../components/searchBoxFade';
  import bindingDialog from './bindingDialog';
  import {getDateStr,parseDate} from "@/utils";
  export default {
    name: 'driverBindVehicle',
    data() {
      return {
        visible: false,
        vehicleData: {},
        requestTable: this.$root.getBindList,
        showBox: false,
        loading: false,
        form: {
          searchByCompanyCode: this.$store.getters.getCompanyCode,
          searchByName: '',
          searchByMobile: '',
          searchByTrailerPlateNo: '',
          searchByMainPlateNo: '',
          searchByBindStatus: null,
          searchBySubmitStatus: null,
          searchByMobileStatus: null,
          pageNum: 1
        },
        showTable: false,
        newColumn: null, //筛选后的列
        tableColumn: [
          {
            type: 'index',
            label: '序号'
          },
          {
            label: '操作',
            prop: 'bindStatus',
            align: 'center',
            width: '100',
            formatter: (row) => {
              if (row.bindStatus === 0) {
                return (
                    <el-button type="text" onClick={this.toBind.bind(this,row)} v-has="VRES21">绑定</el-button>
                )
              } else {
                return <el-button type="text" onClick={this.unBind.bind(this,row)} v-has="VRES22">解绑</el-button>
              }
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
            prop: 'vehicleNo',
            label: '车辆编码',
            align: 'center',
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
            prop: 'submitStatusName',
            label: '提交定位系统',
            align: 'center'
          },
          {
            prop: 'mobileStatusName',
            label: '手机号是否注册',
            align: 'center'
          },
          {
            prop: 'mainPlateNo',
            label: '主车车牌号',
            align: 'center'
          },
          {
            prop: 'trailerPlateNo',
            label: '挂车车牌号',
            align: 'center'
          },
          {
            prop: 'vehicleAttribute',
            label: '车辆属性',
            align: 'center'
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
            prop: 'regularVehicleName',
            label: '是否合规车',
            align: 'center'
          },
          {
            prop: 'gpsNo',
            label: 'GPS/BDS编号',
            align: 'center'
          },
          {
            prop: 'bindOn',
            label: '最后绑定日期',
            align: 'center'
          },
        ]
      }
    },
    mounted() {

    },
    methods: {
      search() {
        this.form.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
      },
      reset() {
        this.form = {
          searchByCompanyCode: this.$store.getters.getCompanyCode,
          searchByName: '',
          searchByMobile: '',
          searchByTrailerPlateNo: '',
          searchByMainPlateNo: '',
          searchByBindStatus: null,
          searchBySubmitStatus: null,
          searchByMobileStatus: null,
          pageNum: 1
        };
        this.$refs['table'].requestTableData(this.form);
      },
      doneFilter(list) {
        this.showTable = false;
        this.newColumn = [...list];
        setTimeout(() => {
          this.showTable = true;
        }, 0)
      },
      success() {
        this.$refs['table'].requestTableData(this.form);
      },
      toBind(data) {
        this.vehicleData = data;
        this.visible = true;
      },
      unBind(data) {
        this.$confirm('确定解绑？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$root.bindDriverVehicle({
            vehicleId: data.vehicleId,
            bindStatus: 0,
            driverId: data.driverId
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('解绑成功');
              this.success();
            }
          })
        })
      },
      handleDelete(data) {

      },
      //导出
      exportFun() {
        let params = {...this.form};
        let requestPromise = this.$root.getDriVehicleExport({
          searchByCompanyCode:params.searchByCompanyCode,
          searchByName:params.searchByName,
          searchByMobile:params.searchByMobile,
          searchByTrailerPlateNo:params.searchByTrailerPlateNo,
          searchByMainPlateNo:params.searchByMainPlateNo,
          searchByBindStatus:params.searchByBindStatus,
          searchBySubmitStatus: params.searchBySubmitStatus,
          searchByMobileStatus: params.searchByMobileStatus,
        });
        requestPromise.then(res => {
          let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `司机车辆关系绑定${parseDate()}.xls`;
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
      filterColumn,
      searchBoxFade,
      bindingDialog
    }
  }
</script>

<style scoped lang="scss">
  .driver-data /deep/ {
    .el-form .el-select {
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