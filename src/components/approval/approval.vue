/*
*  @描述：审核组件
*  @作者：白朗
*  @创建时间：2019/3/22
*/
<template>
  <el-dialog :title="title" width="600px" :visible.sync="visible" :before-close="close">
    <div class="content">
      <el-form ref="form" inline label-width="110px" :model="form" :rules="rules">
          <el-form-item label="审核结果:" prop="approve">
            <el-radio-group v-model="form.approve" @change="approveChange">
              <el-radio :label="1">审核通过</el-radio>
              <el-radio :label="0">审核不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :style="{visibility:form.approve?'hidden':'visible'}" label="审核说明:" prop="reason">
            <el-input size="small" v-model="form.reason" type="textarea" :rows="2" style="width:400px;"  placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
    </div>
    <span slot="footer">
      <el-button type="primary" size="small" :loading="loading"  @click="save">确定</el-button>
      <el-button size="small" @click="close">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '提示'
      }
    },
    data() {
      return {
        loading: false,
        form:{
          approve:1,
          reason:''
        },
        rules: {
          approve: [
            { required: true, message: '请选择是否变更承运商', trigger: 'change' }
          ],
          reason: [
            { required:false, message: '变更原因不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {

    },
    methods: {
      //更改承运商
      approveChange(e){
        console.log(e);
        this.form.reason = '';
        if(e){
          this.rules.reason[0].required = false;
        }else{
          this.rules.reason[0].required = true;
        }
      },
      //保存
      save(){
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.$emit('approvalData',this.form);
            this.close();
          }
        })
      },
      //取消
      close() {
        this.$refs['form'].resetFields();
        this.$emit('update:visible',false);
      }
    }
  }
</script>

<style scoped lang="scss">
  .content{
    padding: 4px;
  }
</style>