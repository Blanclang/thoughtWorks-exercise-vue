/*
*  @描述：成员设置
*  @作者：邱康松
*  @创建时间：2019/2/28
*/

<template>
  <div class="page-normal member-manage">
    <column-box no-title="">
      <template slot="body">
        <el-button size="small" type="primary" @click="visible=true" v-has="'VRES30'"><i class="el-icon-plus"></i>添加成员</el-button>
      </template>
    </column-box>
    <column-box no-title="" last>
      <template slot="body">
        <div class="user-group-block">
          <h3 class="setting-block-title">角色</h3>
          <ul class="member-wrapper">
            <li
              v-for="item in roleList"
              :key="item.code"
              :class="form.roleCode===item.code?'current':''">
              <span @click="changeRole(item.code)">{{item.name}}{{+item.type !== 0 ? '(系统分组)' : ''}}</span>
            </li>
          </ul>
        </div>
        <zt-table :table-column="tableColumn" :table-data="tableData" v-loading="tableLoading"></zt-table>
      </template>
    </column-box>

    <el-dialog title="添加成员" :visible.sync="visible" width="500px" @close="selectList=[]">
      <el-select
              :loading="searchLoading"
              v-model="selectList"
              multiple
              filterable
              remote
              :remote-method="getWxUser"
              placeholder="请输入公司已有成员的真实姓名" style="width: 100%">
        <el-option
                v-for="item in wxUserList"
                :key="item.userId"
                :label="item.name"
                :value="item.userId">
          <div class="user-item">
            <img :src="item.avatar || normalIcon" />
            <div class="user-detail">
              <span>{{item.name}}</span>
              <span>{{item.departmentFullName}}</span>
            </div>
          </div>
        </el-option>
      </el-select>
      <span slot="footer">
        <p style="float: left;">被邀请者还没加入公司？先请<span class="text-danger">公司管理员</span>添加吧</p>
        <el-button @click="visible=false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="addUser" :disabled="selectList.length===0" :loading="loading">导入成员</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import columnBox from '../../../components/zt-column-box';
  import ztTable from '../../../components/zt-table';
  import normalIcon from '@/assets/images/user.png';
  export default {
    name: 'memberManage',
    data() {
      return {
        normalIcon,
        tableData: [],
        searchLoading: false,
        form: {
          companyCode: this.$store.getters.getCompanyCode,
          roleCode: ''
        },
        roleList: [],
        wxUserList: [],
        selectList: [],
        visible: false,
        loading: false,
        tableLoading: false,
        tableColumn: [
          {
            type: 'index',
            label: '序号'
          },
          {
            label: '成员昵称',
            prop: 'alias',
            width: 150,
            formatter: (row) => {
              return (
                  <div class="user-icon">
                    <img src={row.avatar || this.normalIcon} />
                    <span>{row.alias || row.name}</span>
                  </div>
              )
            }
          },
          /*{
            label: '企业微信',
            prop: 'a2',
            align: 'center'
          },*/
          {
            label: '真实姓名',
            prop: 'name',
          },
          {
            label: '部门',
            prop: 'departments',
            formatter: (row) => {
              return this.formatDepartment(row.departments);
            }

          },
          {
            label: '性别',
            prop: 'gender',
            formatter: (row) => {
              return row.gender === 1 ? '男' : '女'
            }
          },
          {
            label: '职位',
            prop: 'position',
          },
          {
            label: '邮箱',
            prop: 'email',
          },
          {
            label: '角色',
            prop: 'roleName',
          },
          /*{
            label: '状态',
            prop: 'a9',
          },*/
          {
            label: '操作',
            prop: 'a10',
            formatter: (row) => {
              // 如果是超级管理员或者是当前登录的人，就不能移除
              return (
                <el-button type="text" onClick={this.removeMember.bind(this,row)} disabled={row.isAdmin || row.code===this.myUserCode} v-has="VRES29">移出</el-button>
              )
            }
          },
        ]
      }
    },
    created() {
      this.getList();
      this.getRoleList();
    },
    computed: {
      myUserCode() {
        return this.$store.getters.getUserCode
      }
    },
    methods: {
      addUser() {
        this.loading = true;
        this.$root.addUser({
          companyCode: this.$store.getters.getCompanyCode,
          userIds: this.selectList
        }).then(res => {
          this.loading = false;
          if (res.code === 0) {
            this.$message.success('添加成功');
            this.visible = false;
            this.getList();
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      getWxUser(value) {
        if (value !== '' && value.length > 1) {
          this.searchLoading = true;
          this.$root.getWxUserList({
            companyCode: this.$store.getters.getCompanyCode,
            name: value
          }).then(res => {
            this.searchLoading = false;
            if (res.code === 0) {
              this.wxUserList = res.data || [];
            }
          }).catch(() => {
            this.searchLoading = false;
          })
        } else {
          this.wxUserList = [];
        }
      },
      getRoleList() {
        this.$root.getRoleList({
          companyCode: this.$store.getters.getCompanyCode
        }).then(res => {
          if (res.code === 0) {
            this.roleList = res.data || [];
            this.roleList.unshift({
              type: 0,
              code: '',
              name: '所有'
            })
          }
        })
      },
      getList() {
        this.tableLoading = true;
        this.$root.getUserList(this.form).then(res => {
          this.tableLoading = false;
          if (res.code === 0) {
            this.tableData = res.data || []
          }
        }).catch(() => {
          this.tableLoading = false;
        })
      },
      changeRole(code) {
        this.form.roleCode = code;
        this.getList();
      },
      removeMember(data) {
        this.$confirm(`确定移出${data.name}？`,'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$root.removeUser({
            "companyCode": this.$store.getters.getCompanyCode,
            "userCode": data.code
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('移出成功');
              this.getList();
            }
          })
        })
      },
      formatDepartment(list) {
        return list.map(item => item.fullName).join(';');
      },
    },
    components: {
      columnBox,
      ztTable
    }
  }
</script>

<style scoped lang="scss">
  .el-select-dropdown__item {
    height: auto;
    padding: 5px 20px;
    line-height: normal;
    &+.el-select-dropdown__item {
      border-top: 1px solid #efefef;
    }
  }
  .user-item /deep/ {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img {
      height: 40px;
      width: 40px;
      border-radius: 50%;
    }
    .user-detail {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      span:first-child {
        font-weight: bold;
      }
      span:last-child {
        color: #9e9e9e;
        font-size: 12px;
      }
    }
  }
  .member-manage /deep/ {
    .el-dialog__body {
      min-height: 280px;
    }
    .user-icon {
      img {
        height: 28px;
        width: 28px;
        border-radius: 50%;
        vertical-align: middle;
      }
      span {
        display: inline-block;
        margin-left: 10px;
      }
    }
  }
  .user-group-block {
    position: relative;
    margin-bottom: 20px;
    background: #fafafa;
    padding: 10px;
    padding-top: 20px;
    border-radius: 4px;
    border: 1px solid #f3f3f3;
    .setting-block-title {
      font-size: 13px;
      font-weight: 400;
      color: #666;
      padding-bottom: 5px;
    }
    .member-wrapper {
      min-width: 540px;
      max-width: 70%;
      margin-left: 63px;
      margin-top: -30px;
      margin-bottom: 1px;
      overflow: hidden;
      li {
        display: inline-block;
        font-size: 14px;
        width: auto;
        min-width: 80px;
        margin: 4px 45px 4px 0;
        &.current span {
          color: #4f8ff5;
          font-size: 14px;
          font-weight: 400;
          background-color: #e1eaf8;
        }
        span {
          &:hover {
            background-color: #e1eaf8;
          }
          cursor: pointer;
          color: #4d7db7;
          display: inline-block;
          width: auto;
          height: 28px;
          padding-left: 10px;
          padding-right: 10px;
          line-height: 28px;
          border-radius: 2px;
        }
      }
    }
  }
</style>