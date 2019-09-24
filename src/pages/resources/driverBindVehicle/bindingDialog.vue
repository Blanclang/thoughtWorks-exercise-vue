/*
*  @描述：绑定弹窗
*  @作者：邱康松
*  @创建时间：2019/3/5
*/

<template>
  <div>
    <el-dialog title="司机车辆关系绑定" :visible.sync="visible" :before-close="closeDialog" width="600px">
      <el-form inline label-width="100px">
        <el-form-item label="司机姓名：">
          <el-input placeholder="请选择司机" readonly v-model="driverObj.name">
            <el-button slot="append" @click="showDriver" type="primary">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input disabled class="new-width" v-model="driverObj.mobile"></el-input>
        </el-form-item><br/>
        <el-form-item label="主车车牌号：">
          <el-input disabled class="new-width" v-model="vehicleData.mainPlateNo"></el-input>
        </el-form-item>
        <el-form-item label="挂车车牌号：">
          <el-input disabled class="new-width" v-model="vehicleData.trailerPlateNo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="handleBind" :loading="loading">保存</el-button>
        <el-button size="small" @click="closeDialog">取消</el-button>
      </span>
    </el-dialog>

    <!--司机列表弹窗-->
    <el-dialog title="司机选择" :visible.sync="driverVisible" width="900px">
      <el-form inline label-width="100px">
        <el-form-item label="姓名：">
          <el-input v-model="tableForm.searchByName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="司机状态：">
          <el-select v-model="tableForm.searchByStatus">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="黑名单：">
          <el-select v-model="tableForm.searchByBlackStatus">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否绑定：">
          <el-select v-model="tableForm.searchByBindStatus">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="已绑定" :value="1"></el-option>
            <el-option label="未绑定" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <zt-table
              radioLabel="driverId"
              :current.sync="checkObj"
              :table-column="tableColumn"
              ref="table"
              :request="requestTable"
              :request-params="tableForm"
              highlight-current-row>
      </zt-table>

      <span slot="footer">
        <el-button size="small" type="primary" @click="handleSubmit">确定</el-button>
        <el-button size="small" @click="driverVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ztTable from '@/components/zt-table';
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      vehicleData: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    name: '',
    data() {
      return {
        checkObj: null,
        driverObj: {},
        driverVisible: false,
        loading: false,
        requestTable: this.$root.getBindDriverList,
        isFirst: true,
        tableForm: {
          searchByCompanyCode: this.$store.getters.getCompanyCode,
          searchByName: '',
          searchByStatus: null,
          searchByBindStatus: null,
          searchByBlackStatus: null,
          pageNum: 1
        },
        tableColumn: [
          {
            type: 'radio',
            label: '选择'
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
            prop: 'statusName',
            label: '司机状态',
            align: 'center'
          },
          {
            prop: 'blackStatus',
            label: '黑名单',
            align: 'center',
            formatter: (row) => {
              if (row.blackStatus === 0) {
                return '否'
              } else {
                return <span class="text-danger">是</span>
              }
            }
          },
          {
            prop: 'bindStatus',
            label: '是否绑定',
            align: 'center',
            formatter: (row) => {
              if (row.bindStatus === 1) {
                return '已绑定'
              } else {
                return <span class="text-danger">未绑定</span>
              }
            }
          },
        ]
      }
    },
    watch: {
      driverVisible(val) {
        if (val && !this.isFirst) {
          this.checkObj = null;
          this.reset();
          this.$refs['table'].resetRadio();
        }
        this.isFirst = false;
      },
      visible(val) {
        if (val) {
          this.driverObj = {};
        }
      }
    },
    methods: {
      closeDialog() {
        this.$emit('update:visible',false);
      },
      handleBind() {
        this.loading = true;
        this.$root.bindDriverVehicle({
          driverId: this.driverObj.driverId,
          vehicleId: this.vehicleData.vehicleId,
          bindStatus: 1
        }).then(res => {
          this.loading = false;
          if (res.code === 0) {
            this.$message.success('绑定成功');
            this.closeDialog();
            this.$emit('success');
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      handleSubmit() {
        if (!this.checkObj) {
          this.$message.warning('请先选择司机');
          return false;
        }
        this.driverObj = {...this.checkObj};
        this.driverVisible = false;
      },
      showDriver() {
        this.driverVisible = true;
      },
      search() {
        this.tableForm.pageNum = 1;
        this.$refs['table'].requestTableData(this.tableForm);
      },
      reset() {
        this.tableForm = {
          searchByCompanyCode: this.$store.getters.getCompanyCode,
          searchByName: '',
          searchByStatus: '',
          searchByBindStatus: '',
          searchByBlackStatus: '',
          pageNum: 1
        };
        this.$refs['table'].requestTableData(this.tableForm);
      }
    },
    components: {
      ztTable
    }
  }
</script>

<style scoped>
  .new-width {
    width: 273px
  }
  .el-input-group__append button.el-button {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
  }
</style>