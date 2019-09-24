/*
*  @描述：财务报表
*  @作者：邱康松
*  @创建时间：
*/
<template>
  <div>
    <column-box v-if="!isView">
      <template slot="head">
        <p>
          <span class="column__title--h4">财务报表</span>
          <span class="text-danger">（请贵公司提供近三年财务报表数据-加盖公章）</span>
          <span>（财务报表可上传JPG、JPEG、PNG、PDF格式文件）</span>
        </p>
      </template>
      <template slot="body">
        <el-form inline label-width="100px" :model="form" :rules="rules" ref="form">
          <el-form-item label="报表年份：" style="width: 470px;margin-right: 0" prop="year">
            <el-select v-model="form.year" style="width: 250px">
              <el-option v-for="item in yearList" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产负债表：" prop="balanceSheetUrl" style="width: 470px;margin-right: 0">
            <upload-file type="input" :show-tip="false" :fileData.sync="zcObj" ref="zc"></upload-file>
          </el-form-item>
          <el-form-item label="现金流量表：" prop="cashFlowSheetUrl" style="width: 470px;margin-right: 0">
            <upload-file type="input" :show-tip="false" :fileData.sync="xjObj" ref="xj"></upload-file>
          </el-form-item>
          <el-form-item label="利润表：" prop="profitSheetUrl" style="width: 470px;margin-right: 0">
            <upload-file type="input" :show-tip="false" :fileData.sync="lrObj" ref="lr"></upload-file>
          </el-form-item><br/>
          <el-form-item style="margin: 0">
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-form-item>
        </el-form>
      </template>
    </column-box v-if=>
    <column-box no-title="" last>
      <template slot="body">
        <zt-table :table-column="tableColumn" :table-data="tableData" :pagination="false" :loading="tableLoading"></zt-table>
      </template>
    </column-box>
  </div>
</template>

<script>
  import columnBox from '@/components/zt-column-box';
  import ztTable from '@/components/zt-table';
  import uploadFile from '@/components/uploadFile';

  export default {
    name: "financeReport",
    props: {
      detail: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        form: {
          carrierCode: this.$store.getters.getCarriersCode,
          year: null,
          balanceSheetUrl: null,
          balanceSheetName: null,
          cashFlowSheetUrl: null,
          cashFlowSheetName: null,
          profitSheetUrl: null,
          profitSheetName: null,
        },
        rules: {
          year: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          balanceSheetUrl: [
            { required: true, message: '这是必填字段', trigger: 'input' }
          ],
          cashFlowSheetUrl: [
            { required: true, message: '这是必填字段', trigger: 'input' }
          ],
          profitSheetUrl: [
            { required: true, message: '这是必填字段', trigger: 'input' }
          ]
        },
        zcObj: {},
        xjObj: {},
        lrObj: {},
        yearList: [],
        tableColumn: [
          { type: 'index', label: '序号' },
          { prop: 'edit', label: '操作', align: 'center', width: 100,
            formatter: (row, column, cellValue, index) => {
              if (this.isView) {
                return '';
              }
              if (row.workStatus !== 1) { //审核通过的不能删除
                return <el-button type="text" onClick={this.handleDelete.bind(this,row)}>删除</el-button>
              } else {
                return '';
              }
            }
          },
          { prop: 'year', label: '报表年份', align: 'center' },
          { prop: 'zc', label: '资产负债表', align: 'center',
            formatter: (row) => {
              return <a href={row.balanceSheetUrl} target="_blank" class="file-item">{row.balanceSheetName}</a>
            }
          },
          { prop: 'xj', label: '现金流量表', align: 'center',
            formatter: (row) => {
              return <a href={row.cashFlowSheetUrl} target="_blank" class="file-item">{row.cashFlowSheetName}</a>
            }
          },
          { prop: 'lr', label: '利润表', align: 'center',
            formatter: (row) => {
              return <a href={row.profitSheetUrl} target="_blank" class="file-item">{row.profitSheetName}</a>
            }
          },
          { prop: 'modifiedOn', label: '修改时间', align: 'center', width: 140 },
        ],
        tableData: [],
        tableLoading: false
      }
    },
    watch: {
      zcObj(val) {
        if (val) {
          this.form.balanceSheetUrl = val.fileUrl;
          this.form.balanceSheetName = val.fileName;
          this.$refs['form'].clearValidate(['balanceSheetUrl']);
        }
      },
      xjObj(val) {
        if (val) {
          this.form.cashFlowSheetUrl = val.fileUrl;
          this.form.cashFlowSheetName = val.fileName;
          this.$refs['form'].clearValidate(['cashFlowSheetUrl']);
        }
      },
      lrObj(val) {
        if (val) {
          this.form.profitSheetUrl = val.fileUrl;
          this.form.profitSheetName = val.fileName;
          this.$refs['form'].clearValidate(['profitSheetUrl']);
        }
      },
      detail(val) {
        this.tableData = [...val];
      }
    },
    computed: {
      isView() { //是否是查看
        return this.$route.query.isView;
      }
    },
    created() {
      let nowYear = new Date().getFullYear();
      for (let i = 3; i > 0; i--) {
        this.yearList.push(nowYear - i);
      }
      this.yearList.push(nowYear);
      this.$set(this.$data,'yearList',this.yearList);
    },
    methods: {
      handleSubmit() {
        return this.tableData.length > 0;
      },
      getList() {
        this.tableLoading = true;
        this.$root.getFinanceList({
          carrierCode: this.$store.getters.getCarriersCode
        }).then(res => {
          this.tableLoading = false;
          if (res.code === 0) {
            this.tableData = res.data || [];
          }
        }).catch(() => {
          this.tableLoading = false;
        })
      },
      handleDelete(row) {
        this.$root.deleteFinanceReport({
          id: row.id
        }).then(res => {
          if (res.code === 0) {
            this.getList();
          }
        })
      },
      clearFile() {
        this.$refs['zc'].clearFiles();
        this.$refs['xj'].clearFiles();
        this.$refs['lr'].clearFiles();
      },
      handleSave() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.tableData.length > 0 && this.tableData.some(item => +item.year === +this.form.year)) {
              this.$message.warning('该年份已增加，请选择其他年份！');
              return false;
            }
            this.$root.addFinanceReport(this.form).then(res => {
              if (res.code === 0) {
                this.$message.success('操作成功！');
                this.getList();
                this.clearFile();
                this.$refs['form'].resetFields();
              }
            })
          }
        })
      }
    },
    components: {
      columnBox,
      ztTable,
      uploadFile
    }
  }
</script>

<style scoped>
  .file-item {
    color: #409EFF;
  }
  .file-item:hover {
    text-decoration: underline;
  }
</style>