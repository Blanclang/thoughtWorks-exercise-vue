/*
*  @描述：车辆详情
*  @作者：邱康松
*  @创建时间：2019/3/5
*/

<template>
  <div class="page-normal">
    <column-box title="基本信息" class="form-item-box" v-loading="pageLoading">
      <template slot="body">
        <el-form label-width="130px" inline ref="firstForm" :model="form" :rules="rules">
          <el-form-item label="承运商编码：">
            <span class="text-span">{{$store.getters.getCompanyInfo.carriersCode}}</span>
          </el-form-item>
          <el-form-item label="承运商全称：">
            <span class="text-span">{{$store.getters.getCompanyInfo.name}}</span>
          </el-form-item>
          <el-form-item label="承运商简称：">
            <span class="text-span">{{$store.getters.getCompanyInfo.abbreviation}}</span>
          </el-form-item><br/>
          <el-form-item label="主车车牌号：" prop="mainPlateNo">
            <el-input v-model="form.mainPlateNo" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="主车品牌型号：" prop="mainBrand">
            <el-input v-model="form.mainBrand" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="挂车车牌号：" prop="trailerPlateNo">
            <el-input :disabled="isPass" v-model="form.trailerPlateNo" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="挂车品牌型号：" prop="trailerBrand">
            <el-input v-model="form.trailerBrand" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="发动机号：" prop="engineNo">
            <el-input v-model="form.engineNo" :maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="主车车辆识别代码：" prop="mainCode">
            <el-input v-model="form.mainCode" :maxlength="17"></el-input>
          </el-form-item>
          <el-form-item label="挂车车辆识别代码：" prop="trailerCode">
            <el-input v-model="form.trailerCode" :maxlength="17"></el-input>
          </el-form-item>
          <el-form-item label="车辆启用日期：" prop="vehicleStartOn">
            <el-date-picker
                    :disabled="isPass"
                    v-model="form.vehicleStartOn"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="车辆类型：" prop="vehicleType">
            <el-select :disabled="isPass" v-model="form.vehicleType">
              <el-option v-for="item in carTypeList" :label="item.name" :value="item.code" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆属性：" prop="vehicleAttribute">
            <el-select :disabled="isPass" v-model="form.vehicleAttribute">
              <el-option v-for="item in carAttrList" :label="item.name" :value="item.code" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最大装载台数：" prop="carryQuantity">
            <el-input-number label="描述文字" :min="1" :disabled="isPass" v-model="form.carryQuantity"></el-input-number>
          </el-form-item>
          <el-form-item label="挂车尺寸长(m)：" prop="trailerLength">
            <el-input v-model="form.trailerLength" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="挂车尺寸宽(m)：" prop="trailerWidth">
            <el-input v-model="form.trailerWidth" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="挂车尺寸高(m)：" prop="trailerHigh">
            <el-input v-model="form.trailerHigh"></el-input>
          </el-form-item>
          <el-form-item label="行驶证所属单位：" prop="vehicleLicenseUnit">
            <el-input :disabled="isPass" v-model="form.vehicleLicenseUnit" :maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="GPS域名：" prop="gpsDomainName">
            <el-input v-model="form.gpsDomainName" :maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="GPS/BDS编号：" prop="gpsNo">
            <el-input v-model="form.gpsNo" :maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="是否合规车：" prop="regularVehicle">
            <el-select v-model="form.regularVehicle">
              <el-option label="是" value="0">是</el-option>
              <el-option label="否" value="1">否</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" v-model="form.remark" :maxlength="50"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </column-box>

    <column-box title="上传证件" last>
      <template slot="body">
        <div v-if="isPass">
          <image-box :url="form.mainLicence && form.mainLicence.mainLicenceUrl" title="主车行驶证" :img-list="imgList"></image-box>
          <image-box :url="form.trailerLicence && form.trailerLicence.trailerLicenceUrl" title="挂车行驶证" :img-list="imgList"></image-box>
          <imageUpload title="上传其他证件" :resId.sync="form.otherLicence.otherLicenceFileId" @showImg="showImg" :fileList="otherImg"></imageUpload>
          <div style="clear: both"></div>
        </div>
        <el-form v-else inline label-width="120px" ref="secondForm" :rules="rules" :model="form">
          <el-form-item label="主车行驶证" prop="mainLicence.mainLicenceFileId">
            <image-upload @showImg="showImg" :resId.sync="form.mainLicence.mainLicenceFileId" :fileList="zhuCheImg"></image-upload>
          </el-form-item>
          <el-form-item label="挂车行驶证" prop="trailerLicence.trailerLicenceFileId">
            <image-upload @showImg="showImg" :resId.sync="form.trailerLicence.trailerLicenceFileId" :fileList="guaCheImg"></image-upload>
          </el-form-item>
          <el-form-item label="其他证件" prop="otherLicence.otherLicenceFileId">
            <image-upload @showImg="showImg" :resId.sync="form.otherLicence.otherLicenceFileId" :fileList="otherImg"></image-upload>
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px">
          <el-button size="small" type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
          <el-button size="small" @click="$router.replace('/vehicleData')">取消</el-button>
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
  export default {
    name: '',
    data() {
      return {
        value1: '',
        imageUrl: '',
        visible: false,
        pageLoading: false,
        loading: false,
        zhuCheImg: [],
        guaCheImg: [],
        otherImg: [],
        carTypeList: [], //车辆类别
        carAttrList: [], //车辆属性
        imgList: [],
        form: {
          "companyCode": this.$store.getters.getCompanyCode,
          "trailerPlateNo": "",
          "trailerBrand": "",
          "mainBrand": "",
          "mainPlateNo": "",
          "mainCode": "",
          "trailerCode": "",
          "engineNo": "",
          "vehicleType": "",
          "vehicleAttribute": "",
          "trailerHigh": "",
          "trailerLength": "",
          "trailerWidth": "",
          "carryQuantity": "",
          "vehicleLicenseUnit": "",
          "gpsNo": "",
          "gpsDomainName":"",
          "regularVehicle": '0',
          "vehicleStartOn": "",
          "mainLicence":{
            "mainLicenceFileId": "",
            "mainLicenceUrl": ""
          },
          "trailerLicence":{
            "trailerLicenceFileId": "",
            "trailerLicenceUrl": ""
          },
          "otherLicence":{
            "otherLicenceFileId": "",
            "otherLicenceUrl": ""
          },
          "remark": ""
        },
        rules: {
          trailerPlateNo: [
            { required: true, message: '这是必填字段', trigger: 'blur' }
          ],
          mainPlateNo: [
            { required: true, message: '这是必填字段', trigger: 'blur' }
          ],
          mainCode: [
            { max: 17, min: 17, message: '请输入正确的主车车辆识别代码', trigger: 'blur' }
          ],
          trailerCode: [
            { max: 17, min: 17, message: '请输入正确的挂车车辆识别代码', trigger: 'blur' }
          ],
          vehicleStartOn: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          vehicleType: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          vehicleAttribute: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          carryQuantity: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          vehicleLicenseUnit: [
            { required: true, message: '这是必填字段', trigger: 'blur' }
          ],
          'mainLicence.mainLicenceFileId': [
            { required: true, message: '请上传图片', trigger: 'change' }
          ],
          'trailerLicence.trailerLicenceFileId': [
            { required: true, message: '请上传图片', trigger: 'change' }
          ]
        }
      }
    },
    watch: {
      'form.mainLicence.mainLicenceFileId': function (val) {
        if (val) {
          this.$refs['secondForm'].clearValidate(['mainLicence.mainLicenceFileId']);
        }
      },
      'form.trailerLicence.trailerLicenceFileId': function (val) {
        if (val) {
          this.$refs['secondForm'].clearValidate(['trailerLicence.trailerLicenceFileId']);
        }
      }
    },
    mounted() {
      this.getDictByTypes();
      if (!!this.$route.query.id) {
        this.pageLoading = true;
        this.$root.getVehicleDetail({
          vehicleId: this.$route.query.id
        }).then(res => {
          this.pageLoading = false;
          if (res.code === 0) {
            this.form = res.data || {};
            this.zhuCheImg = this.form.mainLicence.mainLicenceUrl ? [this.form.mainLicence.mainLicenceUrl] : [];
            this.otherImg = this.form.otherLicence.otherLicenceUrl ? [this.form.otherLicence.otherLicenceUrl] : [];
            this.guaCheImg = this.form.trailerLicence.trailerLicenceUrl ? [this.form.trailerLicence.trailerLicenceUrl] : [];
            let list = [
              this.form.mainLicence && this.form.mainLicence.mainLicenceUrl || '',
              this.form.trailerLicence && this.form.trailerLicence.trailerLicenceUrl || '',
              this.form.otherLicence && this.form.otherLicence.otherLicenceUrl || ''
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
      //获取车辆属性、车辆类型
      getDictByTypes() {
        this.$root.getDictByTypes({
          types: 'CLLX,CLSX'
        }).then(res => {
          if (res.code === 0) {
            this.carTypeList = res.data['CLLX'];
            this.carAttrList = res.data['CLSX'];
          }
        })
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
          this.loading = true;
          let url = this.$route.query.id ? 'updateVehicle' : 'addVehicle';
          this.$root[url](this.form).then(res => {
            this.loading = false;
            if (res.code === 0) {
              this.$message.success('提交成功');
              this.$router.replace('/vehicleData');
            }
          }).catch(() => {
            this.loading = false;
          })
        }
      }
    },
    computed: {
      isPass() {
        return this.form.auditStatus === 2;
      }
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