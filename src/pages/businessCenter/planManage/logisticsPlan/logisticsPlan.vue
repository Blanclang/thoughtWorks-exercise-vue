/*
*  @描述：物流执行计划
*  @作者：邱康松
*  @创建时间：2019/2/27
*/

<template>
  <div class="logistics-plan page-normal">
    <el-form inline label-width="130px" class="search-form">
      <searchBoxFade>
        <template slot="show">
          <el-form-item label="扣款日期：">
            <datePicker v-model="filterTime_kk"></datePicker>
          </el-form-item>
          <el-form-item label="VIN码：">
            <el-input placeholder="请输入" clearable size="small" v-model="form.searchByVinCode" maxlength="25" @keyup.native.enter="search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" size="small">查询</el-button>
            <el-button size="small" @click="reset(null)">重置</el-button>
          </el-form-item>
        </template>
        <template slot="hide">
          <el-form-item label="目的地：">
            <el-input placeholder="请输入" clearable size="small" v-model="form.searchByTargetLocation" maxlength="25" @keyup.native.enter="search"></el-input>
          </el-form-item>
          <el-form-item label="专营店：">
            <el-input placeholder="请输入" clearable size="small" v-model="form.searchByStore" maxlength="25" @keyup.native.enter="search"></el-input>
          </el-form-item>
          <el-form-item label="物流执行计划号：">
            <el-input placeholder="请输入" clearable size="small" v-model="form.searchByCode" maxlength="25" @keyup.native.enter="search"></el-input>
          </el-form-item>
          <el-form-item label="省份：">
            <el-input placeholder="请输入" clearable size="small" v-model="form.searchByProvince" maxlength="25" @keyup.native.enter="search"></el-input>
          </el-form-item>
          <el-form-item label="城市：">
            <el-input placeholder="请输入" clearable size="small" v-model="form.searchByCity" maxlength="25" @keyup.native.enter="search"></el-input>
          </el-form-item>
          <!--<el-form-item label="计划类型：">
            <el-select v-model="form.date" size="small">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="计划" :value="1"></el-option>
              <el-option label="预计划" :value="2"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="是否承运商配板：">
            <el-select v-model="form.isCarrierAssign">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="特殊计划：">
            <el-select v-model="form.searchByExceptionReasonCode">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="item in reasonList" :key="item.code" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出发要求日期：">
            <datePicker v-model="filterTime_cf"></datePicker>
          </el-form-item>
          <el-form-item label="接收日期：">
            <datePicker v-model="filterTime_js"></datePicker>
          </el-form-item>
        </template>
      </searchBoxFade>
    </el-form>
    <column-box no-title="" last style="padding-top: 0" :class="{'fullscreen': isFullscreen}">
      <template slot="body">
        <div class="flex_sc operation-box" style="padding-bottom: 10px">
          <div>
            <el-button size="small" type="primary" @click="showDialog" v-has="'VRES43'" ref="assignBtn">配板</el-button>
            <el-button size="small" @click="cancelSelect">取消选择</el-button>
            <el-button @click="insertPlan" v-has="'VRES102'">插入计划</el-button>
            <el-button size="small" @click="exportExcel" :loading="btnLoading" v-has="'VRES44'">导出</el-button>
            <el-button @click="handleFullscreen">{{isFullscreen?'退出全屏':'全屏模式'}}</el-button>
          </div>
          <div style="display: flex;align-items: center;">
            <el-input style="margin-right: 20px" placeholder="VIN码快速定位" @keyup.native.enter="findVinPosition" v-model="findVinCode" clearable @clear="clearVinCode"></el-input>
            <el-dropdown style="min-width: 134px;margin-right: 10px" trigger="click" placement="bottom" @command="handleCommand" @visible-change="getColorsList">
              <el-button >
                <span
                  :style="{'backgroundColor': colorObj[selectColor]}"
                  class="color-box"
                  style="margin-right: 0"
                  :class="{'hidden':!selectColor}">
                </span>
                超期未配板筛选<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <template v-if="colorList.length === 0">
                  <el-dropdown-item command="loading">
                    <div class="select-item">加载中...</div>
                  </el-dropdown-item>
                </template>
                <template v-else>
                  <el-dropdown-item command="">
                    <div class="select-item">
                      <div class="left">默认</div>
                      <div class="right"><i class="el-icon-check" :class="{'hidden':!!selectColor}"></i></div>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item :command="item.color" v-for="item in colorList" :key="item.color">
                    <div class="select-item">
                      <div class="left">
                        <span class="color-box" :style="{'background-color': colorObj[item.color]}"></span>
                        <span>{{item.count}}</span>
                      </div>
                      <div class="right"><i class="el-icon-check" :class="{'hidden':selectColor!==item.color}"></i></div>
                    </div>
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
            <filterColumn :tableColumn="tableColumn" ref="filter" @doneFilter="doneFilter" :remove-num="2"></filterColumn>
          </div>
        </div>
        <!--表格区域-->
        <div v-loading="loading" element-loading-text="正在加载...">
          <el-tabs v-model="form.searchByOriginLocationCode" type="card" class="tag-box" @tab-click="tabClick">
            <el-tab-pane :name="item.code" v-for="item in fromList" :key="item.code" :_name="item.name">
              <div slot="label" class="el-badge">
                <span>{{item.name+'('+item.count+')'}}</span>
                <!--特急配的数量-->
                <span class="el-badge__content" style="position: absolute;top: 0;" v-if="item.urgentNum > 0">{{item.urgentNum}}</span>
              </div>
            </el-tab-pane>
          </el-tabs>
          <contextMenu :menuList="menuList" @menuClick="menuClick">
            <template slot="body">
              <div class="table-box">
                <div class="my-table">
                  <!--表头-->
                  <div class="t-row t-header" ref="tHeader" style="transform: translateX(0)">
                    <div class="t-cell" v-for="item in (newColumn || tableColumn)" :key="item.prop" :style="'min-width:'+item.width+'px'">
                      <!--未配板天数、实际未配板天数、超期天数tooltip提示-->
                      <template v-if="item.prop === 'noAssignDays' || item.prop === 'realNoAssignDays' || item.prop === 'exceedDays'">
                        {{item.label}}
                        <el-tooltip class="item" effect="light" placement="top">
                          <template slot="content">
                            <div v-if="item.prop === 'exceedDays'">
                              超期天数说明<br/>
                              超期天数= 当前日期-出发要求日期
                            </div>
                            <div v-else>
                              {{item.prop==='noAssignDays' ? '未配板天数颜色说明（N=当前日期-扣款日期）' : '实际未配板天数颜色说明（N=当前日期-接收日期）'}}<br/>
                              蓝： N = 5或3<br/>
                              黄：  5 < N < 7 或 3 < N <7<br/>
                              红：7 =< N =< 14<br/>
                              紫：N >= 15
                            </div>
                          </template>
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                      </template>
                      <template v-else>
                        {{item.label}}
                      </template>
                    </div>
                  </div>
                  <!--表头end-->
                  <p v-show="tableData.length === 0" style="text-align: center">暂无数据</p>
                  <!--表格主体-->
                  <div v-show="tableData.length > 0">
                    <RecycleScroller
                            v-if="showTable"
                            id="scroller"
                            :style="{'height': tableHeight + 'px'}"
                            class="scroller"
                            :items="tableData"
                            :item-size="30"
                            key-field="id"
                    >
                      <template v-slot="{ item }" class="user">
                        <div style="line-height: 30px;height: 30px" class="t-row" @dblclick="dblclickRow(item)">
                          <div class="t-cell"
                               v-for="(cell,index) in (newColumn || tableColumn)"
                               :key="cell.prop"
                               :style="{'min-width':cell.width+'px','background-color':formatColor(item,cell)}"
                               :class="{'check-store': selectionList.indexOf(item.id) !== -1 && (cell.prop==='store' || cell.prop==='vinCode'), 'grey': item.isEven, 'find-result': item.vinCode===findResult}">
                            <el-checkbox
                                    :value="selectionList.indexOf(item.id) !== -1"
                                    @change="changeSelect(item)"
                                    v-if="cell.type==='selection'">
                              &nbsp;
                            </el-checkbox>
                            <el-tag effect="dark" :type="formatTag(item).type" v-if="cell.type==='tag'&&!!item.planStatus" size="mini">
                              {{item.planStatus}}
                            </el-tag>
                            <span :class="{'sub-total': item.isTotal}" @mouseover="showToolTip" @mouseout="isShowToolTip=false">
                              {{cell.formatter ? cell.formatter(item) : item[cell.prop]}}
                            </span>
                          </div>
                        </div>
                      </template>
                    </RecycleScroller>
                  </div>
                  <!--表格主体end-->
                </div>
              </div>
            </template>
          </contextMenu>
        </div>
        <div class="total-fixed">
          <span>总计：{{totalPlanNum}}</span>
          <span>选择台数：{{selectionList.length}}</span>
          <span v-for="(value,key) in selectCityObj" :key="key">{{key}}：{{value}}</span>
          <span>专营店数量：{{Object.keys(storeObj).length}}</span>
        </div>
      </template>
    </column-box>
    <!--文本溢出tooltip-->
    <div class="el-tooltip__popper is-light" x-placement="top-start" :style="options" v-show="isShowToolTip">
      {{toolTipText}}
      <div x-arrow="" class="popper__arrow"></div>
    </div>
    <!--配板弹窗-->
    <peiBan :visible.sync="visible" :selectData="selectData" @success="getList"></peiBan>
    <!--插入计划弹窗-->
    <insert-plan :visible.sync="insertVisible" :selectData="selectData" @success="getList"></insert-plan>
  </div>
</template>

<script>
  import columnBox from '../../../../components/zt-column-box';
  import filterColumn from '../../../../components/filterColumn';
  import searchBoxFade from '../../../../components/searchBoxFade';
  import peiBan from './peiBan';
  import contextMenu from '../../../../components/contextMenu';
  import {renderHeader,getBetweenDay,parseDate} from "../../../../utils";
  import datePicker from '../../../../components/datePicker';
  import { RecycleScroller } from 'vue-virtual-scroller';
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
  import insertPlan from './insertPlan';

  export default {
    name: 'logisticsPlan',
    data() {
      return {
        colorObj: {
          blue: '#07A3FF',
          yellow: '#FFF21C',
          red: '#FF5A51',
          purple: '#F231FF'
        },
        selectColor: null, //超期未配板筛选
        colorList: [], //超期未配板下拉列表
        insertVisible: false,
        isFullscreen: false, //全屏模式
        findVinCode: '',
        findResult: '', //vin码模糊快速定位后最终匹配的vin码
        totalPlanNum: 0, //计划总数
        options: {},
        reasonList: [], //计划异常原因
        toolTipText: '',
        isShowToolTip: false,
        isFirst: true,
        btnLoading: false,
        fromList: [], //出发地列表
        compareNum: null, //当前出发地tab的配板时效
        tableHeight: 0,
        menuList: ['配板','取消选择'],
        activeName: '',
        showBox: false,
        visible: false,
        loading: false,
        form: {
          searchByPlanIds: null, //超期未配板筛选
          companyCode: this.$store.getters.getCompanyCode,
          userCode: this.$store.getters.getUserCode,
          searchByWithholdStartDate: '', //扣款日期
          searchByWithholdEndDate: '',
          searchByVinCode: '', //VIN
          searchByCode: '', //物流执行计划号
          searchByTargetLocation: '', //目的地
          searchByStore: '', //专营店
          searchByProvince: '', //省份
          searchByCity: '', //城市
          isCarrierAssign: null, //是否承运商配板
          searchByReceiveStartOn: '', //接收日期
          searchByReceiveEndOn: '',
          searchByExceptionReasonCode: null, //特殊计划
          searchByRequireStartTime: '', //出发时间
          searchByRequireEndTime: '',
          searchByOriginLocationCode: null //出发地
        },
        showTable: false,
        tableData: [],
        selectionList: [],
        totalSelectList: [], //小计勾选框
        newColumn: null, //筛选后的列
        filterTime_kk: {}, //扣款日期
        filterTime_js: {}, //接收日期
        filterTime_cf: {}, //出发日期
        tableColumn: [
          {
            prop: 'index',
            label: '序号',
            width: 50
          },
          {
            type: 'selection',
            prop: 'select',
            label: '选择',
            width: 50
          },
          {
            type: 'tag',
            label: '计划状态',
            prop: 'status',
            align: 'center',
            width: 80
          },
          {
            label: '省份',
            prop: 'province',
            width: 100,
          },
          {
            label: '城市',
            prop: 'city',
            width: 100,
          },
          {
            label: '配板地',
            prop: 'assignLocation',
            width: 170
          },
          {
            label: '工厂',
            prop: 'factory',
            width: 50,
          },
          {
            label: '实际未配板天数',
            prop: 'realNoAssignDays',
            width: 150,
            renderHeader: renderHeader
          },
          {
            label: '预计订单到达日',
            prop: 'scheduledArriveDate',
            renderHeader: renderHeader,
            width: 120,
            formatter: (row) => {
              return this.formatDate(row.scheduledArriveDate);
            }
          },
          {
            label: '配板预定日',
            prop: 'configureScheduleDate',
            renderHeader: renderHeader,
            width: 120,
            formatter: (row) => {
              return this.formatDate(row.configureScheduleDate);
            }
          },
          {
            label: '扣款日期',
            prop: 'withholdDate',
            width: 120,
            formatter: (row) => {
              return this.formatDate(row.withholdDate);
            }
          },
          {
            label: '专营店',
            prop: 'store',
            width: 215
          },
          {
            label: '承运商',
            prop: 'mainPowerName',
            width: 215
          },
          /*{
            label: '轮板承运商',
            prop: 'mainPowerCarrierCompanys',
            width: 215,
            formatter: (row) => {
              if (row.lineTypeName === '轮板') {
                return row.mainPowerCarrierCompanys.map(item => item.companyName).join('/')
              }
              return '';
            }
          },*/
          {
            label: '承运商配板',
            prop: 'isCarrierAssign',
            renderHeader: renderHeader,
            width: 90,
            formatter: (row) => {
              if (row.isCarrierAssign === undefined) {
                return '';
              }
              return +row.isCarrierAssign === 1 ? '是' : '否';
            }
          },
          {
            label: '运输方式',
            prop: 'transportWay',
            width: 100,
          },
          {
            label: '是否NG',
            prop: 'isNg',
            width: 80,
          },
          {
            label: '发运次序',
            prop: 'assignOrder',
            width: 80,
          },
          {
            label: '最终搬入地',
            prop: 'finalLocation',
            renderHeader: renderHeader,
            width: 170
          },
          /*{
            label: '预计划',
            prop: 'scheduleConfigurePlanCode'
          },*/
          {
            label: '运输天数',
            prop: 'transportDays',
            width: 100,
          },
          {
            label: '未配板天数',
            prop: 'noAssignDays',
            renderHeader: renderHeader,
            width: 120,
          },
          {
            label: '超期天数',
            prop: 'exceedDays',
            width: 100,
          },
          {
            label: '物流执行计划号',
            prop: 'code',
            renderHeader: renderHeader
          },
          {
            label: 'VIN码',
            prop: 'vinCode',
            width: 153
          },
          {
            label: '车型',
            prop: 'vehicleName',
            width: 170
          },
          {
            label: '车型简称',
            prop: 'vehicleType',
            width: 170
          },
          {
            label: '颜色',
            prop: 'color'
          },
          {
            label: '出发地',
            prop: 'originLocation',
            width: 170
          },
          {
            label: '最终结算地',
            prop: 'finalSettleLocation',
            renderHeader: renderHeader,
            width: 170
          },
          {
            label: '目的地',
            prop: 'targetLocation',
            width: 170
          },
          {
            label: '搬入地',
            prop: 'moveLocation',
            width: 170
          },
          {
            label: '出发要求时间',
            prop: 'requireStartTime',
            renderHeader: renderHeader
          },
          /*{
            label: '配板日期',
            prop: 'c5'
          },
          {
            label: '拖车计划号',
            prop: 'c6',
            renderHeader: renderHeader
          },*/
          {
            label: '到达要求时间',
            prop: 'requireArriveTime',
            renderHeader: renderHeader
          },
          {
            label: '发动机号',
            prop: 'engineCode'
          },
          {
            label: '合格证号',
            prop: 'certificateQualificationCode'
          },
          {
            label: '运输类型',
            prop: 'transportType'
          },
          {
            label: '要求返回计划时间',
            prop: 'requireBackTime',
            renderHeader: renderHeader
          },
          {
            label: '资金方式',
            prop: 'moneyWay'
          },
          {
            label: '备注',
            prop: 'remark'
          },
          {
            label: '途径简称',
            prop: 'pointShortName',
            width: 200
          },
          {
            label: '预定受入日期',
            prop: 'scheduledAcceptDate',
            renderHeader: renderHeader
          },
          {
            label: '库位号',
            prop: 'inventoryNumber'
          },
          {
            label: '质量状态',
            prop: 'qualificationStatus',
            width: 100,
          },
          {
            label: '大区',
            prop: 'bigArea',
            width: 100,
          },
          {
            label: '区域编码',
            prop: 'areaCode',
            width: 100,
          },
          {
            label: '特殊计划',
            prop: 'reason',
            width: 100,
          },
          {
            label: '特殊计划备注',
            prop: 'exceptionRemark',
            width: 215,
          },
          {
            label: '操作特殊计划人',
            prop: 'exceptionModifiedName',
            width: 120,
          },
          {
            label: '操作特殊计划时间',
            prop: 'exceptionModifiedOn',
            width: 140,
          },
          {
            label: '物流计划发布时间',
            prop: 'planPublishTime',
            renderHeader: renderHeader
          },
          {
            label: '接收时间',
            prop: 'receiveOn'
          },
          {
            label: '预配板计划号',
            prop: 'scheduleConfigurePlanCode',
            renderHeader: renderHeader
          },
        ]
      }
    },
    mounted() {
      this.getList();
      this.getTableHeight();
      this.getTransType();
      window.onresize = this.getTableHeight; //窗口变化就从新计算高度
      let self = this;
      //监控直接按esc退出全屏，就重新计算表格高度（只针对webkit内核）
      document.addEventListener("webkitfullscreenchange", function () {
        var isFull = document.fullscreenElement    ||
          document.msFullscreenElement  ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement || false;
        if (!isFull) {
          self.isFullscreen = false;
          self.getTableHeight();
        }
      }, false);
    },
    activated() {
      this.$refs['tHeader'].style.transform = `translateX(0px)`;
      let table = document.getElementById('scroller');
      if (table) { //强制移动滚动条，防止出现在其他页面切换回来，表格内容样式错误
        table.scrollLeft = 1;
        table.scrollLeft = 0;
      }
    },
    deactivated() {
      window.onresize = null;
    },
    watch: {
      showTable(val) {
        if (val) {
          this.$nextTick(() => {
            document.getElementById('scroller').onscroll = this.onscroll; //监听左右滑动滚动条，移动表头
          })
        }
      },
      filterTime_kk(val) {
        this.form.searchByWithholdStartDate = val.startDate;
        this.form.searchByWithholdEndDate = val.endDate;
      },
      filterTime_cf(val) {
        this.form.searchByRequireStartTime = val.startDate;
        this.form.searchByRequireEndTime = val.endDate;
      },
      filterTime_js(val) {
        this.form.searchByReceiveStartOn = val.startDate;
        this.form.searchByReceiveEndOn = val.endDate;
      },
      activeName(val) { //监听tab变动，获取当前tab下面的配板时效
        this.compareNum = this.fromList.filter(item => val === item.name)[0].deadlineDays;
      },
    },
    computed: {
      selectCityObj() { //勾选的车辆城市信息
        return this.getSelectDataFun('city');
      },
      storeObj() { //勾选的门店数量
        return this.getSelectDataFun('store');
      },
      selectData() {
        return this.tableData.filter(item => this.selectionList.indexOf(item.id) !== -1);
      },
    },
    methods: {
      //超期未配板筛选下拉菜单展开时
      getColorsList(val) {
        if (val) {
          this.$root.getColorsList().then(res => {
            if (res.code === 0) {
              this.colorList = res.data || [];
            }
          })
        }
      },
      //超期未配板筛选
      handleCommand(val) {
        if (val === 'loading') return false;
        this.selectColor = val;
        let obj = this.colorList.find(item => item.color === val);
        this.reset(obj && obj.planIds); //筛选超期未配板，其他的搜索需要清空，如果点击查询按钮，超期未配板筛选需要清空
      },
      // 格式化计划状态标签
      formatTag(row) {
        if (row.planStatus === '特急') {
          return {
            type: 'danger',
            name: '特急'
          }
        } else if (row.planStatus === '急') {
          return {
            type: 'warning',
            name: '急'
          }
        } else if (row.planStatus === '改送') {
          return {
            type: '',
            name: '改送'
          }
        } else if (row.planStatus === '缓发') {
          return {
            type: 'success',
            name: '缓发'
          }
        } else {
          return null;
        }
      },
      //插入计划
      insertPlan() {
        if (this.selectData.length === 0) {
          this.$message.warning('请先选择计划');
          return false;
        }
        // 承运商配板为’是‘才可以配板
        if (this.selectData.some(item => item.isCarrierAssign !== 1)) {
          this.$message.warning('没有配板权限，无法配板！');
          return false;
        }
        if (this.activeName.match('花都')) {
          // 花都中心库的新老厂不能一起配板
          if (this.selectData.some(item => item.factory === '新厂') && this.selectData.some(item => item.factory === '老厂')) {
            this.$message.warning('同一板必须发自同一个厂！');
            return false;
          }
        }
        if (this.activeName.match('上海')) {
          //上海大区的AB/C厂不能一起配板
          let flag1 = this.selectData.some(item => item.bigArea === 'A' || item.bigArea === 'B');
          let flag2 = this.selectData.some(item => item.bigArea === 'C');
          if (flag1 && flag2) {
            this.$message.warning('同一板必须发自同一个厂！');
            return false;
          }
        }
        // 轮板和专线不能一起配
        if (this.selectData.some(item => item.lineTypeName !== this.selectData[0].lineTypeName)) {
          this.$message.warning('同一板必须是同一个线路类型！');
          return false;
        }
        // 专线承运商必须一致，轮板即轮板承运商必须一致
        let lineType = this.selectData[0].lineTypeName;
        if (this.selectData.length > 1) {
          if (lineType === '轮板') {
            if (this.selectData.some(item => item.mainPower !== this.selectData[0].mainPower)) {
              this.$message.warning('同一板必须承运商一致！');
              return false;
            }
          } else {
            if (this.selectData.some(item => item.carrierCompanyCode !== this.selectData[0].carrierCompanyCode)) {
              this.$message.warning('同一板必须承运商一致！');
              return false;
            }
          }
        }
        this.insertVisible = true;
      },
      //获取计划异常原因
      getTransType() {
        this.$root.getDictByTypes({
          types: '18.20'
        }).then(res => {
          if (res.code === 0) {
            this.reasonList = res.data['18.20'] || [];
          }
        })
      },
      handleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        if (this.isFullscreen) {
          this.inFullscreen();
        } else {
          this.outFullscreen();
        }
        setTimeout(() => {
          this.getTableHeight();
        },10);
      },
      //进入浏览器全屏
      inFullscreen() {
        let docElm = document.documentElement;
        //W3C
        if(docElm.requestFullscreen) {
          docElm.requestFullscreen();
        }

        //FireFox
        else if(docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        }

        //Chrome等
        else if(docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        }

        //IE11
        else if(elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      },
      //退出浏览器全屏
      outFullscreen() {
        //W3C
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        //FireFox
        else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
        //Chrome等
        else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
        //IE11
        else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      },
      //清空定位vinCode的背景色
      clearVinCode() {
        this.findResult = '';
      },
      //vin码快速定位
      findVinPosition() {
        //通过找到该vin码在数组中的下标，然后乘以行高30，就可以定位到该vin码的位置
        if (this.findVinCode.length < 4) {
          this.$message.warning('请至少输入4位数！');
          return false;
        }
        if (this.tableData.length === 0) {
          return false;
        }
        let index = this.tableData.findIndex(item => item.vinCode && item.vinCode.match(this.findVinCode));
        if (index === -1) {
          this.findResult = '';
          this.$message.warning(this.activeName + '下暂无此VIN码！');
          return false;
        } else {
          this.findResult = this.tableData[index].vinCode;
        }
        document.getElementById('scroller').scrollTop = index * 30;
      },
      // 复选框勾选事件
      changeSelect(row) {
        if (this.selectionList.indexOf(row.id) !== -1) {
          //取消勾选
          this.selectionList.indexOf(row.id) > -1 && this.selectionList.splice(this.selectionList.indexOf(row.id),1);
        } else {
          //勾选
          this.selectionList.push(row.id);
        }
        // $set一下，触发视图更新
        this.$set(this.$data, 'selectionList', this.selectionList);
      },
      showToolTip(el) {
        let parentNode = el.currentTarget.parentNode;
        let containerLength = parentNode.clientWidth;
        let textLength = parentNode.scrollWidth;
        if (textLength > containerLength) { //如果是溢出才显示tooltip
          let obj = el.currentTarget.getBoundingClientRect();
          this.options = {
            position: 'fixed',
            top: (obj.top - 50) + 'px',
            left: obj.left + 'px'
          };
          this.toolTipText = el.currentTarget.innerText;
          this.isShowToolTip = true;
        }
      },
      exportExcel() {
        this.btnLoading = true;
        let obj = {...this.form};
        delete obj.searchByOriginLocationCode;
        this.$root.exportLgsPlan(obj).then(res => {
          this.btnLoading = false;
          if (!res.code) {
            let blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `物流执行计划${parseDate()}.xls`;
            let evt = document.createEvent("MouseEvents");
             evt.initEvent("click",true,true);
             link.dispatchEvent(evt);
            this.$message.success("导出成功");
          }
        }).catch(() => {
          this.btnLoading = false;
        })
      },
      tabClick(tab) {
        this.activeName = tab.$attrs._name;
        this.form.searchByOriginLocationCode = tab.name;
        this.getList(true);
      },
      formatColor(row,cell) {
        //未配板天数和实际未配板天数需要判断显示颜色
        if ((cell.prop === 'noAssignDays' || cell.prop === 'realNoAssignDays') && this.compareNum) { //配板时效存在才显示颜色
          let key = cell.prop;
          if (row[key] === this.compareNum) {
            return '#07a3ff';
          } else if (this.compareNum < row[key] && row[key] < 7) {
            return '#fff21c';
          } else if (7 <= row[key] && row[key] <= 14) {
            return '#ff5a51';
          } else if (row[key] >= 15) {
            return '#f231ff';
          }
        }
        return '';
      },
      onscroll(event) { //移动表头
        this.$refs['tHeader'].style.transform = `translateX(-${event.currentTarget.scrollLeft}px)`
      },
      getTableHeight() { //动态设置表格高度
        this.$nextTick(() => {
          if (this.isFullscreen) {
            let height = document.getElementsByClassName('fullscreen')[0].clientHeight;
            let btnHeight = document.getElementsByClassName('operation-box')[0].clientHeight;
            let footerHeight = document.getElementsByClassName('total-fixed')[0].clientHeight;
            let tagHeight = 35;
            this.tableHeight = height - btnHeight - footerHeight - tagHeight - 65;
          } else {
            let height = document.getElementsByClassName('page-content')[0].clientHeight;
            let formHeight = document.getElementsByClassName('search-form')[0].clientHeight;
            let btnHeight = document.getElementsByClassName('operation-box')[0].clientHeight;
            let footerHeight = document.getElementsByClassName('total-fixed')[0].clientHeight;
            let tagHeight = 35;
            this.tableHeight = height - formHeight - btnHeight - footerHeight - tagHeight - 45;
          }
        });
      },
      menuClick(name) { //右键菜单点击
        if (name === '配板') {
          if (this.selectionList.length === 0) {
            this.$message.warning("请先选择计划");
            return false;
          }
          if (this.$refs['assignBtn'].$el.getAttribute('disabled') === 'disabled') {
            this.$message.warning('你无配板使用权限');
          } else {
            this.showDialog();
          }
        } else if (name === '取消选择') {
          this.cancelSelect();
        } else if (name.match('全屏')) {
          this.handleFullscreen();
        }
      },
      showDialog() {
        if (this.selectData.length === 0) {
          this.$message.warning('请先选择计划');
          return false;
        }
        // 承运商配板为’是‘才可以配板
        if (this.selectData.some(item => item.isCarrierAssign !== 1)) {
          this.$message.warning('没有配板权限，无法配板！');
          return false;
        }
        if (this.activeName.match('花都')) {
          // 花都中心库的新老厂不能一起配板
          if (this.selectData.some(item => item.factory === '新厂') && this.selectData.some(item => item.factory === '老厂')) {
            this.$message.warning('同一板必须发自同一个厂！');
            return false;
          }
        }
        if (this.activeName.match('上海')) {
          //上海大区的AB/C厂不能一起配板
          let flag1 = this.selectData.some(item => item.bigArea === 'A' || item.bigArea === 'B');
          let flag2 = this.selectData.some(item => item.bigArea === 'C');
          if (flag1 && flag2) {
            this.$message.warning('同一板必须发自同一个厂！');
            return false;
          }
        }
        // 轮板和专线不能一起配
        if (this.selectData.some(item => item.lineTypeName !== this.selectData[0].lineTypeName)) {
          this.$message.warning('同一板必须是同一个线路类型！');
          return false;
        }
        // 专线承运商必须一致，轮板即轮板承运商必须一致
        let lineType = this.selectData[0].lineTypeName;
        if (this.selectData.length > 1) {
          if (lineType === '轮板') {
            if (this.selectData.some(item => item.mainPower !== this.selectData[0].mainPower)) {
              this.$message.warning('同一板必须承运商一致！');
              return false;
            }
          } else {
            if (this.selectData.some(item => item.carrierCompanyCode !== this.selectData[0].carrierCompanyCode)) {
              this.$message.warning('同一板必须承运商一致！');
              return false;
            }
          }
        }
        this.visible = true;
      },
      getSelectDataFun(key) {
        let selectList = this.selectData,
            obj = {};
        for (let i = 0; i < selectList.length; i++) {
          let cityName = selectList[i][key] || '未设置';
          if (!obj[cityName]) {
            obj[cityName] = 1;
          } else {
            obj[cityName] += 1;
          }
        }
        return obj;
      },
      search() {
        this.form.searchByPlanIds = null; //点击搜索清空超期未配板筛选
        this.selectColor = null;
        this.getList();
      },
      reset(planIds) {
        if (!planIds) this.selectColor = null;
        this.form = {
          companyCode: this.$store.getters.getCompanyCode,
          userCode: this.$store.getters.getUserCode,
          searchByWithholdStartDate: '', //扣款日期
          searchByWithholdEndDate: '',
          searchByVinCode: '', //VIN
          searchByCode: '', //物流执行计划号
          searchByTargetLocation: '', //目的地
          searchByStore: '', //专营店
          searchByProvince: '', //省份
          searchByCity: '', //城市
          isCarrierAssign: null, //是否承运商配板
          searchByReceiveStartOn: '', //接收日期
          searchByReceiveEndOn: '',
          searchByExceptionReasonCode: null, //特殊计划
          searchByRequireStartTime: '', //出发时间
          searchByRequireEndTime: '',
          searchByOriginLocationCode: this.form.searchByOriginLocationCode, //出发地
          searchByPlanIds: planIds //超期未配板筛选
        };
        this.filterTime_kk = {}; this.filterTime_cf = {}; this.filterTime_js = {};
        this.getList();
      },
      doneFilter(list) {
        this.newColumn = [...list];
      },
      cancelSelect() { //取消选择
        this.selectionList = [];
        this.totalSelectList = [];
      },
      getFromList() {//获取出发地列表
        return new Promise((resolve, reject) => {
          this.$root.getFromList(this.form).then(res => {
            if (res.code === 0) {
              this.fromList = res.data || [];
              this.totalPlanNum = this.fromList.reduce((total,item) => total + item.count,0); //获取总数
              this.$nextTick(() => {
                // 如果是第一次进来，就默认取第一个出发地搜索
                if (this.isFirst) {
                  this.activeName = this.fromList[0] && this.fromList[0].name;
                  this.form.searchByOriginLocationCode = this.fromList[0] && this.fromList[0].code;
                }
                // 如果把当前tab下面的计划都全部配板成功了，即重新获取第一个出发地进行搜索
                if (this.fromList.length > 0 && !this.fromList.some(item => item.name === this.activeName)) {
                  // 出发地列表里面找不到当前搜索的出发地名称，即说明已经不存在了
                  this.activeName = this.fromList[0].name;
                  this.form.searchByOriginLocationCode = this.fromList[0].code;
                }
              });
              resolve();
            } else {
              reject();
            }
          }).catch(() => {
            reject();
          })
        })
      },
      getList(changeTab) {
        if (getBetweenDay(this.form.searchByWithholdStartDate,this.form.searchByWithholdEndDate) > 90) {
          this.$message.warning('扣款日期查询区间不得超过90天！');
          return false;
        }
        if (getBetweenDay(this.form.searchByReceiveStartOn,this.form.searchByReceiveEndOn) > 90) {
          this.$message.warning('接收日期查询区间不得超过90天！');
          return false;
        }
        if (getBetweenDay(this.form.searchByRequireStartTime,this.form.searchByRequireEndTime) > 90) {
          this.$message.warning('出发要求日期查询区间不得超过90天！');
          return false;
        }
        this.selectionList = []; //重置勾选列表
        this.totalSelectList = []; //重置小计行勾选
        this.tableData = [];
        this.loading = true;
        if (!this.isFirst) {
          this.showTable = false;
        }
        this.getFromList(changeTab).then(() => {
          this.$root.getLogisticsPlan(this.form).then(res => {
            this.loading = false;
            if (res.code === 0) {
              this.tableData = this.formatList(res.data || []);
              setTimeout(() => {
                this.$refs['tHeader'].style.transform = `translateX(0px)`;
                this.showTable = true;
              },0)
            }
          }).catch(() => {
            this.loading = false;
          })
        }).catch(() => {
          this.loading = false;
        });
        this.isFirst = false;
      },
      formatList(list) {
        let newList = [];
        let num = 0; //添加一列自定义序号
        let evenNum = 0; // 用来判断行数是否是偶数，偶数行显示背景色,列表插件滑动后dom的顺序会混乱，所以不能用css的even选择器来控制
        for (let i = 0; i < list.length; i++) {
          evenNum += 1;
          newList.push({
            ...list[i],
            index: ++num,
            storeCode: list[i].storeCode,
            isEven: evenNum % 2 === 0 //偶数行，用来标识是否显示灰色背景
          });
        }
        return newList;
      },
      dblclickRow(row,event) {
        if (!row.store) { //没有专营店，不做操作
          return false;
        }
        let selectArr = this.tableData.filter(item => {
          return item.store === row.store;
        }).map(item => item.id);
        let flag = selectArr.some(item => this.selectionList.indexOf(item) === -1);
        if (flag) { //如果双击的专营店有一个没有勾上，即默认把相同的专营店全部勾上
          this.selectionList = Array.from(new Set(this.selectionList.concat(selectArr))); //去重
        } else { //如果已经全部勾上了，再次双击就是取消勾选
          selectArr.forEach(item => {
            this.selectionList.indexOf(item) > -1 && this.selectionList.splice(this.selectionList.indexOf(item),1);
          });
        }
      },
    },
    components: {
      columnBox,
      peiBan,
      filterColumn,
      searchBoxFade,
      contextMenu,
      datePicker,
      RecycleScroller,
      insertPlan
    }
  }
</script>

<style scoped lang="scss">
  .page-normal {
    padding-bottom: 30px !important;
  }
  .hidden {
    display: none !important;
  }
  .el-dropdown {
    font-size: 12px !important;
  }
  .color-box {
    display: inline-block;
    height: 14px;
    width: 14px;
    margin-right: 5px;
    vertical-align: sub;
  }
  .select-item {
    display: flex;
    justify-content: space-between;
    width: 130px;
    font-size: 12px;
    .right {
      color: #409EFF;
      .el-icon-check {
        font-weight: 600 !important;
      }
    }
  }
  .logistics-plan /deep/ {
    .fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      padding-top: 10px !important;
      z-index: 100;
      background-color: #ffffff;
    }
    .table-box {
      border:1px solid #EBEEF5;
      overflow: hidden;
    }
    .my-table {
      margin-left:-1px;
      border-bottom-width:0;
      border-left-width:0;
      text-align:left;
      line-height:40px;
      box-sizing:border-box;
      -moz-box-sizing:border-box; /* Firefox */
      -webkit-box-sizing:border-box; /* Safari */
      .vue-recycle-scroller__item-wrapper {
        overflow: initial;
      }
      .el-checkbox-group {
        font-size: 12px;
      }
      .t-header .t-cell {
        background-color: #EBEEF5;
        text-align: center;
      }
      .t-row {
        display: flex;
        &:not(.t-header):hover .t-cell {
          background-color: #D8E3FF;
        }
        .t-cell {
          text-align: center;
          border-bottom: 1px solid #EBEEF5;
          border-left: 1px solid #EBEEF5;
          flex: 1;
          white-space: nowrap;
          line-height: 30px;
          padding: 0 10px;
          min-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          &.grey {
            background-color: #F9F9F9;
          }
          &.find-result {
            background-color: #b4ec99;
          }
          &:nth-child(2) {
            text-overflow: initial;
          }
          .el-checkbox {
            margin-right: 0;
            margin-left: 7px;
          }
        }
      }
    }
    .sub-total {
      color: #F56C6C;
    }
    .check-store {
      background-color: #62ff75 !important;
    }
    .search-form .el-select, .search-form .el-input {
      width: 202px;
    }
    .search-form .el-form-item {
      margin-bottom: 10px;
    }
    th.el-table-column--selection {
      .el-checkbox {
        display: none;
      }
    }
    .el-table-column--selection .is-disabled {
      display: none;
    }
    .total-fixed {
      position: absolute;
      bottom: 10px;
      width: calc(100% - 24px);
      padding: 0 10px;
      color: #1989FA;
      line-height: 30px;
      left: 12px;
      z-index: 99;
      background-color: rgba(255, 255, 255, 0.7);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      span {
        display: inline-block;
        margin-right: 20px;
      }
    }
    .el-date-editor.el-input {
      width: 202px;
    }
    th {
      background-color: #EBEEF5;
    }
    .el-tabs {
      .el-tabs__nav-next, .el-tabs__nav-prev {
        line-height: 35px;
      }
      .el-tabs__header {
        margin-bottom: 0;
        background-color: #ffffff;
        border: none;
      }
      .el-tabs__nav {
        border: none;
      }
      .el-tabs__item {
        font-size: 12px;
        height: 35px;
        line-height: 35px;
        border: none;
        &:hover {
          background-color: #F9F9F9;
          border-radius: 4px 4px 0 0;
          color: #4A4A4A;
        }
        &.is-active {
          background-color: #EBEEF5;
          border-radius: 4px 4px 0 0;
          color: #4A4A4A;
        }
      }
    }
  }
</style>