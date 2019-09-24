/*
*  @描述：承运商详情
*  @作者：邱康松
*  @创建时间：2019/3/5
*/

<template>
  <div class="page-normal company-detail" v-loading="pageLoading">
    <column-box no-title last class="top-box">
      <template slot="body">
        <div v-if="!isView">
          <el-button type="primary" @click="handleApply" :loading="loading">提交审核</el-button>
          <el-button @click="goBack">取消</el-button>
        </div>
        <div v-if="isView">
          <el-button type="primary" @click="$router.replace('/companyData')">关闭</el-button>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="info"></el-tab-pane>
          <el-tab-pane label="联系人" name="contact"></el-tab-pane>
          <el-tab-pane label="财务报表" name="financeReport"></el-tab-pane>
          <el-tab-pane label="能力调查表" name="ability"></el-tab-pane>
        </el-tabs>
      </template>
    </column-box>
    <div class="component-box">
      <info v-show="activeName==='info'" ref="info" :detail="detail.base"></info>
      <contact v-show="activeName==='contact'" ref="contact" :detail="detail.links"></contact>
      <financeReport v-show="activeName==='financeReport'" ref="financeReport" :detail="detail.reports"></financeReport>
      <ability v-show="activeName==='ability'" ref="ability" :detail="detail.powers"></ability>
    </div>
  </div>
</template>

<script>
  import columnBox from '@/components/zt-column-box';
  import info from './info';
  import contact from './contact';
  import financeReport from './financeReport';
  import ability from './ability';
  export default {
    name: 'companyDetail',
    data() {
      return {
        activeName: 'info',
        pageLoading: false,
        detail: {},
        loading: false
      }
    },
    computed: {
      isView() { //是否是查看
        return !!this.$route.query.isView;
      }
    },
    mounted() {
      this.$nextTick(() => {
        let topHeight = document.getElementsByClassName('top-box')[0].clientHeight;
        document.getElementsByClassName('component-box')[0].style.maxHeight = `calc(100% - ${topHeight}px)`;
      });
      this.getDetail(); //获取详细信息
    },
    methods: {
      getDetail() {
        this.pageLoading = true;
        this.$root.getCompanyAllData({
          id: this.$route.query.id
        }).then(res => {
          this.pageLoading = false;
          if (res.code === 0) {
            this.detail = res.data || {};
          }
        }).catch(() => {
          this.pageLoading = false;
        })
      },
      handleApply() {
        //如果组件返回form数据说明必填项都已填写，如果返回false说明没有完成填写
        let infoData = this.$refs['info'].handleSubmit();
        let contactData = this.$refs['contact'].handleSubmit();
        let financeReportData = this.$refs['financeReport'].handleSubmit();
        let abilityData = this.$refs['ability'].handleSubmit();
        if (!infoData) {
          this.$message.warning('请完善基本信息！');
          return false;
        }
        if (!contactData) {
          this.$message.warning('请完善4个联系人信息！');
          return false;
        }
        if (!financeReportData) {
          this.$message.warning('请至少提供近一年的财务报表数据！');
          return false;
        }
        if (!abilityData) {
          this.$message.warning('请至少提供一年的能力调查表！');
          return false;
        }
        if (infoData && contactData && financeReportData && abilityData) {
          this.loading = true;
          //提交审核只需提交基本信息的参数
          this.$root.applyAudit({
            id: this.$route.query.id,
            ...infoData
          }).then(res => {
            this.loading = false;
            if (res.code === 0) {
              this.$message.success('提交成功！');
              this.$router.replace('/companyData');
            }
          }).catch(() => {
            this.loading = false;
          })
        }
      },
      goBack() {
        this.$confirm('取消后，所填写的基本信息将不会被保存，确定取消？','提示').then(() => {
          this.$router.replace('/companyData');
        }).catch(() => {})
      }
    },
    components: {
      columnBox,
      info,
      contact,
      financeReport,
      ability
    }
  }
</script>

<style scoped lang="scss">
  .company-detail /deep/ {
    height: 100%;
    .el-tabs__header {
      margin: 0;
    }
  }
  .top-box {
    width: 100%;
  }
  .component-box {
    overflow-y: auto;
  }
</style>