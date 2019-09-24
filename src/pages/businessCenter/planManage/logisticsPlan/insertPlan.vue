/*
*  @描述：插入计划弹窗
*  @作者：邱康松
*  @创建时间：2019/7/30
*/
<template>
  <el-dialog title="插入计划" :visible.sync="visible" width="1000px" :before-close="closeDialog">
    <el-form inline label-width="90px">
      <el-form-item label="拖车计划号：">
        <el-input placeholder="请输入" clearable :maxlength="30" v-model="form.searchByCode"></el-input>
      </el-form-item>
      <el-form-item label="司机姓名：">
        <el-input placeholder="请输入" clearable :maxlength="30" v-model="form.searchByDriver"></el-input>
      </el-form-item>
      <el-form-item label="挂车车牌号：">
        <el-input placeholder="请输入" clearable :maxlength="30" v-model="form.searchByTrailerPlate"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <zt-table
      :table-column="tableColumn"
      :pagination="false"
      :table-data="tableData"
      v-loading="loading"
      radio-label="code"
      :getClickRow.sync="selectRadio"
      highlight-current-row="">
    </zt-table>
    <span slot="footer">
      <el-button type="primary" @click="save" :loading="btnLoading">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ztTable from '../../../../components/zt-table';
  export default {
    name: "insertPlan",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      selectData: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    watch: {
      visible(val) {
        if (val) {
          this.getList();
        } else {
          this.selectRadio = null;
        }
      }
    },
    data() {
      return {
        btnLoading: false,
        loading: false,
        tableData: [],
        selectRadio: null,
        form: {
          searchByCode: '',
          searchByTrailerPlate: '',
          searchByDriver: ''
        },
        tableColumn: [
          { type: 'index', label: '序号' },
          { type: 'radio', label: '选择' },
          { prop: 'code', label: '拖车计划号', align: 'center' },
          { prop: 'carrierCompanyCode', label: '承运商编码', align: 'center' },
          { prop: 'carrierCompanyName', label: '承运商', align: 'center' },
          { prop: 'trailerPlate', label: '挂车车牌号', align: 'center' },
          { prop: 'driverName', label: '司机姓名', align: 'center' },
          { prop: 'driverMobile', label: '手机号', align: 'center' },
          { prop: 'vehicleNum', label: '商品车数', align: 'center' },
          { prop: 'carryQuantity', label: '最大装载台数', align: 'center' },
          { prop: 'detachStatusName', label: '抽单状态', align: 'center' },
          { prop: 'originLocationName', label: '出发地', align: 'center' },
          { prop: 'assignOn', label: '编制日期', align: 'center',
            formatter: (row) => {
              return this.formatDate(row.assignOn);
            }
          }
        ]
      }
    },
    methods: {
      save() {
        if (!this.selectRadio) {
          this.$message.warning('请先选择一条运输计划！');
          return false;
        }
        this.btnLoading = true;
        this.$root.confirmInsertPlan({
          companyCode: this.$store.getters.getCompanyCode,
          userCode: this.$store.getters.getUserCode,
          ids: this.selectData.map(item => item.id),
          code: this.selectRadio.code
        }).then(res => {
          this.btnLoading = false;
          if (res.code === 0) {
            this.$message.success('操作成功！');
            this.$emit('success');
            this.closeDialog();
          }
        }).catch(() => {
          this.btnLoading = false;
        })
      },
      search() {
        this.getList();
      },
      reset() {
        this.form = {
          searchByCode: '',
          searchByTrailerPlate: '',
          searchByDriver: ''
        };
        this.getList();
      },
      closeDialog() {
        this.$emit('update:visible', false);
      },
      getList() {
        this.loading = true;
        this.$root.insertPlanList({
          companyCode: this.$store.getters.getCompanyCode,
          userCode: this.$store.getters.getUserCode,
          searchByOriginLocation: this.selectData[0].originLocation,
          searchByMainPowerCode: this.selectData[0].mainPower,
          searchByLineType: this.selectData[0].lineType,
          ...this.form
        }).then(res => {
          this.loading = false;
          if (res.code === 0) {
            this.tableData = res.data || [];
          }
        }).catch(() => {
          this.loading = false;
        })
      }
    },
    components: {
      ztTable
    }
  }
</script>

<style scoped>

</style>