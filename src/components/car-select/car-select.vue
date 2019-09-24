/*
*  @描述：车辆选择弹窗
*  @作者：邱康松
*  @创建时间：2019/3/20
*/

<template>
  <el-dialog title="车辆选择" :visible.sync="carSelVisible" width="1000px" top="5vh" :before-close="closeDialog">
    <columnBox no-title="">
      <template slot="body">
        <el-form inline label-width="100px">
          <el-form-item label="车辆编码：">
            <el-input placeholder="请输入" v-model="form.searchByVehicleNo" :maxlength="50" @keyup.native.enter="search" clearable></el-input>
          </el-form-item>
          <el-form-item label="挂车车牌号：">
            <el-input placeholder="请输入" v-model="form.searchByTrailerPlateNo" :maxlength="50" @keyup.native.enter="search" clearable></el-input>
          </el-form-item>
          <el-form-item label="主车车牌号：">
            <el-input placeholder="请输入" v-model="form.searchByMainPlateNo" :maxlength="50" @keyup.native.enter="search" clearable></el-input>
          </el-form-item>
          <el-form-item label="司机姓名：">
            <el-input placeholder="请输入" v-model="form.searchByName" :maxlength="50" @keyup.native.enter="search" clearable></el-input>
          </el-form-item>
          <el-form-item label="司机手机号：">
            <el-input placeholder="请输入" v-model="form.searchByMobile" :maxlength="11" @keyup.native.enter="search" clearable></el-input>
          </el-form-item>
          <el-form-item label="运力类型：">
            <el-select v-model="form.sign">
              <el-option label="长期" :value="0"></el-option>
              <el-option label="临时" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
    </columnBox>
    <column-box no-title="" last>
      <template slot="body">
        <ztTable
                :request="requestTable"
                :request-params="form"
                :page-size="10"
                :loading="loading"
                highlightCurrentRow
                radioLabel="vehicleNo"
                :table-column="tableColumn"
                :getClickRow.sync="selectData"
                @rowDblclick="rowDblclick"
                ref="table">
        </ztTable>
      </template>
    </column-box>
    <span slot="footer">
      <el-button type="primary" size="small" @click="save">确定</el-button>
      <el-button size="small" @click="closeDialog">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ztTable from '../zt-table';
  import columnBox from '../zt-column-box';
  export default {
    props: {
      carSelVisible: {
        type: Boolean,
        default: false
      },
      code: { //承运商编码
        type: String,
        default: ''
      }
    },
    name: '',
    data() {
      return {
        isFirst: true,
        loading: false,
        requestTable: this.$root.getBusinessPowerList,
        form: {
          pageNum: 1,
          searchByName: '', //司机姓名
          searchByMainPlateNo: '' ,//主车车牌号
          searchByTrailerPlateNo: '', //挂车车牌号
          searchByMobile: '', //司机手机号
          searchByCompanyNo: '',
          sign:0,
          searchByVehicleNo: ''
        },
        selectData: null,
        tableData: [],
        tableColumn: [
          {
            type: 'radio',
            label: '选择'
          },
          {
            prop: 'companyName',
            label: '承运商',
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
            prop: 'trailerPlateNo',
            label: '挂车车牌号',
            align: 'center'
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
            prop: 'idNo',
            label: '身份证号',
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
            prop: 'sign',
            label: '运力类型',
            align: 'center',
            formatter: (row) => {
              return row.sign === 1 ? '临时' : '长期'
            }
          }
        ]
      }
    },
    watch: {
      carSelVisible(val) {
        if (val) {
          this.form.searchByCompanyNo = this.code;
          this.$nextTick(() => {
            this.$refs['table'].resetRadio();
            if (!this.isFirst) {
              this.$refs['table'].requestTableData(this.form);
            }
            this.isFirst = false;
          });
          this.selectData = null;
        } else {
          this.form = {
            pageNum: 1,
            searchByName: '', //司机姓名
            searchByMainPlateNo: '' ,//主车车牌号
            searchByTrailerPlateNo: '', //挂车车牌号
            searchByMobile: '', //司机手机号
            searchByCompanyNo: '',
            sign:0,
            searchByVehicleNo: ''
          }
        }
      }
    },
    methods: {
      search() {
        this.form.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
      },
      reset() {
        this.form = {
          pageNum: 1,
          searchByName: '', //司机姓名
          searchByMainPlateNo: '' ,//主车车牌号
          searchByTrailerPlateNo: '', //挂车车牌号
          searchByMobile: '', //司机手机号
          searchByCompanyNo: this.code,
          sign:0,
          searchByVehicleNo: ''
        };
        this.$refs['table'].requestTableData(this.form);
      },
      rowDblclick(row) {
        this.selectData = row;
        this.save();
      },
      closeDialog() {
        this.$emit('update:carSelVisible',false);
      },
      save() {
        if (!this.selectData) {
          this.$message.warning('请先选择车辆！');
          return false;
        }
        this.$emit('update:carSelData',this.selectData);
        this.$emit('carSelData',this.selectData);
        this.closeDialog();
      }
    },
    components: {
      ztTable,
      columnBox
    }
  }
</script>

<style scoped>

</style>