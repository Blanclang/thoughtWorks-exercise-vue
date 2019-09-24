/*
*  @描述：上传文件组件
*  @作者：邱康松
*  @创建时间：2019/1/26
*/

<template>
  <div :style="{'display': type==='input'? 'flex': 'block'}">
    <el-input v-if="type==='input'" style="margin-right: 10px;width: 250px" :value="fileName" readonly></el-input>
    <el-upload
            ref="upload"
            action="/v1/upl/aliyun/oss/template/upload"
            :show-file-list="type!=='input'"
            :headers="headers"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-error="handleError"
            :on-success="handleSuccess"
            accept=".jpg,.png,.jpeg,.pdf"
            :limit="type==='input'?null:1"
            :file-list="fileList"
            :on-exceed="handleExceed">
      <el-button size="small" type="primary" :loading="loading">点击上传</el-button>
      <div slot="tip" class="el-upload__tip gray" style="line-height: normal" v-if="showTip">文件格式为JPEG、JPG、PNG、PDF，并且小于20Mb</div>
    </el-upload>
  </div>
</template>

<script>
  export default {
    props: {
      fileList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      showTip: {
        type: Boolean,
        default: true
      },
      type: { //上传的样式，传'input'显示为输入框样式
        type: String,
        default: null
      }
    },
    watch: {
      fileList(val) {
        if (val.length > 0) {
          this.url = val[0].url;
        }
      }
    },
    data() {
      return {
        headers: {
          Authorization: 'vlsCompany ' + this.$store.getters.getToken
        },
        url: '',
        loading: false,
        fileName: null
      }
    },
    methods: {
      handleRemove() {
        this.url = '';
        this.$emit('update:fileId','')
      },
      handleExceed() {
        this.$message.warning('只能上传一个文件！');
      },
      handlePreview() {
        window.open(this.url);
      },
      handleError() {
        this.loading = false;
        this.$message.error('上传失败！');
      },
      handleSuccess(response) {
        this.loading = false;
        if (response.code === 0) {
          this.$emit('update:fileId',response.data.id);
          this.$emit('update:fileUrl',response.data.originalFileUrl);
          this.$emit('update:fileName',this.fileName);
          this.$emit('update:fileData',{
            fileName: this.fileName,
            fileUrl: response.data.originalFileUrl,
            fileId: response.data.id
          });
          this.url = response.data.originalFileUrl;
          this.$message.success('上传成功！');
        } else {
          this.$message.error('上传失败！');
        }
      },
      beforeUpload(file) {
        if (file.size > 20971520) {
          this.$message.warning('文件大小不得超过20Mb！');
          return false;
        }
        this.loading = true;
        this.fileName = file.name;
      },
      clearFiles() {
        this.fileName = null;
        this.$emit('update:fileData', {});
        this.$refs['upload'].clearFiles();
      }
    }
  }
</script>

<style scoped>

</style>