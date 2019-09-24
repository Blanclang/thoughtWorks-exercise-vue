/*
*  @描述：表格组件
*  @作者：付文松
*  @创建时间：2018/5/3
*/
<template>
  <div class="zt__table"
       v-loading="dloading"
       :element-loading-text="dElementLoadingText"
  >
    <!--表格组件-->
    <el-table
            ref="elTable"
            stripe
            tooltip-effect="light"
            :cell-style="cellStyle"
            :class="{'nowrap-table':nowrap}"
            :row-key="rowKey"
            :current-row-key="dRadioLabel"
            @current-change="currentChange"
            :span-method="spanMethod"
            :highlight-current-row="dHighlightCurrentRow"
            @select-all="selectTableAll"
            @select="selectTableRow"
            @selection-change="selectTableChange"
            border
            :height="height"
            :max-height="maxHeight"
            :data="dTableData"
            :show-summary="showSummary"
            :summary-method="spanMethod"
            :row-class-name="rowClassName"
            :row-style="rowStyle"
            @row-click='rowClick'
            @row-dblclick="rowDblclick"
    >
      <el-table-column
              v-for="column in dTableColumn"
              :key="column.prop"
              :reserve-selection="column.reserve || false"
              :align="column.align"
              :header-align="column.headerAlign"
              :formatter="column.formatter"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :min-width="column.newWidth"
              :fixed="column.fixed"
              :show-overflow-tooltip="column.type ? false : showOverflowTooltip"
              :type="column.type"
              :selectable="column.selectable"
              :render-header="column.renderHeader"
      >
        <template v-if="column.children && column.children.length">
          <el-table-column
                  v-for="chilcolumn in column.children"
                  :key="chilcolumn.prop"
                  :align="chilcolumn.align"
                  :header-align="chilcolumn.headerAlign"
                  :formatter="chilcolumn.formatter"
                  :prop="chilcolumn.prop"
                  :label="chilcolumn.label"
                  :width="chilcolumn.width"
                  :fixed="chilcolumn.fixed"
                  :show-overflow-tooltip="column.type ? false : showOverflowTooltip"
                  :type="chilcolumn.type"
                  :selectable="chilcolumn.selectable"
                  :render-header="chilcolumn.renderHeader"
          ></el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
            :class="{'resize': resize}"
            ref="elPagination"
            v-if="pagination"
            @mousedown.native="handleResize"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="handlePrevClick"
            @next-click="handleNextClick"
            :current-page.sync="dCurrentPage"
            :background="paginationbg"
            :page-sizes="pageSizes"
            :page-size.sync="dPageSize"
            :page-count="pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dPaginationTotal">
    </el-pagination>
  </div>
</template>

<style lang="scss" scoped>
  .zt__table /deep/ {
    .el-pagination {
      text-align: left;
      margin-top: 5px;
      .el-pagination__sizes .el-input .el-input__inner {
        font-size: 12px;
      }
      span:not([class*=suffix]) {
        font-size: 12px;
      }
    }
    .highlightcurrent__radio {
      .el-radio__label {
        display: none;
      }
    }
  }
</style>

<script>
  export default {
    name: "zt-table",
    props: {
      resize: { //是否开启翻页区域拖动功能（用来实现主子表高度改变）
        type: Boolean,
        default: false
      },
      showOverflowTooltip: { //是否开启内容过长显示tooltip
        type: Boolean,
        default: true
      },
      cellStyle: {
        type: [Object,Function],
        default: null
      },
      nowrap: { //单元格是否不换行 true：不换行
        type: Boolean,
        default: true
      },
      maxHeight: {
        type: Number,
        default: null
      },
      height: {
        type: Number,
        default: null
      },
      // 当column的reserve的值为true时,必须要传这个，实现翻页后也能保持勾选状态，rowKey必须是唯一的，最好用每行对应的id
      rowKey: {
        type: String,
        default: ''
      },
      //表格取的数据，如果接口返回的不是data:{list:[]}的方式，就必须传这个
      dataKey: {
        type: String,
        default: ''
      },
      //表格数据
      tableData: {
        type: Array,
        default() {
          return [];
        }
      },
      //表格栏目数据
      tableColumn: {
        type: Array,
        default() {
          return [];
        }
      },
      //是否显示序列号,
      index: {
        type: Boolean,
        default: false
      },
      //是否显示复选框
      selection: {
        type: Boolean,
        default: true
      },
      //当前页码
      currentPage: {
        type: Number,
        default: 1
      },
      //是否显示分页背景
      paginationbg: {
        type: Boolean,
        default: false
      },
      //每页显示多少条的选项数
      pageSizes: {
        type: Array,
        default() {
          return [10, 20, 50, 100];
        }
      },
      //每页显示多少条数
      pageSize: {
        type: Number,
        default: 20
      },
      //分页的总条数
      paginationTotal: {
        type: Number,
        default: 0
      },
      //总页数
      pageCount: {
        type: Number,
        default: 10
      },
      //表格请求
      request: {
        type: [Function, String]
      },
      //表格请求参数
      requestParams: {
        type: Object,
        default() {
          return {};
        }
      },
      //获取选中的行数组
      getSelection: {
        type: Array
      },
      //是否禁用复选框过滤函数
      selectableFilter: {
        type: Function
      },
      //是否使用本地数据
      local: {
        type: Boolean,
        default: false
      },
      //是否分页
      pagination: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      //Loading 提示
      elementLoadingText: {
        type: String,
        default: "正在加载..."
      },
      //合并行或列的计算方法
      spanMethod: {
        type: Function
      },
      //格式化表格数据
      tableDataFormatter: {
        type: Function
      },
      // 表格尾部展示合计行
      showSummary: {
        type: Boolean,
        default: false
      },
      //单选
      highlightCurrentRow: {
        type: Boolean,
        default: false
      },
      //单选 label
      radioLabel: {
        type: String,
        default: ""
      },
      selectRadio: {
        validator: value => {
          return true;
        }
      },
      //当前行的 key，只写属性
      currentRowKey: {
        type: [String, Number]
      },
      rowClassName: {
        type: Function
      },
      rowStyle: Function,
      isBackTop:{
        type:Boolean,
        default:true
      },
      //选择框是否全选
      allSelection:{
        type:Boolean,
        default:false
      },
      //单选默认
      redioDefault:{
        type:Boolean,
        default:false
      },
    },
    data() {
      let t = this;
      //将表格数据用变量表示
      let tableData = [...this.tableData];
      //将数据总数用变量表示
      let dTableData = [...this.tableData];
      let tableColumnFirstType = this.tableColumn[0].type;
      let paginationTotal = this.paginationTotal || dTableData.length;
      if (!tableColumnFirstType) {
        this.tableColumn.unshift({
          type: "selection",
          disabled: true,
          selectable: this.selectableFilter,
          align: "center",
          width: 50
        });
      }
      // let dTableColumn = [] ||this.formatterColumn([...this.tableColumn]);
      //如果不需要 ajax 请求数据则用本地数据
      if (!this.request && this.pagination) {
        let pageSize = this.pageSize;
        this.dPageSize = pageSize;
        paginationTotal = tableData.length;
        dTableData = tableData.splice(0, pageSize);
      }
      return {
        isFirst: true,
        dTableData,
        dTableColumn: [],
        dSelection: this.selection,
        dCurrentPage: this.currentPage,
        dPaginationTotal: paginationTotal,
        dPageSize: this.pageSize,
        dRequestParams: this.requestParams,
        dIndex: this.index,
        //表格加载loading
        dloading: this.loading,
        //加载 Loading 文字
        dElementLoadingText: this.elementLoadingText,
        //表格数据格式化
        dTableDataFormatter: this.tableDataFormatter,
        //是否单选
        dHighlightCurrentRow: this.highlightCurrentRow,
        dSelectRadio: this.selectRadio,
        dCurrentRowKey: this.currentRowKey,
        dRadioLabel: this.radioLabel,
        dRequest:this.request
      };
    },
    watch: {
      tableData: {
        handler(n, o) {
          if(!this.dRequest && this.pagination) {
            let pageSize = this.pageSize;
            this.dPageSize = pageSize;
            this.dTableData = n.slice(0, pageSize);
          }else{
            this.dTableData = [...n];
          }
          this.dPaginationTotal = n.length;
        },
        deep: true
      },
      tableColumn: {
        handler(n, o) {
          let list = [];
          n.forEach(item => { //暴力解决对象引用问题。。
            list.push({...item})
          });
          this.dTableColumn = this.formatterColumn(list);
        },
        immediate: true,
      },
      elementLoadingText(n, o) {
        this.dElementLoadingText = n;
      },
      loading(n, o) {
        this.dloading = n;
      },
      paginationTotal(n, o) {
        this.dPaginationTotal = n;
      },
      highlightCurrentRow(n) {
        this.dHighlightCurrentRow = n;
      },
      radioLabel(n) {
        this.dRadioLabel = n;
      },
      selectRadio(n) {
        this.dSelectRadio = n;
      },
      request(n){
        this.dRequest = n;
      },
      dTableData(n,o){
        this.resetRadio();
        //选择框默认是否全选
        if(this.allSelection){
          this.$refs.elTable.toggleAllSelection();
        }
        if(this.redioDefault){
          this.setCurrentRow(this.dTableData[0]);
          this.$emit("update:getClickRow", this.dTableData[0]);
        }
        this.$nextTick(() => {
          setTimeout(() => { //nextTick回调后，dom样式偶尔还会存在一些诡异的问题，所以再加个延时比较靠谱
            this.renderAutoTable(n);
          },0)
        });
      }
    },
    created() {
      let t = this;
      //判断是否是ajax 请求数据，并判断请求的是否是函数
      if (this.dRequest && this.isFunction(this.dRequest)) {
        this.requestTableData({
          pageSize: this.pageSize,
          pageNum: 1
        });
      }
      this.$on("requestTable", function(options) {
        t.requestTableData(options);
      });
      this.$on("clearSelection",function(options){
        t.$refs.elTable.clearSelection();
      });
    },
    mounted() {
      this.setHighLightRow();
      this.renderAutoTable(this.dTableData);
    },
    methods: {
      // 翻页区域上下拖动
      handleResize(e) {
        this.$emit('tableResize',e);
      },
      // 表格列宽度自适应(不换行)
      renderAutoTable(n) {
        // 如果接口数据为空，默认列的宽度就是表头的宽度
        if (n && n.length === 0) {
          let list = [];
          this.dTableColumn.forEach(item => {
            if (item.type || item.width) {
              list.push(item);
            } else {
              item.newWidth = item.label.length * 16 > 50 ? item.label.length * 16 : 50;
              item.hasIcon && (item.newWidth = item.newWidth + 20); //如果表头有icon提示，即添加15宽度
              list.push(item);
            }
          });
          this.dTableColumn = list;
          return false;
        }
        // 用接口数据来比较，如果单元格显示的内容比表头的内容多，就取单元格文字数量乘以字体的（大概）宽度
        // 如果单元格显示的内容比表头少，就取表头的宽度
        let obj = {};
        let newColumn = [];
        //先遍历一遍接口数据，把每列显示内容最长的那个取出来
        this.dTableColumn.forEach(item => {
          if (!item.type) {
            let cellText = '';
            for (let i = 0; i < n.length; i++) {
              let currentItem = item.formatter ? item.formatter(n[i]) : n[i][item.prop];
              if (!currentItem) {
                continue;
              }
              if (cellText) {
                // 如果是全数字或者字母的，算0.5长度，因为字母数字在页面上比汉字的宽度小
                let length = /^\w+$/.test(cellText) || typeof cellText === 'number' ? String(cellText).length * 0.5 : cellText.length;
                let curLength = /^\w+$/.test(currentItem) || typeof cellText === 'number' ? String(currentItem).length * 0.5 : currentItem.length;
                cellText = length > curLength ? cellText : currentItem;
              } else {
                cellText = currentItem;
              }
            }
            obj[item.prop] = cellText;
          }
        });
        //计算宽度-以字体大小12px来计算
        this.dTableColumn.forEach(item => {
          if (item.type || item.width) { //如果是有type或者已经手动设置了width，就不重新计算了
            newColumn.push(item);
          } else {
            let text = obj[item.prop];
            let thLength = null;
            //如果表头不是文字的，就按字符宽度处理
            if (item.shortLabel) {
              thLength = item.hasIcon ? item.label.length * 10 + 20 : item.label.length * 10; //表头宽度
            } else {
              thLength = item.hasIcon ? item.label.length * 16 + 20 : item.label.length * 16; //表头宽度
            }
            // 单元格显示字符串或者数字
            if (typeof text === 'string' || typeof text === 'number') {
              text = String(text); //将number转为字符串，否则无法获取length
              let num = (/[\u4e00-\u9fa5]/g).test(text) ? 16 : 10; //中文宽度取大一点
              if (item.label.match('日期') || item.label.match('时间')) {
                //日期时分秒固定140，日期固定100
                item.newWidth = text.split(' ').length > 1 ? 140 : 100;
                //如果宽度还是小，就取表头宽度
                if (thLength > item.newWidth) {
                  item.newWidth = thLength;
                }
              } else {
                item.newWidth = text.length * num > thLength ? text.length * num : thLength;
              }
            } else {
              // 单元格不显示字符串的话，一般为按钮，所以给个固定宽度
              item.newWidth = thLength > 80 ? thLength : 80;
            }

            if (!text) { //如果单元格显示的内容为空，使用表头的宽度
              item.newWidth = thLength;
            }

            item.newWidth = item.newWidth >= 50 ? item.newWidth : 50; //默认宽度最小值为50
            item.newWidth = item.newWidth > 210 ? 210 : item.newWidth; //宽度最大值为210，超出隐藏
            newColumn.push(item);
          }
        });
        this.dTableColumn = newColumn;
      },
      //判断数据类型
      isFunction(data) {
        return Object.prototype.toString.call(data) === "[object Function]";
      },
      //修改每页的条数回调
      handleSizeChange(pageSize) {
        if (this.dRequest && this.isFunction(this.dRequest)) {
          this.requestTableData({
            pageSize: pageSize
          });
        }
        if (!this.dRequest) {
          this.dPageSize = pageSize;
          let tableData = JSON.parse(JSON.stringify(this.tableData));
          this.dTableData = tableData.splice(0, this.dPageSize);
        }
        this.$emit("handleSizeChange", pageSize);
      },
      //点击某一页回调
      handleCurrentChange(pageNum) {
        if (this.dRequest && this.isFunction(this.dRequest)) {
          this.requestTableData({
            pageNum: pageNum
          });
        }
        if (!this.dRequest) {
          let tableData = JSON.parse(JSON.stringify(this.tableData));
          let currentData = tableData.splice(
              (pageNum - 1) * this.dPageSize,
              this.dPageSize
          );
          this.dTableData = JSON.parse(JSON.stringify(currentData));
        }
        this.isBackTop && this.backTop();
        this.$emit("handleCurrentChange", pageNum);
      },
      //点击上一页回调
      handlePrevClick(options) {
        this.$emit("handlePrevClick", options);
      },
      //点击下一页回调
      handleNextClick(options) {
        this.$emit("handleNextClick", options);
      },
      //请求表格数据
      requestTableData(options,newRequest) {
        let t = this;
        if(!this.dRequest){t.dloading = false;return false;}
        options = options || {};
        let requestParams = Object.assign(this.dRequestParams, options);
        this.dCurrentPage = requestParams.pageNum; // 把当前页强制置为传进来的pageNum,修复搜索的pageNum与翻页组件当前页不对应
        this.dloading = this.loading || true;
        let requestPromise = newRequest ? newRequest(requestParams) : this.dRequest(requestParams);
        if(!requestPromise){t.dloading = false;return false;}
        requestPromise.then(function(res) {
          t.dloading = false;
          let code = parseInt(res.code),
              data = res.data || {},
              msg = res.msg || res.message;
          if (code) {
            return false;
          }
          t.$emit('getResData',data); // 给父组件返回请求的数据,方便父组件进行逻辑处理
          if (!!t.dataKey) {
            data = data[t.dataKey];
          }
          let list = data.list || [],
              total = parseInt(data.total || 0),
              pageSize = parseInt(data.pageSize || options.pageSize);
          let tdFormatter = t.dTableDataFormatter || t.defaultTableDataFormatter;
          if(list.length !== 0){
            t.dTableData = tdFormatter(list);
          }else{
            t.dTableData = [];
          }
          t.dPaginationTotal = total;
          t.dPageSize = pageSize;
        });
        requestPromise.catch(function(res) {
          t.dloading = false;
          t.dTableData = [];
        });
      },
      //table 数据格式化函数
      defaultTableDataFormatter(tableList) {
        let newTableList = tableList.map(function(item) {
          return item;
        });
        return newTableList;
      },
      //点击全选按钮
      selectTableAll(selection) {
        // this.$emit("update:getSelection", selection);
        this.$emit("select-all", selection);
      },
      //勾选某一行
      selectTableRow(selection, row) {
        // this.$emit("update:getSelection", selection);
        this.$emit("select", selection, row);
      },
      //勾选项变化
      selectTableChange(selection) {
        this.$emit("update:getSelection", selection);
      },
      //格式化 radio 栏目
      radioColumnFormatter: function(row, column, cellValue, index) {
        let h = this.$createElement;
        return (
            <el-radio
                value={this.dSelectRadio}
                label={row[this.dRadioLabel]}
                onChange={this.radioChange.bind(this, row[this.dRadioLabel])}
                class="highlightcurrent__radio"
            >
              &nbsp;
            </el-radio>
        );
      },
      //单选事件
      radioChange(label) {
        this.$emit("update:selectRadio", label);
      },
      //清空radio选中状态
      resetRadio() {
        this.dSelectRadio = '';
      },
      //选中某行函数
      currentChange(currentRow, oldCurrentRow) {
        if (currentRow) {
          this.dSelectRadio = currentRow[this.dRadioLabel];
          this.$emit(
              "update:selectRadio",
              currentRow[this.dRadioLabel],
              currentRow
          );
          this.$emit(
              "update:current", currentRow
          );
        }
      },
      // 高亮指定行
      setHighLightRow() {
        let dSelectRadio = this.dSelectRadio;
        if (dSelectRadio) {
          let currentRow = this.dTableData.filter(item => {
            return item[this.radioLabel] === dSelectRadio;
          });
          if (currentRow.length) {
            this.$refs.elTable.setCurrentRow(currentRow[0]);
          }
        }
      },
      //处理表头
      formatterColumn(tableColumn) {
        let t = this;
        let _tableColumn = [];
        _tableColumn = tableColumn.map(function(item, index) {
          let type = item.type;
          if (type === "radio") {
            item.label = item.label || "选择";
            item.formatter = item.formatter || t.radioColumnFormatter;
          }
          if (type === "radio" || type === "index" || type === "selection") {
            item.width = item.width || "50px";
            item.align = item.align || "center";
          }
          return item;
        });
        return _tableColumn;
      },
      // 当某一行被点击时会触发该事件
      rowClick(row, event, column) {
        this.$emit("update:getClickRow", row);
        this.$emit("getClickRow", row);
      },
      // 双击某一行
      rowDblclick(row) {
        this.$emit("rowDblclick", row);
      }
      // 回到顶部
      ,backTop(){
        let tableRect = document.querySelector(".zt__table").getBoundingClientRect();
        let paginationRect = this.$refs.elPagination.$el.getBoundingClientRect();
        let $pageContent = document.querySelector(".page-content");
        let pageContentRect = $pageContent.getBoundingClientRect();
        let pageContentScrollTop = document.querySelector(".page-content").scrollTop;
        document.querySelector(".page-content").scrollTop = pageContentScrollTop - Math.abs(tableRect.top) - 130;
      },
      //双击
      dbRow(row, column, event) {
        this.$emit("dbSave", row);
      },
      // 高亮显示行
      setCurrentRow(row) {
        this.$refs['elTable'].setCurrentRow(row);
      },
      doLayout() {
        this.$refs['elTable'].doLayout();
      },
      // 自动勾选某一行
      toggleRowSelection(row,select) {
        this.$refs['elTable'].toggleRowSelection(row,select);
      }
    }
  };
</script>

<style scoped lang="scss">
  .resize {
    cursor: ns-resize;
  }
  .el-table /deep/ {
    .cell, th div {
      padding-left: 5px;
      padding-right: 5px;
    }
    &.nowrap-table .cell {
      /*white-space: nowrap !important;
      text-overflow: initial !important;*/
      .el-button {
        padding: 0;
      }
    }
    th {
      background-color: #EBEEF5;
      .tip-label {
        line-height: normal !important;
        vertical-align: middle;
      }
    }
    .cell {
      line-height: normal !important;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row > td, .el-table__body tr.hover-row.current-row > td, .el-table__body tr.hover-row.el-table__row--striped.current-row > td, .el-table__body tr.hover-row.el-table__row--striped > td, .el-table__body tr.hover-row > td {
      background-color: #D8E3FF;
    }
    .el-table__body tr:hover > td {
      background-color: #D8E3FF !important;
    }
  }

</style>
