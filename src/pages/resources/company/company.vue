/*
*  @描述：承运商列表
*  @作者：邱康松
*  @创建时间：2019/3/4
*/

<template>
  <div class="driver-data page-normal">
    <column-box no-title="" last>
      <template slot="body">
        <div class="flex_sc">
          <el-button size="small" type="primary" @click="exportFun()" v-has="'VRES24'">导出</el-button>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter"></filterColumn>
        </div>
        <zt-table :table-column="newColumn || tableColumn" ref="table" v-if="showTable" :tableData="tableData" :pagination="false"></zt-table>
      </template>
    </column-box>
  </div>
</template>

<script>
  import ztTable from '../../../components/zt-table';
  import columnBox from '../../../components/zt-column-box';
  import datePicker from '../../../components/datePicker';
  import filterColumn from '../../../components/filterColumn';
  import searchBoxFade from '../../../components/searchBoxFade';
  import {getDateStr,parseDate} from "@/utils";
  export default {
    name: 'companyData',
    data() {
      return {
        showBox: false,
        loading: false,
        tableData: [],
        form: {
          pageNum: 1,
          companyCode: this.$store.getters.getCompanyCode
        },
        showTable: false,
        isFirst: true,
        newColumn: null, //筛选后的列
        tableColumn: [
          {
            type: 'index',
            label: '序号',
            align: 'center'
          },
          {
            label: '操作',
            prop: 'confirmStatus',
            align: 'center',
            formatter: (row) => {
              if (+row.auditStatus === 0) { //待审核
                return <el-button type="text" onClick={this.toDetail.bind(this,row)}>查看</el-button>
              } else {
                return (
                    <el-button type="text" onClick={this.toUpdate.bind(this,row)} v-has="VRES25">修改</el-button>
                )
              }
            }
          },
          {
            prop: 'auditStatusTxt',
            label: '审核状态',
            align: 'center',
          },
          {
            prop: 'auditRemark',
            label: '审核说明',
            align: 'center',
          },
          {
            prop: 'isStatus',
            label: '启用停用状态',
            align: 'center',
            formatter: (row) => {
              if (row.isStatus === 0) {
                return <span class="text-danger">已停用</span>
              } else {
                return '已启用'
              }
            }
          },
          {
            prop: 'carrierCode',
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
            prop: 'companySettlement',
            label: '结算主体',
            align: 'center'
          },
          {
            prop: 'unifiedSocialCreditCode',
            label: '统一社会信用代码',
            align: 'center'
          },
          {
            prop: 'businessEntity',
            label: '法人姓名',
            align: 'center'
          },
          {
            prop: 'businessEntityIdentity',
            label: '法人身份证号',
            align: 'center'
          },
          {
            prop: 'registerAddress',
            label: '注册地址',
            align: 'center'
          },
          {
            prop: 'registerCapital',
            label: '注册资金(元)',
            align: 'center'
          },
          {
            prop: 'fixedAssets',
            label: '固定资产(元)',
            align: 'center'
          },
          {
            prop: 'zipCode',
            label: '邮政编码',
            align: 'center'
          },
          {
            prop: 'registerDate',
            label: '成立日期',
            align: 'center',
            formatter: (row) => {
              return this.formatDate(row.registerDate);
            }
          },
          {
            prop: 'bankName',
            label: '开户银行',
            align: 'center'
          },
          {
            prop: 'bankAccount',
            label: '银行账户',
            align: 'center'
          },
          {
            prop: 'insuranceType',
            label: '保险公司',
            align: 'center'
          },
          {
            prop: 'companyScale',
            label: '公司总人数',
            align: 'center'
          },
          {
            prop: 'companyManagementScale',
            label: '管理人员人数',
            align: 'center'
          },
          {
            prop: 'operatePeriod',
            label: '营业期限',
            align: 'center'
          },
          {
            prop: 'roadTransportOperatePeriod',
            label: '道路运输经营许可证期限',
            align: 'center'
          },
          {
            prop: 'operateRange',
            label: '经营范围',
            align: 'center'
          },
          {
            prop: 'mainRange',
            label: '主营业务',
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
          {
            prop: 'auditName',
            label: '审核人',
            align: 'center'
          },
          {
            prop: 'auditOn',
            label: '审核时间',
            align: 'center'
          },
        ]
      }
    },
    activated() {
      this.$root.getCompanyList(this.form).then(res => {
        if (res.code === 0) {
          this.tableData = res.data && res.data.list || [];
        }
      })
    },
    methods: {
      toDetail(data) {
        this.$router.push({
          path: 'companyDetail',
          query: {
            id: data.id,
            isView: true
          }
        });
      },
      doneFilter(list) {
        this.showTable = false;
        this.newColumn = [...list];
        setTimeout(() => {
          this.showTable = true;
        }, 0)
      },
      toUpdate(data) {
        this.$router.push({
          path: 'companyDetail',
          query: {
            id: data.id
          }
        });
      },
      //导出
      exportFun() {
        let params = {...this.form};
        let requestPromise = this.$root.getCarriersExport({
          companyCode:params.companyCode,
        });
        requestPromise.then(res => {
          let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `承运商资料${parseDate()}.xls`;
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