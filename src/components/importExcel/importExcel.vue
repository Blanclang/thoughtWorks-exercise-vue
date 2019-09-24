/*
*  @描述：导入excel弹窗组件
*  @作者：邱康松
*  @创建时间：2019/1/10
*/

<template>
  <el-dialog :title="title" :visible.sync="visible" :before-close="closeDialog" @open="openDialog">
    <div class="content">
      <el-upload
        class="upload-demo"
        ref="upload"
        accept=".xls,.xlsx,.csv"
        :headers="headers"
        :action="action"
        :data="params"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">{{tip}}</div>
      </el-upload>
    </div>
    <span slot="footer">
      <el-button v-if="showDownload" size="small" @click="downloadTemp">下载导入模板</el-button>
      <el-button type="primary" size="small" @click="handleImport" :loading="loading">确认导入</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Cookie from 'js-cookie';
  export default {
    props: {
      params: { //上传时额外的参数
        type: Object,
        default: function () {
          return {};
        }
      },
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '导入文件'
      },
      tip: {
        type: String,
        default: '请上传Excel文件格式：.xls、.xlsx'
      },
      action: {
        type: String,
        default: ''
      },
      code: { //模板地址的code
        type: String,
        default: ''
      },
      showDownload: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        loading: false,
        downloadUrl: '',
        headers: {
          Authorization: 'vlsCompany ' + Cookie.get('vlsCompanyToken')
        }
      }
    },
    created() {
      if (this.showDownload) {
        this.$root.getTemplate({
          code: this.code
        }).then(res => {
          if (res.code === 0) {
            this.downloadUrl = res.data.originalFileUrl || '';
          }
        })
      }
    },
    methods: {
      openDialog() {
        this.$nextTick(() => {
          this.$refs['upload'].clearFiles();
        });
      },
      closeDialog() {
        this.$emit('update:visible',false);
      },
      downloadTemp() {
        location.href = this.downloadUrl;
      },
      beforeUpload() {
        this.loading = true;
      },
      handleError(err) {
        this.loading = false;
        this.$message.error(err.message || '上传失败');
      },
      handleSuccess(response) {
        this.loading = false;
        if (response.code === 0) {
          this.closeDialog();
          this.$emit('success',response.data);
        } else {
          this.$message.error(response.message);
        }
      },
      handleImport() {
        this.$refs['upload'].submit();
      },
      handleRemove() {

      }
    }
  }
</script>

<style scoped lang="scss">
  .content /deep/ {
    background-color: #F2F6FC;
    padding: 15px 20px;
    .el-upload__tip {
      display: inline-block;
      margin-left: 30px;
      color: #999999;
    }
  }

</style>