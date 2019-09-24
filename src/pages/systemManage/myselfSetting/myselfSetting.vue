/*
*  @描述：我的设置
*  @作者：邱康松
*  @创建时间：
*/

<template>
  <div class="page-normal">
    <div class="form-content" v-loading="pageLoading">
      <el-form label-width="100px" :model="userInfo" ref="form" :rules="rules">
        <el-form-item label="昵称：">
          <el-input placeholder="" maxlength="10" v-model="userInfo.alias" disabled></el-input>
        </el-form-item>
        <el-form-item label="真实姓名：">
          <el-input placeholder="" maxlength="10" v-model="userInfo.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio v-model="userInfo.gender" :label="1" disabled>男</el-radio>
          <el-radio v-model="userInfo.gender" :label="2" disabled>女</el-radio>
        </el-form-item>
        <el-form-item label="职位：">
          <el-input placeholder="" maxlength="10" v-model="userInfo.position" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属部门：">
          <span>{{userInfo.departments.map(item => item.fullName).join('；')}}</span>
        </el-form-item>
        <!--<el-form-item>
          <el-button type="primary" style="width: 100px" @click="handleSubmit" :loading="loading" v-has="'VRES39'">保存</el-button>
        </el-form-item>-->
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'myselfSetting',
    data() {
      return {
        userInfo: {
          departments: []
        },
        loading: false,
        pageLoading: false,
        rules: {
          name: [
            { required: true, message: '昵称不能为空', trigger: 'blur' }
          ],
          alias: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData(callback) {
        this.pageLoading = true;
        this.$root.getUserInfo().then(res => {
          this.pageLoading = false;
          if (res.code === 0) {
            this.userInfo = res.data;
            callback && callback(res.data);
          }
        }).catch(() => {
          this.pageLoading = false;
        })
      },
      handleSubmit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.loading = true;
            this.$root.updateMyData({
              "id": this.userInfo.id,
              "name": this.userInfo.name,
              "alias": this.userInfo.alias,
              "position": this.userInfo.position,
              "gender": this.userInfo.gender
            }).then(res => {
              this.loading = false;
              if (res.code === 0) {
                this.$message.success('修改成功');
                this.getData((data) => {
                  let userInfo = this.$store.getters.getUserInfo;
                  userInfo.name = data.name; //修改右上角名字
                  localStorage.setItem('data',JSON.stringify(userInfo));
                  this.$store.commit('SET_USER_INFO',userInfo);
                })
              }
            }).catch(() => {
              this.loading = false;
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .form-content {
    width: 400px;
    margin-top: 10px;
  }
</style>