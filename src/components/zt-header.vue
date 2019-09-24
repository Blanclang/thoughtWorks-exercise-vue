/*
*  @描述：页面结构的头部组件，包括门店选择、logo、当前登录人等
*  @作者：付文松
*  @创建时间：2018-04-20
*/
<template>
  <div class="frame-header-box flex_sc">
    <!-- logo -->
    <div class="logo-box flex_lc">
      <img class="icon" :src="logo"/>
      <span class="logo-name">圣泽捷通智慧整车物流系统</span>
    </div>
    <div class="person-info flex_cc">
      <el-dropdown @command="handleCommand">
        <div class="el-dropdown-link">
          <img :src="userInfo.avatar || userIcon" alt="">
          <span style="color: #fff;font-size: 12px">
            {{userInfo.name || '--'}}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
        </div>
          <el-dropdown-menu class="dropsty" slot="dropdown" style="min-width: 100px">
            <!--<el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
            <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>-->
            <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--修改密码弹窗-->
    <el-dialog title="修改密码" :visible.sync="visible" width="580px" @closed="closeDialog">
      <el-form label-width="120px" :model="form" ref="form" :rules="rules">
        <el-form-item label="手机号码：">
          {{userInfo.account || '--'}}
        </el-form-item>
        <el-form-item label="短信验证码：" prop="verifyCode">
          <el-input placeholder="请输入短信验证码" v-model="form.verifyCode" maxlength="6">
            <el-button slot="append" @click="getCode" :disabled="isGet">{{codeText}}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="password">
          <el-input placeholder="数字和字母组合，6-20位字符" maxlength="20" type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPassword">
          <el-input placeholder="再次输入确认" type="password" v-model="form.confirmPassword" maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="visible=false">取消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ztLogo from "./../assets/images/sts.png";
  import userIcon from "./../assets/images/user.png";
  import Cookie from "js-cookie";
  import md5 from 'js-md5';
  import {passwordReg} from "../utils";

  export default {
    components:{
    },
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
        seconds: 60, // 验证码60s可重新获取
        timer: null,
        isGet: false, //验证码已发送
        loading: false,
        visible: false,
        codeText: '获取验证码',
        form: {
          "mobile":'',
          "verifyCode":"",
          "password":"",
          "confirmPassword":""
        },
				logo:ztLogo,
        userIcon,
        dUserName:this.userName,
        dPosition:this.position,
        rules: {
          verifyCode: [
            { required: true, message: '这是必填字段', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '这是必填字段', trigger: 'blur' },
            { validator: checkPass, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '这是必填字段', trigger: 'blur' },
            {
              validator: validatePass, trigger: 'blur'
            }
          ],
        }
      };
    },
    created(){

    },
    computed:{
      userInfo() {
        return this.$store.getters.getUserInfo || {};
      }
    },
    methods:{
      closeDialog() {
        this.$refs['form'].resetFields();
      },
      getCode() {
        this.isGet = true;
        this.$root.getCaptcha({
          mobile: this.userInfo.account
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
      },
      handleCommand(key) {
        if (key === 'loginOut') {
          this.loginOut();
        } else if (key === 'updatePassword') {
          this.updatePassword();
        } else {
          this.$router.push('/systemManage/userCenter');
        }
      },
      updatePassword() {
        this.visible = true;
      },
      handleSubmit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.loading = true;
            let obj = {...this.form};
            obj.mobile = this.userInfo.account;
            obj.password = md5(obj.password);
            obj.confirmPassword = md5(obj.confirmPassword);
            this.$root.resetPassword(obj).then(res => {
              this.loading = false;
              if (+res.code === 0) {
                this.visible = false;
                this.$alert('修改密码成功！点击确定重新登录', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push('/login');
                  }
                });
              }
            }).catch(() => {
              this.loading = false;
            })
          }
        })
      },
      //退出登录
      loginOut(){
        this.$confirm("确定退出登录吗？","提示",{
          confirmButtonText: '退出',
          cancelButtonText: '取消',
          closeOnClickModal:false,
          type:"warning"
        })
        .then(()=>{
          // 清除缓存数据
          Cookie.remove("vlsCompanyToken",{domain:""});
          localStorage.removeItem('data');
          this.$store.commit('CLEAR_USER_INFO');
          location.href = '/#/login';
          location.reload(); //刷新页面，重新实例化router，防止路由重复
        })
        .catch(()=>{})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .frame-header-box /deep/ {
    width: 100%;
    height: 40px;
    background-color:#000;
    .el-dropdown-link {
      cursor: pointer;
      span {
        display: inline-block;
        vertical-align: middle;
      }
      img {
        height: 28px;
        width: 28px;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
    // logo
    .logo-box{
      padding-left: 10px;
      /*width: 200px;*/
      height: 100%;
      .logo-name {
        height:40px;
        line-height: 40px;
        font-size:14px;
        color: #fff;
        display: inline-block;
        margin-left: 10px;
      }
    }
    .person-info{
      padding-right: 18px;
      p{
        margin: 0px 10px;
        color: #666666;
      }
      .under-line{
        margin: 0px 10px;
        text-decoration: underline;
        cursor: pointer;
        span{
          color:#409EFF;
        }
      }
      .blue-color{
        color: #409eff;
      }
    }
    .el-dialog__header{
      padding-bottom: 0;
    }
    .filterdata__searchbox-form{
      width: 500px;
    }
  }
  .el-dropdown-menu{
    background-color: #000000;
    border: 1px solid #000000;
    text-align: center;
  }
  .el-dropdown-menu__item{
    color: rgb(178, 198, 212);
  }
  .el-dropdown-menu__item:hover{
    background-color: #000000;
  }

</style>