/*
*  @描述：基本信息
*  @作者：邱康松
*  @创建时间：
*/
<template>
  <div>
    <column-box title="基本信息" class="form-item-box">
      <template slot="body">
        <el-form label-width="170px" inline :model="form" :rules="rules" ref="firstForm">
          <el-form-item label="承运商编码：">
            <span>{{$store.getters.getCompanyInfo.carriersCode}}</span>
          </el-form-item>
          <el-form-item label="承运商全称：">
            <span>{{$store.getters.getCompanyInfo.name}}</span>
          </el-form-item>
          <el-form-item label="承运商简称：">
            <span>{{$store.getters.getCompanyInfo.abbreviation}}</span>
          </el-form-item><br/>
          <el-form-item label="结算主体：" prop="companySettlement">
            <el-input v-model="form.companySettlement" :disabled="isView"></el-input>
          </el-form-item>
          <el-form-item label="统一社会信用代码：" prop="unifiedSocialCreditCode">
            <el-input v-model="form.unifiedSocialCreditCode" placeholder="请输入" maxlength="30" :disabled="isView"></el-input>
          </el-form-item>
          <el-form-item label="法人姓名：" prop="businessEntity">
            <el-input v-model="form.businessEntity" placeholder="请输入" maxlength="10" :disabled="isView"></el-input>
          </el-form-item>
          <el-form-item label="法人身份证号：" prop="businessEntityIdentity">
            <el-input v-model="form.businessEntityIdentity" placeholder="请输入" maxlength="18" :disabled="isView"></el-input>
          </el-form-item>
          <el-form-item label="注册地址：" prop="registerAddress">
            <el-input v-model="form.registerAddress" placeholder="请输入" maxlength="30" :disabled="isView"></el-input>
          </el-form-item>
          <el-form-item label="注册资金（元）：" prop="registerCapital">
            <moneyInput v-model="form.registerCapital" :disabled="isView"></moneyInput>
          </el-form-item>
          <el-form-item label="固定资产（元）：" prop="fixedAssets">
            <moneyInput v-model="form.fixedAssets" :disabled="isView"></moneyInput>
          </el-form-item>
          <el-form-item label="邮政编码：" prop="zipCode">
            <el-input v-model="form.zipCode" placeholder="请输入" maxlength="6" :disabled="isView"></el-input>
          </el-form-item>
          <el-form-item label="成立日期：" prop="registerDate">
            <el-date-picker type="date" value-format="yyyy-MM-dd hh:MM:ss" placeholder="选择日期" v-model="form.registerDate" :disabled="isView"></el-date-picker>
          </el-form-item>
          <el-form-item label="开户银行：" prop="bankName">
            <el-input v-model="form.bankName" placeholder="请输入" maxlength="18" :disabled="isView"></el-input>
          </el-form-item>
          <el-form-item label="银行账户：" prop="bankAccount">
            <el-input v-model="form.bankAccount" placeholder="请输入" maxlength="30" :disabled="isView"></el-input>
          </el-form-item>
          <el-form-item label="保险公司：" prop="insuranceType">
            <el-select v-model="form.insuranceType" :disabled="isView">
              <el-option v-for="item in bxList" :key="item.id" :value="item.code"
                         :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司总人数：" prop="companyScale">
            <el-input v-model="form.companyScale" placeholder="请输入" maxlength="5" :disabled="isView"></el-input>
          </el-form-item>
          <el-form-item label="管理人员人数：" prop="companyManagementScale">
            <el-input v-model="form.companyManagementScale" placeholder="请输入" maxlength="5" :disabled="isView"></el-input>
          </el-form-item><br/>
          <el-form-item label="营业期限：" prop="operatePeriodStart">
            <datePicker v-model="filterTime_1" :disabled="isView"></datePicker>
          </el-form-item>
          <el-form-item label="道路运输经营许可证期限：" prop="roadTransportOperatePeriodStart">
            <datePicker v-model="filterTime_2" :disabled="isView"></datePicker>
          </el-form-item><br/>
          <el-form-item label="经营范围：" prop="operateRange">
            <el-input v-model="form.operateRange" placeholder="请输入" maxlength="100" type="textarea" :rows="5" :disabled="isView"></el-input>
          </el-form-item>
          <el-form-item label="主营业务：" prop="mainRange">
            <el-input v-model="form.mainRange" placeholder="请输入" maxlength="100" type="textarea" :rows="5" :disabled="isView"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" v-model="form.remark" maxlength="100" placeholder="请输入" :rows="5" :disabled="isView"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </column-box>

    <column-box title="上传证件" last>
      <template slot="head">
        <p>
          <span class="column__title--h4">上传证件</span>
          <span>（证件可上传JPG、JPEG、PNG、PDF格式文件）</span>
        </p>
      </template>
      <template slot="body">
        <el-form ref="secondForm" label-width="150px" :model="form" :rules="rules">
          <el-form-item label="营业执照：" prop="businessLicenseUrl">
            <a :href="form.businessLicenseUrl" v-if="isView" target="_blank" class="file-item">{{form.businessLicenseName}}</a>
            <uploadFile
              v-else
              :show-tip="false"
              class="upload"
              :file-list="yyImg"
              :file-url.sync="form.businessLicenseUrl"
              :file-name.sync="form.businessLicenseName">
            </uploadFile>
          </el-form-item>
          <el-form-item label="道路运输经营许可证：" prop="roadTransportPermitsUrl">
            <a :href="form.roadTransportPermitsUrl" v-if="isView" target="_blank" class="file-item">{{form.roadTransportPermitsName}}</a>
            <uploadFile
              v-else
              :show-tip="false"
              class="upload"
              :file-list="dlImg"
              :file-url.sync="form.roadTransportPermitsUrl"
              :file-name.sync="form.roadTransportPermitsName">
            </uploadFile>
          </el-form-item>
          <el-form-item label="开户许可证：" prop="accountPermitsUrl">
            <a :href="form.accountPermitsUrl" v-if="isView" target="_blank" class="file-item">{{form.accountPermitsName}}</a>
            <uploadFile
              v-else
              :show-tip="false"
              class="upload"
              :file-list="khImg"
              :file-url.sync="form.accountPermitsUrl"
              :file-name.sync="form.accountPermitsName">
            </uploadFile>
          </el-form-item>
        </el-form>
      </template>
    </column-box>
  </div>
</template>

<script>
  import columnBox from '@/components/zt-column-box';
  import uploadFile from '@/components/uploadFile';
  import datePicker from '@/components/datePicker';
  import moneyInput from '@/components/moneyInput';
  import {idNoReg} from "@/utils";

  export default {
    name: 'info',
    props: {
      detail: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      let validateAccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('这是必填字段'));
        } else if (isNaN(value)) {
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      };
      let validateIdCard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('这是必填字段'));
        } else if (!idNoReg.test(value)) {
          callback(new Error('请输入正确的身份证号'));
        } else {
          callback();
        }
      };
      let validateNum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('这是必填字段'));
        } else if (isNaN(value) || String(value).split('.').length > 1) {
          callback(new Error('请输入正整数'));
        } else if (value < 0 || value > 99999){
          callback(new Error('请输入大于0且小于99999的数字'));
        } else {
          callback();
        }
      };
      return {
        yyImg: [], //回显的营业执照
        dlImg: [], //回显的道路运输许可证
        khImg: [], //回显的开户许可证
        loading: false,
        filterTime_1: {},
        filterTime_2: {},
        form: {
          companySettlement: '', //结算主体
          unifiedSocialCreditCode: '', //统一社会信用代码
          businessEntity: '', //法人姓名
          businessEntityIdentity: '', //法人身份证号
          registerAddress: '', //注册地址
          registerCapital: '', //注册资金
          fixedAssets: '', //固定资产
          zipCode: '', //邮政编码
          registerDate: null, //公司注册日期
          bankName: '', //开户银行
          bankAccount: '', //银行账号
          insuranceType: null, //保险公司
          companyScale: '', //公司规模
          companyManagementScale: '', //管理人员规模
          operatePeriodStart: null, //营业期限
          operatePeriodEnd: null,
          roadTransportOperatePeriodStart: null, //道路许可期限
          roadTransportOperatePeriodEnd: null,
          operateRange: '', //经营范围
          mainRange: '', //主营业务
          remark: '', //备注
          businessLicenseUrl: '', //营业执照
          businessLicenseName: '', //营业执照
          roadTransportPermitsUrl: '', //道路运输许可证
          roadTransportPermitsName: '', //道路运输许可证
          accountPermitsUrl: '', //开户许可
          accountPermitsName: '' //开户许可
        },
        bxList: [],
        value1: '',
        imageUrl: '',
        visible: false,
        rules: {
          companySettlement: [
            {required: true, message: '这是必填字段', trigger: 'blur'}
          ],
          unifiedSocialCreditCode: [
            {required: true, message: '这是必填字段', trigger: 'blur'}
          ],
          businessEntity: [
            {required: true, message: '这是必填字段', trigger: 'blur'}
          ],
          businessEntityIdentity: [
            {required: true, message: '这是必填字段', trigger: 'blur'},
            {validator: validateIdCard, trigger: 'blur'}
          ],
          registerAddress: [
            {required: true, message: '这是必填字段', trigger: 'blur'}
          ],
          registerCapital: [
            {required: true, message: '这是必填字段', trigger: 'blur'}
          ],
          fixedAssets: [
            {required: true, message: '这是必填字段', trigger: 'blur'}
          ],
          zipCode: [
            {required: true, message: '这是必填字段', trigger: 'blur'},
            {validator: validateAccount, trigger: 'blur'}
          ],
          registerDate: [
            {required: true, message: '这是必填字段', trigger: 'change'}
          ],
          bankName: [
            {required: true, message: '这是必填字段', trigger: 'blur'}
          ],
          bankAccount: [
            {required: true, message: '这是必填字段', trigger: 'blur'},
            {validator: validateAccount, trigger: 'blur'}
          ],
          insuranceType: [
            {required: true, message: '这是必填字段', trigger: 'change'}
          ],
          companyScale: [
            {required: true, message: '这是必填字段', trigger: 'blur'},
            {validator: validateNum, trigger: 'blur'},
          ],
          companyManagementScale: [
            {required: true, message: '这是必填字段', trigger: 'blur'},
            {validator: validateNum, trigger: 'blur'},
          ],
          operatePeriodStart: [
            {required: true, message: '这是必填字段', trigger: 'change'}
          ],
          roadTransportOperatePeriodStart: [
            {required: true, message: '这是必填字段', trigger: 'change'}
          ],
          operateRange: [
            {required: true, message: '这是必填字段', trigger: 'blur'}
          ],
          mainRange: [
            {required: true, message: '这是必填字段', trigger: 'blur'}
          ],
          businessLicenseUrl: [
            {required: true, message: '请上传文件', trigger: 'blur'}
          ],
          roadTransportPermitsUrl: [
            {required: true, message: '请上传文件', trigger: 'blur'}
          ],
          accountPermitsUrl: [
            {required: true, message: '请上传文件', trigger: 'blur'}
          ]
        },
      }
    },
    watch: {
      'form.businessLicenseUrl': function (val) {
        if (val) {
          this.$refs['secondForm'].clearValidate(['businessLicenseUrl']);
        }
      },
      'form.roadTransportPermitsUrl': function (val) {
        if (val) {
          this.$refs['secondForm'].clearValidate(['roadTransportPermitsUrl']);
        }
      },
      'form.accountPermitsUrl': function (val) {
        if (val) {
          this.$refs['secondForm'].clearValidate(['accountPermitsUrl']);
        }
      },
      filterTime_1(val) {
        this.form.operatePeriodStart = val.startDate;
        this.form.operatePeriodEnd = val.endDate;
      },
      filterTime_2(val) {
        this.form.roadTransportOperatePeriodStart = val.startDate;
        this.form.roadTransportOperatePeriodEnd = val.endDate;
      },
      detail(val) {
        if (val) {
          //回显数据
          for (let key in this.form) {
            this.form[key] = val[key];
            if (this.form.operatePeriodStart) {
              this.filterTime_1 = {
                startDate: this.form.operatePeriodStart,
                endDate: this.form.operatePeriodEnd
              }
            }
            if (this.form.roadTransportOperatePeriodStart) {
              this.filterTime_2 = {
                startDate: this.form.roadTransportOperatePeriodStart,
                endDate: this.form.roadTransportOperatePeriodEnd
              }
            }
            this.yyImg = this.form.businessLicenseUrl ? [{url:this.form.businessLicenseUrl,name:this.form.businessLicenseName}] : [];
            this.dlImg = this.form.roadTransportPermitsUrl ? [{url:this.form.roadTransportPermitsUrl,name:this.form.roadTransportPermitsName}] : [];
            this.khImg = this.form.accountPermitsUrl ? [{url:this.form.accountPermitsUrl,name:this.form.accountPermitsName}] : [];
          }
        }
      }
    },
    mounted() {
      // 获取保险公司
      this.$root.getDictByTypes({
        types: '18.09'
      }).then(res => {
        if (res.code === 0) {
          this.bxList = res.data['18.09']
        }
      });
    },
    methods: {
      handleSubmit() {
        let valid_1 = true, valid_2 = true;
        this.$refs['firstForm'].validate(valid => {
          valid_1 = valid;
        });
        this.$refs['secondForm'] && this.$refs['secondForm'].validate(valid => {
          valid_2 = valid;
        });
        if (valid_1 && valid_2) {
          let params = {...this.form};
          //把千位符去掉，给后台传数字类型
          params.registerCapital = parseFloat(params.registerCapital.replace(/,/g,''));
          params.fixedAssets = parseFloat(params.fixedAssets.replace(/,/g,''));
          return params;
        } else {
          return false;
        }
      }
    },
    computed: {
      isView() { //是否是查看
        return !!this.$route.query.isView;
      }
    },
    components: {
      columnBox,
      uploadFile,
      datePicker,
      moneyInput
    }
  }
</script>

<style scoped lang="scss">
  .form-item-box {
    .el-form-item {
      .el-input, .el-select, .el-input-number, .el-textarea {
        width: 202px;
      }
    }
  }
  .upload {
    max-width: 400px;
  }
  .file-item {
    color: #409EFF;
  }
  .file-item:hover {
    text-decoration: underline;
  }
</style>