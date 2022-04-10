function compareDate(date1,date2){
	var flag = false;
	var array1 = date1.split("-");
	var array2 = date2.split("-");
	var vDate1 = new Date(array1[0],array1[1],array1[2]);
	var vDate2 = new Date(array2[0],array2[1],array2[2]);
	if(vDate1 >= vDate2){
		flag = true;
	}
	return flag;
}
function getNowFormatDate(flag) {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	if(flag){
		strDate = "01";//為TRUE取當前月1 號
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate; 
	return currentdate;
}
function getNsqxdm(skssqq,skssqz){
	debugger;
	var nsqx_dm = "";
	var qDates = splitStr(skssqq);
	var zDates = splitStr(skssqz);
	//按月申报情况
	if(parseInt(qDates[1], 10) == parseInt(zDates[1], 10)){
		nsqx_dm="06";
	}
	//按季申报
	if(((parseInt(qDates[1], 10) == 1 && parseInt(zDates[1], 10) == 3)
			|| (parseInt(qDates[1], 10) == 4 && parseInt(zDates[1], 10) == 6)
			|| (parseInt(qDates[1], 10) == 7 && parseInt(zDates[1], 10) == 9) 
			|| (parseInt(qDates[1], 10) == 10 && parseInt(zDates[1], 10) == 12))){
		nsqx_dm="08";
	}
	//按半年申报
	if((parseInt(qDates[1], 10) == 1 && parseInt(zDates[1], 10) == 6) || (parseInt(
			qDates[1], 10) == 7 && parseInt(zDates[1], 10) == 12)){
		nsqx_dm="09";
	}
	//按年申报
	if((parseInt(qDates[1], 10) == 1 && parseInt(zDates[1], 10) == 12)){
		nsqx_dm="10";
	}
	return nsqx_dm;
}
/**
 * 根据年月返回该月天数
 * add by houkai at 2015-12-02 am 10:10
 * @param {Object}
 *            year
 * @param {Object}
 *            month
 */
var monthDay = function(year,month){
	var feb = (year % 4 == 0)? 29:28; 
	var monthDay = new Array(31, feb , 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	return monthDay[month-1];
};
/**
 * 截取日期，以数组形式返回年月日
 * add by houkai at 2015-12-02 am 9:45
 * @param {Object}
 *            dataStr
 */
var splitStr = function(dataStr){
	// 截取前面年月日
	var dateStr = splitStrToChar(dataStr," ")[0];
	// 分割字符
	var splitChar = dateStr.indexOf("-")!=-1?"-":"/";
	
	return splitStrToChar(dateStr,splitChar);
};
 /**
  * 根据相应字符截取字符串
  * add by houkai at 2015-12-02 am 9:45
  * @param {Object}
  *            dateStr
  * @param {Object}
  *            chars
  * @return {TypeName}
  */
 function splitStrToChar(dateStr,splitChar){
 	return trimStr(dateStr).split(splitChar);
 }
  /**
   * 截取前后空格
   */
  function trimStr(str){
  	return str.replace(/(^\s*)|(\s*$)/g, "");
  }