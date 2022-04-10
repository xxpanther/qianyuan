(function ($) {
    $.fn.extend({
        "initToolbar": function (options) {
		    var btnHtml='';
            var opts = $.extend({}, defaluts, options); 
            var sbstate = $("#sbzbstate").val();
            return this.each(function () {  
                var $this = $(this); 
                debugger;
                for(var i=0;i<opts.btns.length;i++){
                	if(opts.btns[i]=='submitQhjt'){
   				     btnHtml+='<div class="btn_ho"  onclick="tempSave();" id="save_btn"><img src="'+getContextPath()+'/js/common/image/action_save.gif" alt=""><span>提交</span></div>';
   				   }else if(opts.btns[i]=='save'){
				     btnHtml+='<div class="btn_ho"  onclick="doTempSave();" id="save_btn"><img src="'+getContextPath()+'/js/common/image/action_save.gif" alt=""><span>保存</span></div>';
				   }else if(opts.btns[i]=='storageSave'){
				     btnHtml+='<div class="btn_ho"  onclick="storageSave();" id="storage_btn"><img src="'+getContextPath()+'/js/common/image/action_save.gif" alt=""><span>暂存</span></div>';
				   }else if(opts.btns[i]=='return'){
				     btnHtml+='<div class="btn_ho"  onclick="goBack();" id="goback_btn"><img src="'+getContextPath()+'/js/common/image/back.png" alt=""><span>返回</span></div>';
				   }else if(opts.btns[i]=='readData'){
					   btnHtml+='<div class="btn_ho" onclick="readData();" id="read_btn"><img src="'+getContextPath()+'/js/common/image/readData.png" alt=""><span>数据读取</span></div>';  
				   }else if(opts.btns[i]=='checkDB'){
					   btnHtml+='<div class="btn_ho" onclick="checkDB();" id="check_btn"><img src="'+getContextPath()+'/js/common/image/preview.png" alt=""><span>字段校验</span></div>';  
				   }else if(opts.btns[i]=='queryData'){
					   btnHtml+='<div class="btn_ho" onclick="queryData();" id="query_btn"><img src="'+getContextPath()+'/js/common/image/application_form_magnify.png" alt=""><span>查询</span></div>';  
				   }else if(opts.btns[i]=='previewData'){
					   btnHtml+='<div class="btn_ho" onclick="previewData();" id="preview_btn"><img src="'+getContextPath()+'/js/common/image/preview.png" alt=""><span>预览打印</span></div>';  
				   }else if(opts.btns[i]=='dataReady'){
					   btnHtml+='<div class="btn_ho" onclick="dataReady();" id="dataReady_btn"><img src="'+getContextPath()+'/js/common/image/user.gif" alt=""><span>数据准备区</span></div>';  
				   }else if(opts.btns[i]=='submitData'){
					   btnHtml+='<div class="btn_ho" onclick="submitData();" id="submit_btn"><img src="'+getContextPath()+'/js/common/image/sumbit.gif" alt=""><span>申报</span></div>';  
				   }else if(opts.btns[i]=='chooseBB'){
					   btnHtml+='<div class="btn_ho"  id="chooseBB_btn"><img src="'+getContextPath()+'/js/common/image/preview.png" alt=""><span>切换报表</span></div>';  
				   }else if(opts.btns[i]=='uploadExcel'){
					   btnHtml+='<div class="btn_ho" onclick="uploadExcel();" id="uploadExcel_btn"><img src="'+getContextPath()+'/js/common/image/database_refresh.png" alt=""><span>Excel上传</span></div>';  
				   }else if(opts.btns[i]=='downExcel'){
					   btnHtml+='<div class="btn_ho" onclick="downExcel();" id="downExcel_btn"><img src="'+getContextPath()+'/js/common/image/page_white_excel.png" alt=""><span>下载模板</span></div>';  
				   }else if(opts.btns[i]=='uploadXml'){
					   btnHtml+='<div class="btn_ho" onclick="uploadXml();" id="uploadXml_btn"><img src="'+getContextPath()+'/js/common/image/.png" alt=""><span>Xml上传</span></div>';  
				   }else if(opts.btns[i]=='saveData'){
					   btnHtml+='<div class="btn_ho_zrrjjdj" onclick="saveData();" id="zrrjjdj_btn"><span>自然人间接登记</span></div>';
					   //btnHtml+='<div class="btn_hoaa" onclick="saveData();" id="savedata_btn"><img src="'+getContextPath()+'/js/common/image/application.png" alt=""><span>自然人间接登记</span></div>';  
				   }else if(opts.btns[i]=='sscxBB'){//涉税查询
					   btnHtml+='<div class="btn_ho" onclick="sbCancel();" id="sscxBB_btn"><img src="'+getContextPath()+'/js/common/image/application_form_magnify.png" alt=""><span>涉税查询</span></div>';  
				   }else if(opts.btns[i]=='tishi'){
					   btnHtml+='<div class="btn_ho" onclick="tishi();" id="tishi_btn"><img src="'+getContextPath()+'/js/common/image/book_open.png" alt=""><span>换算规则</span></div>';  
				   }else if(opts.btns[i]=='cancelData'){
					   btnHtml+='<div class="btn_ho" onclick="cancelData();" id="cancelData_btn"><img src="'+getContextPath()+'/js/common/image/exclamation.png" alt=""><span>作废</span></div>';  
				   }else if(opts.btns[i]=='xxfpData'){
					   btnHtml+='<div class="btn_ho" onclick="xxfpData();" id="xxfpData_btn"><img src="'+getContextPath()+'/js/common/image/user.gif" alt=""><span>销项发票区</span></div>';  
				   }else if(opts.btns[i]=='jxfpData'){
					   btnHtml+='<div class="btn_ho" onclick="jxfpData();" id="jxfpData_btn"><img src="'+getContextPath()+'/js/common/image/user.gif" alt=""><span>进项发票区</span></div>';  
				   }else if(opts.btns[i]=='autoCal'){
					   btnHtml+='<div class="btn_ho" onclick="autoCalData();" id="autoCal_btn"><img src="'+getContextPath()+'/js/common/image/calculator.png" alt=""><span>自动计算</span></div>';  
				   }else if(opts.btns[i]=='getFTL'){
					   btnHtml+='<div class="btn_ho" onclick="getFTL();" id="getFTL_btn"><img src="'+getContextPath()+'/js/common/image/database_refresh.png" alt=""><span>生成FTL</span></div>';  
				   }else if(opts.btns[i]=='ccshzSave'){
					   btnHtml+='<div class="btn_ho" onclick="ccshzSave();" id="ccshzSave_btn"><img src="'+getContextPath()+'/js/common/image/database_refresh.png" alt=""><span>汇总</span></div>';  
				   }else if(opts.btns[i]=='tdzzsqslistQuery'){
					   btnHtml+='<div class="btn_ho" onclick="tdzzsqslistQuery();" id="tdzzsqslist_btn"><img src="'+getContextPath()+'/js/common/image/application_view_list.png" alt=""><span>列表提取</span></div>';  
				   }else if(opts.btns[i]=='getXmmxInit'){
					   btnHtml+='<div class="btn_ho" onclick="getXmmxInit();" id="getXmmxInit_btn"><img src="'+getContextPath()+'/js/common/image/database_refresh.png" alt=""><span>数据提取</span></div>';  
				   }else if(opts.btns[i]=='uploadXmmx'){
					   btnHtml+='<div class="btn_ho" onclick="uploadXmmx();" id="uploadXmmx_btn"><img src="'+getContextPath()+'/js/common/image/database_refresh.png" alt=""><span>数据上传</span></div>';  
				   }else if(opts.btns[i]=='qyzdqtrycj'){
				     btnHtml+='<div class="btn_ho_cj" onclick="qyzdqtrycj();" id="qyzdqtrycj_btn"><span>企业重点群体人员采集</span></div>';
				   }else if(opts.btns[i]=='qytysbcj'){
				     btnHtml+='<div class="btn_ho_cj" style="margin-right:20px " onclick="qytysbcj();" id="qytysbcj_btn"><span>企业退役士兵采集</span></div>';
				   }else if(opts.btns[i]=='sbtbsm'){
				     btnHtml+='<div class="btn_ho" style="float:right; margin-right:20px" onclick="sbtbsm();" id="sbtbsm_btn"><img src="'+getContextPath()+'/js/common/image/action_save.gif" alt=""><span>填表说明</span></div>';
				   }else if(opts.btns[i]=='yjsb'){
					   btnHtml+='<div class="btn_ho" onclick="yjsb();" id="yjsb_btn"><img src="'+getContextPath()+'/js/common/image/application_view_list.png" alt=""><span>一键申报</span></div>';  
				   }else if(opts.btns[i]=='yjjk'){
					   btnHtml+='<div class="btn_ho" onclick="yjjk();" id="yjsb_btn"><img src="'+getContextPath()+'/js/common/image/application_view_list.png" alt=""><span>一键缴款</span></div>';  
				   }else if(opts.btns[i]=='refreshPage'){
					   btnHtml+='<div class="btn_ho" onclick="refreshPage();" id="refreshPage_btn"><img src="'+getContextPath()+'/js/common/image/application_view_list.png" alt=""><span>刷新</span></div>';  
				   }else if(opts.btns[i]=='pdfPrint'){
					   btnHtml+='<div class="btn_ho" onclick="pdfPrint();" id="pdfPrint_btn"><img src="'+getContextPath()+'/js/common/image/application_view_list.png" alt=""><span>打印</span></div>';  
				   }else if(opts.btns[i]=='fjsSb'){
					   btnHtml+='<div class="btn_ho" onclick="fjsSb();" id="fjsSb_btn" style="float:right; margin-right:20px"><img src="'+getContextPath()+'/js/common/image/application_view_list.png" alt=""><span>附加税申报</span></div>';  
				   }
                	
				   /********************************************小规模转一般纳税人综合套餐**********************************************/
				   else if(opts.btns[i]=='chooseBBZhtc'){
					   btnHtml+='<div class="btn_ho"  id="chooseBB_btn_zhtc"><img src="'+getContextPath()+'/js/common/image/preview.png" alt=""><span>切换报表</span></div>';  
				   }else if(opts.btns[i]=='saveZhtc'){
				     btnHtml+='<div class="btn_ho"  onclick="doTempSavezHTC();" id="save_btn"><img src="'+getContextPath()+'/js/common/image/action_save.gif" alt=""><span>保存</span></div>';
				   }
				   /***********************************************************************************************************************/
				}
                debugger;
				$('div.etaxTBar').append(btnHtml);
				/*if (sbstate == "4" || sbstate == "6" || sbstate == "7" || sbstate == "2") {
					if (!(($('#sb_zlid').val() == '10519' && $('#bb_zlbh').val() == '10519002') || ($('#sb_zlid').val() == '10519' && $('#bb_zlbh').val() == '10519003') || 
						  ($('#sb_zlid').val() == '10507' && $('#bb_zlbh').val() == '10507002') || ($('#sb_zlid').val() == '10507' && $('#bb_zlbh').val() == '10507003'))) {
						$("#save_btn,#storage_btn,#read_btn,#dataReady_btn,#preview_btn,#query_btn,#check_btn,#uploadExcel_btn,#uploadXml_btn").addClass("gray").removeAttr("onclick").attr('disabled', true);
					}
				}
				*/
				if(sbstate=="4" || sbstate == "6" || sbstate =="7"||sbstate=="2"){
					$("#save_btn,#read_btn,#dataReady_btn,#preview_btn,#query_btn,#check_btn,#uploadExcel_btn,#uploadXml_btn,#storage_btn").addClass("gray").removeAttr("onclick").attr('disabled',true);
				}
				
				debugger;
				if($('#chooseBB_btn').length>0){
					  var tempStr;
					if($('#sb_zlid').val()=='10416'){
						tempStr=$("input[id='glywData']",window.parent.document).val();
					}else{
						 if($("#sbcwgzbz").val()!= null && $("#sbcwgzbz").val()!="" &&  $("#sbcwgzbz").val() == "Y"){
							 tempStr=$("input[id='sbcwgzbblist']").val();
						 }else{
							 tempStr=$("input[id='bbListData']",window.parent.document).val();
						 }
					}
					if($('#sb_zlid').val().startWith('398')){
						$('#chooseBB_btn').hide();
					}
			        if(tempStr!=null&&tempStr!=''){
				        $("body").append('<div id="selectItem" class="selectItemhidden"></div>');
				        createBBDiv(tempStr);
			        }else{
			        	$('#chooseBB_btn').hide();
			        }
				}
				if($('#chooseBB_btn_zhtc').length>0){
					  var tempStr=$("input[id='bbListDataZhtc']").val();
			        if(tempStr!=null&&tempStr!=''){
				        $("body").append('<div id="selectItem" class="selectItemhidden"></div>');
				        createBBDivZhtc(tempStr);
			        }else{
			        	$('#chooseBB_btn_zhtc').hide();
			        }
				}
            });
        }
    });
    //默认参数
    var defaluts = {
      btns:['return','save','chooseBB']
    };
})(window.jQuery);
function createBBDiv(jsonData){
	var _sbstate = $("#sbzbstate").val();
	var bbListData=$.parseJSON(jsonData);
	$("#selectItem").empty();
	var str='<div id="selectItemAd" class="selectItemtit bgc_ccc"><h2 id="selectItemTitle" class="selectItemleft">选择切换</h2>  <div id="selectItemClose" class="selectItemright">关闭</div></div>  <div id="selectItemCount" class="selectItemcont"> <div id="selectSub"><table class="bblistTb"><tr style="background-color:#EBEBEB;font-weight:bold;"><td style="width:18%;">报表编号</td><td style="width:72%;">报表名称</td><td>状态</td></tr>';
	 for(var i=0 ;i<bbListData.length;i++){
		 var bb_zlid=bbListData[i]["bb_zlid"];
		 var url=bbListData[i]["url"];
		 var zt=bbListData[i]["zt"];
		 str+='<tr onclick="chooseBB(\''+bb_zlid+'\',\''+url+'\',\''+zt+'\',\''+_sbstate+'\')"><td>'+bb_zlid+'</td><td>'+bbListData[i]["bb_zlmc"]+'</td><td>'+bbListData[i]["ztmc"]+'</td></tr>';
	 }
	str+='</table>  </div></div>';
	$("#selectItem").append(str);
	$("#chooseBB_btn").showbbList('#selectItem');
	//table隔行换色
	$("table.bblistTb").find("tr:gt(0)").mouseenter(function(){
		$(this).css('background-color','#E88E22').css({'color':'white','cursor':'pointer','text-decoration':'underline'});
	}).mouseout(function(){
		$(this).css('background-color','white').css({'color':'black','text-decoration':''});
	});
}
function doTempSave(){
	getLshNull();
	if($('#chooseBB_btn').length>0){
		var tempStr;
		if($('#sb_zlid').val()=='10416'){
			tempStr=$("input[id='glywData']",window.parent.document).val();
		}else{
			if($("#sbcwgzbz").val()!= null && $("#sbcwgzbz").val()!="" &&  $("#sbcwgzbz").val() == "Y"){
				 tempStr=$("input[id='sbcwgzbblist']").val();
			 }else{
				 tempStr=$("input[id='bbListData']",window.parent.document).val();
			 }
		}
	 if(tempStr!=undefined && tempStr!=''&& tempStr!=null && tempStr!='null'){
		    var bbListData=$.parseJSON(tempStr);
		     var bb_zlbh=$('#bb_zlbh').val();
		     var jsonStr='[';
		     for(var i=0 ;i<bbListData.length;i++){
		    	 if(i==0){
		    		 jsonStr+='{';
		    	 }else{
		    		 jsonStr+=',{';
		    	 }
		    	 jsonStr+='"bb_zlid":"'+bbListData[i]["bb_zlid"]+'",';
		    	 jsonStr+='"bb_zlmc":"'+bbListData[i]["bb_zlmc"]+'",';
		    	 if(bb_zlbh==bbListData[i]["bb_zlid"]){
		    		 var _url=(bbListData[i]["url"]).replace('initPage','queryData');
		    		 jsonStr+='"url":"'+_url+'",';
		    		 jsonStr+='"zt":"101",';
		    		 if(bb_zlbh=='AX10000'||bb_zlbh=='AX40000'){
		    			 jsonStr+='"ztmc":"进入"';
		    		 }else{
		    			 jsonStr+='"ztmc":"已填写"';
		    		 }
		    	 }else{
		    		 jsonStr+='"url":"'+bbListData[i]["url"]+'",';
		    		 jsonStr+='"zt":"'+bbListData[i]["zt"]+'",';
		    		 jsonStr+='"ztmc":"'+bbListData[i]["ztmc"]+'"';
		    	 }
		    	
		    	 jsonStr+='}';
		     }
		     jsonStr+=']';
		     debugger;
			 if($('#sb_zlid').val()=='10416'){
					$("input[id='glywData']",window.parent.document).val(jsonStr);
			 }else{
				 if($("#sbcwgzbz").val()!= null && $("#sbcwgzbz").val()!="" &&  $("#sbcwgzbz").val() == "Y"){
					 $("input[id='sbcwgzbblist']").val(jsonStr);
				 }else{
					 $("input[id='bbListData']",window.parent.document).val(jsonStr);
				 }
			 }
		     createBBDiv(jsonStr);
	   }
	}
     tempSave();
}
function storageSave(){
	storage_btn();
}
function chooseBB(bb_zlid,url,zt,sbstate){
	debugger;
	var sb_type = $("#sb_type").val();
	var zsxm_dm = $("#zsxm_dm").val();
	var sssq_q = $("#sssq_q").val();
	var sssq_z = $("#sssq_z").val();
	var nsqx_dm = $("#nsqx_dm").val();
	var xmbm = $("#xmbm").val();
	var ggyylybz = $("#ggyylybz").val();
	var sb_zlbh = '';
	if(bb_zlid.startWith('A')){
		sb_zlbh='10409';
	}else if(bb_zlid.startWith('G')){
		sb_zlbh='10416';
	}else{
		sb_zlbh=bb_zlid.substring(0,5);
	}
	var lsh=$('#lsh').val();
	loadingInfo();
	debugger;
	if($("#sbcwgzbz").val()!= null && $("#sbcwgzbz").val()!="" &&  $("#sbcwgzbz").val() == "Y"){
		var sbuuid = $('#sbuuid').val();
		var pzxh =  $('#pzxh').val();
//		var sbcwgzbblist =  $('#sbcwgzbblist').val();
		window.location.href = getContextPath() +"/"+ url + "&lsh=" + lsh + "&bb_zlbh="
		+ bb_zlid + "&zt=" + zt + "&sssq_q=" + sssq_q + "&sssq_z=" + sssq_z
		+ "&sb_zlid=" + sb_zlbh + "&sb_type=" + sb_type + "&zsxm_dm="
		+ zsxm_dm + "&nsqx_dm=" + nsqx_dm+"&sbstate="+sbstate +"&pzxh=" + pzxh+"&sbuuid=" + sbuuid+"&xmbm=" +xmbm;
	}else{
		window.location.href = getContextPath() +"/"+ url + "&lsh=" + lsh + "&bb_zlbh="
		+ bb_zlid + "&zt=" + zt + "&sssq_q=" + sssq_q + "&sssq_z=" + sssq_z
		+ "&sb_zlid=" + sb_zlbh + "&sb_type=" + sb_type + "&zsxm_dm="
		+ zsxm_dm + "&nsqx_dm=" + nsqx_dm+"&sbstate="+sbstate+"&xmbm=" +xmbm + "&ggyylybz="+ggyylybz;
	}
}
/****************************************************小规模转一般纳税人综合套餐部分*********************************************/
function createBBDivZhtc(jsonData){
	debugger;
	var _sbstate = $("#sbzbstate").val();
	var bbListData=$.parseJSON(jsonData);
	$("#selectItem").empty();
	var str='<div id="selectItemAd" class="selectItemtit bgc_ccc"><h2 id="selectItemTitle" class="selectItemleft">选择切换</h2>  <div id="selectItemClose" class="selectItemright">关闭</div></div>  <div id="selectItemCount" class="selectItemcont"> <div id="selectSub"><table class="bblistTb"><tr style="background-color:#EBEBEB;font-weight:bold;"><td style="width:90%;">报表名称</td><td>状态</td></tr>';
	 for(var i=0 ;i<bbListData.length;i++){
		 var bb_zlid=bbListData[i]["bb_zlid"];
		 var url=bbListData[i]["url"];
		 var zt=bbListData[i]["zt"];
		 str+='<tr onclick="chooseBBzhtc(\''+bb_zlid+'\',\''+url+'\',\''+zt+'\',\''+_sbstate+'\')"><td>'+bbListData[i]["bb_zlmc"]+'</td><td>'+bbListData[i]["ztmc"]+'</td></tr>';
	 }
	str+='</table>  </div></div>';
	$("#selectItem").append(str);
	$("#chooseBB_btn_zhtc").showbbList('#selectItem');
	//table隔行换色
	$("table.bblistTb").find("tr:gt(0)").mouseenter(function(){
		$(this).css('background-color','#E88E22').css({'color':'white','cursor':'pointer','text-decoration':'underline'});
	}).mouseout(function(){
		$(this).css('background-color','white').css({'color':'black','text-decoration':''});
	});
}
function chooseBBzhtc(bb_zlid,url,zt,sbstate){
	var sb_type = $("#sb_type").val();
	var zsxm_dm = $("#zsxm_dm").val();
	var sssq_q = $("#sssq_q").val();
	var sssq_z = $("#sssq_z").val();
	var nsqx_dm = $("#nsqx_dm").val();
	var sb_zlbh =bb_zlid.substring(0,5);
	var lsh=$('#lsh').val();
	loadingInfo();
	window.location.href = getContextPath() +"/"+ url + "&lsh=" + lsh + "&bb_zlbh="
			+ bb_zlid + "&zt=" + zt + "&sssq_q=" + sssq_q + "&sssq_z=" + sssq_z
			+ "&sb_zlid=" + sb_zlbh + "&sb_type=" + sb_type + "&zsxm_dm="
			+ zsxm_dm + "&nsqx_dm=" + nsqx_dm+"&sbstate="+sbstate;
}
function doTempSavezHTC(){
	debugger;
	getLshNull();
	if($('#chooseBB_btn_zhtc').length>0){
		var tempStr=$("input[id='bbListDataZhtc']").val();
	 if(tempStr!=undefined && tempStr!=''&& tempStr!=null && tempStr!='null'){
		    var bbListData=$.parseJSON(tempStr);
		     var bb_zlbh=$('#bb_zlbh').val();
		     var jsonStr='[';
		     for(var i=0 ;i<bbListData.length;i++){
		    	 if(i==0){
		    		 jsonStr+='{';
		    	 }else{
		    		 jsonStr+=',{';
		    	 }
		    	 jsonStr+='"bb_zlid":"'+bbListData[i]["bb_zlid"]+'",';
		    	 jsonStr+='"bb_zlmc":"'+bbListData[i]["bb_zlmc"]+'",';
		    	 if(bb_zlbh==bbListData[i]["bb_zlid"]){
		    		 var _url=(bbListData[i]["url"]).replace('initPage','queryData');
		    		 jsonStr+='"url":"'+_url+'",';
		    		 jsonStr+='"zt":"101",';
	    			 jsonStr+='"ztmc":"已填写"';
		    	 }else{
		    		 jsonStr+='"url":"'+bbListData[i]["url"]+'",';
		    		 jsonStr+='"zt":"'+bbListData[i]["zt"]+'",';
		    		 jsonStr+='"ztmc":"'+bbListData[i]["ztmc"]+'"';
		    	 }
		    	 jsonStr+='}';
		     }
		     jsonStr+=']';
			$("input[id='bbListDataZhtc']").val(jsonStr);
			createBBDivZhtc(jsonStr);
	   }
	}
     tempSave();
}
/******************************************************************************************************************/
