/*
*  @描述：用户组权限
*  @作者：邱康松
*  @创建时间：2019/2/28
*/

<template>
  <div class="page-normal group-auth" @mouseup="hideMenu">
    <!--左侧区域-->
    <div class="left">
      <div class="role-title">角色</div>
      <div class="role-content webkit-scrollbar">
        <ul class="role-list-ul">
          <li v-for="item in roleList" :key="item.code" :class="roleCode === item.code ? 'current' : ''" @click="changeRole(item)">
            <p>{{item.name}}{{item.type !== 0 ? '（系统分组）' : ''}}</p>
            <span class="setting-btn" v-if="item.type === 0" @click.stop="showMenu($event,item)">
              <i class="el-icon-more"></i>
            </span>
            <!--<span class="setting-btn" @click.stop="removeRole($event,item)" v-if="item.type === 0" v-has="'VARES68'"><i class="el-icon-close"></i></span>-->
          </li>
        </ul>
        <el-button type="text" class="add-role" v-show="!showAddBox" @click="showAddBox=true" v-has="'VRES33'"><i class="el-icon-plus"></i>添加角色</el-button>
        <div class="add-role-card" v-show="showAddBox">
          <el-input type="textarea" placeholder="请输入角色名称" maxlength="10" v-model="roleName"></el-input>
          <el-button size="mini" type="primary" @click="addRole" :loading="addLoading">确定</el-button>
          <el-button size="mini" @click="showAddBox=false">取消</el-button>
        </div>
      </div>
    </div>

    <!--右侧区域-->
    <div class="right webkit-scrollbar" v-loading="pageLoading">
      <div class="member-div">
        <div class="title-count">
          <div>
            <b>角色成员</b>
            <span>·</span>
            <span class="count-digital">{{roleDetail.users && roleDetail.users.length || 0}}</span>
          </div>
          <div class="add-btn">
            <el-button type="text" @click="visible=true" v-has="'VRES36'">
              <i class="el-icon-plus"></i>添加成员
            </el-button>
          </div>
        </div>
        <div class="members-wrap">
          <!--没添加成员-->
          <div class="no-member-wrap" v-if="roleDetail.users && roleDetail.users.length === 0">
            <div class="no-member">
              <div class="pic">
                <img src="../../../assets/images/no-member.png" alt="">
              </div>
              <div class="text-tip">
                该角色还没有成员，赶紧<el-button type="text" @click="visible=true" v-has="'VRES36'">添加</el-button>吧
              </div>
            </div>
          </div>
          <!--end-->
          <div class="members-list-container webkit-scrollbar" v-else>
            <ul>
              <li v-for="item in (roleDetail.users || [])" :key="item.code" :title="(item.alias || item.name)+'（'+item.name+'）'">
                <img :src="item.avatar || userIcon"/>
                {{item.alias || item.name}}({{item.name}})
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="permission-title">
        {{activeRoleName}}
        <span class="auth-tip" v-show="!isNormal">（修改权限后重新登录生效）</span>
      </div>
      <div class="tree-box">
        <div class="tree-title">
          <div>选择权限</div>
          <div>
            <el-button size="mini" type="primary" :loading="loading" @click="updateAuth" v-if="!isNormal" v-has="'VRES37'">保存</el-button>
          </div>
        </div>
        <div class="tree-content">
          <el-tree
            ref="tree"
            @check="checkChange"
            default-expand-all
            :default-checked-keys="checkResource"
            node-key="idCode"
            :props="props"
            :data="roleDetail.resources || []"
            show-checkbox>
          </el-tree>
        </div>
      </div>
    </div>

    <!--角色操作下拉菜单-->
    <ul class="el-dropdown-menu menu-box" ref="menuBox">
      <li class="el-dropdown-menu__item" @click="isShowMenu=true" v-if="hasAuth('VRES35')">重命名</li>
      <li class="el-dropdown-menu__item" @click="removeRole(clickMenuData)" v-if="hasAuth('VRES34')">删除</li>
    </ul>

    <!--重命名弹窗-->
    <el-dialog title="重命名" :visible.sync="isShowMenu" width="300px" :modal="false" top="30vh" :show-close="false">
      <el-input v-model="clickMenuData.name" maxlength="10" placeholder="请输入"></el-input>
      <span slot="footer">
        <el-button type="primary" @click="handleRename">确定</el-button>
        <el-button @click="isShowMenu=false">取消</el-button>
      </span>
    </el-dialog>
    <!--编辑成员弹窗-->
    <el-dialog title="添加成员" :visible.sync="visible" class="add-member">
      <h3 class="tip-title">勾选即给该角色添加成员，添加后，该成员之前的角色自动移除</h3>
      <div class="content">
        <el-input placeholder="请输入已有成员的真实姓名" v-model="searchUserName" @input="searchUser" clearable></el-input>
        <div class="user-box webkit-scrollbar">
          <ul class="user-list" v-if="visible">
            <li v-if="userList.length===0" class="no-data">暂无数据</li>
            <li v-for="item in userList" :key="item.code">
              <div>
                <img :src="item.avatar || userIcon" style="border-radius: 50%"/>
                <span>{{item.alias || item.name}}({{item.name}})</span>
              </div>
              <el-checkbox
                      :checked="selectList.indexOf(item.code) !== -1"
                      :disabled="isAddUserList.indexOf(item.code) !== -1"
                      :true-label="JSON.stringify({code:item.code,check:true})"
                      :false-label="JSON.stringify({code:item.code,check:false})"
                      @change="changeSelect">
              </el-checkbox>
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer">
        <el-button size="small" @click="visible=false">取消</el-button>
        <el-button size="small" type="primary" @click="handleUpdateUser" :loading="loading">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import userIcon from '../../../assets/images/user.png';
  import hasAuth from '@/utils/directive';
  export default {
    name: 'userGroupAuth',
    data() {
      return {
        userIcon,
        hasAuth,
        isShowMenu: false,
        clickMenuData: {}, //点击修改的角色数据
        addLoading: false,
        checkResource: [], //存在权限的资源
        unCheckResource: [], //没有权限的资源
        searchUserName: '',
        isNormal: false, //当前选择的角色是否是系统预设的管理员
        activeRoleName: '', //当前选择的角色名称
        roleName: '', //新增角色名称
        visible: false,
        selectList: [],
        roleList: [],
        roleCode: '', //当前选择的角色
        showAddBox: false,
        props: {
          children: 'children',
          label: 'name',
          disabled: 'null'
        },
        loading: false,
        roleDetail: {},
        pageLoading: false,
        userList: [], //添加成员弹窗列表
        userList_bak: [] //保存成员列表
      }
    },
    created() {
      this.getRoleList();
    },
    computed: {
      isAddUserList() { //当前角色已经添加的成员
        return this.roleDetail.users && this.roleDetail.users.map(item => item.code) || [];
      }
    },
    watch: {
      visible(val) {
        if (val) {
          this.getUserList();
          this.selectList = [...this.isAddUserList];
        }
      },
      showAddBox(val) {
        if (!val) {
          this.roleName = '';
        }
      },
      isNormal(val) {
        if (val) { //如果是系统分组，默认禁止修改
          this.props.disabled = 'idCode'
        } else {
          this.props.disabled = 'null'
        }
      }
    },
    methods: {
      handleRename() {
        if (!this.clickMenuData.name) {
          this.$message.warning('请输入角色名！');
          return false;
        }
        this.$root.renameRole({
          "companyCode": this.$store.getters.getCompanyCode,
          "code": this.clickMenuData.code,
          "name": this.clickMenuData.name
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('重命名成功！');
            this.isShowMenu = false;
            this.getRoleList('rename');
          }
        })
      },
      hideMenu(event) {
        if (event.button === 0) { //鼠标左键
          this.$refs['menuBox'].style.display = 'none';
        }
      },
      showMenu(e,data) {
        this.$refs['menuBox'].style.display = 'block';
        this.$refs['menuBox'].style.top = e.currentTarget.getBoundingClientRect().top + 15 + 'px';
        this.$refs['menuBox'].style.left = e.currentTarget.getBoundingClientRect().left + 'px';
        this.clickMenuData = {...data};
      },
      //实现需求：如果勾选的是非查询按钮，即把查询勾选上，如果取消勾选查询按钮，即把同级按钮也取消勾选
      checkChange(data) {
        //判断是否勾选的是最后一级
        if (data.children && data.children.length > 0) {
          return false;
        }
        let checkNode = this.$refs['tree'].getNode(data.idCode);
        if (data.name === '查询') {
          if (!checkNode.checked) {
            //找出与查询同级选项的key
            let keys = checkNode.parent.data.children.map(item => item.idCode);
            //如果取消勾选查询，即同级也取消勾选
            keys.forEach(item => {
              this.$refs['tree'].setChecked(item,false);
            });
          }
        } else {
          //如果勾选的是其他按钮，即默认把查询也勾选上，因为必须有查询权限，其他按钮才会有效果
          if (checkNode.checked) {
            let searchNode = checkNode.parent.data.children.find(item => item.name === '查询');
            this.$refs['tree'].setChecked(searchNode,true);
          }
        }
      },
      updateAuth() {
        //获取选中状态和半选状态的资源
        let codeList = (this.$refs['tree'].getCheckedKeys()).concat(this.$refs['tree'].getHalfCheckedKeys());
        this.loading = true;
        this.$root.updateRoleAuth({
          code: this.roleCode,
          resources: codeList
        }).then(res => {
          this.loading = false;
          if (res.code === 0) {
            this.$message.success('更新成功');
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      searchUser(value) {
        if (value === '') {
          this.userList = [...this.userList_bak];
        } else {
          this.userList = this.userList_bak.filter(item => item.name.match(value) || item.alias.match(value))
        }
      },
      handleUpdateUser() { //添加成员
        if (this.selectList.length === 0) {
          this.$message.warning('请先勾选成员');
          return false;
        }
        this.loading = true;
        this.$root.updateUserRole({
          code: this.roleCode,
          userCodes: this.selectList
        }).then(res => {
          this.loading = false;
          if (res.code === 0) {
            this.$message.success('添加成功');
            this.visible = false;
            this.getRoleDetail();
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      getUserList() { //添加成员弹窗获取成员列表
        this.$root.getUserList({
          companyCode: this.$store.getters.getCompanyCode
        }).then(res => {
          if (res.code === 0) {
            this.userList = (res.data || []).filter(item => !item.isAdmin); //如果是超级管理员。就不显示
            this.userList_bak = [...this.userList];
          }
        })
      },
      addRole() {
        if (!this.roleName) {
          this.$message.warning('角色名称不能为空');
          return false;
        }
        this.addLoading = true;
        this.$root.addRole({
          companyCode: this.$store.getters.getCompanyCode,
          name: this.roleName,
          resources: []
        }).then(res => {
          this.addLoading = false;
          if (res.code === 0) {
            this.showAddBox = false;
            this.$message.success('添加成功');
            this.getRoleList('add');
          }
        }).catch(() => {
          this.addLoading = false;
        })
      },
      changeRole(data) {
        this.roleCode = data.code;
        this.activeRoleName = data.name;
        this.isNormal = data.type === 1;
        this.getRoleDetail();
      },
      getRoleDetail() {
        this.pageLoading = true;
        this.$root.getRoleDetail({
          companyCode: this.$store.getters.getCompanyCode,
          code: this.roleCode
        }).then(res => {
          this.pageLoading = false;
          if (res.code === 0) {
            this.roleDetail = res.data || {};
            this.getCheckId();
            this.$nextTick(() => {
              //把没有权限的资源取消勾选，防止父子联动的功能导致没有权限的子元素也勾选上了
              this.unCheckResource.forEach(item => {
                this.$refs['tree'].setChecked(item,false);
              })
            });
          }
        }).catch(() => {
          this.pageLoading = false;
        })
      },
      getCheckId() {
        let arr = this.roleDetail.resources || [];
        let self = this;
        self.checkResource = [];
        self.unCheckResource = [];
        (function f(list) {
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (item.isChecked) {
              self.checkResource.push(item.idCode);
            } else {
              self.unCheckResource.push(item.idCode);
            }
            if (item.children && item.children.length > 0) {
              f(item.children);
            }
          }
        })(arr);
      },
      getRoleList(type) {
        this.$root.getRoleList({
          companyCode: this.$store.getters.getCompanyCode
        }).then(res => {
          if (res.code === 0) {
            this.roleList = res.data || [];
            if (type === 'add') {
              // 如果是新增角色，默认显示最新的那个角色详情
              let data = res.data && res.data[res.data.length - 1] || {};
              this.roleCode = data.code;
              this.activeRoleName = data.name;
              this.isNormal = data.type === 1;
              this.getRoleDetail();
            } else if (type === 'delete') {
              let flag = this.roleList.some(item => item.code === this.roleCode);
              //如果删除的角色是当前选中的角色，删除后默认选中第一个角色，否则不做操作
              if (!flag) {
                let data = res.data && res.data[0] || {};
                this.roleCode = data.code;
                this.activeRoleName = data.name;
                this.isNormal = data.type === 1;
                this.getRoleDetail();
              }
            } else if (type === 'rename') {
              // nothing
            } else {
              let data = res.data && res.data[0] || {};
              this.roleCode = data.code;
              this.activeRoleName = data.name;
              this.isNormal = data.type === 1;
              this.getRoleDetail();
            }
          }
        })
      },
      removeRole(data) {
        this.$confirm(`确定删除角色 “${data.name}”？`, '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$root.deleteRole({
            code: data.code,
            companyCode: this.$store.getters.getCompanyCode
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('删除成功');
              this.getRoleList('delete');
            }
          })
        }).catch(() => {})
      },
      changeSelect(data) {
        data = JSON.parse(data);
        if (data.check) {
          this.selectList.push(data.code)
        } else {
          this.selectList.splice(this.selectList.indexOf(data.code),1);
        }
      }
    },
  }
</script>
<style>


</style>

<style scoped lang="scss">
  .group-auth /deep/ {
    display: flex;
    height: 100%;
    padding-left: 0 !important;
    padding-bottom: 0 !important;
    .menu-box {
      display: none;
      z-index: 2001;
      padding: 5px 0 !important;
      position: fixed !important;
      .el-dropdown-menu__item {
        font-size: 12px;
        line-height: 23px;
        padding: 0 10px;
      }
    }
    .auth-tip {
      font-size: 12px;
      color: #999;
      font-weight: normal;
    }
    .left {
      width: 220px;
      background-color: #f9f9f9;
      height: 100%;
      border-right: #e5e5e5 1px solid;
      border-top: #e5e5e5 1px solid;
      .role-title {
        padding-left: 20px;
        height: 56px;
        line-height: 56px;
        font-size: 14px;
        color: #999;
      }
      .role-content {
        overflow-y: auto;
        height: calc(100% - 56px);
        .setting-btn {
          display: none;
          position: absolute;
          right: 5px;
          top: 19px;
          i {
            font-size: 18px;
            font-weight: bold;
          }
          &:hover {
            color: #409EFF;
          }
        }
      }
      .role-list-ul li {
        padding-left: 20px;
        position: relative;
        display: block;
        height: 56px;
        color: #666;
        border-top: 1px solid #ececec;
        cursor: pointer;
        &:hover {
          background-color: #ffffff;
          .setting-btn {
            display: block;
          }
        }
        &.current {
          background-color: #ffffff;
          p {
            color: #409EFF;
          }
        }
        p {
          line-height: 56px;
          width: 150px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #666;
          font-size: 14px;
        }
      }
      .add-role {
        display: block;
        width: 100%;
        border-top: 1px solid #ececec;
        border-bottom: 1px solid #ececec;
      }
      .add-role-card {
        position: relative;
        background-color: #fff;
        text-align: center;
        padding: 10px;
        border-top: 1px solid #ececec;
        border-bottom: 1px solid #ececec;
        .el-textarea {
          margin-bottom: 10px;
          display: block;
        }
      }
    }
    .right {
      flex: 1;
      margin-left: 15px;
      overflow-y: auto;
      .title-count > div {
        float: left;
        line-height: 40px;

        &:last-child {
          margin-left: 30px;
        }
      }

      .count-digital {
        font-size: 12px;
        color: #8091a5;
      }
      .members-wrap {
        padding: 20px 15px;
        background: #f8f8f8;
        clear: both;
        .no-member-wrap {
          text-align: center;
          .no-member {
            display: inline-block;
            .pic {
              float: left;
              margin-right: 10px;
            }
            .text-tip {
              height: 45px;
              line-height: 45px;
              float: left;
            }
          }
        }
        .members-list-container {
          max-height: 300px;
          overflow-y: auto;
        }
        li {
          float: left;
          margin-right: 12px;
          margin-bottom: 12px;
          width: 140px;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          img {
            height: 20px;
            width: 20px;
            border-radius: 50%;
          }
        }
      }
      .permission-title {
        font-weight: bold;
        height: 20px;
        line-height: 25px;
        margin-top: 20px;
      }
      .tree-box {
        border: 1px solid #EAEEFB;
        margin-top: 15px;
        .tree-title {
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          background-color: #F3F6FC;
          overflow: hidden;
          div {
            line-height: 50px;
            &:first-child {
              font-weight: bold;
            }
          }
        }
        .tree-content {
          max-height: 520px;
          overflow: auto;
        }
      }
    }
    .add-member {
      .tip-title {
        margin-bottom: 10px;
      }
      .user-box {
        border: 1px solid #e0e0e0;
        margin-top: 5px;
        padding: 10px;
        max-height: 500px;
        overflow-y: auto;
      }
      .user-list {
        li {
          line-height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          &.no-data {
            justify-content: center;
          }
          &:hover:not(.no-data) {
            background-color: #f3f3f3;
          }
          img {
            height: 26px;
            width: 26px;
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>