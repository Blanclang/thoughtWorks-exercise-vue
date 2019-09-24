/*
*  @描述：重置密码
*  @作者：邱康松
*  @创建时间：2019/1/7
*/

<template>
  <div style="padding: 1px">
    <div class="reset-box">
      <h3>重置密码
        <router-link to="/login" class="router__link_text">立即登录></router-link>
      </h3>
      <el-form label-width="100px" ref="form" :rules="rules" :model="form">
        <el-form-item label="手机号码" prop="mobile">
          <el-input placeholder="请输入" v-model="form.mobile" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="短信验证码" prop="verifyCode">
          <el-input placeholder="请输入短信验证码" v-model="form.verifyCode" maxlength="6">
            <el-button slot="append" @click="getCode" :disabled="isGet">{{codeText}}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="设置密码" prop="password">
          <el-input placeholder="数字和字母组合，6-20位字符" v-model="form.password" maxlength="20" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input placeholder="请再次输入" v-model="form.confirmPassword" maxlength="20" type="password"></el-input>
        </el-form-item>
        <el-form-item label="滑动验证" prop="check">
          <div id="captcha"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="handleReset">确认重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  require('@/assets/js/jigsaw.min.js'); //滑块验证插件
  import {passwordReg} from "../../../utils";
  import md5 from 'js-md5';

  export default {
    data() {
      let checkPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'));
        } else {
          if (passwordReg.test(value)) {
            callback();
          } else {
            callback(new Error('请输入6-20位数字和字母组合'));
          }
        }
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'));
        } else {
          if (this.form.confirmPassword !== this.form.password) {
            callback(new Error('两次输入密码不一致'));
          } else {
            callback();
          }
        }
      };
      return {
        codeText: '获取验证码',
        seconds: 60, // 验证码60s可重新获取
        timer: null,
        isGet: false, //验证码已发送
        form: {
          mobile: '',
          verifyCode: '',
          password: '',
          confirmPassword: '',
          check: ''
        },
        rules: {
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          verifyCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: checkPass, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            {
              validator: validatePass, trigger: 'blur'
            }
          ],
          check: [
            { required: true, message: '请先验证', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      let self = this;
      jigsaw.init({
        el: document.getElementById('captcha'),
        onSuccess: function () {
          self.form.check = 'check';
          self.$refs['form'].clearValidate('check');
        },
        onFail: function () {
          self.form.check = '';
        },
        onRefresh: function () {
          self.form.check = '';
        },
        width: 400
      })
    },
    methods: {
      handleReset() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let obj = {...this.form};
            obj.password = md5(obj.password);
            obj.confirmPassword = md5(obj.confirmPassword);
            this.$root.resetPassword(obj).then(res => {
              if (+res.code === 0) {
                this.$message.success('重置成功！');
                this.$router.push('login');
              }
            })
          }
        })
      },
      getCode() {
        if (!this.form.mobile) {
          this.$message.warning('请先输入手机号');
          return false;
        }
        if(!(/^1[34578]\d{9}$/.test(this.form.mobile))){
          this.$message.warning('请输入正确的手机号');
          return false;
        }
        this.isGet = true;
        this.$root.getCaptcha({
          mobile: this.form.mobile
        }).then(res => {
          if (+res.code === 0) {
            this.timer = window.setInterval(() => {
              if (this.seconds > 1) {
                this.codeText = `重新获取（${this.seconds--}s）`;
              } else {
                this.isGet = false;
                this.codeText = '重新获取';
                this.seconds = 60;
                clearInterval(this.timer);
              }
            },1000)
          } else {
            this.isGet = false;
          }
        }).catch(() => {
          this.isGet = false;
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .reset-box {
    width: 1000px;
    margin-left: auto;
    margin-right: auto;
    background-color: #ffffff;
    padding: 50px;
    margin-top: 50px;
    .el-input-group__append button.el-button.is-disabled:hover {
      background: #f5f7fa;
      color: #909399
    }
    h3 {
      font-weight: bold;
      font-size: 20px;
      text-align: center;
      margin-bottom: 40px;
      position: relative;
      a {
        position: absolute;
        right: 0;
        font-size: 14px;
        font-weight: normal;
        line-height: 27px;
      }
    }
    .el-form {
      width: 500px;
      margin: auto;
    }
  }
</style>