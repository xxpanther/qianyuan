/*******************************************************************************
 * 去掉首尾空格
 * 
 * @param mystring
 * @returns
 */
function trim(mystring) {
	if(mystring==undefined){
		return "";
	}
	if(typeof(mystring)=='number'){
		return mystring;
	}
    try {
        var temp_string = mystring;
        while (temp_string.substring(0, 1) == " ")
            temp_string = temp_string.substring(1);
        while (temp_string
				.substring(temp_string.length - 1, temp_string.length) == " ")
            temp_string = temp_string.substring(0, temp_string.length - 1);
        return temp_string;
    } catch (e) {
//    	 alert(e.message);
        return "";
    }
}
/**
 * 将空转换成0.00
 * 
 * @param obj
 * @returns
 */
function emptyToZ(obj) {
    if (typeof (obj) == "object") {
        if (trim(obj.value)=="") {
            return "0.00";
        } else if (trim(obj.value) == "null") {
            return "0.00";
        } else {
            return obj.value;
        }
    } else {
        if (trim(obj)=="") {
            return "0.00";
        } else if (trim(obj) == "null") {
            return "0.00";
        } else {
            return obj;
        }
    }
}

function f_KeyUp_number(obj, fN) {
    obj.value = obj.value.replace(/\D/g, '');
    if (fN == '0') {
        if (obj.value.length > 1) {
            if (obj.value.substr(0, 1) == '0') {
                obj.value = '';
            }
        }
    }
}

function f_OnChange_number(obj, fN) {
    obj.value = obj.value.replace(/\D/g, '');
    if (fN == '0') {
        if (obj.value.length > 1) {
            if (obj.value.substr(0, 1) == '0') {
                obj.value = '';
            }
        }
    }
}

function safePage() {
    document.oncontextmenu = function () {
        event.returnValue = false;
    };
    window.onhelp = function () {
        return false;
    };
    document.onkeydown = function () {
        if ((window.event.altKey)
				&& ((window.event.keyCode == 37) || (window.event.keyCode == 39))) {

            event.returnValue = false;
        }
        if ((event.keyCode == 116) || (event.ctrlKey && event.keyCode == 82)) {
            event.keyCode = 0;
            event.returnValue = false;
        }
        if (event.keyCode == 122) {
            event.keyCode = 0;
            event.returnValue = false;
        }
        if (event.ctrlKey && event.keyCode == 78)
            event.returnValue = false;
        if (event.shiftKey && event.keyCode == 121)
            event.returnValue = false;
        if (window.event.srcElement.tagName == "A" && window.event.shiftKey)
            window.event.returnValue = false;
    };
}

function enterTab() {
    try {
        var type;
        type = document.activeElement.type;
        if (type == "select-one") {
            if ((event.keyCode != 38) && (event.keyCode != 40)) {
                window.event.keyCode = 9;
            }
        } else {
            if (event.keyCode == 13) {
                window.event.keyCode = 9;
            }
        }
    } catch (e) {

    }
}
//$("input[name*='code']")  name属性包含code的所有input标签 
function getVOData(voName){
	var fields=$("[name*='"+voName+"']").serializeArray();
	return $.toJSON(fields);
}

//  $("input[name^='code']")  name属性以code开始的所有input标签 
function getVODataStart(voName){
	debugger;
	var fields=$("[name^='"+voName+"']").serializeArray();
	return $.toJSON(fields);
}

function getDynamicVOData(tabID,voName,rowIdx){
	var fields= $("#"+tabID+" tr:gt("+rowIdx+")").find("[name*='"+voName+"']").serializeArray();
	return $.toJSON(fields);
}
function showSelect(inputName,sname){
	//select框回显
	var selectValue=$("input[name='"+inputName+"']").val();
	$("select[name='"+sname+"']").val(selectValue);
}

window.onload=function(){
	var errMsg=$("#errMsg").val();
	if(errMsg){
		if(errMsg!=''){
			 layerHandler.alert(errMsg);
		}
	}
};

// Ajax 文件下载
jQuery.download = function(url, data, method) { // 获得url和data
	if (url && data) {
		// data 是 string 或者 array/object
		data = typeof data == 'string' ? data : jQuery.param(data); 
		var inputs = '';
		jQuery.each(data.split('&'), function() {
			var pair = this.split('=');
			inputs += '<input type="hidden" name="' + pair[0] + '" value="'
					+ pair[1] + '" />';
		}); // request发送请求
     	jQuery(
				'<form action="' + url + '" method="' + (method || 'post')
						+ '">' + inputs + '</form>').appendTo('body').submit()
				.remove();
	}
};

function isIE(){
	if($.browser.msie){
		return 1;
	}
	return 0;
}
function setNotIEValAttr(arr){
		for(var i=0;i<arr.length;i++){
			document.getElementById(arr[i]).setAttribute('value',document.getElementById(arr[i]).value);
		}
}
function convertNull2Empty(arr){
	for(var i=0;i<arr.length;i++){
		if(document.getElementById(arr[i]).value=='null'){
			document.getElementById(arr[i]).value='';
		}
	}
}
function delRow(){
	if($("input:checked").length==0){
		layerHandler.alert("请选择要删除的行！");
		return;
	}
	layerHandler.confirm("确认删除选中的行吗？","删除确认",300,150,function(){
		var checkNode='<input type="checkbox" name="checkFlag">';
		$("input:checked").each(function(idx,dom){
			$(dom).parent().parent().remove();
		});
		$(":checkbox").each(function(idx,dom){
			if(idx>0){
				$(dom).parent().html(checkNode+idx);
			}
		});
		triggerJSGS(calObj);
	});
}
// 生成PDF取select框的值
function setHideVal(obj){
	var selectMc=$(obj).find("option:selected").text();
	$(obj).next("span").text(selectMc);
}


function dateCompare(startdate,enddate)   
{   
	var arr=startdate.split("-");    
	var starttime=new Date(arr[0],arr[1],arr[2]);    
	var starttimes=starttime.getTime();   
	  
	var arrs=enddate.split("-");    
	var lktime=new Date(arrs[0],arrs[1],arrs[2]);    
	var lktimes=lktime.getTime();   
  
	if(starttimes>lktimes)    
	{   
	  return false;   
	}else{
		 return true; 
	 }  
  
}  
function checkGj(obj){
	var selVal=obj.value;
	var num=0;
	if(selVal!='--请选择--'){
		$("select[name='gjdq']").each(function(idx,dom){
			if($(dom).val()==selVal){
				num=num+1;
			}
		});
		if(num>=2){
			layerHandler.alert('不能选择相同的国籍！');
			$("#dataFormSave").removeClass('gray').addClass("gray").attr('disabled','disabled');
		}else{
			$("#dataFormSave").removeAttr('disabled').removeClass("gray");
		}
	}
}
function getRightInnerHTML(elm){
	if(isIE()!='1'){
	  return encodeURIComponent($(elm).html());
	}
	var content = elm.innerHTML;
	if(!document.all) return content;
	var regOne = /(\s+\w+)\s*=\s*([^<>"\s]+)(?=[^<>]*\/>)/ig;
	var regTwo = /"'([^'"]*)'"/ig; 
	content = content.replace(regOne,'$1="$2"').replace(regTwo,'\"$1\"'); 
	var okText = content.replace(/<(\/?)(\w+)([^>]*)>/g,function(match,$1,$2,$3){
		if($1){
			return "</"+ $2.toLowerCase() +">";       
		}       
		return ("<"+ $2.toLowerCase() +$3+">").replace(/=(("[^"]*?")|('[^']*?')|([\w\-\.]+|[(\u4E00-\u9FA5\uF900-\uFA2D)|(\w\-\.)]+))([\s>])/g,
				function(match2,$1,$2,$3,$4,$5,position,all){
			if($4){return '="'+ $4 +'"'+ $5;}
			return match2;
	   });
	});
	return encodeURIComponent(okText.replace(/<\/?([^>]+)>/g,function(lele){return lele;}));
}
function sbCancel(){
	var sb_type = $('#sb_type').val();
	var zsxm_dm = $('#zsxm_dm').val();
	var sbqx_dm = $("#nsqx_dm").val();
	var url = "sbcxAction.action?sign=index&amp;&sb_type=" + sb_type+ "&zsxm_dm=" + zsxm_dm + "&sbqx_dm=" + sbqx_dm;
	window.parent.addTabs("涉税查询",url);
}
function goBack(){ 
	debugger;
	loadingInfo();
	if($("#sb_type").val()=="31" || $("#sb_type").val()=="22" || $("#sb_type").val()=="21"){
		window.location.href = "indexDsMenuJump.action?sign=querysbzl&sb_type="+$("#sb_type").val()+"&zsxm_dm="+$("#zsxm_dm").val()+"&sssq_q="+$("#sssq_q").val()+"&sssq_z="+$("#sssq_z").val()+"&sb_zlbh="+$('#sb_zlid').val()+"&nsqx_dm="+$('#nsqx_dm').val()+"&sb_bh="+$('#lsh').val() + "&xmbm="+ isNullReturnEmpty($('#xmbm').val());
	}/*else if($("#sb_type").val()=="21"){
		window.location.href = "sb10411InitAction.action?sign=querysbzl&sb_type="+$("#sb_type").val()+"&zsxm_dm="+$("#zsxm_dm").val()+"&sssq_q="+$("#sssq_q").val()+"&sssq_z="+$("#sssq_z").val()+"&sb_zlbh="+$('#sb_zlid').val()+"&nsqx_dm="+$('#nsqx_dm').val();
	}*/else if($("#sb_type").val()=="18"){
		debugger;
		if($("#sb_zlid").val()=='10416'){
			window.location.href = "qysdsAMain.action?sign=glywIndex&sb_type="+$("#sb_type").val()+"&zsxm_dm="+$("#zsxm_dm").val()+"&sssq_q="+$("#sssq_q").val()+"&sssq_z="+$("#sssq_z").val()+"&sb_zlbh="+$('#sb_zlid').val()+"&nsqx_dm="+$('#nsqx_dm').val();
		}else if($("#sb_zlid").val()=='10409'){
			if($('#bb_zlbh').val()=='AX40000'){
				if($('#jumpBZ').length>0){
					window.location.href = "qysdsAMain.action?sign=qysdsAIndex&sb_type="+$("#sb_type").val()+"&zsxm_dm="+$("#zsxm_dm").val()+"&sssq_q="+$("#sssq_q").val()+"&sssq_z="+$("#sssq_z").val()+"&sb_zlbh="+$('#sb_zlid').val()+"&nsqx_dm="+$('#nsqx_dm').val();
				}else{
					window.location.href = "AX4000QkAction.action?sign=initPage&zlsh=" + $('#zlsh').val()
					+ "&sssq_q=" + $('#sssq_q').val() + "&sssq_z=" + $('#sssq_z').val()
					+ "&sb_zlid=" + $("#sb_zlid").val() + "&bb_zlbh="
					+ $('#bb_zlbh').val() + "&sb_type=" + $('#sb_type').val()
					+ "&zsxm_dm=" + $('#zsxm_dm').val() + "&nsqx_dm="
					+ $('#nsqx_dm').val() + "&lsh=" + lsh+"&flag=1";
				}
			}else{
				window.location.href = "qysdsAMain.action?sign=qysdsAIndex&sb_type="+$("#sb_type").val()+"&zsxm_dm="+$("#zsxm_dm").val()+"&sssq_q="+$("#sssq_q").val()+"&sssq_z="+$("#sssq_z").val()+"&sb_zlbh="+$('#sb_zlid').val()+"&nsqx_dm="+$('#nsqx_dm').val();
			}
		}else{
			window.location.href = "indexMenuJump.action?sign=querysbzl&sb_type="+$("#sb_type").val()+"&zsxm_dm="+$("#zsxm_dm").val()+"&sssq_q="+$("#sssq_q").val()+"&sssq_z="+$("#sssq_z").val()+"&sb_zlbh="+$('#sb_zlid').val()+"&nsqx_dm="+$('#nsqx_dm').val();
		}
	}else if($('#sb_zlid').val().substr(0,3)== '105' && !isSbcwgz()){
		window.location.href = "indexDsMenuJump.action?sign=querysbzl&sb_type="+$("#sb_type").val()+"&zsxm_dm="+$("#zsxm_dm").val()+"&sssq_q="+$("#sssq_q").val()+"&sssq_z="+$("#sssq_z").val()+"&sb_zlbh="+$('#sb_zlid').val()+"&nsqx_dm="+$('#nsqx_dm').val()+"&sb_bh="+$('#lsh').val() + "&xmbm="+ isNullReturnEmpty($('#xmbm').val()) ;
	}else if(isSbcwgz()){
		//申报错误更正
		window.location.href = "sbCwgzInitAction.action?sign=querysbzl&sb_type="+$("#sb_type").val()+"&zsxm_dm="+$("#zsxm_dm").val()+"&sssq_q="+$("#sssq_q").val()+"&sssq_z="+$("#sssq_z").val()+"&sb_zlbh="+$('#sb_zlid').val()+"&nsqx_dm="+$('#nsqx_dm').val()+"&pzxh="+$('#pzxh').val()+"&sbuuid="+$('#sbuuid').val()+"&lsh="+$('#lsh').val();
	}else{
		window.location.href = "indexMenuJump.action?sign=querysbzl&sb_type="+$("#sb_type").val()+"&zsxm_dm="+$("#zsxm_dm").val()+"&sssq_q="+$("#sssq_q").val()+"&sssq_z="+$("#sssq_z").val()+"&sb_zlbh="+$('#sb_zlid').val()+"&nsqx_dm="+$('#nsqx_dm').val()+"&sjly="+$('#sjly').val() +"&sb_bh="+$('#lsh').val()+"&ggyylybz="+ isNullReturnEmpty($('#ggyylybz').val()) ;;
	}
}
function isSbcwgz(){
	var sbcwgzbz = $("#sbcwgzbz").val();
	if(isNotNull(sbcwgzbz) && sbcwgzbz == "Y"){
		return true;
	}
	return false;
}
$(function(){
	 $("body").on('focus',"input.srx",function(){
	 	if($(this).attr('cal')){
	 		 $(this).css({"text-align":"left"});
	 	}
	 });
});
function validateInputNull(){
	 var valid=true;
	 var jDoms=$("input:text");
	 var msg;
	 for(var i=0;i<jDoms.length;i++){
		 msg="";
		 if($(jDoms[i]).attr('validate')){
			 msg=$(jDoms[i]).attr('validate');
		 }else{
			 continue;
		 }
		 if($(jDoms[i]).val()==''){
			 valid=false;
			 layerHandler.alert(msg);
			 break;
		 }
		
	 }
	return valid;
}
/**
 * 获取上下文路径
 * @returns
 */
function getContextPath() {
	var contextPath = document.location.pathname;
	var index = contextPath.substr(1).indexOf("/");
	contextPath = contextPath.substr(0, index + 1);
	delete index;
	return contextPath;
}
function loadingInfo(setting){
	var args = $.extend({
		msg :"业 务 处 理 中,请 您 耐 心 等 待......" //default
	},setting||{});
	var str = "<div id='loading-box'>"
				+"<div class='loading-center'>"
				+"<span class='gif'></span>"
				+ "<span class='msg'>"+args.msg+"</span>"
			+"</div></div>";
	$("body").prepend(str);
}
function removeLoadingInfo(){
	$("#loading-box").remove();
}


function getCommonInfo(){
	var temp=$('#bb_zlbh').val();
	var zlid='';
	if(temp.startWith('A')||temp.startWith('G')){
		zlid=$('#sb_zlid').val();
	}else if(temp=='39800000'){
		zlid=$('#sb_zlid').val();
	}else{
		zlid=($('#bb_zlbh').val()+"").substring(0,5);
	}
	var str= '&lsh='+$('#lsh').val()+'&bb_zlbh='+$('#bb_zlbh').val()+'&sb_zlid='+zlid+'&sssq_q='+$("#sssq_q").val()+'&sssq_z='+$("#sssq_z").val();
	return str;
}
/**
 * 初始化数据赋值
 */
function initHideVal(){
	var initData=$("#jsonData").val();
	if(initData!=null&&initData!=''){
		var jsonData=$.parseJSON(initData);
		for(var key in jsonData){
			$("input[name$='."+key+"'],input[name='"+key+"']").val(jsonData[key]);
		}
	}
}

String.prototype.startWith=function(str){
	if(str==null||str==""||this.length==0||str.length>this.length)
	  return false;
	if(this.substr(0,str.length)==str)
	  return true;
	else
	  return false;
	return true;
};
String.prototype.endWith=function(str){
	if(str==null||str==""||this.length==0||str.length>this.length)
	  return false;
	if(this.substring(this.length-str.length)==str)
	  return true;
	else
	  return false;
	return true;
};

//下载模板  
function downLoadExcel(concent){
   window.open( getContextPath()+"/download/"+concent);
}
function getCellValue(rowIdx,tagName){
	 var temp=$("#tab1 tr:eq("+rowIdx+")").find("input[name='"+tagName+"']").val();
	 return parseFloat(caltbNumloop(emptyToZ(temp),2));
}
/**
* ex： 
* a) 1+2+3....+10   expStr="1~10"
* b) 1+6+9+10       expStr="1,6,9,10"
* @param expStr
* @param tagName
* @returns {Number}
*/
function calAddInputs(expStr,tagName){
	var arr;
	var times;
	var sum=0;
	if(expStr.indexOf("~")>0){
		arr=expStr.split("~");
		times=parseInt(arr[1])-parseInt(arr[0])+1; 
		for(var i=1;i<=times;i++){
			var idx=parseInt(arr[0])+i-1;
			var val=$("#tab1 tr:eq("+idx+")").find("input[name='"+tagName+"']").val();
			sum+=parseFloat(caltbNumloop(emptyToZ(val),2));
		}
	}else if(expStr.indexOf(",")>0){
		arr=expStr.split(",");
		for(var i=0;i<arr.length;i++){
			var idx=parseInt(arr[i]);
			var val=$("#tab1 tr:eq("+idx+")").find("input[name='"+tagName+"']").val();
			sum+=parseFloat(caltbNumloop(emptyToZ(val),2));
		}
	}
	return sum;
}


/**
 *表格的input输入框初始化赋值;
 * @param obj
 */
function inputSetZero(){
$("input[type='text'][cal='true']").each(function(index,dom){
		if($(dom).val()==""){
			$(dom).val(caltbNumloop(0, $(dom).attr("format")==undefined?2:$(dom).attr("format")));
		}
});
}

/**
 *修改td的背景属性;设置单元格背景色  srx:#CAD4EF fsrx:#EBEBEB
 * @param obj
 */
function setCell_backgroundColor(){
$("input[type='text']").each(function(index,dom){
	    var style=$(dom).attr("class")==undefined?"":$(dom).attr("class");
		if(style!=""){
		    if(style=="srx"){
		    	$(dom).parent().css("background","#CAD4EF");
		    }else if(style=="fsrx"){
		        $(dom).parent().css("background","#EBEBEB");
		    }	
		}   	
});
}

function setCookie(name,value){
	localStorage[name]=value;
}
function getCookies(name){
/*	alert(document.cookie);
	var attrs=document.cookie.split(';');
	for(var i=0;i<attrs.length;i++){
		var keyValue=attrs[i].split("=");
		if(name == $.trim(keyValue[0])){
			return keyValue[1];
		}
	}*/
	return localStorage[name];
}


/**
 *系统存在流水号为空的情况;进行校验
 * @param obj
 */
function getLshNull(){	
	if($("#lsh").length>0){
		if($.trim($("#lsh").val())==""){
			//灰化暂存按钮
			$("#save_btn,#read_btn,#dataReady_btn,#preview_btn,#query_btn,#check_btn,#uploadExcel_btn,#uploadXml_btn").addClass("gray").removeAttr("onclick");
			layerHandler.alert("核心征管发生业务异常,请返回主页,刷新页面后再次申报!");
			return;
		}
	}
}

function getFTL(){
	$("div.etaxTBar").remove();
	$("br").remove();
	$("table.tb input").each(function(idx,dom){
		var attrName=$(dom).attr('name');
		var aSpan="${bizData1"+attrName.substring(attrName.indexOf('.'))+"}";
		$(dom).after("<span>"+aSpan+"</span>");
		$(dom).remove();
	});
}

function dynamicTriggerATag(url){
	var a=$("<a href='"+url+"' target='_blank'>链接</a>").get(0);
	var e;
		if($.browser.msie){
		  window.open(url);
		}else{
		 e=document.createEvent('MouseEvents');
		 e.initEvent('click',true,true);
		 a.dispatchEvent(e);
		} 
}

function addAvEvents(){
	debugger;
	 //右侧悬浮
	$(".closebox,.openbox .close").click(function(){
 		$(".fastnav").toggleClass("open");
 	});
	//右侧浮动广告事件
	$('#kfLink').click(function(){
 		  $.etaxAjax('DzswjAdviseAction.action',{'open_type':'index','code':$(this).attr('code')},function(data){
 	            dynamicTriggerATag(data["url"]);
 		  },false);
	});
	$('#cstLink').click(function(){
		  $.etaxAjax('DzswjAdviseAction.action',{'open_type':'package','code':$(this).attr('code')},function(data){
	            dynamicTriggerATag(data["url"]);
		  },false);
	});
	$('#czspLink').click(function(){
		  $.etaxAjax('DzswjAdviseAction.action',{'open_type':'video','code':$(this).attr('code')},function(data){
	            dynamicTriggerATag(data["url"]);
		  },false);
	});
	$('#bszsLink,#yjlsbLink').click(function(){
		  $.etaxAjax('DzswjAdviseAction.action',{'open_type':'appkey','code':$(this).attr('code')},function(data){
	            dynamicTriggerATag(data["url"]);
		  },false);
	});
}
function isNullReturnEmpty(obj){
	if(isNotNull(obj)){
		return trim(obj);
	}
	return "";
}
function isNotNull(obj){
	if(obj == undefined || obj == null || obj == "" || obj == "null" || obj == "NULL"){
		return false;
	}
	return true;
}
function getJsonDataValBykey(inputKey){
	var tempData = $('#jsonData').val();
	var jsonDataVal = "";
	if(tempData!=null&&tempData!=''&&tempData!='null'){
		var jsonData = $.parseJSON(tempData);
		jsonDataVal = jsonData[inputKey];
	}
	return jsonDataVal;
}

