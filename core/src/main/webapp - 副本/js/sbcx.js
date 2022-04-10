$(function(){
	$("div.etaxTBar").initToolbar({btns:['queryData']});
	// 检测Adobe插件
//	CheckAdobe();
});

function queryData(){
	debugger;
	loadingInfo();
	$("#sbcxForm")[0].submit();
}

function querydetail(sb_bh,sb_zlbh,ssqq,ssqz,gzlx_dm,tbrq,obj)
{
	var pdfinfo=$(obj).next('input[name="pdfInfo"]').val();
	if(pdfinfo==''||pdfinfo==null){
		$.etaxAjax('pdfUploadAction.action?sign=uploadPDF',{'sb_zlbh':sb_zlbh,'ssqq':ssqq,'ssqz':ssqz,'lsh':sb_bh,'gzlx_dm':gzlx_dm,'tbrq':tbrq},function(data){
			pdfinfo=data["pdfInfo"];
			$(obj).next('input[name="pdfInfo"]').val(pdfinfo);
			if(pdfinfo!=null&&pdfinfo!=''){
				showDialogPDF(sb_bh,sb_zlbh,pdfinfo,ssqq,ssqz,tbrq);
			}else{
				layerHandler.alert('pdf下载失败，请稍后重试！');
			}
		});
	}else{
		showDialogPDF(sb_bh,sb_zlbh,pdfinfo,ssqq,ssqz,tbrq);
	}

} 

function showDialogPDF(sb_bh,sb_zlbh,pdfinfo,sssq_q,sssq_z,tbrq){
	$("<div></div>").append(
			$("<iframe id='dialogjs' frameborder='0' align='center' height='100%' width='100%' src='sbcxAction.action?sign=queryDetail&sb_zlid="+sb_zlbh+"&sb_bh="+sb_bh+"&sssq_q="+sssq_q+"&sssq_z="+sssq_z+"&tbrq="+tbrq+"&pdfinfo="+pdfinfo+"'/>")).dialog({
			autoOpen: true, 
			modal: true, 
			height: 600,
	        width: 850,
			title: "详情",
			resizable:false,
			buttons:{
				   
		    },
		   close: function() {
		      $(this).dialog('close');
		    }
		});
}
	

	// Adobe PDF和Flash 插件检测
	 function GetAdobeState()
	 {
		if((typeof SYSCHECK !== 'undefined') && (typeof SYSCHECK.CheckAdobePDF !== 'undefined')){
			return SYSCHECK.CheckAdobePDF();				
		}
		else{
			return true;
		}
	 }

	 function CheckAdobe()
	 {
	 	var adb = GetAdobeState();

	 	var obj = eval('(' + adb + ')');

	 	if (obj.AdobePDF == '0')
	 	{
	 		layerHandler.alert('当前系统未安装Pdf阅读器，请下载安装。');
	 	}else if(obj.AdobeFlash == '0'){
	 		layerHandler.alert('当前系统未安装Flash插件，请下载安装！');
	 	}
	 } 
	 
function jk(skssqq,skssqz,yzdjxh,yzpzxh,yzpzzl_dm,zgswskfj_dm,sb_zlbh,xmbm){
	if(yzpzzl_dm == "BDA0610222"){//社保费
		//新增需求 苏州需要校验是否过了限缴期限 
//		zgswskfj_dm = "13205051000";
		if(zgswskfj_dm.substring(0,5) == "13205"){
			$.etaxAjax('sbcxAction.action?sign=checkSzXjqx', {
				  "xmbm":xmbm,
				  "skssqq":skssqq,
				  "skssqz":skssqz,
				  "zgswskfj_dm":zgswskfj_dm
			},function(data){
				debugger;
				if(data["mess"]!=null && data["mess"]!=undefined && data["mess"] != ""){
					layerHandler.alertauto(data["mess"],'提示信息','450px','180px');
				}else{
					sbfDjskxx(skssqq,skssqz,yzdjxh,yzpzxh,yzpzzl_dm,zgswskfj_dm,sb_zlbh);
				}
			});
		}else{
			sbfDjskxx(skssqq,skssqz,yzdjxh,yzpzxh,yzpzzl_dm,zgswskfj_dm,sb_zlbh);
		}
	}else{
		djskxx(skssqq,skssqz,yzdjxh,yzpzxh,yzpzzl_dm,zgswskfj_dm,sb_zlbh);
	}
}
function djskxx(skssqq,skssqz,yzdjxh,yzpzxh,yzpzzl_dm,zgswskfj_dm,sb_zlbh){
	$("<div id='dialogDIV'></div>").append(
 			$("<iframe  frameborder='0' align='center' height='500px;' width='980px;' src='qsxxcxAction.action?sign=queryQs&yzdjxh="+yzdjxh+"&yzpzxh="+yzpzxh+"&skssqq="+skssqq+"&skssqz="+skssqz+"&yzpzzl_dm="+yzpzzl_dm+"&zgswskfj_dm="+zgswskfj_dm+"&sb_zlbh="+sb_zlbh+"'/>")).dialog({
 			autoOpen: true, 
 			modal: true, 
 			height: 590,
 	        width: 1030,
 			title: "税款详情",
 			resizable:false,
 			buttons:{
 		    },
 		   close: function() {
 		      $(this).dialog('close');
 		    }
 		});
}
function sbfDjskxx(skssqq,skssqz,yzdjxh,yzpzxh,yzpzzl_dm,zgswskfj_dm,sb_zlbh){
	$("<div id='dialogDIV'></div>").append(
			$("<iframe  frameborder='0' align='center' height='500px;' width='980px;' src='qsxxcxAction.action?sign=querySbfQs&yzdjxh="+yzdjxh+"&yzpzxh="+yzpzxh+"&skssqq="+skssqq+"&skssqz="+skssqz+"&yzpzzl_dm="+yzpzzl_dm+"&zgswskfj_dm="+zgswskfj_dm+"'/>")).dialog({
			 			autoOpen: true, 
			 			modal: true, 
			 			height: 590,
			 	        width: 1030,
			 			title: "税款详情",
			 			resizable:false,
			 			buttons:{
			 		    },
			 		   close: function() {
			 		      $(this).dialog('close');
			 		    }
			 		});
}

 function closeDialogDIV(){
	 $("div#dialogDIV.ui-dialog-content.ui-widget-content").dialog('close');
 }
//附加税申报
 function queryFjssb(sb_bh,yzpzxh,sb_zlid,ssqq,ssqz,tbrq,ssdabh){
	 //window.open(getContextPath() +"/fjsSbAction.action?sign=queryFjssb&lsh="+sb_bh+"&yzpzxh="+yzpzxh+"&sb_zlid="+sb_zlid+"&ssqq="+ssqq+"&ssqz="+ssqz+"&tbrq="+tbrq+"&ssdabh="+ssdabh);
	 fjssbJump();
}
 function showCwxx(msg){
	 if(msg==''){
		 msg='申报信息正在处理中，请稍后。';
	 }
	 layerHandler.alertauto(msg,"详细信息","450px","250px",null);
 }
	 