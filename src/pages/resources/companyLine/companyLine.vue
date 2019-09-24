/*
*  @描述：承运商线路查询
*  @作者：邱康松
*  @创建时间：2019/3/5
*/

<template>
  <div class="page-normal">
    <searchBoxFade :show-btn="false">
      <template slot="show">
        <el-form inline>
          <el-form-item label="起点：">
            <el-input v-model="form.startLocation" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="省份：">
            <el-input v-model="form.province" placeholder="请输入" :maxlength="10" clearable></el-input>
          </el-form-item>
          <el-form-item label="终点：">
            <el-input v-model="form.endLocation" placeholder="请输入" :maxlength="50" clearable></el-input>
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
        <div style="margin-bottom: 10px">
          <el-button size="small" @click="exportFun()" v-has="'VRES27'" type="primary">导出</el-button>
        </div>
        <zt-table :table-column="tableColumn" :pagination="false" :request-params="form" ref="table" :request="request"></zt-table>
      </template>
    </column-box>
  </div>
</template>

<script>
  import columnBox from '../../../components/zt-column-box';
  import ztTable from '../../../components/zt-table';
  import {getDateStr,parseDate} from "@/utils";
  import searchBoxFade from '@/components/searchBoxFade';
  export default {
    name: '',
    data() {
      return {
        request: this.$root.getCompanyLineList,
        form: {
          companyCode: this.$store.getters.getCompanyCode,
          province: '',
          startLocation: '',
          endLocation: '',
          pageNum: 1
        },
        tableColumn: [
          {
            type: 'index',
            label: '序号'
          },
          {
            prop: 'startLocation',
            label: '起点',
            align: 'center'
          },
          {
            prop: 'province',
            label: '省份',
            align: 'center'
          },
          {
            prop: 'endLocation',
            label: '终点',
            align: 'center'
          },
          {
            prop: 'remark',
            label: '备注',
            align: 'center'
          },
        ]
      }
    },
    methods: {
      search() {
        this.form.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
      },
      reset() {
        this.form = {
          companyCode: this.$store.getters.getCompanyCode,
          province: '',
          startLocation: '',
          endLocation: '',
          pageNum: 1
        };
        this.$refs['table'].requestTableData(this.form);
      },
      //导出
      exportFun() {
        let params = {...this.form};
        let requestPromise = this.$root.getCarrierRoutesExport({
          companyCode:params.companyCode,
          province:params.province,
          startLocation:params.startLocation,
          endLocation:params.endLocation
        });
        requestPromise.then(res => {
          let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `承运商线路查询${parseDate()}.xls`;
          let evt = document.createEvent("MouseEvents");
             evt.initEvent("click",true,true);
             link.dispatchEvent(evt);
          this.$message.success("导出成功");
        });
      }
    },
    components: {
      columnBox,
      ztTable,
      searchBoxFade
    }
  }
</script>

<style scoped>

</style>