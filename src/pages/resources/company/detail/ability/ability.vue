/*
*  @描述：能力调查报表
*  @作者：白朗
*  @创建时间：2019/7/11
*/
<template>
  <div class="page-normal">
    <column-box title="能力调查表" style="border-bottom:none;">
      <template slot="body">
        <div v-if="!isView" class="flex_lc" style="margin-bottom: 10px">
          <div style="margin-right: 30px">能力调查表年份：
            <el-select placeholder="请选择代码类型" v-model="tableFrom.year" style="width:150px;">
              <el-option v-for="item in yearArrs" :label="item" :value="item" :key="item" ></el-option>
            </el-select>
          </div> 
          <el-button type="primary" @click="openDialog">新增能力调查表</el-button>
        </div>
        <!-- <zt-table ref="table" :pagination="false" :selection="false" :tableColumn="tableColumn" :request="requestTable" :requestParams="requestParams"></zt-table> -->
        <zt-table ref="table" :pagination="false" :tableColumn="tableColumn" :tableData="tableDatas"/>
      </template>
    </column-box>
    <!-- 新增修改弹框 -->
    <el-dialog :title="addeaitType?'编辑能力调查表':'新增能力调查表'" :visible.sync="addvisible" width="900px" class="ability_dialog" :before-close="closeDialog">
      <div class="dialog_con">
        <ul>
          <li>
            <div class="tab_tit flex_lc">
              <div class="tit_left flex_lc">
                1、<div class="required">*</div>纳税人资格：
              </div>
              <div>
                <el-radio-group v-model="tableFrom.taxType">
                  <el-radio v-for="item in nslist" :key="item.code" :label="item.code">{{item.name}}</el-radio>
                </el-radio-group>
              </div>
            </div>
          </li>
          <li>
            <div class="tab_tit">
              <div class="tit_left flex_lc">
                2、<div class="required">*</div>整车运输销售信息<span>（填写至少近一年数据）</span>
              </div>
              <div class="table_con">
                <div class="table_comp">
                  <div class="tab_tr title">
                    <div class="tab_td" style="width:8%">序号</div>
                    <div class="tab_td" style="width:22%"><span>*</span>年份</div>
                    <div class="tab_td" style="width:20%"><span>*</span>年销售总额(元)</div>
                    <div class="tab_td" style="width:25%"><span>*</span>供应捷通年销售额(元)</div>
                    <div class="tab_td" style="width:25%"><span>*</span>主要客户</div>
                  </div>
                  <div class="navtab_body">
                    <div class="tab_tr" v-for="(item,index) in tableFrom.sales" :key="index">
                      <div class="tab_td"  style="width:8%">{{index+1}}</div>
                      <div class="tab_td" style="width:22%"><el-input size="mini" type="number" v-model="item.year" :placeholder="index == 0?'必填':''"></el-input></div>
                      <div class="tab_td" style="width:20%"><el-input size="mini" type="number" v-model="item.saleMoney" :placeholder="index == 0?'必填':''"></el-input></div>
                      <div class="tab_td" style="width:25%"><el-input size="mini" type="number" v-model="item.jtSaleMoney" :placeholder="index == 0?'必填':''"></el-input></div>
                      <div class="tab_td" style="width:25%"><el-input size="mini" type="text" v-model="item.customer" :placeholder="index == 0?'必填':''"></el-input></div>
                    </div>
                    <div v-if="tableFrom.sales.length==0" class="tab_tr body" style="justify-content:center;height:35px;">暂无数据</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="tab_tit">
              <div class="tit_left flex_lc">
                3、<div class="required">*</div>质量体系情况（请务必上传有效证书，<span>如无证书，填否</span>）（证书可上传JPG、JPEG、PNG、PDF格式文件）
              </div>
              <div class="table_con">
                <div class="table_comp">
                  <div class="tab_tr title">
                    <div class="tab_td" style="width:5%">序号</div>
                    <div class="tab_td" style="width:15%">证书类型</div>
                    <div class="tab_td" style="width:14%"><span>*</span>是否认证</div>
                    <div class="tab_td" style="width:28%">有限期</div>
                    <div class="tab_td" style="width:14%">证书图片</div>
                    <div class="tab_td" style="width:24%">备注</div>
                  </div>
                  <div class="navtab_body">
                    <div class="tab_tr" v-for="(item,index) in tableFrom.licenses" :key="index">
                      <div class="tab_td" style="width:5%">{{index+1}}</div>
                      <div class="tab_td" style="width:15%">{{item.licenseType}}</div>
                      <div class="tab_td" style="width:14%">
                        <el-select v-model="item.hasLiscense" size="mini" placeholder="请选择" @change="liscenseChange($event,item,index)">
                          <el-option v-for="itm in ifArr" :key="itm.value" :label="itm.name" :value="itm.value"></el-option>
                        </el-select>
                      </div>
                      <div class="tab_td" style="width:28%">
                        <el-date-picker  v-if="item.hasLiscense && index ===0" type="daterange"  size="mini" v-model="licensesDate0" range-separator="-" 
                          start-placeholder="开始日期"
                          end-placeholder="结束日期" 
                          value-format="yyyy-MM-dd" 
                          format="yyyy-MM-dd" 
                          placeholder="选择日期"> 
                        </el-date-picker>
                        <el-date-picker  v-if="item.hasLiscense && index ===1" type="daterange"  size="mini" v-model="licensesDate1" range-separator="-" 
                          start-placeholder="开始日期"
                          end-placeholder="结束日期" 
                          value-format="yyyy-MM-dd" 
                          format="yyyy-MM-dd" 
                          placeholder="选择日期"> 
                        </el-date-picker>
                        <el-date-picker  v-if="item.hasLiscense && index ===2" type="daterange"  size="mini" v-model="licensesDate2" range-separator="-" 
                          start-placeholder="开始日期"
                          end-placeholder="结束日期" 
                          value-format="yyyy-MM-dd" 
                          format="yyyy-MM-dd" 
                          placeholder="选择日期"> 
                        </el-date-picker>
                      </div>
                      <div class="tab_td" style="width:14%">
                        <div v-if="item.hasLiscense" class="zs_sty flex_cc">
                          <!-- <span @click="openUpload(item,index)">上传</span> -->
                          <el-upload
                            :show-file-list="false"
                            :headers="headers"
                            :before-upload="beforeUpload"
                            :on-error="handleError"
                            :on-success="handleSuccess"
                            accept=".jpg,.png,.jpeg,.pdf"
                            action="/v1/upl/aliyun/oss/template/upload">
                            <span @click="uploadFun(index)">上传</span>
                          </el-upload>
                          
                          <span @click="lockFile(item.licenseUrl)">查看</span>
                        </div>
                      </div>
                      <div class="tab_td" style="width:24%"><el-input v-if="item.hasLiscense" size="mini" v-model="item.remark"></el-input></div>
                    </div>
                    <div v-if="tableFrom.licenses.length==0" class="tab_tr body" style="justify-content:center;height:35px;">暂无数据</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="tab_tit flex_lc">
              <div class="tit_left flex_lc">
                4、<div class="required">*</div>与圣泽捷通合作：
              </div>
              <div>
                <el-radio-group v-model="tableFrom.coorperationType">
                  <el-radio v-for="item in conProYearlist" :key="item.code" :label="item.code">{{item.name}}</el-radio>
                </el-radio-group>
              </div>
            </div>
          </li>
          <li>
            <div class="tab_tit">
              <div class="tit_left flex_lc">
                5、<div class="required">*</div>股本构成<span>（至少填一行）</span>
              </div>
              <div class="table_con">
                <div class="table_comp">
                  <div class="tab_tr title">
                    <div class="tab_td" style="width:10%">序号</div>
                    <div class="tab_td" style="width:25%"><span>*</span>股东公司名称(或自然人)</div>
                    <div class="tab_td" style="width:20%"><span>*</span>股东资金构成</div>
                    <div class="tab_td" style="width:15%"><span>*</span>投资币种</div>
                    <div class="tab_td" style="width:15%"><span>*</span>投资额</div>
                    <div class="tab_td" style="width:15%"><span>*</span>股本比例</div>
                  </div>
                  <div class="navtab_body">
                    <div class="tab_tr" v-for="(item,index) in tableFrom.shareholders" :key="index">
                      <div class="tab_td" style="width:10%">{{index+1}}</div>
                      <div class="tab_td" style="width:25%"><el-input size="mini" v-model="item.entity" :placeholder="index == 0?'必填':''"></el-input></div>
                      <div class="tab_td" style="width:20%"><el-input size="mini" v-model="item.shareType" :placeholder="index == 0?'必填':''"></el-input></div>
                      <div class="tab_td" style="width:15%"><el-input size="mini" v-model="item.moneyType" :placeholder="index == 0?'必填':''"></el-input></div>
                      <div class="tab_td" style="width:15%"><el-input size="mini" type="number" v-model="item.shareMoney" :placeholder="index == 0?'必填':''"></el-input></div>
                      <div class="tab_td" style="width:15%"><el-input size="mini" v-model="item.rate" :placeholder="index == 0?'必填':''"></el-input></div>
                    </div>
                    <div v-if="tableFrom.shareholders.length==0" class="tab_tr body" style="justify-content:center;height:35px;">暂无数据</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="tab_tit">
              <div class="tit_left flex_lc">
                6、<div class="required">*</div>车辆资源调查(没有相应类型车辆可填0)
              </div>
              <div class="table_con">
                <div class="table_comp">
                  <div class="tab_tr title">
                    <div class="tab_td" style="width:10%">序号</div>
                    <div class="tab_td" style="width:25%">类型</div>
                    <div class="tab_td" style="width:15%"><span>*</span>6位车</div>
                    <div class="tab_td" style="width:15%"><span>*</span>7位车</div>
                    <div class="tab_td" style="width:15%"><span>*</span>中置轴</div>
                    <div class="tab_td" style="width:20%">合计</div>
                  </div>
                  <div class="navtab_body">
                    <div class="tab_tr" v-for="(item,index) in tableFrom.carResources" :key="index">
                      <div class="tab_td" style="width:10%">{{index+1}}</div>
                      <div class="tab_td" style="width:25%">{{item.type}}</div>
                      <div class="tab_td" style="width:15%"><el-input size="mini" v-model="item.sixSeatsNumber" placeholder="必填" @change="carzyChange($event,index,'sixSeatsNumber')"></el-input></div>
                      <div class="tab_td" style="width:15%"><el-input size="mini" v-model="item.sevenSeatsNumber" placeholder="必填" @change="carzyChange($event,index,'sevenSeatsNumber')"></el-input></div>
                      <div class="tab_td" style="width:15%"><el-input size="mini" v-model="item.axisNumber" placeholder="必填" @change="carzyChange($event,index,'axisNumber')"></el-input></div>
                      <div class="tab_td" style="width:20%">{{item.count}}</div>
                    </div>
                    <div class="tab_tr">
                      <div class="tab_td" style="width:80%;font-weight:bold; ">合计</div>
                      <div class="tab_td" style="width:20%">{{carMount}}</div>
                    </div>
                    <div v-if="tableFrom.carResources.length==0" class="tab_tr body" style="justify-content:center;height:35px;">暂无数据</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <span slot="footer">
        <el-button type="primary" size="small" @click="saveTab">保存</el-button>
        <el-button size="small" @click="closeDialog">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 详情弹框 -->
    <el-dialog title="能力调查表详情" :visible.sync="visibleDetail" width="900px" class="ability_dialog" :before-close="closeDetail">
      <div class="dialog_con">
        <ul>
          <li>
            <div class="tab_tit flex_lc">
              <div class="tit_left flex_lc">
                1、<div class="required">*</div>纳税人资格：
              </div>
              <div>
                <el-radio-group v-model="tableFrom.taxType">
                  <el-radio v-for="item in nslist" :key="item.code" :label="item.code" disabled>{{item.name}}</el-radio>
                </el-radio-group>
              </div>
            </div>
          </li>
          <li>
            <div class="tab_tit">
              <div class="tit_left flex_lc">
                2、<div class="required">*</div>整车运输销售信息<span>（填写至少近一年数据）</span>
              </div>
              <div class="table_con">
                <div class="table_comp">
                  <div class="tab_tr title">
                    <div class="tab_td" style="width:8%">序号</div>
                    <div class="tab_td" style="width:22%"><span>*</span>年份</div>
                    <div class="tab_td" style="width:20%"><span>*</span>年销售总额(元)</div>
                    <div class="tab_td" style="width:25%"><span>*</span>供应捷通年销售额(元)</div>
                    <div class="tab_td" style="width:25%"><span>*</span>主要客户</div>
                  </div>
                  <div class="navtab_body">
                    <div class="tab_tr" v-for="(item,index) in tableFrom.sales" :key="index">
                      <div class="tab_td"  style="width:8%">{{index+1}}</div>
                      <div class="tab_td" style="width:22%">{{item.year}}</div>
                      <div class="tab_td" style="width:20%">{{item.saleMoney}}</div>
                      <div class="tab_td" style="width:25%">{{item.jtSaleMoney}}</div>
                      <div class="tab_td" style="width:25%">{{item.customer}}</div>
                    </div>
                    <div v-if="tableFrom.sales.length==0" class="tab_tr body" style="justify-content:center;height:35px;">暂无数据</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="tab_tit">
              <div class="tit_left flex_lc">
                3、<div class="required">*</div>质量体系情况（请务必上次有效证书，<span>如无证书，填否</span>）（证书可上传JPG、JPEG、PNG、PDF格式文件）
              </div>
              <div class="table_con">
                <div class="table_comp">
                  <div class="tab_tr title">
                    <div class="tab_td" style="width:5%">序号</div>
                    <div class="tab_td" style="width:15%">证书类型</div>
                    <div class="tab_td" style="width:14%"><span>*</span>是否认证</div>
                    <div class="tab_td" style="width:28%">有限期日期</div>
                    <div class="tab_td" style="width:14%">证书图片</div>
                    <div class="tab_td" style="width:24%">备注</div>
                  </div>
                  <div class="navtab_body">
                    <div class="tab_tr" v-for="(item,index) in tableFrom.licenses" :key="index">
                      <div class="tab_td" style="width:5%">{{index+1}}</div>
                      <div class="tab_td" style="width:15%">{{item.licenseType}}</div>
                      <div class="tab_td" style="width:14%">{{item.hasLiscense?'是':'否'}}</div>
                      <div class="tab_td" style="width:28%">
                        <div v-if="item.hasLiscense && item.date.length>0">{{item.date[0]}} - {{item.date[1]}}</div>
                      </div>
                      <div class="tab_td" style="width:14%">
                        <div v-if="item.hasLiscense" class="zs_sty flex_cc"><span @click="lockFile(item.licenseUrl)">查看</span></div>
                        <div v-else>-</div>
                      </div>
                      <div class="tab_td" style="width:24%"><el-input size="mini" v-model="item.remark"></el-input></div>
                    </div>
                    <div v-if="tableFrom.licenses.length==0" class="tab_tr body" style="justify-content:center;height:35px;">暂无数据</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="tab_tit flex_lc">
              <div class="tit_left flex_lc">
                4、<div class="required">*</div>与圣泽捷通合作：
              </div>
              <div>
                <el-radio-group v-model="tableFrom.coorperationType">
                  <el-radio v-for="item in conProYearlist" :key="item.code" :label="item.code" disabled>{{item.name}}</el-radio>
                </el-radio-group>
              </div>
            </div>
          </li>
          <li>
            <div class="tab_tit">
              <div class="tit_left flex_lc">
                5、<div class="required">*</div>股本构成<span>（至少填一行）</span>
              </div>
              <div class="table_con">
                <div class="table_comp">
                  <div class="tab_tr title">
                    <div class="tab_td" style="width:10%">序号</div>
                    <div class="tab_td" style="width:25%"><span>*</span>股东公司名称(或自然人)</div>
                    <div class="tab_td" style="width:20%"><span>*</span>股东资金构成</div>
                    <div class="tab_td" style="width:15%"><span>*</span>投资币种</div>
                    <div class="tab_td" style="width:15%"><span>*</span>投资额</div>
                    <div class="tab_td" style="width:15%"><span>*</span>股本比例</div>
                  </div>
                  <div class="navtab_body">
                    <div class="tab_tr" v-for="(item,index) in tableFrom.shareholders" :key="index">
                      <div class="tab_td" style="width:10%">{{index+1}}</div>
                      <div class="tab_td" style="width:25%">{{item.entity}}</div>
                      <div class="tab_td" style="width:20%">{{item.shareType}}</div>
                      <div class="tab_td" style="width:15%">{{item.moneyType}}</div>
                      <div class="tab_td" style="width:15%">{{item.shareMoney}}</div>
                      <div class="tab_td" style="width:15%">{{item.rate}}</div>
                    </div>
                    <div v-if="tableFrom.shareholders.length==0" class="tab_tr body" style="justify-content:center;height:35px;">暂无数据</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="tab_tit">
              <div class="tit_left flex_lc">
                6、<div class="required">*</div>车辆资源调查(没有相应类型车辆可填0)
              </div>
              <div class="table_con">
                <div class="table_comp">
                  <div class="tab_tr title">
                    <div class="tab_td" style="width:10%">序号</div>
                    <div class="tab_td" style="width:25%">类型</div>
                    <div class="tab_td" style="width:15%"><span>*</span>6位车</div>
                    <div class="tab_td" style="width:15%"><span>*</span>7位车</div>
                    <div class="tab_td" style="width:15%"><span>*</span>中置轴</div>
                    <div class="tab_td" style="width:20%">合计</div>
                  </div>
                  <div class="navtab_body">
                    <div class="tab_tr" v-for="(item,index) in tableFrom.carResources" :key="index">
                      <div class="tab_td" style="width:10%">{{index+1}}</div>
                      <div class="tab_td" style="width:25%">{{item.type}}</div>
                      <div class="tab_td" style="width:15%">{{item.sixSeatsNumber}}</div>
                      <div class="tab_td" style="width:15%">{{item.sevenSeatsNumber}}</div>
                      <div class="tab_td" style="width:15%">{{item.axisNumber}}</div>
                      <div class="tab_td" style="width:20%">{{item.count}}</div>
                    </div>
                    <div class="tab_tr">
                      <div class="tab_td" style="width:80%;font-weight:bold; ">合计</div>
                      <div class="tab_td" style="width:20%">{{carMount}}</div>
                    </div>
                    <div v-if="tableFrom.carResources.length==0" class="tab_tr body" style="justify-content:center;height:35px;">暂无数据</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
    <!-- 上传附件弹框 -->
    <el-dialog title="上传附件" :visible.sync="filevisible" width="500px" class="ability_dialog" :before-close="closefile">
      <div class="dialog_con">
        <el-upload
          class="upload-demo"
          :show-file-list="false"
          action="https://jsonplaceholder.typicode.com/posts/">
          <span>点击上传</span>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import ztTable from '@/components/zt-table';
  import columnBox from '@/components/zt-column-box';
  import {getDateStr,parseDate} from "@/utils";
import { setTimeout } from 'timers';
  export default {
    name: 'ability',
    data() {
      var _this = this;
      return {
        licensesDate0:[],
        licensesDate1:[],
        licensesDate2:[],
        headers: {
          Authorization: 'vlsCompany ' + this.$store.getters.getToken
        },
        tableColumn: [
          {type: 'index',label: '序号',align: 'center',width:100},
          {prop: 'todo',label: '操作',align: 'center',
            formatter: (row) => {
              return <div class="flex_cc" style={!this.isView?'display:block':'display:none'}>
                <el-button style={row.workStatus == 1?'display:none':'display:inline-block'} type="text" onClick={this.deleteItem.bind(this,row)}>删除</el-button>
                <el-button style={row.workStatus == 1?'display:none':'display:inline-block'} type="text" onClick={this.editItem.bind(this,row)}>修改</el-button>
              </div>
            }
          },
          {prop: 'workStatusTxt',label: '状态',align: 'center'},
          {prop: 'year',label: '报表年份',align: 'center'},
          {prop: 'detail',label: '能力调查表详情',align: 'center',
            formatter: (row) => { return <el-button type="text" onClick={this.showDetail.bind(this,row)}>详情</el-button> }
          },
          {prop: 'modifiedOn',label: '修改时间',align: 'center'}
        ],
        tableDatas:[],
        nslist:[],//获取纳税人列表
        conProYearlist:[],//合作年限列表
        yearArrs:[],
        addvisible:false,
        visibleDetail:false,
        filevisible:false,
        ifArr:[
          {value:1,name:'是'},
          {value:0,name:'否'},
        ],
        tableFrom:{
          carrierCode:this.$store.getters.getCompanyInfo.carriersCode,
          taxType:0,
          sales:[
            {year:'',saleMoney:'',jtSaleMoney:'',customer:''},
            {year:'',saleMoney:'',jtSaleMoney:'',customer:''},
            {year:'',saleMoney:'',jtSaleMoney:'',customer:''},
          ],
          licenses:[
            {licenseType:'ISO9000',hasLiscense:0,usefulStart:'',usefulEnd:'',licenseUrl:'',remark:'',date:[]},
            {licenseType:'ISO14000',hasLiscense:0,usefulStart:'',usefulEnd:'',licenseUrl:'',remark:'',date:[]},
            {licenseType:'OHSAS18001',hasLiscense:0,usefulStart:'',usefulEnd:'',licenseUrl:'',remark:'',date:[]}
          ],
          coorperationType:0,
          year:'2019',
          shareholders:[
            {entity:'',shareType:'',moneyType:'',shareMoney:'',rate:''},
            {entity:'',shareType:'',moneyType:'',shareMoney:'',rate:''},
            {entity:'',shareType:'',moneyType:'',shareMoney:'',rate:''}
          ],
          carResources:[
            {type:'挂靠捷通车辆',sixSeatsNumber:'',sevenSeatsNumber:'',axisNumber:'',count:''},
            {type:'自有车辆（非挂靠捷通）',sixSeatsNumber:'',sevenSeatsNumber:'',axisNumber:'',count:''},
            {type:'外协车辆',sixSeatsNumber:'',sevenSeatsNumber:'',axisNumber:'',count:''}
          ]
        },
        carMount:'',
        detailData:{},
        itemId:'',
        addeaitType:0,//0是新增 1编辑

        fileList:[],
        fileInfo:{
          url:'',
          name:''
        },
        zsidx:''
      }
    },
    computed: {
      isView() { //是否是查看
        return this.$route.query.isView;
      }
    },
    mounted() {
      this.getYearArr();
      this.getList();
      this.getNslist();
      this.getConProYear();
    },
    methods: {
      handleSubmit() {
        return this.tableDatas.length > 0;
      },
      // 获取年份
      getYearArr(){
        const year = new Date().getFullYear();
        this.yearArrs = [year-1,year]; 
      },
      // 获取用户调查列表
      getList(){
        let requestPromise = this.$root.getCarrierGetPowers({carrierCode:this.$store.getters.getCompanyInfo.carriersCode});
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          if (!code) {
            this.tableDatas = data;
          }
        });
      },
      //删除
      deleteItem(item){
        this.$confirm('确定删除这些项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          let requestPromise = this.$root.getCarrierDeletePowers({id:item.id});
          requestPromise.then(res => {
            let code = parseInt(res.code);
            let data = res.data;
            if (!code) {
              this.$message.success('删除成功');
              this.getList();
            }
          });
        }).catch(() => {
        });
      },
      //新增能力调查表
      openDialog(){
        this.addeaitType = 0;
        if(this.tableDatas.some(item => item.year == this.tableFrom.year)){
          this.$message.warning('已有该年能力调查表');
          return;
        }
        this.addvisible=true;
        
        let tableFrom = {...this.tableFrom}
        this.tableFrom={
          carrierCode:this.$store.getters.getCompanyInfo.carriersCode,
          taxType:0,
          sales:[
            {year:'',saleMoney:'',jtSaleMoney:'',customer:''},
            {year:'',saleMoney:'',jtSaleMoney:'',customer:''},
            {year:'',saleMoney:'',jtSaleMoney:'',customer:''},
          ],
          licenses:[
            {licenseType:'ISO9000',hasLiscense:0,usefulStart:'',usefulEnd:'',licenseUrl:'',remark:'',date:[]},
            {licenseType:'ISO14000',hasLiscense:0,usefulStart:'',usefulEnd:'',licenseUrl:'',remark:'',date:[]},
            {licenseType:'OHSAS18001',hasLiscense:0,usefulStart:'',usefulEnd:'',licenseUrl:'',remark:'',date:[]}
          ],
          coorperationType:0,
          year:tableFrom.year,
          shareholders:[
            {entity:'',shareType:'',moneyType:'',shareMoney:'',rate:''},
            {entity:'',shareType:'',moneyType:'',shareMoney:'',rate:''},
            {entity:'',shareType:'',moneyType:'',shareMoney:'',rate:''}
          ],
          carResources:[
            {type:'挂靠捷通车辆',sixSeatsNumber:'',sevenSeatsNumber:'',axisNumber:'',count:''},
            {type:'自有车辆（非挂靠捷通）',sixSeatsNumber:'',sevenSeatsNumber:'',axisNumber:'',count:''},
            {type:'外协车辆',sixSeatsNumber:'',sevenSeatsNumber:'',axisNumber:'',count:''}
          ]
        }
        this.carMount = '';
        console.log(this.tableFrom);

      },
      //修改
      editItem(item){
        this.addeaitType = 1;
        this.itemId = item.id;
        let requestPromise = this.$root.getPowerDetail({id:item.id});
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          if (!code) {
            this.detailData = data;
            this.addvisible=true;
            data.licenses.forEach((item,index)=>{
              let licensesDate = 'licensesDate'+index;
              if(item.usefulStart && item.usefulEnd){
                this[licensesDate] = [item.usefulStart.substring(0,10),item.usefulEnd.substring(0,10)];
                item.date = [item.usefulStart.substring(0,10)||'',item.usefulEnd.substring(0,10)||''];
              }else{
                this[licensesDate] = [];
                item.date =[];
              }
            });
            let carMount = 0;
            data.carResources.forEach(item=>{
              item.count = Number(item.sixSeatsNumber) + Number(item.sevenSeatsNumber) + Number(item.axisNumber);
              carMount=carMount+item.count;
            });
            this.carMount = carMount;
            console.log(data.licenses);
            this.tableFrom={
              carrierCode:this.$store.getters.getCompanyInfo.carriersCode,
              taxType:data.taxType,
              sales:data.sales,
              licenses:data.licenses,
              coorperationType:data.coorperationType,
              year:data.year,
              shareholders:data.shareholders,
              carResources:data.carResources
            }
            console.log(this.tableFrom);
          }
        });
      },
      //显示详情
      showDetail(item){
        this.itemId = item.id;
        let requestPromise = this.$root.getPowerDetail({id:item.id});
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          if (!code) {
            this.detailData = data;
            this.visibleDetail=true;
            data.licenses.forEach(item=>{
              if(item.usefulStart && item.usefulEnd){
                item.date = [item.usefulStart.substring(0,10)||'',item.usefulEnd.substring(0,10)||''];
              }else{
                item.date =[];
              }
            });
            let carMount = 0;
            data.carResources.forEach(item=>{
              item.count = Number(item.sixSeatsNumber) + Number(item.sevenSeatsNumber) + Number(item.axisNumber);
              carMount=carMount+item.count;
            });
            this.carMount = carMount;
            console.log(data.licenses);
            this.tableFrom={
              carrierCode:this.$store.getters.getCompanyInfo.carriersCode,
              taxType:data.taxType,
              sales:data.sales,
              licenses:data.licenses,
              coorperationType:data.coorperationType,
              year:data.year,
              shareholders:data.shareholders,
              carResources:data.carResources
            }
          }
        });
      },
      //上传
      openUpload(itm,idx){
        console.log(itm,idx);
        this.filevisible=true;
      },
      //关闭显示详情
      closeDetail(){
        this.visibleDetail=false;
      },
      //关闭上传弹框
      closefile(){
        this.filevisible=false;
      },
      // 获取纳税人列表
      getNslist(){
        let requestPromise = this.$root.getDictCompanyList({type:'NSRZG'});
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          if (!code) {
            this.nslist = data;
          }
        });
      },
      // 合作年限列表
      getConProYear(){
        let requestPromise = this.$root.getDictCompanyList({type:'HZNX'});
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          if (!code) {
            this.conProYearlist = data;
          }
        });
      },
      //分类列表
      getTypeList(){
        let requestPromise = this.$root.getCodeTypes();
        requestPromise.then(res => {
          let code = parseInt(res.code);
          let data = res.data;
          if (!code) {
            this.typeList = data;
          }
        });
      },
      closeDialog(){
        this.addvisible=false;
      },
      //车辆资源调查
      carzyChange(value,idx,name){
        let val = /^\d+$/.test(value) ? value : 0;
        let itemCount = this.tableFrom.carResources[idx];
        itemCount[name]=val;
        itemCount.count = Number(itemCount.sixSeatsNumber) + Number(itemCount.sevenSeatsNumber) + Number(itemCount.axisNumber);
        let carMount = 0;
        this.tableFrom.carResources.forEach(item =>{
          carMount=carMount+item.count
        });
        this.carMount=carMount;
      },
      //验证
      check1(){
        let status =true;
        this.tableFrom.sales.forEach((item,index) =>{
          if(!index && (!item.customer || !item.jtSaleMoney || !item.saleMoney || !item.year)){
            status = false;
          }
        });
        console.log(status);
        return status;
      },
      check2(){
        let status =true;
        this.tableFrom.shareholders.forEach((item,index) =>{
          if(!index && (!item.entity || !item.moneyType || !item.rate || !item.shareMoney || !item.shareType)){
            status=false;
          }
        });
        return status;
      },
      check3(){
        let status =true;
        console.log(this.tableFrom.carResources);
        this.tableFrom.carResources.forEach((item) =>{
          if(item.axisNumber==='' || item.sevenSeatsNumber==='' || item.sixSeatsNumber===''){
            console.log(123);
            status=false;
          }
        });
        return status;
      },
      check4(){
        let status =true;
        this.tableFrom.licenses.forEach((item,index) =>{
          let licensesDate = 'licensesDate'+index;
          if(item.hasLiscense&&(!item.licenseUrl || this[licensesDate].length==0)){
            status=false;
          }
        });
        return status;
      },
      //能力调查表保存
      saveTab(){
        let tableFrom = JSON.parse(JSON.stringify(this.tableFrom));
        if(this.addeaitType){tableFrom.powerId = this.itemId}

        let promise = new Promise((resolve, reject)=>{
          if(this.tableFrom.taxType){
            resolve('通过1');
          }else{
            reject('请选择纳税人资格');
          }
        });

        promise.then((data)=>{
          if(this.check1()){
            return Promise.resolve('通过2');
          }else{
            return Promise.reject('请填写整车运输销售信息');
          }
        }).then((data)=>{
          if(tableFrom.coorperationType){
            return Promise.resolve('通过3');
          }else{
            return Promise.reject('请选择与圣泽捷通合作年限');
          }
        }).then((data)=>{
          if(this.check2()){
            return Promise.resolve('通过4');
          }else{
            return Promise.reject('请填写股本构成');
          }
        }).then((data)=>{
          if(this.check3()){
            return Promise.resolve('通过5');
          }else{
            return Promise.reject('车辆资源调查(没有相应类型车辆可填0)有误');
          }
        }).then((data)=>{
          if(this.check4()){
            tableFrom.licenses.forEach((item,index) =>{
              let licensesDate = 'licensesDate'+index;
              let date = this[licensesDate];
              if(date.length>0){
                item.usefulStart = date[0]+' 00:00:00';
                item.usefulEnd = date[1]+' 23:59:59';
              }
            });
            return Promise.resolve('通过5');
          }else{
            return Promise.reject('请填写质量体系情况');
          }
        }).then((data)=>{
          let url = this.addeaitType ? 'getCarrierUpdatePower' : 'getCarrierAddPower';
          let requestPromise = this.$root[url](tableFrom);
          requestPromise.then(res => {
            let code = parseInt(res.code);
            let data = res.data;
            if (!code) {
              this.addeaitType ? this.$message.success('修改成功') : this.$message.success('添加成功');
              this.getList();
              this.closeDialog();
            }
          });
        }).catch((data)=>{
          console.log(data);
          this.$message.warning(data);
        });
      },
      //获取上传下标
      uploadFun(idx){
        this.zsidx = idx;
      },
      lockFile(url){
        if(!url){
          this.$message.warning('请先上传证书照片');
          return;
        }
        window.open(url,'top'); 
      },
      handleError() {
        this.$message.error('上传失败！');
      },
      handleSuccess(response) {
        console.log(response.data.originalFileUrl);
        let idx = this.zsidx;
        this.tableFrom.licenses[idx].licenseUrl = response.data.originalFileUrl;
        console.log(this.tableFrom);
        this.$message.success('上传成功！');
      },
      beforeUpload(file) {
        if (file.size > 20971520) {
          this.$message.warning('文件大小不得超过20Mb！');
          return false;
        }
      },
      liscenseChange(e,itm,idx){
        // hasLiscense:0,usefulStart:'',usefulEnd:'',licenseUrl:'',remark:'',date:[]
        console.log(e);
        console.log(itm);
        console.log(idx);
        if(!e){
          this.tableFrom.licenses[idx].usefulStart='';
          this.tableFrom.licenses[idx].usefulEnd='';
          this.tableFrom.licenses[idx].licenseUrl='';
          this.tableFrom.licenses[idx].remark='';
          let licensesDate = 'licensesDate'+idx;
          this[licensesDate]=[];
        }
      },
      dateChange(e,itm){
        console.log(e);
        console.log(itm);
      }
    },
    components: {
      ztTable,
      columnBox
    }
  }
</script>

<style scoped lang="scss">
  .logistics-plan /deep/ {
    .sub-total-column td {
      color: #409EFF;
    }
    .el-select {
      width: 202px;
    }

  }
  .btn_style{
    color: #409EFF;
    span{margin: 0px 6px;cursor: pointer;}
  }
  .upload {
    max-width: 400px;
  }
  // 弹框
  .dialog_con{
    color: #606266;
    // border: 1px solid red;
    ul{
      // border: 1px solid blue;
      li{
        // border: 1px solid pink;
        .tab_tit{
          .tit_left{
            height: 40px;
            font-size: 14px;
            span{color:#f56c6c;}
          }
        }
      }
    }
  }
  .required{
    height: 12px;
    font-size: 20px;
    color: #f56c6c;
  }
  //表格样式
  .table_con{
    padding: 0px 12px 6px 12px;
  }
  .table_comp{
    width: 100%;
    border: 1px solid #ebeef5;
    color: #606266;
    .tab_tr{
      width: 100%;
      display: flex;
      justify-content:space-between;
      align-items: center;
      border-bottom: 1px solid #ebeef5;
      .tab_td{
        height: 30px;
        padding: 0px 6px;
        border-right: 1px solid #ebeef5;
        display: flex;
        justify-content:center;
        align-items: center;
        input{
          width: 100%;
          height:26px;
          padding: 0px 2px;
          border:none;
          border-radius:2px;
          text-align: center;
          color: #606266;
        }
      }
      .tab_td.td_active{
        background-color:#d8e3ff;
      }
      .tab_td:last-child{
        border-right:none;
      }
      span{
        color: #f56c6c;
        font-size: 18px;
        padding-top: 10px;
        display: block;
        margin-right: 2px;
      }
    }
    .tab_tr:last-child{
      border-bottom:none;
    }
    .tab_tr.title{
      background-color:#f2f6fc;
    }
    .tab_tr.hover{
      cursor: pointer;
    }
    .tab_tr.hover:hover{
      background-color:#d8e3ff;
    }
    .tab_tr.tab_active{
      background-color: #d8e3ff;
    }
    .navtab_body{
      width: 100%;
      max-height: calc(100vh - 210px);
      overflow: hidden;
      overflow-y: auto;
    }
    .zs_sty{
      width: 100%;
      span{
        font-size: 12px;
        color: #409EFF;
        padding-top:0px;
        margin: 0px 8px;
        cursor: pointer;
      }
    }

  }
</style>