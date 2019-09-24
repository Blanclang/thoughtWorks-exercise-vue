/*
*  @描述：js公共函数库
*  @作者：邱康松
*  @创建时间：2019/1/9
*/


/**
 * 获取前几天的日期，如获取前7天的日期,dayNum传-7
 * @param dayNum
 * @returns {string}
 */
export function getDateStr (dayNum) {
  dayNum = parseInt(dayNum) || 0;
  let date = new Date();
  date.setDate(date.getDate() + dayNum);
  let year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate();
  month = month < 10 ? '0'+month : month;
  day = day < 10 ? '0' + day : day;
  return year + "-" + month + '-' + day;
}

/**
 * 密码正则，6-20位，必须包含数字和字母
 * @type {RegExp}
 */
export let passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;

/**
 * 简单身份证正则,18位最后一位可能是数字或者字母x;
 * @type {RegExp}
 */
export let idNoReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

/**
 * 手机正则
 */
export let mobileReg = /^1[1234567890]\d{9}$/;

/**
 * 通用邮箱正则
 */
export let emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

/**
 * 把当前日期转换为数字显示，如20190201102358
 */
export function parseDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  return '' + year  + (month>=10?month:'0'+month) + (day>=10?day:'0'+day) + (hour>=10?hour:'0'+hour) + (minutes>=10?minutes:'0'+minutes) + (seconds>=10?seconds:'0'+seconds);
}

/**
 * 表头不换行方法
 */
export function renderHeader(h,{column,index}) {
  let l = column.label.length;
  let f = 18; //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
  column.minWidth = f*l > 50 ? f*l : 50 ; //字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度，最小值50
  return column.label;
}

/**
 * 计算两个日期之间相差的天数
 */
export function getBetweenDay(startDate,endDate) {
  if (!startDate || !endDate) {
    return 0;
  }
  startDate = new Date(startDate.split(' ')[0]);
  endDate = new Date(endDate.split(' ')[0]);
  let day = Math.floor((endDate.getTime() - startDate.getTime())/(1000*60*60*24));
  return day;
}

/**
 * 日期去除时分秒
 * @param val
 * @returns {string}
 */
export function formatDate(val) {
  if (!!val) {
    return val.split(' ').length > 0 ? val.split(' ')[0] : val;
  } else {
    return '';
  }
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 例子：
 (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param fmt
 * @returns {*}
 * @constructor
 */
export function Format(fmt) {
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

/**
 * 根据身份证号获取出生日期
 * @param idCard
 * @returns {string}
 */
export function getBirthdayByIdCard(idCard) {
  let birthday = "";
  if(idCard != null && idCard !== ""){
    if(idCard.length === 15){
      birthday = "19"+idCard.substr(6,6);
    } else if(idCard.length === 18){
      birthday = idCard.substr(6,8);
    }
    birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
  }
  return birthday;
}

/**
 * 获取当月1号至当前的日期
 * @returns {{startDate: string, endDate: string}}
 */
export function getMonthToNow() {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  month = month > 9 ? month : '0' + month;
  let startDate = year + '-' + month + '-' + '01';
  return {
    startDate: startDate + ' 00:00:00',
    endDate: getDateStr(0) + ' 23:59:59'
  }
}


