/*
*  @描述：出门后换板
*  @作者：白朗
*  @创建时间：2019/4/30
*/
<template>
  <div class="vehicle-data page-normal">
    <el-form inline label-width="110px" class="search-form">
      <searchBoxFade>
        <template slot="show">
          <el-form-item label="编制日期：">
            <date-picker v-model="filterTime"></date-picker>
          </el-form-item>
          <el-form-item label="VIN码：">
            <el-input v-model="form.vinCode" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" size="small">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </template>
        <template slot="hide">
          <el-form-item label="出发地：">
            <startLocation v-model="form.startLocation"></startLocation>
          </el-form-item>
          <el-form-item label="拖车计划号：">
            <el-input v-model="form.transPlanCode" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="挂车车牌号：">
            <el-input v-model="form.trailerPlate" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="司机姓名：">
            <el-input v-model="form.driverName" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="送车通知单号：">
            <el-input v-model="form.transCode" placeholder="请输入" :maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="是否换版：">
            <el-select v-model="form.isChange">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </searchBoxFade>
    </el-form>
    <column-box no-title="" last class="parent-table-box">
      <template slot="body">
        <div class="flex_sc operation-box">
          <div>
            <el-button type="primary" @click="changeUpdate" v-has="'VRES60'">换板</el-button>
            <!-- <el-button @click="examineFun" v-has="'VARES150'">审核</el-button> -->
            <el-button @click="exportFun" v-has="'VRES61'">导出</el-button>
          </div>
          <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter" :remove-num="2"></filterColumn>
        </div>
        <zt-table 
          :table-column="newColumn || tableColumn" 
          ref="table"
          resize
          @tableResize="tableResize"
          :height="tableHeight"
          :request="requestTable"
          v-if="showTable" 
          v-loading="loading"
          :request-params="form" 
          :getClickRow.sync="selectedRadio"
          :redioDefault="true"
          radio-label="key"
          :highlightCurrentRow='true'>
        </zt-table>
      </template>
    </column-box>
    <!-- 字表 -->
    <column-box no-title="" last class="child-table-box">
      <template slot="body">
        <zt-table 
          ref="tablechild" 
          :height="childHeight"
          :table-column="tableChildColumn"  
          v-loading="childLoading" 
          :tableData="tableChildData" 
          :pagination="false"
          :getSelection.sync="selTabList"
          :allSelection='true'
        >
        </zt-table>
      </template>
    </column-box>

    <!--出门后换板-->
    <!-- <trailer-update :visible.sync="trailerVisible" title="出门后换板"  :datas.sync="selData" @returnData="trailerReturn"></trailer-update> -->
    <trailer-update :visible.sync="trailerVisible" title="出门后换板" :datas.sync="selData" @returnData="trailerReturn"></trailer-update>
    <!--导出-->
    <approval :visible.sync="approvalVisible" title="出门后换板审核"  @approvalData="approvalReturn"></approval>
    
  </div>
</template>

<script>
  import ztTable from '@/components/zt-table';
  import columnBox from '@/components/zt-column-box';
  import datePicker from '@/components/datePicker';
  import filterColumn from '@/components/filterColumn';
  import searchBoxFade from '@/components/searchBoxFade';
  import {getDateStr,parseDate} from "@/utils";
  import trailerUpdate from '@/components/trailer-update';
  import approval from '@/components/approval';
  import startLocation from '@/components/startLocation';
  export default {
    name: 'changeedition',
    data() {
      return {
        tableHeight: 0,
        childHeight: 170,
        trailerVisible:false,
        approvalVisible:false,
        requestTable: this.$root.getChangeboardList,
        loading: false,
        childLoading:false,
        form: {
          start:getDateStr(0) + ' 00:00:00',
          end:getDateStr(0) + ' 23:59:59',
          vinCode: '',
          startLocation: '',
          transPlanCode: '',
          driverName:'',
          trailerPlate:'',
          transCode: '',
          isChange:null,
          pageNum: 1
        },
        showTable: false,
        selectedRadio:null,
        selTabList:[],
        selData:null,
        newColumn: null, //筛选后的列
        filterTime: {
          startDate:getDateStr(0) + ' 00:00:00',
          endDate:getDateStr(0) + ' 23:59:59'
        },
        tableColumn: [
          {type: 'index',label: '序号',align: 'center'},
          {type: 'radio',align: 'center'},
          {prop: 'statusText',label: '是否换板',align: 'center'},
          {prop: 'transPlanCode',label: '拖车计划号',align: 'center'},
          {prop: 'waybillCode',label: '送车通知单号',align: 'center'},
          {prop: 'waybillVehicleNum',label: '运单台数',align: 'center'},
          {prop: 'assignOn',label: '编制日期',align: 'center',
            formatter: (row) => {return row.assignOn? row.assignOn.substring(0,10) : ''}
          },
          {prop: 'intoTime',label: '进门时间',align: 'center'},
          {prop: 'outTime',label: '出门时间',align: 'center'},
          {prop: 'originLocation',label: '出发地',align: 'center'},
          {prop: 'carrierCompanyName',label: '承运商',align: 'center'},
          {prop: 'trailerPlate',label: '挂车车牌号',align: 'center'},
          {prop: 'driverName',label: '司机姓名',align: 'center'},
          {prop: 'driverMobile',label: '司机手机号',align: 'center'}
        ],
        //字表title
        tableChildColumn:[
          {type: 'index',label: '序号',align: 'center'},
          {type: 'selection'},
          {prop: 'transPlanCode',label: '拖车计划号',align: 'center'},
          {prop: 'lgsPlanCode',label: '物流执行计划号',align: 'center'},
          {prop: 'waybillCode',label: '送车通知单号',align: 'center',},
          {prop: 'vinCode',label: 'VIN码',align: 'center'},
          {prop: 'vehicleType',label: '车型',align: 'center'},
          {prop: 'color',label: '颜色',align: 'center'},
          {prop: 'carrierCompanyName',label: '原承运商',align: 'center'},
          {prop: 'trailerPlate',label: '原挂车车牌号',align: 'center'},
          {prop: 'driverName',label: '原司机姓名',align: 'center'},
          {prop: 'changeCarrierCompanyName',label: '换板后承运商',align: 'center'},
          {prop: 'changeTrailerPlate',label: '换板后挂车车牌号',align: 'center'},
          {prop: 'changeDriverName',label: '换板后司机姓名',align: 'center'},
          {prop: 'originLocationName',label: '出发地',align: 'center'},
          {prop: 'targetLocationName',label: '目到地',align: 'center'},
          {prop: 'province',label: '省份',align: 'center'},
          {prop: 'city',label: '城市',align: 'center'},
          {prop: 'moveLocationName',label: '最终搬入地',align: 'center'},
          {prop: 'cancelReason',label: '取消原因',align: 'center'},
          {prop: 'cancelTime',label: '取消时间',align: 'center'},
          {prop: 'changeTransPlanCode',label: '换板拖车计划号',align: 'center'},
          {prop: 'changeBoardMan',label: '换板人',align: 'center'},
          {prop: 'changeOn',label: '换板时间',align: 'center'},
          {prop: 'changeBoardReason',label: '换板原因',align: 'center'}
        ],
        //字表数据
        tableChildData:[]
      }
    },
    watch: {
      filterTime(val) {
        this.form.start = val.startDate;
        this.form.end = val.endDate;
      },
      selectedRadio(n,o){
        if(n){
          this.getChildTable(n);
        }else{
          this.tableChildData = [];
        }
      }
    },
    mounted() {
      this.getTableHeight();
      window.onresize = this.getTableHeight;
    },
    deactivated() {
      window.onresize = null;
    },
    methods: {
      tableResize(e) {
        let clientY = e.clientY;
        let self = this;
        let height = self.tableHeight;
        let childHeight = self.childHeight;
        document.onmousemove = function (ev) {
          let y = ev.clientY;
          if (clientY > y + 10) { //向上拖
            if (self.tableHeight <= 100) {
              return false;
            }
            self.tableHeight = height - (clientY - y);
            self.childHeight = childHeight + (clientY - y);
          } else if (clientY < y + 10) { //向下拖
            if (self.childHeight <= 100) {
              return false;
            }
            self.tableHeight = height + (y - clientY);
            self.childHeight = childHeight - (y - clientY);
          }
        };
        document.onmouseup=function(){
          document.onmousedown=null;
          document.onmousemove=null;
        };
      },
      search() {
        this.form.pageNum = 1;
        this.$refs['table'].requestTableData(this.form);
        // 强制变换一下表格高度，防止固定列错位问题
        this.$nextTick(() => {
          this.tableHeight = this.tableHeight - 1;
          setTimeout(() => {
            this.tableHeight = this.tableHeight + 1;
          },1000)
        })
      },
      reset() {
        this.form = {
          start:getDateStr(0) + ' 00:00:00',
          end:getDateStr(0) + ' 23:59:59',
          vinCode: '',
          startLocation: '',
          transPlanCode: '',
          driverName:'',
          trailerPlate:'',
          transCode: '',
          isChange:null,
          pageNum: 1
        };
        this.filterTime = {
          startDate:getDateStr(0) + ' 00:00:00',
          endDate:getDateStr(0) + ' 23:59:59'
        };
        this.$refs['table'].requestTableData(this.form);
      },
      //获取子列表
      getChildTable(data){
        this.childLoading = true;
        let requestPromise = this.$root.getChangeboardChildList({
          code:data.waybillCode||'',
          version: data.waybillVersion
        });
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          let msg = res.message;
          this.childLoading = false;
          if (!code) {
            this.tableChildData = data;
          }
        });
      },
      getTableHeight() {
        this.$nextTick(() => {
          let height = document.getElementsByClassName('page-content')[0].clientHeight;
          let formHeight = document.getElementsByClassName('search-form')[0].clientHeight;
          let btnHeight = document.getElementsByClassName('operation-box')[0].clientHeight;
          let cTableHeight = document.getElementsByClassName('child-table-box')[0].clientHeight;
          this.tableHeight = height - formHeight - btnHeight - cTableHeight - 54; //45：翻页加一些margin值
        })
      },
      doneFilter(list) {
        this.showTable = false;
        this.newColumn = [...list];
        setTimeout(() => {
          this.showTable = true;
        }, 0)
      },
      toAudit(data) {
        this.$router.push('vehicleDetail?id=' + data.vehicleId);
      },
      //换板
      changeUpdate(){
        if(!this.selectedRadio){
          this.$message.warning('请选择要变更的项目');
          return;
        }
        if(!this.selectedRadio.outTime){
          this.$message.warning('还未出门，不能换板');
          return;
        }
        if(this.selTabList.length<1){
          this.$message.warning('无子表数据，不能换板');
          return;
        }
        if(this.selectedRadio.status&&this.selectedRadio.auditStatus==0){
          this.$message.warning('该记录未审核，不能换板');
          return;
        }
        // var arr = [{value:'',name:'北京'},{value:'',name:'上海'},{value:'',name:'广州'},{value:'',name:'深圳'},{value:'',name:'天津'}];
        // let carrieryCodeArr = [],doal = true;
        // arr.forEach((item)=>{
        //   carrieryCodeArr.push(item.value)
        // });
        // console.log(carrieryCodeArr);
        // carrieryCodeArr.forEach((item,index,arr)=>{
        //   arr.forEach((itm,i,a) => {
        //     if(item != itm){
        //       doal = false;
        //     }
        //   });
        // });
        // console.log(doal);
        let carrieryCodeArr = [],doal = true;
        this.selTabList.forEach((item,index,arr)=>{
          carrieryCodeArr.push(item.changeCarrierCompanyCode);
        });
        carrieryCodeArr.forEach((item,index,arr)=>{
          arr.forEach((itm) => {
            if(item != itm){
              doal = false;
            }
          });
        });
        
        setTimeout(() => {
          if(!doal){this.$message.warning('承运商不同不能换班');return;}
          this.selData = JSON.parse(JSON.stringify(this.selectedRadio));
          this.trailerVisible = true;
        },20);
        
      },
      //换板返回数据
      trailerReturn(data){
        console.log(data);
        let orgin = this.selectedRadio;
        // return;
        let requestPromise = this.$root.getChangeboardChange({
          transPlanCode:orgin.transPlanCode,//拖车计划号
          originLocationCode:orgin.originLocationCode,//出发地编码
          earliestArriveTime:orgin.earliestArriveTime,//最早到达日期+时间
          scheduleArriveTime:orgin.scheduleArriveTime,//预定到达日期+时间
          waybillCode:orgin.waybillCode,//送车通知单号
          waybillVersion: orgin.waybillVersion,
          id: orgin.id,
          // lgsPlanCode:orgin.lgsPlanCode,//物流执行计划号
          // vinCode:orgin.vinCode,//VIN码
          // carrierCompanyCode:orgin.carrierCompanyCode,//原承运商编码
          // carrierCompanyName:orgin.carrierCompanyName,//原承运商
          // headPlate:orgin.headPlate,//原主车车牌号
          // trailerPlate:orgin.trailerPlate,//原挂车车牌号
          // carryQuantity:orgin.carryQuantity,//原拖车装载位数
          // vehicleNo:orgin.vehicleNo,//原车辆编码
          // vehicleType:orgin.vehicleType,//原车型
          // driverName:orgin.driverName,//原司机
          // driverNo:orgin.driverNo,//原司机卡号
          // driverMobile:orgin.driverMobile,//原司机手机
          // driverIdNo:orgin.driverIdNo,//原司机身份证号
          changeCarrierCompanyCode:orgin.carrierCompanyCode,//变更后承运商编码
          changeCarrierCompanyName:orgin.carrierCompanyName,//变更后承运商
          changeHeadPlate:data.changeMainPlateNo,//变更后主车车牌号
          changeTrailerPlate:data.changeTrailerNo,//变更后挂车车牌号
          changeCarryQuantity:data.changeCarryQuantity,//变更拖车装载位数
          changeVehicleNo:data.changeVehicleNo,//变更后车辆编码
          changeVehicleType:data.changeVehicleType,//变更后车型
          changeDriverMobile:data.changeMobile,//变更后司机手机
          changeDriverName:data.changeDriverName,//变更后司机名称
          changeDriverNo:data.changeDriverNo,//变更后司机卡号
          changeDriverIdNo:data.changeDriverIdcard,//变更后司机身份证号
          hasAudit:data.change,//0：否，1是
          reason:data.createdReason,//原因
          rows:this.selTabList
        });
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          let msg = res.message;
          if (!code) {
            this.$message.success('换板成功');
            this.trailerVisible = false;
            this.$refs.table.$emit("requestTable", this.requestParams);
          }
        });
      },
      //审核
      examineFun(data,idx){
        if(!this.selectedRadio){
          this.$message.warning('请选择要删除的项');
          return;
        }
        if(!this.selectedRadio.status && !this.selectedRadio.auditStatus){
          this.$message.warning('该记录无需审核');
          return;
        }
        if(this.selectedRadio.status && this.selectedRadio.auditStatus!=0){
          this.$message.warning('该记录已审核');
          return;
        }
        this.approvalVisible = true;
      },
      //审核返回数据
      approvalReturn(data){
        let requestPromise = this.$root.getChangeboardAudit({
          waybillCode:this.selectedRadio.waybillCode, 
          auditStatus:data.approve||2,
          auditComment:data.reason
        });
        requestPromise.then(res => {
          let data = res.data;
          let msg = res.message;
          if (res.code == 0) {
            this.$message.success('审核成功');
            this.$refs.table.$emit("requestTable", this.requestParams);
          }
        });
      },
      //导出excel
      exportFun(){
        let params = {...this.form};
        let requestPromise = this.$root.getChangeboardExport({
          start: params.start,
          end: params.end,
          vinCode: params.vinCode,
          startLocation: params.startLocation,
          transPlanCode: params.transPlanCode,
          driverName: params.driverName,
          trailerPlate: params.trailerPlate,
          transCode: params.transCode,
          isChange:params.isChange
        });
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          let msg = res.message;
          if (!code) {
            let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `出门后换板列表${parseDate()}.xls`;
            let evt = document.createEvent("MouseEvents");
             evt.initEvent("click",true,true);
             link.dispatchEvent(evt);
            this.$message.success("导出成功");
          }
        });
      }
    },
    components: {
      ztTable,
      columnBox,
      datePicker,
      filterColumn,
      searchBoxFade,
      trailerUpdate,
      approval,
      startLocation
    }
  }
</script>

<style scoped lang="scss">
  .el-form .el-select, .el-form .el-input {
    width: 202px;
  }
  .flex_sc {
    margin-bottom: 10px;
  }
  .tablechild_box{
    padding-top: 30px;
  }
</style>