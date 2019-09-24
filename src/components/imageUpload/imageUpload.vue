/*
*  @描述：图片上传组件（单张图片）
*  @作者：邱康松
*  @创建时间：2018/12/29
*/

<template>
  <el-upload
    ref="upload"
    :limit="1"
    :headers="headers"
    class="upload-image one-img"
    action="/v1/upl/aliyun/oss/image/uploadFileWithThumbnail"
    list-type="picture-card"
    :file-list="myFileList"
    accept=".jpg,.png,.jpeg"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-preview="handlePreview"
    :on-remove="handleRemove">
    <i class="el-icon-plus"></i>
    <span class="tip">{{title}}</span>
  </el-upload>
</template>

<script>
  import Cookie from 'js-cookie';
  export default {
    props: {
      fileList: {
        type: Array,
        default: function () {
          return []
        }
      },
      maxSize: { //图片的最大值，单位M
        type: [Number,String],
        default: 5
      },
      resUrl: {
        type: String,
        default: ''
      },
      resId: {
        type: [Number,String],
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    computed: {
      myFileList() {
        return this.fileList.map(item => { return { url: item } });
      }
    },
    data() {
      return {
        headers: {
          Authorization: 'vlsCompany ' + Cookie.get('vlsCompanyToken')
        }
      }
    },
    methods: {
      clearFile() {
        this.$refs['upload'].clearFiles();
      },
      handlePreview(file) {
        this.$emit('showImg', file.url);
      },
      handleRemove(file, fileList) {
        this.$emit('update:resUrl','');
        this.$emit('update:resId','');
      },
      handleSuccess(res) {
        if (res.code === 0) {
          this.$emit('update:resUrl',res.data.originalFileUrl);
          this.$emit('update:resId',res.data.id);
        } else {
          this.$emit('update:resUrl','');
          this.$emit('update:resId','');
          this.$refs['upload'].clearFiles();
          this.$message.warning(res.message || '上传失败');
        }
      },
      handleError(err) {
        this.$emit('update:resUrl','');
        this.$emit('update:resId','');
        this.$refs['upload'].clearFiles();
        this.$message.error(err.message || '上传失败');
      },
      beforeUpload(file) {
        if (file.size > this.maxSize * 1024 * 1024) {
          this.$message.warning(`文件大小不得超过${this.maxSize}Mb！`);
          return false;
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .one-img {
    height: 148px;
    width: 148px;
    overflow: hidden;
  }
  .upload-image /deep/ {
    &+.upload-image {
      margin-top: 20px;
    }
    .el-upload--picture-card {
      position: relative;
    }
    .tip {
      position: absolute;
      bottom: -50px;
      left: 50%;
      transform: translate(-50%);
      width: 100%;
      color: #999999;
    }
  }
</style>