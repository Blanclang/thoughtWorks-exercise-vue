/*
*  @描述：首页
*  @作者：邱康松
*  @创建时间：2019/2/27
*/

<template>
  <div class="page-normal">
    <div class="home">
      <div class="left">
        <div class="top-box">
          <div class="user-icon">
            <img :src="userInfo.avatar || normalIcon" alt="">
          </div>
          <div class="tip">
            <p>{{userInfo.name}}，{{text}}</p>
            <p>
              <span>{{userInfo.departments && userInfo.departments[0].fullName}}</span>
              <span>{{new Date().Format('yyyy年M月d日')}} 星期{{"日一二三四五六".charAt(new Date().getDay())}}</span>
            </p>
          </div>
        </div>
        <div class="content">
          <div class="main-box">
            <div class="title-box">
              <div class="title">待办事项</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="top-box">
          <div class="item">
            <span>个人访问次数</span>
            <span>{{loginData.personVisitsCount || 0}}</span>
          </div>
          <div class="item">
            <span>团队内排名</span>
            <span>
              <b>{{loginData.teamRanking || 0}}</b>
              <b style="font-size: 16px;color: #9B9B9B">/{{loginData.teamTotal || 0}}</b>
            </span>
          </div>
          <div class="item">
            <span>团队总访问次数</span>
            <span>{{loginData.teamTotalVisitsCount || 0}}</span>
          </div>
        </div>
        <div class="main-box">
          <div class="title-box">
            <div class="title">便捷导航</div>
            <el-button type="text" icon="el-icon-edit" style="padding: 0" @click="handleEdit">编辑</el-button>
          </div>
          <div class="content-box">
            <p style="text-align: center" v-if="navList.length === 0">暂未添加便捷导航</p>
            <template v-else>
              <router-link :to="{name: item.url}" class="link" tag="div" v-for="item in navList" :key="item.idCode">
                <a>{{item.name}}</a>
                <i class="el-icon-close" @click.stop="deleteTag(item)"></i>
              </router-link>
            </template>
          </div>
        </div>
        <div class="main-box">
          <div class="title-box">
            <div class="title">团队</div>
          </div>
          <div class="content-box">
            <p style="text-align: center" v-if="teamList.length === 0">暂无团队</p>
            <template v-else>
              <div class="team-item" v-for="item in teamList" :key="item.id">
                <img :src="getImg(item.name)" alt="">
                <span class="team-name" :title="item.name">{{item.name}}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!--编辑弹窗-->
    <el-dialog title="编辑便捷导航" :visible.sync="visible" width="350px">
      <div class="tree-box">
        <p>选择导航</p>
        <div class="tree">
          <el-tree
                  ref="tree"
                  check-strictly
                  default-expand-all
                  :default-checked-keys="checkResource"
                  node-key="idCode"
                  :props="props"
                  :data="formatTree(userInfo.resources || [])"
                  show-checkbox>
          </el-tree>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="visible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import teamPlan from '../../assets/images/team-plan.png';
  import teamService from '../../assets/images/team-service.png';
  import teamQuality from '../../assets/images/team-quality.png';
  import teamScene from '../../assets/images/team-scene.png';
  import teamFinance from '../../assets/images/team-finance.png';
  import teamAny from '../../assets/images/team-any.png';
  import normalIcon from '../../assets/images/user.png';
  export default {
    name: 'home',
    data() {
      return {
        normalIcon,
        checkResource: [], //已经勾选的资源
        props: {
          children: 'children',
          label: 'name',
          disabled: function (data) {
            return data.resType === 'PM';
          }
        },
        imgObj: {
          '计划组': teamPlan,
          '客服组': teamService,
          '品质组': teamQuality,
          '现场组': teamScene,
          '财务组': teamFinance
        },
        navList: [],
        teamList: [],
        visible: false,
        text: '',
        loginData: {}
      }
    },
    created() {
      this.getText();
      this.getTeamList();
      this.getNavList();
      this.getLoginNum();
    },
    computed: {
      userInfo() {
        return this.$store.getters.getUserInfo;
      },
    },
    methods: {
      handleSubmit() {
        let codeList = this.$refs['tree'].getCheckedKeys();
        if (codeList.length === 0) {
          this.$message.warning('请选选择一条导航');
          return false
        }
        this.$root.addFastNav({
          resources: codeList
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('操作成功！');
            this.visible = false;
            this.getNavList();
          }
        })
      },
      //获取团队列表
      getTeamList() {
        this.$root.getTeamList().then(res => {
          if (res.code === 0) {
            this.teamList = res.data || [];
          }
        })
      },
      // 获取已添加的便捷导航
      getNavList() {
        this.$root.getFastNavList().then(res => {
          if (res.code === 0) {
            this.navList = res.data || [];
            this.checkResource = res.data.map(item => item.idCode);
          }
        })
      },
      // 获取登录次数信息
      getLoginNum() {
        this.$root.getLoginInfo().then(res => {
          if (res.code === 0) {
            this.loginData = res.data || {};
          }
        })
      },
      formatTree(list) {
        let newList = JSON.parse(JSON.stringify(list));
        function format(arr) {
          arr.forEach((item,index) => {
            if (item.children && item.children.length > 0) {
              // 去除按钮的权限
              if (item.children[0].resType !== 'M' && item.children[0].resType !== 'PM') {
                item.children = [];
              } else {
                format(item.children);
              }
            }
          })
        }
        format(newList);
        return newList;
      },
      getText() { //获取问候语
        let hour = new Date().getHours();
        if (hour < 10) {
          this.text = '早安，祝你开心每一天！';
        } else if (hour < 14) {
          this.text = '加油，汗水汇聚你我，创新铸就明天。';
        } else if (hour < 17) {
          this.text = '中午养足了精神吗？打起精神，还有半天就可以下班了。';
        } else {
          this.text = '累了不要硬撑，站起来，伸展一下身体，放松放松。';
        }
      },
      handleEdit() {
        this.visible = true;
      },
      getImg(id) {
        return this.imgObj[id] || teamAny;
      },
      deleteTag(data) {
        let list = [...this.navList];
        list.splice(list.findIndex(item => item.idCode === data.idCode), 1);
        this.$root.addFastNav({
          resources: list.map(item => item.idCode)
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('操作成功！');
            this.getNavList();
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .home {
    display: flex;
    justify-content: space-between;
  }
  .main-box {
    &+.main-box {
      border-top: 1px solid #EFEFF4;
    }
    padding-right: 10px;
    padding-bottom: 50px;
    .title-box {
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
      .title {
        border-left: 4px solid #409EFF;
        padding-left: 5px;
        font-weight: bold;
      }
    }
  }
  .left {
    flex: 2;
    padding-left: 20px;
    .top-box {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-bottom: 1px solid #EFEFF4;
      box-sizing: border-box;
      .user-icon {
        margin-right: 20px;
        img {
          height: 60px;
          width: 60px;
          border-radius: 50%;
        }
      }
      .tip {
        height: 60px;
        position: relative;
        width: 100%;
        p:first-child {
          font-size: 16px;
          font-weight: bold;
          color: #000000;
          line-height: 21px;
          position: absolute;
          top: 5px;
          left: 0;
        }
        p:last-child {
          position: absolute;
          bottom: 5px;
          left: 0;
          color: #9B9B9B;
          span {
            display: inline-block;
            margin-right: 30px;
          }
        }
      }
    }
  }
  .right {
    margin-left: 60px;
    flex: 1;
    min-width: 350px;
    .top-box {
      height: 100px;
      box-sizing: border-box;
      border-bottom: 1px solid #EFEFF4;
      display: flex;
      align-items: center;
      .item {
        flex: 1;
        &+.item {
          border-left: 1px solid #EFEFF4;
          padding-left: 10px;
        }
        span {
          display: block;
          &:first-child {
            color: #4A4A4A;
          }
          &:last-child {
            font-size: 24px;
            color: #000000;
            font-weight: bold;
            margin-top: 15px;
          }
        }
      }
    }
    .main-box {
      .link {
        display: inline-block;
        margin-right: 15px;
        margin-bottom: 10px;
        i {
          display: inline-block;
          visibility: hidden;
          margin-left: 5px;
          cursor: pointer;
        }
        &:hover {
          color: #409EFF;
          text-decoration: underline;
          i {
            visibility: visible;
          }
        }
      }
      .team-item {
        display: inline-block;
        width: calc(33% - 9px);
        background-color: #F6F9FD;
        line-height: 40px;
        height: 40px;
        margin-right: 15px;
        margin-bottom: 10px;
        padding: 0 10px;
        .team-name {
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: calc(100% - 35px);
          white-space: nowrap;
          display: inline-block;
        }
        &:nth-child(3n+3) {
          margin-right: 0;
        }
        img {
          margin-top: 9px;
          display: inline-block;
          margin-right: 5px;
        }
      }
    }
  }
  .tree-box {
    border: 1px solid #EBEEF5;
    p {
      line-height: 40px;
      background-color: #EBEEF5;
      padding-left: 10px;
      font-size: 14px;
      font-weight: bold;
    }
    .tree /deep/ {
      overflow-y: auto;
      height: 400px;
      .el-tree-node__label {
        font-size: 12px;
      }
    }
  }
</style>