/*
*  @描述：司机详情
*  @作者：邱康松
*  @创建时间：2019/3/4
*/

<template>
  <div class="page-normal" >
    <column-box title="基本信息" class="form-item-box" v-loading="pageLoading">
      <template slot="body">
        <el-form label-width="130px" inline :model="form" ref="firstForm" :rules="rules">
          <el-form-item label="承运商编码：">
            <span class="text-span">{{$store.getters.getCompanyInfo.carriersCode}}</span>
          </el-form-item>
          <el-form-item label="承运商全称：">
            <span class="text-span">{{$store.getters.getCompanyInfo.name}}</span>
          </el-form-item>
          <el-form-item label="承运商简称：">
            <span class="text-span">{{$store.getters.getCompanyInfo.abbreviation}}</span>
          </el-form-item><br/>
          <el-form-item label="姓名：" prop="name">
            <el-input :disabled="isPass" v-model="form.name" maxlength="10" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-select :disabled="isPass" v-model="form.sex">
              <el-option label="男" value="04001">男</el-option>
              <el-option label="女" value="04002">女</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号：" prop="idNo">
            <el-input :disabled="isPass" v-model="form.idNo" maxlength="18" placeholder="请输入" @change="changeIdCard"></el-input>
          </el-form-item>
          <el-form-item label="出生日期：" prop="birthday">
            <el-date-picker
                    :disabled="isPass"
                    v-model="form.birthday"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input :disabled="isPass" v-model="form.mobile" maxlength="11" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="主副驾：" prop="driverType">
            <el-select :disabled="isPass" v-model="form.driverType">
              <el-option label="主驾" value="10001">主驾</el-option>
              <el-option label="副驾" value="10002">副驾</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="驾龄（年）：" prop="driverAge">
            <el-input-number :min="1" :disabled="isPass" v-model="form.driverAge"></el-input-number>
          </el-form-item>
          <el-form-item label="驾照类型：" prop="driverLicenseType">
            <el-select :disabled="isPass" v-model="form.driverLicenseType">
              <el-option label="A照" value="09001">A照</el-option>
              <el-option label="B照" value="09002">B照</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用工类型：" prop="employType">
            <el-select v-model="form.employType">
              <el-option label="合同工" value="08002">合同工</el-option>
              <el-option label="承包" value="08001">承包</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="劳务合同起始日期：" prop="agreeStartOn">
            <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="form.agreeStartOn"
                    type="date"
                    placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="劳务合同截止日期：" prop="agreeEndOn">
            <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="form.agreeEndOn"
                    type="date"
                    placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发卡银行：" prop="bankName">
            <el-input v-model="form.bankName" maxlength="20" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="银行卡号：" prop="bankAccount">
            <el-input v-model="form.bankAccount" maxlength="20" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" v-model="form.remark" maxlength="30" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </column-box>

    <column-box title="上传证件">
      <template slot="body">
        <div v-if="isPass">
          <image-box :url="form.card.cardUrl" title="身份证（正面）" :img-list="imgList"></image-box>
          <image-box :url="form.card.cardReverseUrl" title="身份证（反面）" :img-list="imgList"></image-box>
          <image-box :url="form.licence.licenceUrl" title="驾驶证" :img-list="imgList"></image-box>
          <image-box :url="form.qualification.qualificationUrl" title="从业资格证" :img-list="imgList"></image-box>
          <imageUpload
                  @showImg="showImg"
                  :fileList="otherImg"
                  :resId.sync="form.other.otherLicenceFileId"
                  title="上传其他证件">
          </imageUpload>
          <div style="clear: both"></div>
        </div>
        <el-form v-else inline label-width="140px" :model="form" ref="secondForm" :rules="rules">
          <el-form-item label="身份证（正面）：" prop="card.cardFileId">
            <imageUpload
                    key="1"
                    @showImg="showImg"
                    :fileList="zCardImg"
                    :resId.sync="form.card.cardFileId">
            </imageUpload>
          </el-form-item>
          <el-form-item label="身份证（反面）：" prop="card.cardFileReverseId">
            <imageUpload
                    key="2"
                    @showImg="showImg"
                    :fileList="fCardImg"
                    :resId.sync="form.card.cardFileReverseId">
            </imageUpload>
          </el-form-item>
          <el-form-item label="驾驶证：" prop="licence.licenceFileId">
            <imageUpload
                    key="3"
                    @showImg="showImg"
                    :fileList="jiaShiImg"
                    :resId.sync="form.licence.licenceFileId">
            </imageUpload>
          </el-form-item>
          <el-form-item label="从业资格证：" prop="qualification.qualificationFileId">
            <imageUpload
                    key="4"
                    @showImg="showImg"
                    :fileList="ziGeImg"
                    :resId.sync="form.qualification.qualificationFileId">
            </imageUpload>
          </el-form-item>
          <el-form-item label="其他证件：" prop="other.otherLicenceFileId">
            <imageUpload
                    key="5"
                    @showImg="showImg"
                    :fileList="otherImg"
                    :resId.sync="form.other.otherLicenceFileId">
            </imageUpload>
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px">
          <el-button size="small" type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
          <el-button size="small" @click="$router.replace('/driverData')">取消</el-button>
        </div>
      </template>
    </column-box>
    <image-dialog :imgUrl="imageUrl" :visible.sync="visible"></image-dialog>
  </div>
</template>

<script>
  import columnBox from '@/components/zt-column-box';
  import imageBox from '@/components/imageBox';
  import imageDialog from '@/components/imageDialog';
  import imageUpload from '@/components/imageUpload';
  import {mobileReg,idNoReg,getBirthdayByIdCard} from "../../../../utils";

  let validateMobile = (rule, value, callback) => {
    if (!mobileReg.test(value)) {
      callback(new Error('请输入正确的手机号'));
    } else {
      callback();
    }
  };
  let validateIdNo = (rule, value, callback) => {
    if (!idNoReg.test(value)) {
      callback(new Error('请输入正确的身份证号'));
    } else {
      callback();
    }
  };
  export default {
    name: '',
    data() {
      return {
        value1: '',
        imageUrl: '',
        visible: false,
        pageLoading: false,
        loading: false,
        zCardImg: [],
        fCardImg: [],
        jiaShiImg: [],
        ziGeImg: [],
        otherImg: [],
        imgList: [],
        form: {
          "name": "", //姓名
          "mobile": "",
          "sex": "",
          "idNo": "",
          "birthday": "",
          "driverAge": "",
          "driverLicenseType": "",
          "driverType": "",
          "employType": "",
          "bankAccount": "",
          "bankName": "",
          "agreeStartOn": "",
          "agreeEndOn": "",
          "companyName": "",
          "companyCode": this.$store.getters.getCompanyCode,
          "companyAbbreviation": "",
          "card":{
            "cardFileId":"",
            "cardFileReverseId": "",
            "cardUrl": "",
            "cardReverseUrl": ""
          },
          "licence":{
            "licenceFileId":"",
            "licenceUrl": ""
          },
          "qualification":{
            "qualificationFileId": "",
            "qualificationUrl": ""
          },
          "other":{
            "otherLicenceFileId": "",
            "otherLicenceUrl": "",
          },
          "remark": ""
        },
        rules: {
          name: [
            { required: true, message: '这是必填字段', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          idNo: [
            { required: true, message: '这是必填字段', trigger: 'blur' },
            { validator: validateIdNo, trigger: 'blur' }
          ],
          birthday: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          mobile: [
            { required: true, message: '这是必填字段', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          driverType: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          driverAge: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          driverLicenseType: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          'card.cardFileId': [
            { required: true, message: '请上传图片', trigger: 'change' }
          ],
          /*'card.cardFileReverseId': [
            { required: true, message: '请上传图片', trigger: 'change' }
          ],*/
          'licence.licenceFileId': [
            { required: true, message: '请上传图片', trigger: 'change' }
          ],
          /*'qualification.qualificationFileId': [
            { required: true, message: '请上传图片', trigger: 'change' }
          ],*/
        }
      }
    },
    created() {
      if (!!this.$route.query.id) {
        this.pageLoading = true;
        this.$root.getDriverDetail({
          driverId: this.$route.query.id
        }).then(res => {
          this.pageLoading = false;
          if (res.code === 0) {
            this.form = res.data || {};
            this.zCardImg = this.form.card.cardUrl ? [this.form.card.cardUrl] : [];
            this.fCardImg = this.form.card.cardReverseUrl ? [this.form.card.cardReverseUrl] : [];
            this.jiaShiImg = this.form.licence.licenceUrl ? [this.form.licence.licenceUrl] : [];
            this.ziGeImg = this.form.qualification.qualificationUrl ? [this.form.qualification.qualificationUrl] : [];
            this.otherImg = this.form.other.otherLicenceUrl ? [this.form.other.otherLicenceUrl] : [];
            let list = [
              this.form.card && this.form.card.cardUrl || '',
              this.form.card && this.form.card.cardReverseUrl || '',
              this.form.licence && this.form.licence.licenceUrl || '',
              this.form.qualification && this.form.qualification.qualificationUrl || '',
              this.form.other && this.form.other.otherLicenceUrl || ''
            ];
            list.forEach(item => {
              !!item && this.imgList.push(item);
            })
          }
        }).catch(() => {
          this.pageLoading = false;
        })
      }
    },
    methods: {
      changeIdCard(val) {
        this.form.birthday = getBirthdayByIdCard(val);
      },
      showImg(url) {
        this.imageUrl = url;
        this.visible = true;
      },
      handleSubmit() {
        let valid_1 = true,valid_2 = true;
        this.$refs['firstForm'].validate(valid => {
          valid_1 = valid;
        });
        this.$refs['secondForm'] && this.$refs['secondForm'].validate(valid => {
          valid_2 = valid;
        });
        if (valid_1 && valid_2) {
          let url = '';
          if (!!this.$route.query.id) { //存在id说明是修改
            url = 'updateDriver';
          } else {
            url = 'addDriver';
          }
          this.loading = true;
          this.$root[url](this.form).then(res => {
            this.loading = false;
            if (res.code === 0) {
              this.$message.success('提交成功');
              this.$router.replace('/driverData');
            }
          }).catch(() => {
            this.loading = false;
          })
        }
      }
    },
    watch: {
      'form.card.cardFileId': function (val) {
        if (val) {
          this.$refs['secondForm'].clearValidate(['card.cardFileId']);
        }
      },
      'form.card.cardFileReverseId': function (val) {
        if (val) {
          this.$refs['secondForm'].clearValidate(['card.cardFileReverseId']);
        }
      },
      'form.licence.licenceFileId': function (val) {
        if (val) {
          this.$refs['secondForm'].clearValidate(['licence.licenceFileId']);
        }
      },
      'form.qualification.qualificationFileId': function (val) {
        if (val) {
          this.$refs['secondForm'].clearValidate(['qualification.qualificationFileId']);
        }
      }
    },
    computed: {
      isPass() { //是否是已审核状态
        return this.form.auditStatus === 2;
      },
    },
    components: {
      columnBox,
      imageBox,
      imageDialog,
      imageUpload
    }
  }
</script>

<style scoped lang="scss">
  .form-item-box {
    .el-form-item {
      .text-span {
        display: block;
        min-width: 202px;
      }
      .el-input,.el-select,.el-input-number,.el-textarea {
        width: 202px;
      }
    }
  }
</style>