
/*
*  @描述：车型保险设置
*  @作者：白朗
*  @创建时间：2019/3/4
*/
<template>
  <div class="logistics-plan page-normal">
    <searchBoxFade :show-btn="false">
      <template slot="show">
        <el-form inline label-width="80px">
          <el-form-item label="所属车名">
            <el-input placeholder="请输入所属车名" :maxlength="50" v-model="requestParams.carName" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryTableData">查询</el-button>
            <el-button @click="resetFun">重置</el-button>
          </el-form-item>

        </el-form>
      </template>
    </searchBoxFade>
    <column-box no-title="" last>
      <template slot="body">
        <div class="flex_lc" style="margin-bottom: 10px">
          <el-button @click="exportFun" v-has="'VRES67'" type="primary">导出</el-button>
        </div>
        <zt-table ref="table" :tableColumn="tableColumn" :request="requestTable" :requestParams="requestParams"></zt-table>
      </template>
    </column-box>
  </div>
</template>
<script>
  import ztTable from '@/components/zt-table';
  import {getDateStr,parseDate} from "@/utils";
  import columnBox from '@/components/zt-column-box';
  import searchBoxFade from '@/components/searchBoxFade';
  export default {
    name: 'carinsurance',
    data() {
      return {
        requestTable:this.$root.getVehicleinsuranceList,
        requestParams:{
          carName:'',
          // orderBy:0,//排序 0:正序(少) 1:倒序(多)
          pageNum:1,//当前页码
        },
        tableColumn: [
          {
            type: 'index',
            label: '序号',
            align: 'center'
          },
          {
            prop: 'carName',
            label: '所属车名',
            align: 'center'
          },
          {
            prop: 'carType',
            label: '所属车种',
            align: 'center'
          },
          {
            prop: 'brand',
            label: '品牌',
            align: 'center'
          },
          {
            prop: 'vehiclePrice',
            label: '车型价格',
            align: 'center'
          },
          {
            prop: 'rate',
            label: '费率',
            align: 'center'
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
          }
        ]
      }
    },
    methods: {
      //查询
      queryTableData(){
        this.requestParams.pageNum=1;
        this.$refs.table.$emit("requestTable", this.requestParams);
      },
      //重置
      resetFun(){
        this.requestParams={
          carName:'',
          pageNum:1,//当前页码
        }
        this.$refs.table.$emit("requestTable", this.requestParams);
      },
      //导出
      exportFun(){
        let params = {...this.requestParams};
        let requestPromise = this.$root.exportVehicleinsurance(params);
        requestPromise.then(res => {
          let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `车型保险查询${parseDate()}.xls`;
          let evt = document.createEvent("MouseEvents");
         evt.initEvent("click",true,true);
         link.dispatchEvent(evt);
          this.$message.success("导出成功");
        });
      },
    },
    components: {
      ztTable,
      columnBox,
      searchBoxFade
    }
  }
</script>

<style scoped lang="scss">
  .logistics-plan /deep/ {
    .sub-total-column td {
      color: #409EFF;
    }
    .el-select {
      width: 202px;
    }

  }
  .btn_style{
    color: #409EFF;
    span{margin: 0px 6px;cursor: pointer;}
  }
</style>