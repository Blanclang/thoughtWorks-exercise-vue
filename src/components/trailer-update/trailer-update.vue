/*
*  @描述：拖车更换组件
*  @作者：白朗
*  @创建时间：2019/3/20
*/
<template>
  <div>
    <el-dialog :title="title" width="745px" :visible.sync="visible" :before-close="close">
      <div class="content">
        <el-form ref="form" inline label-width="125px" :model="form" :rules="rules">
          <el-form-item label="拖车计划号:">
            <el-input size="small" v-model="form.transPlanCode" placeholder="请输入" :maxlength="50" disabled></el-input>
          </el-form-item>
          <el-form-item label="原承运商:">
            <el-input size="small" v-model="form.initCarrierCompanyName" placeholder="请输入" :maxlength="50" disabled></el-input>
          </el-form-item>
          <el-form-item label="原挂车车牌号:">
            <el-input size="small" v-model="form.trailerPlate" placeholder="请输入" :maxlength="50" disabled></el-input>
          </el-form-item>
          <el-form-item label="承运商:">
            <el-input size="small" v-model="form.carrierCompanyName" placeholder="请输入" :maxlength="50" disabled></el-input>
          </el-form-item>
          <el-form-item label="原司机姓名:">
            <el-input size="small" v-model="form.driverName" placeholder="请输入" :maxlength="50" disabled></el-input>
          </el-form-item>
          <el-form-item label="变更拖车:" prop="changeTrailerNo">
            <div class="carry_box flex_sc" @click="selCar">
              <span>{{form.changeTrailerNo}}</span><span class="el-icon-search"></span>
            </div>
          </el-form-item>
          <el-form-item label="变更原因:" prop="createdReason">
            <el-input size="small" v-model="form.createdReason" type="textarea" :rows="2" style="width:535px;"  placeholder="请输入" :maxlength="100"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" size="small" @click="save" :loading="loading">保存并退出</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </span>
    </el-dialog>
    <!--选择车辆-->
    <car-selected :carSelVisible.sync="carselVisible"  @carSelData="carSelReturn" :code.sync="carrierCompanyCode" ></car-selected>
  </div>
  
</template>

<script>
  import carSelected from '@/components/car-select';
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '提示'
      },
      datas:{
        type: Object,
        default: null
      }
    },
    data() {
      return {
        loading: false,
        carrierCompanyCode:'',
        form:{
          waybillCode:'',
          transPlanCode:'',
          carrierCompanyName:'',
          initCarrierCompanyName:'',
          trailerPlate:'',
          changeTrailerNo:'',
          changeDriverName:'',
          driverName:'',
          createdReason:'',
          change:0
        },
        rules: {
          changeTrailerNo:[
            { required: true, message: '请选择变更拖车', trigger: 'change' }
          ],
          createdReason: [
            { required: true, message: '变更原因不能为空', trigger: 'blur' }
          ]
        },
        carselVisible:false, //选择车辆弹出层
      }
    },
    created() {
      
    },
    watch:{
      datas(n,o){
        this.form={
          waybillCode:n.waybillCode||'',
          transPlanCode:n.transPlanCode||'-',
          carrierCompanyName:n.carrierCompanyName||'-',
          initCarrierCompanyName:n.initCarrierCompanyName||'-',
          changeCarriers:'',
          changeCarriersName:'',
          trailerPlate:n.initTrailerPlate||'-',
          changeDriverName:'',
          changeTrailerNo:'',
          driverName:n.initDriverName||'-',
          createdReason:'',
          change:0
        };
        this.carrierCompanyCode = n.carrierCompanyCode;
      }
    },
    methods: {
      //打开选择车辆
      selCar(){
        this.carselVisible = true;
      },
      //选择车辆返回值
      carSelReturn(e){
        this.form.changeTrailerNo=e.trailerPlateNo;
        this.form.changeMainPlateNo=e.mainPlateNo;
        this.form.changeDriverName=e.name;
        this.form.changeDriverIdcard=e.idNo;
        this.form.changeDriverNo=e.driverNo;
        this.form.changeCarryQuantity=e.carryQuantity;
        this.form.changeMobile=e.mobile;
        this.form.changeVehicleNo=e.vehicleNo;
        this.form.changeVehicleType=e.vehicleType;
      },
      //保存
      save(){
        this.$refs['form'].validate(valid => {
          if (valid) {
            let obj = {...this.form};
            this.$emit('returnData',obj);
            // this.close();
          }
        })
      },
      //取消
      close() {
        this.$refs['form'].resetFields();
        this.$emit('update:visible',false);
      },
    },
    components: {
      carSelected
    }
  }
</script>

<style scoped lang="scss">
  .content{
    padding: 4px;
  }
  .carry_box{
    width: 200px;
    height: 32px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 12px;
    cursor: pointer;
    margin-top: 4px;
  }
</style>