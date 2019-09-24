/*
*  @描述：联系人
*  @作者：邱康松
*  @创建时间：
*/
<template>
  <div>
    <column-box v-if="!isView">
      <template slot="head">
        <p>
          <span class="column__title--h4">联系人</span>
          <span class="text-danger">（委托签约人、业务联系人、商务联系人、合同收件人信息必须填写）</span>
        </p>
      </template>
      <template slot="body">
        <el-form inline label-width="100px" :model="form" :rules="rules" ref="form">
          <el-form-item label="联系人角色：" prop="role">
            <el-select v-model="form.role" :disabled="isEdit">
              <el-option v-for="item in roleList" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input placeholder="请输入" :maxlength="30" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="部门：" prop="department">
            <el-input placeholder="请输入" :maxlength="30" v-model="form.department"></el-input>
          </el-form-item>
          <el-form-item label="职位：" prop="position">
            <el-input placeholder="请输入" :maxlength="30" v-model="form.position"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input placeholder="请输入" :maxlength="11" v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="座机：" prop="plane">
            <el-input placeholder="请输入" :maxlength="30" v-model="form.plane"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input placeholder="请输入" :maxlength="30" v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="收件地址：" prop="address">
            <el-input placeholder="请输入" :maxlength="50" v-model="form.address"></el-input>
          </el-form-item><br/>
          <el-form-item style="margin: 0">
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-form-item>
        </el-form>
      </template>
    </column-box>
    <column-box no-title="" last>
      <template slot="body">
        <ztTable :table-column="tableColumn" :table-data="tableData" :pagination="false" :loading="tableLoading"></ztTable>
      </template>
    </column-box>
  </div>
</template>

<script>
  import columnBox from '@/components/zt-column-box';
  import ztTable from '@/components/zt-table';
  import { mobileReg, emailReg } from "../../../../utils";

  export default {
    name: "contact",
    props: {
      detail: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      let validateMobile = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('这是必填字段'));
        } else if (!mobileReg.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      };
      let validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('这是必填字段'));
        } else if (!emailReg.test(value)) {
          callback(new Error('请输入正确的邮箱'));
        } else {
          callback();
        }
      };
      let validatePlane = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('这是必填字段'));
        } else if (!/0\d{2,3}-\d{7,8}/.test(value)) {
          callback(new Error('请输入正确的座机号，用 - 分隔'));
        } else {
          callback();
        }
      };
      return {
        tableLoading: false,
        roleList: [],
        form: {
          carrierCode: this.$store.getters.getCarriersCode,
          role: null,
          name: '',
          department: '',
          position: '',
          phone: '',
          plane: '',
          email: '',
          address: ''
        },
        rules: {
          role: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          name: [
            { required: true, message: '这是必填字段', trigger: 'blur' }
          ],
          department: [
            { required: true, message: '这是必填字段', trigger: 'blur' }
          ],
          position: [
            { required: true, message: '这是必填字段', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '这是必填字段', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          plane: [
            { required: true, message: '这是必填字段', trigger: 'blur' },
            { validator: validatePlane, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '这是必填字段', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          address: [
            { required: true, message: '这是必填字段', trigger: 'blur' }
          ]
        },
        tableColumn: [
          { type: 'index', label: '序号' },
          { prop: 'edit', label: '操作', align: 'center',
            formatter: (row) => {
              if (this.isView) {
                return '';
              }
              // 审核通过不能删除
              if (row.workStatus !== 1) {
                return (
                  <div>
                    <el-button type="text" onClick={this.handleDelete.bind(this,row)}>删除</el-button>
                    <el-button type="text" onClick={this.handleEdit.bind(this,row)}>修改</el-button>
                  </div>
                )
              } else {
                return <el-button type="text" onClick={this.handleEdit.bind(this,row)}>修改</el-button>
              }
            }
          },
          { prop: 'role', label: '联系人角色', align: 'center' },
          { prop: 'name', label: '姓名', align: 'center' },
          { prop: 'department', label: '部门', align: 'center' },
          { prop: 'position', label: '职位', align: 'center' },
          { prop: 'phone', label: '手机号', align: 'center' },
          { prop: 'plane', label: '座机', align: 'center' },
          { prop: 'email', label: '邮箱', align: 'center' },
          { prop: 'address', label: '收件地址', align: 'center' },
          { prop: 'modifiedOn', label: '修改时间', align: 'center' }
        ],
        tableData: [],
        isEdit: false //当前状态是否是点击了修改
      }
    },
    created() {
      //获取联系人角色
      this.$root.getDictByTypes({
        types: 'LXRJS'
      }).then(res => {
        if (res.code === 0) {
          this.roleList = res.data['LXRJS'];
        }
      });
    },
    watch: {
      detail(val) {
        this.tableData = [...val];
      }
    },
    computed: {
      isView() { //是否是查看
        return !!this.$route.query.isView;
      }
    },
    methods: {
      handleSubmit() {
        return this.tableData.length === 4;
      },
      handleDelete(row) {
        this.$root.deleteLink({
          id: row.id
        }).then(res => {
          if (res.code === 0) {
            this.getList();
          }
        })
      },
      handleEdit(row) {
        for (let key in this.form) {
          this.form[key] = row[key];
        }
        this.form.id = row.id;
        this.isEdit = true;
      },
      handleSave() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.tableData.some(item => item.roleCode === this.form.role) && !this.isEdit) {
              this.$message.warning('该联系人已添加，请重新选择！');
              return false;
            }
            let url = this.isEdit ? 'updateLink' : 'addLink';
            this.$root[url](this.form).then((res) => {
              if (res.code === 0) {
                this.isEdit = false;
                delete this.form.id;
                this.$message.success('操作成功！');
                this.$refs['form'].resetFields();
                this.getList();
              }
            })
          }
        })
      },
      getList() {
        this.tableLoading = true;
        this.$root.getLinkList({
          carrierCode: this.$store.getters.getCarriersCode
        }).then(res => {
          this.tableLoading = false;
          if (res.code === 0) {
            this.tableData = res.data || [];
          }
        }).catch(() => {
          this.tableLoading = false;
        })
      }
    },
    components: {
      columnBox,
      ztTable
    }
  }
</script>

<style scoped>
  .el-select, .el-input {
    width: 200px;
  }
</style>