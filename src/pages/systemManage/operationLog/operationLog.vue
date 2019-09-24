/*
*  @描述：操作日志
*  @作者：邱康松
*  @创建时间：2019/2/28
*/

<template>
  <div class="page-normal">
    <searchBoxFade :show-btn="false">
      <template slot="show">
        <el-form inline>
          <el-form-item label="操作人：">
            <el-input v-model="form.searchByName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
            <date-picker v-model="filterTime"></date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>

      </template>
    </searchBoxFade>
    <column-box no-title="" last>
      <template slot="body">
        <zt-table :table-column="tableColumn" :request="requestTable" :request-params="form" ref="table"></zt-table>
      </template>
    </column-box>
  </div>
</template>

<script>
  import columnBox from '../../../components/zt-column-box';
  import datePicker from '../../../components/datePicker';
  import ztTable from '../../../components/zt-table';
  import searchBoxFade from '@/components/searchBoxFade';
  export default {
    name: 'operationLog',
    data() {
      return {
        form: {
          searchByName: '',
          companyCode: this.$store.getters.getCompanyCode,
          searchByStartTime: '',
          searchByEndTime: '',
          pageNum: 1
        },
        requestTable: this.$root.getLogList,
        filterTime: {},
        tableColumn: [
          {
            type: 'index',
            label: '序号'
          },
          {
            label: '操作人',
            prop: 'operatedName',
            align: 'center'
          },
          {
            label: '操作时间',
            prop: 'operatedOn',
            align: 'center'
          },
          {
            label: '所属部门',
            prop: 'department',
            align: 'center'
          },
          {
            label: '操作模块',
            prop: 'module',
            align: 'center'
          },
          {
            label: '操作内容',
            prop: 'content',
            align: 'center'
          },
        ]
      }
    },
    watch: {
      filterTime(val) {
        this.form.searchByStartTime = val.startDate;
        this.form.searchByEndTime = val.endDate;
      }
    },
    methods: {
      search() {
        this.form.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
      },
      reset() {
        this.form = {
          searchByName: '',
          companyCode: this.$store.getters.getCompanyCode,
          searchByStartTime: '',
          searchByEndTime: '',
          pageNum: 1
        };
        this.filterTime = {};
        this.$refs['table'].requestTableData(this.form);
      }
    },
    components: {
      columnBox,
      datePicker,
      ztTable,
      searchBoxFade
    }
  }
</script>

<style scoped>

</style>