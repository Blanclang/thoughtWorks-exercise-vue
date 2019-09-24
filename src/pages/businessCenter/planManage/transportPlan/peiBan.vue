/*
*  @描述：配板弹窗
*  @作者：邱康松
*  @创建时间：2019/3/20
*/

<template>
  <div class="pei-ban">
    <el-dialog title="配板修改" :visible.sync="visible" width="900px" top="5vh" :before-close="closeDialog">
      <el-form inline label-width="150px" :model="form" :rules="rules" ref="form" v-loading="pageLoading">
        <el-form-item label="出发地：">
          <el-input disabled placeholder="请输入" :value="planDetail.originLocationName"></el-input>
        </el-form-item>
        <el-form-item label="商品车数：">
          <el-input disabled placeholder="请输入" :value="planDetail.vehicleNum"></el-input>
        </el-form-item>
        <el-form-item label="拖车计划号：">
          <el-input disabled placeholder="请输入" :value="planDetail.code"></el-input>
        </el-form-item>
        <el-form-item label="短驳目的地：" v-if="planDetail.bargeDestinationCode" prop="bargeDestinationCode">
          <el-input disabled :value="planDetail.bargeDestinationName"></el-input>
        </el-form-item>
        <el-form-item label="干线运输商：" v-if="planDetail.trunkCarrierCode" prop="trunkCarrierCode">
          <el-input disabled :value="planDetail.trunkCarrierName"></el-input>
        </el-form-item>
        <el-form-item label="线路类型：">
          <el-input disabled placeholder="请输入" :value="planDetail.lineTypeName"></el-input>
        </el-form-item>
        <el-form-item label="承运商：" prop="carrierCompanyCode">
          <el-input :value="planDetail.carrierCompanyName" disabled></el-input>
        </el-form-item>
        <el-form-item label="车辆编码：" prop="vehicleNo">
          <el-input style="width: 230px" placeholder="请选择拖车" v-model="form.vehicleNo" readonly>
            <el-button slot="append" @click="showVehicleDialog">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="司机姓名：" prop="driverName">
          <el-input disabled placeholder="请输入" v-model="form.driverName"></el-input>
        </el-form-item>
        <el-form-item label="司机卡号：" prop="driverNo">
          <el-input disabled placeholder="请输入" v-model="form.driverNo"></el-input>
        </el-form-item>
        <el-form-item label="装载位数：" prop="carryQuantity">
          <el-input disabled placeholder="请输入" v-model="form.carryQuantity"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="driverMobile">
          <el-input disabled placeholder="请输入" v-model="form.driverMobile"></el-input>
        </el-form-item>
        <el-form-item label="主车车牌号：" prop="headPlate">
          <el-input disabled placeholder="请输入" v-model="form.headPlate"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码：" prop="driverIdNo">
          <el-input disabled placeholder="请输入" v-model="form.driverIdNo"></el-input>
        </el-form-item>
        <el-form-item label="挂车车牌号：" prop="trailerPlate">
          <el-input disabled placeholder="请输入" v-model="form.trailerPlate"></el-input>
        </el-form-item>
        <el-form-item label="编制日期：">
          <el-input placeholder="请输入" disabled :value="new Date().Format('yyyy-MM-dd')"></el-input>
        </el-form-item>
        <el-form-item label="拖车到达日期：" prop="trailerEarliestDate">
          <el-date-picker
                  :picker-options="pickerOptions"
                  v-model="form.trailerEarliestDate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="拖车最早到达时间：" prop="trailerEarliestTime">
          <el-time-picker
                  :editable="false"
                  :picker-options="{format: 'HH:mm'}"
                  value-format="HHmm"
                  v-model="form.trailerEarliestTime"
                  placeholder="请选择">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="承运原因：" prop="carrierReason">
          <el-input type="textarea" placeholder="请输入" maxlength="100" v-model="form.carrierReason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button type="primary" size="small" @click="handleSubmit" :loading="loading">保存并退出</el-button>
      <el-button size="small" @click="closeDialog">取消</el-button>
    </span>
    </el-dialog>
    <!--车辆选择-->
    <pickVehicle
            :carSelData.sync="carData"
            :carSelVisible.sync="vehicleVisible"
            :code="form.carrierCompanyCode">
    </pickVehicle>
  </div>
</template>

<script>
  import pickVehicle from '../../../../components/car-select';
  export default {
    name: '',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      code: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        pageLoading: false,
        loading: false,
        planDetail: {}, //计划详情
        carData: {},
        duanBo: [],
        ganXian: [],
        bargeDestinationCodeObj: null, //短驳目的地信息
        trunkCarrierCodeObj: null, //干线运输商信息
        vehicleVisible: false,
        form: {
          "code": '', //拖车计划号
          "companyCode": this.$store.getters.getCompanyCode,
          "userCode": this.$store.getters.getUserCode,
          "id": null,
          "bargeDestinationCode":"", //短驳目的地编码
          "bargeDestinationName":"", //短驳目的地名称
          "trunkCarrierCode":"", //干线运输商编码
          "trunkCarrierName":"", //干线运输商名称
          "carrierCompanyCode":"", //承运商编码
          "carrierCompanyName":"", //承运商名称
          "vehicleNo":"",  //车辆编码
          "vehicleType":"", //车辆类型
          "headPlate":"", //主车车牌号
          "trailerPlate":"", //挂车车牌号
          "carryQuantity":"", //装载位数
          "driverName":"", //司机姓名
          "driverMobile":"", //司机手机号
          "driverNo":"", //司机卡号
          "driverIdNo":"", //身份证号码
          "trailerEarliestTime":"1000", //拖车最早到达时间
          "trailerEarliestDate":"", //拖车到达日期
          "carrierReason":"" //承运原因
        },
        rules: {
          carrierCompanyCode: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          vehicleNo: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          trailerEarliestTime: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ],
          trailerEarliestDate: [
            { required: true, message: '这是必填字段', trigger: 'change' }
          ]
        },
        pickerOptions: {
          disabledDate: function (val) {
            return val.getTime() < new Date(new Date().toLocaleDateString() + ' 00:00:00').getTime();
          }
        }
      }
    },
    watch: {
      carData(val) {
        if (val) {
          this.form.vehicleNo = val.vehicleNo;
          this.form.vehicleType = val.vehicleType;
          this.form.headPlate = val.mainPlateNo;
          this.form.trailerPlate = val.trailerPlateNo;
          this.form.carryQuantity = val.carryQuantity;
          this.form.driverName = val.name;
          this.form.driverMobile = val.mobile;
          this.form.driverIdNo = val.idNo;
          this.form.driverNo = val.driverNo;
        }
      },
      visible(val) {
        if (!val) {
          this.$refs['form'].resetFields();
          this.bargeDestinationCodeObj = null;
          this.trunkCarrierCodeObj = null;
        } else {
          this.getDetail();
        }
      },
      bargeDestinationCodeObj(val) {
        if (val) {
          this.form.bargeDestinationCode = val.code;
          this.form.bargeDestinationName = val.name;
        } else {
          this.form.bargeDestinationCode = this.form.bargeDestinationName = '';
        }
      },
      trunkCarrierCodeObj(val) {
        if (val) {
          this.form.trunkCarrierCode = val.code;
          this.form.trunkCarrierName = val.name;
        } else {
          this.form.trunkCarrierCode = this.form.trunkCarrierName = '';
        }
      }
    },
    methods: {
      getDetail() {
        this.pageLoading = true;
        this.$root.getPlanDetail({
          code: this.code
        }).then(res => {
          this.pageLoading = false;
          if (res.code === 0) {
            this.planDetail = res.data || {};
            for (let key in this.form) {
              this.form[key] = this.planDetail[key];
            }
          }
        }).catch(() => {
          this.pageLoading = false;
        })
      },
      handleSubmit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            // 线路类型为轮板，即承运原因必填
            if (this.planDetail.lineTypeName === '轮板' && !this.form.carrierReason) {
              this.$message.warning('请输入承运原因！');
              return false;
            }
            this.loading = true;
            this.form.companyCode = this.$store.getters.getCompanyCode;
            this.form.userCode = this.$store.getters.getUserCode;
            this.$root.updatePlan(this.form).then(res => {
              this.loading = false;
              if (res.code === 0) {
                this.$message.success('修改成功！');
                this.closeDialog();
                this.$emit('success');
              }
            }).catch(() => {
              this.loading = false;
            })
          }
        })
      },
      showVehicleDialog() {
        if (!this.form.carrierCompanyCode) {
          this.$message.warning('请先选择承运商');
          return false;
        }
        this.vehicleVisible = true;
      },
      closeDialog() {
        this.$emit('update:visible',false);
      }
    },
    components: {
      pickVehicle
    }
  }
</script>

<style scoped lang="scss">
  .pei-ban /deep/ {
    .el-input,.el-select {
      width: 230px !important;
    }
    .el-textarea {
      width: 500px !important;
    }
    .time-tip {
      padding-left: 20px;
      color: #409EFF;
    }
    .el-input-group__append {
      background-color: #409EFF;
      color: #ffffff;
      border-color: #409EFF;
    }
  }
</style>