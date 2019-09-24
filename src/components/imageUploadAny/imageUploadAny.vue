/*
*  @描述：图片上传组件（多张）
*  @作者：邱康松
*  @创建时间：2019/5/16
*/

<template>
  <el-upload
          ref="upload"
          :limit="limit"
          :headers="headers"
          class="upload-image"
          action="/v1/upl/aliyun/oss/image/uploadFileWithThumbnail"
          list-type="picture-card"
          :file-list="fileList"
          accept=".jpg,.png,.jpeg"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-exceed="handleExceed"
          :on-preview="handlePreview"
          :on-remove="handleRemove">
    <i class="el-icon-plus"></i>
  </el-upload>
</template>

<script>
  import Cookie from 'js-cookie';
  export default {
    name: '',
    props: {
      fileList: { //格式为[{ur:xxx,id:xx}]
        type: Array,
        default: function () {
          return []
        }
      },
      maxSize: { //图片的最大值，单位M
        type: [Number,String],
        default: 5
      },
      limit: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        headers: {
          Authorization: 'vlsCompany ' + Cookie.get('vlsCompanyToken')
        },
        idList: [],
      }
    },
    watch: {
      fileList: {
        handler: function (val) {
          if (val && val.length > 0) {
            this.idList = val.map(item => item.id);
          }
        },
        immediate: true
      }
    },
    methods: {
      clearFiles() {
        this.$refs['upload'].clearFiles();
      },
      handlePreview(file) {
        this.$emit('showImg', file.url);
      },
      handleRemove(file, fileList) {
        // 存在response说明是当前上传的，没有即说明是之前上传回显的
        this.idList = fileList.map(item => item.response ? item.response.data.id : item.id);
        this.$emit('update:idList',this.idList);
      },
      handleExceed() {
        this.$message.warning(`最多只能上传${this.limit}张图片`);
      },
      handleSuccess(res) {
        if (res.code === 0) {
          this.idList.push(res.data.id);
          this.$emit('update:idList',this.idList);
        } else {
          this.$message.warning(res.message || '上传失败');
        }
      },
      handleError(err) {
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

<style scoped>

</style>