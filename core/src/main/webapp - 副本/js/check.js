
 $(function(){
	 
	//继续添加  添加用户的最后一步有继续添加和确定两个按钮
	 $("#readd").click(function(){
	 	$("#nextsetp2").hide();
	 	$("#firstsetp").show();
	 	});
	 
	 //继续添加
	 $("#hasreadd").click(function(){
		$("#hasnextsetp2").hide();
		$("#hasfirstsetp").show();
	});
	//确定 按钮
	 $("#sureaddnewuser").click(function(){
		 layer.closeAll();
		 window.location.reload();
	 });
	 
	 $("#sureadduser").click(function(){
	    layer.closeAll();
	    window.location.reload();
	});
	 
 });
function emailback() {
	$("#midCheckEmai").hide();
	$(".window-mask").hide();
}

// 修改手机号码 邮箱
function chenckPhone(id) {
	if (id == "editEmail") {
		$('input[id=EditEmail]').removeAttr("disabled");// 去除input元素的readonly属性
		$('input[id=EditEmail]').focus();
	} else if (id == "editPhone") {
		$('input[id=EditPhone]').removeAttr("disabled");// 去除input元素的readonly属性
		$('input[id=EditPhone]').focus();
	}
}
function EditPhone(id, username, ctx) {
	var username = username;
	var phone = $("#" + id).val();
	var reg_phone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
	if(!reg_phone.test(phone)){
		layerHandler.alert("手机格式不正确");
		return ;
	}	
	$.ajax({
		type : "POST",
		url : ctx + "/user/EditEmail.do",
		dataType : 'json',
		data : {
			username : $.trim(username),
			mobile : $.trim(phone)
		},
		success : function(msg) {
			if (ZRJC.isOperationSuccessful(msg)) {
				$('input[id=EditPhone]').attr("disabled", "true");
				layerHandler.alert(ZRJC.getOperationMsg(msg));
			} else {
				var error_msg = ZRJC.getOperationMsg(msg);
				layerHandler.alert(error_msg);
			}

		},
		   error : function(data){
				 try{
					    layerHandler.alert("连接超时，请重试",function(){
							window.location.reload();
						});
				    }catch(e){
					      
				   }

			}
	});
}

function EditEmail(id, username, ctx) {
	var username = username;
	var email = $("#" + id).val();
	var reg_email = /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if(!reg_email.test(email)){
		layerHandler.alert("邮箱格式不正确");
		return ;
	}	
	$.ajax({
		type : "POST",
		url : ctx + "/user/EditEmail.do",
		dataType : 'json',
		data : {
			username : $.trim(username),
			email : $.trim(email)
		},
		success : function(msg) {
			if (ZRJC.isOperationSuccessful(msg)) {
				$('input[id=EditEmail]').attr("disabled", "true");
				layerHandler.alert(ZRJC.getOperationMsg(msg));
			} else {
				var error_msg = ZRJC.getOperationMsg(msg);
				var error_code = ZRJC.getOperationCode(msg);
				layerHandler.alert(error_msg);
			}

		},
		   error : function(data){
				 try{
					    layerHandler.alert("连接超时，请重试",function(){
							window.location.reload();
						});
				    }catch(e){
					      
				   }

			}
	});

}

function emailback() {
	$("#midCheckEmai").hide();
	$(".window-mask").hide();
}
// 验证手机
function mobileCodeCheck(id) {
	if (id == 1) {
		layerHandler.alert("手机已经验证");
	} else {
		$.layer({
			type : 1, // 0-4的选择,（1代表page层）
			area : [ 'auto', 'auto' ],
			title : [ "提示 ", 'border:none;' // title背景色
			],
			bgcolor : '#fff', // 设置层背景色
			page : {
				dom : '#midCheckPhone'
			}
		});
		var value = $("#midCheckPhone").find("#mobileCheck").val();
		if("" == value || "请输入手机号码" == value){
			$("#midCheckPhone").find("#mobileCheck").attr("disabled",false);
			$("#midCheckPhone").find("#mobileCheck").attr("readonly",false);
		}else{
			$("#midCheckPhone").find("#mobileCheck").attr("disabled",true);
			$("#midCheckPhone").find("#mobileCheck").attr("readonly",true);
		}
		// $("#midCheckPhone").show();
		// $(".window-mask").show();
	}

}
function f_layer_close() {
	layer.closeAll();
}


// 检查两次输入的密码是否一致
function vaildpass(obj1, obj2,checkpassconfirm) {
	var repwd = $("#" + obj1).val();
	var pwd = $("#" + obj2).val();
	if (repwd != pwd) {
		$("#"+checkpassconfirm).css({
			'display' : 'block'
		});
		$("#"+checkpassconfirm).text('两次输入的密码不一致');
		$("#"+checkpassconfirm).css("display","block");
		return false;
	} else {
		$("#"+checkpassconfirm).css({
			'display' : 'none'
		});
		
		return true;
	}
}
// 检查密码的安全性
function checkecurity(password,checkpass) {

	var pwdValue = $("#" + password).val();
	//var valpassword = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
	 var  valpassword = /^(?:\d+|[a-z]+)$/;
	if (pwdValue.length > 0 && pwdValue.length < 8) {
		$("#"+checkpass).text("密码长度不能小于8");
		$("#"+checkpass).css("display","block");
		//$("#" + password).focus();
	
		return false;
	} else if (pwdValue.length > 20) {
		$("#"+checkpass).text("密码长度不能大于20");
		$("#"+checkpass).css("display","block");
		//$("#" + password).focus();
		
		return false;
	} else if (pwdValue.length == 0) {
		$("#"+checkpass).text("密码不能为空");
		$("#"+checkpass).css("display","block");
		//$("#" + password).focus();
		
		return false;
	} else if (valpassword.test(pwdValue)) {
		$("#"+checkpass).text("请使用数字、字母、特殊字符的任意组合，提高密码强度");
		$("#"+checkpass).css("display","block");
		//$("#" + password).focus();
		return false;
	} else {
		$("#"+checkpass).text("");
		$("#"+checkpass).css("display","none");
		return true;
	}
}

$(function() {
	/*$("#tab li").first().addClass("on").siblings().removeClass("on");
	$("#center > div").first().show().siblings().hide();
	$("#tab li").click(function() {
		var index = $("#tab li").index(this);
		$(this).addClass("on").siblings().removeClass("on");
		$("#center > div").eq(index).show().siblings().hide();
	});
*/
	$("#freevald").click(function() {
		$("#getvald").hide();
		$("#invald").show();
	});
	
	$("#updatefreevald1").click(function() {
		$("#updategetvald1").hide();
		$("#updateinvald1").show();
	});
	$("#updatefreevald2").click(function() {
		$("#updategetvald2").hide();
		$("#updateinvald2").show();
	});
	/*$("#hasnext_setp2").click(function() {
		$("#hasnextsetp1").hide();
		$("#hasnextsetp2").show()
	})*/

	$("#hasreadd").click(function() {
		$("#hasnextsetp2").hide();
		$("#hasfirstsetp").show();
	});
	$(".exchange_role").click(function() {
		$("#update_table").hide();
		$("#update_firststep").show();
	});
	$(".exchangemail_role").click(
		function() {
			$("#update_table,#update_firststep,#update_step1,#update_step2").hide();
			$("#updatemail_firststep").show();
		});
	
	/*$("#setptonext").click(function() {
		$("#updatemail_firststep").hide();
		$("#updatemail_step1").show()
	})*/
	/*$("#update_nextstep2").click(function() {
		$("#update_step1").hide();
		$("#update_step2").show()
	})
	$("#updatemail_nextstep2").click(function() {
		$("#updatemail_step1").hide();
		$("#updatemail_step2").show()
	})*/
	
	
	
});
//应用排行
function f_init_AppSortList(ctx){
	var url =ctx+"/user/app_center/app_sort_manage.do";
	var classify_sortlist = [];
	ZRJC.ajaxCall(url, null, function(json){
		//classify_sortlist[0]= {title : "财务报表申报34453", 	src : "", img : "${ctx }css/images/tb_03.png"},
		var classifyInfos =json.DATA;
		for ( var i = 0; i <classifyInfos.length; i++) {
			var classifyInfo = classifyInfos[i];
			classify_sortlist[i] = {
					title:classifyInfo.app_mc,
					src:classifyInfo.xstb_lj,
					img:classifyInfo.appVerLogo,
					app_dm : classifyInfo.app_dm,
					sfyy : classifyInfo.sfyy,
					bbh : classifyInfo.bbh,
					app_mc : classifyInfo.app_mc,
					sf_mryy : classifyInfo.sf_mryy,
					appNo : classifyInfo.appNo,
					sf_mk : classifyInfo.sf_mk,
					app_url : classifyInfo.app_url,
					appb_jxlx : classifyInfo.appb_jxlx
			};
		}
},function(data){
	 try{
	    layerHandler.alert("连接超时，请重试",function(){
			window.location.reload();
		});
    }catch(e){
	      
   }
	
	
	
});
return classify_sortlist;
}
//应用排行榜 拼接页面数据
function f_init_right(){
	var url =basePath+"/user/app_center/app_sort_manage.do";
	var classify_sortlist = [];
			ZRJC.ajaxCall(url, null, function(json){
				//classify_sortlist[0]= {title : "财务报表申报34453", 	src : "", img : "${ctx }css/images/tb_03.png"},
				var classifyInfos =json.DATA;
				for ( var i = 0; i <classifyInfos.length; i++) {
					var classifyInfo = classifyInfos[i];
					classify_sortlist[i] = {
							title:classifyInfo.app_mc,
							src:classifyInfo.xstb_lj,
							img:classifyInfo.appVerLogo,
							app_dm : classifyInfo.app_dm,
							sfyy : classifyInfo.sfyy,
							bbh : classifyInfo.bbh,
							app_mc : classifyInfo.app_mc,
							sf_mryy : classifyInfo.sf_mryy,
							appNo : classifyInfo.appNo,
							sf_mk : classifyInfo.sf_mk,
							app_url : classifyInfo.app_url,
							appb_jxlx : classifyInfo.appb_jxlx
					};
				}
				_init_row(classify_sortlist);
		},function(data){
			 try{
			    layerHandler.alert("连接超时，请重试",function(){
					window.location.reload();
				});
		    }catch(e){
			      
		   }
			
			
			
		});
	function _init_row(classify_sortlist){
		var _tmp = "";
		for(var i=1;i<classify_sortlist.length+1;i++){
			var _item = classify_sortlist[i-1];
			if(i == 1){
				_item.sortImg = staticPath+"css/images/nb_03.png";
			}else if(i == 2){
				_item.sortImg = staticPath+"css/images/nb_06.png";
			}else if(i == 3){
				_item.sortImg = staticPath+"css/images/nb_08.png";
			}
			
			_tmp += _init_render(_item, i,basePath);
		}
		$("#app_sort").append(_tmp);
	}
	
	function _init_render(item, index,ctx){
		var _str = "";
		if(window.JSON){
			_str += "<li  onclick='addUserApp("+JSON.stringify(item)+",\""+ctx+"\")'> ";
		}else{
			_str += "<li  onclick='addUserApp("+JSON2.stringify(item)+",\""+ctx+"\")'> ";
		}
		
		
		if(item.sortImg){
			_str += "<span class='numb1'><img src='"+item.sortImg+"' width='15' height='15'/></span>";
		}else{
			_str += "<span class='numb'>" + index + "</span>";
		}
		_str += "<span><img src='"+item.img+"' width='20' height='20'></img></span>";
		_str +=  	item.title;
		_str += "</li>";
		return _str;
	}
};

//添加应用
 function addUserApp(item,ctx){
	  //菜单右击功能
		var imageMenuData = [
		    [{
		        text: "关闭",
		        func: function() {
		        	 $(this).find("p").trigger("click");
		            }
		        }, 
		        {
		            text: "关闭其他",
		            func: function() {
		            	$(this).siblings().find("p").trigger("click");
		            	$(this).trigger("click");
		            	
		            }
		        }, 
		        {
		            text: "关闭所有",
		            func: function() {
		            	 $(this).siblings().find("p").trigger("click");
		            	$(this).find("p").trigger("click");
		            }
		        }]
		        ];
	 if(item.sfyy!=0){
		 var url =ctx+"/user/my_app/app_manage.do?sign=to_app";
		 var params = {
			app_dm : item.app_dm,
			app_bbh : item.bbh,
			appNo : item.appNo,
			sf_mk : item.sf_mk,
			app_url : item.app_url,
			appb_jxlx : item.appb_jxlx
		};
  var sf_mryy = item.sf_mryy;
  ZRJC.ajaxCall(url, params, function(json) {
  	if(ZRJC.isOperationSuccessful(json)){
  		var data = ZRJC.getOperationData(json);
		if("11101"==data.RESULT){
			layerHandler.alert("此应用暂停使用！");
			return;
		}
		if(item.app_dm=='shenbao_pzdy'){
			layerHandler.alert("此功能只支持非电子税局的网上申报历史凭证打印。", function(){
				window.open(data.url);
				});
			return;
		};
		//纳税服务链接
		if(item.app_dm.indexOf('hotapp')==0){
			window.open(data.url);
			return;
		};
		//添加应用使用频率
//		yysypl(params);
		//委托代征链接
		if(item.app_dm.indexOf('wtdz')==0){
				window.open(data.url);
			return;
		};
  		var if_tz = data.if_tz;
  		if((if_tz=="Y")||((if_tz=="N")&&(sf_mryy=="Y"))){
  			if(data.isJspbApp != null && data.isJspbApp == "Y") {
				$("#caPluginDiv").load(getContextPath() + "/commons/ca/ca.jsp", null, function(){
					var code = run_fwsk(0);
					if(code != 0) {
						layerHandler.dialog(("#div_alert_jspb"));
					}
					
				});
				return false;
			}
			if(data.isSKpbApp != null && data.isSKpbApp == "Y") {
				$("#caPluginDiv").load(getContextPath() + "/commons/ca/ca.jsp", null, function(){
					var code = run_fwsk(1);
					if(code != 0) {
						layerHandler.dialog(("#div_alert_skpb"));
					}
				});
				return false;
			}
      		var opt = {id : item.app_dm, title :item.app_mc, src : data.url, 	selected : false, close : true, click_refresh : false};
      		window.top.Index_tab.add_tab(opt);
      		window.top.$("#ulTabId_"+opt.id).smartMenu(imageMenuData,{
  			    name: "image"    
  			});
       }else{
         		layerHandler.alert("用户未与企业绑定，非默认程序不可用");
         	}	
  	}
			return false;
		},function(data){
			 try{
				    layerHandler.alert("连接超时，请重试",function(){
						window.location.reload();
					});
			    }catch(e){
				      
			   }	
			});
	  }else{ 
		    layerHandler.alert("请先添加该应用");  
	  } 
 }

	//添加应用使用频率
	function yysypl(params){
		var url =getContextPath()+"/user/my_app/yySypl.do";
		$.ajax({
			type : "POST",
			url : url,
			data:params,
			dataType : 'json',
			success : function(msg) {
			}});
	} 
 
 
var verify_username = function(value) {
	String.prototype.realLength = function() {
		return this.replace(/[^\x00-\xff]/g, "***").length;
	};
	var username = $("#" + value).val();
	var reg_phone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
	var reg_email = /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if (username == "") {
		$("#reguser").css({
			'display' : 'block'
		});
		$("#registerusername").text("用户名不能为空");
		$("#registerusername").css("display","block");
		$("#" + value).focus();
		return false;
	} else {
		$("#registerusername").css("display","none");
	}
	if (reg_phone.test(username)) {
		// 如果是手机号，那么邮箱显示
		if (username.length == 11 && reg_phone.test(username)) {
			/*$("#testemail").css({
				'display' : 'block'
			});*/
			$("#phone").css({
				'display' : 'none'
			});
//			$("#invald").css({
//				'display' : 'block'
//			});
//			$("#getvald").css({
//				'display' : 'none'
//			});
			$("#reguser").css({
				'display' : 'none'
			});
			return true;
		} else {
			$("#registerusername").text("请输入正确的11位手机号码");
			//$("#registerusername").css("display","block");
			$("#" + value).focus();
			
			return false;
		}
	} else if (username.indexOf('@') > 0) {
		if (reg_email.test(username)) {
			// 如果显示的正确邮箱 ，则显示手机号
			
			$("#getvald").css({
				'display' : 'block'
			});
		   
			$("#invald").css({
				'display' : 'block'
			});
			/*
			$("#phone").css({
				'display' : 'block'
			});*/
			$("#testemail").css({
				'display' : 'none'
			});
			$("#invald").css({
				'display' : 'none'
			});
			$("#getvald").css({
				'display' : 'none'
			});

			return true;
		} else {
			$("#registerusername").text("邮箱地址不正确，请重新输入");
			$("#registerusername").css("display","block");
			$("#" + value).focus();
			
			return false;
		}
	} else {
		$("#registerusername").text("请确保用户名输入的是邮箱或者手机号");
		$("#registerusername").css("display","block");
		$("#" + value).focus();
	
		return false;
	}
};
//校验手机号码
function checkphone(obj1,obj2){
	var phone = $("#" + obj1).val();
	var reg_phone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
	
	if(phone!=null&&phone!=""){
		if(reg_phone.test(phone)){
			$("#"+obj2).text('');
			$("#"+obj2).css("display","none");
			return true;	
		}else{
			$("#"+obj2).css({'display' : 'block'});
			$("#"+obj2).text('请输入正确的手机号码');
			return false;
		}
	}
	
	return true;
	
}
//校验邮箱输入
function checkemail(obj1,obj2){
	var email = $("#" + obj1).val();
	
	 var reg_email = /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if(email!=null&&email!=""){
		if(reg_email.test(email)){
			$("#"+obj2).text('');
			$("#"+obj2).css("display","none");
			return true;	
		}else{
			$("#"+obj2).css({'display' : 'block'});
			$("#"+obj2).text('请输入正确的邮箱');
			return false;
		}
	}
	
	return true;
	
	
}
function validusername(obj, ctx) {

	var value = $("#" + obj).val();
	if ("" == value || null == value || "null" == value || 'undefined' == value) {
		$("#registerusername").text("用户名不能为空");
		$("#registerusername").css("display","block");
		return false;
	}
	if (verify_username(obj) == true) {
		$.ajax({
			type : "POST",
			url : ctx + "/checkusername.do",
			dataType : 'json',
			data : "username=" + $.trim(value),
			success : function(msg) {
				if (msg.RESULT == "0000") {
					$("#registerusername").text("用户名已经存在");
					$("#registerusername").css("display","block");
					//$("#" + obj).focus();
					return false;
				} else {
					$("#registerusername").css("display","none");
					return true;
				}
			},
			error : function(data){
				 try{
					    layerHandler.alert("连接超时，请重试",function(){
							window.location.reload();
						});
				    }catch(e){
					      
				   }

			}
		});
		return true;
	}

}


	

$("#rereadd").click(function() {
	$("#nextsetp2").hide();
	$("#firstsetp").show();
});
// 已存在用户校验js
var verify_inusername = function(value,showmessage,type) {
	var inusername = $("#" + value).val();
	var reg_phone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
	var reg_email = /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	
	if (inusername == "") {
		//20150731 19:43 去除下一行的注释 操作：刘金台
		$("#"+showmessage).css("display","block");
		$("#"+showmessage).text("用户名不能为空");
		$("#"+value).focus();
		return false;
	}else if(type){
		if(type == 'phone'){
			// 如果是手机号，那么邮箱显示
			if (inusername.length == 11 && reg_phone.test(inusername)) {
				$("#"+showmessage).parent().find("#tip_sp_img").show();
				return true;
			} else {
				$("#"+showmessage).text("请输入正确的11位手机号码");
				$("#"+showmessage).parent().find("#tip_sp_img").hide();
				$("#" + value).focus();
				return false;
			}
		}else if(type == 'email'){
			if (reg_email.test(inusername)) {
				$("#"+showmessage).text("");
				$("#"+showmessage).parent().find("#tip_sp_img").show();
				return true;
			} else {
				$("#"+showmessage).parent().find("#tip_sp_img").hide();
				$("#"+showmessage).text("邮箱地址不正确，请重新输入");
				$("#" + value).focus();
				return false;
			}
		}
	} else if (reg_phone.test(inusername)) {
		// 如果是手机号，那么邮箱显示
		if (inusername.length == 11 && reg_phone.test(inusername)) {
			return true;
		} else {
			$("#"+showmessage).css("display","block");
			$("#"+showmessage).text("请输入正确的11位手机号码");
			$("#" + value).focus();
			return false;
		}
	} else if (inusername.indexOf('@') > 0) {
		if (reg_email.test(inusername)) {
			$("#"+showmessage).css("display","none");
			$("#"+showmessage).text("");
			return true;
		} else {
			$("#"+showmessage).css("display","block");
			$("#"+showmessage).text("邮箱地址不正确，请重新输入");
			$("#" + value).focus();
			return false;
		}
	} else {
		$("#"+showmessage).css("display","block");
		$("#"+showmessage).text("请确保用户名输入的是邮箱或者手机号");
		$("#" + value).focus();
		return false;
	}

};
//检查添加的用户名是否合法
function checkexituser(obj,ctx,showmessage,hascode) {
	var inusername = $("#" + obj).val();
	var flag= "";
	var username="";
	if (verify_inusername(obj,showmessage) == true) {
		$.ajax({
			type : "POST",
			url : ctx + "/checkusername.do",
			dataType : 'json',
			async:false,
			data : "username=" + $.trim(inusername),
			success : function(msg) {
				var return_code = ZRJC.getOperationCode(msg);
				var data = ZRJC.getOperationMsg(msg);
				if (return_code == "0000") {
					flag=msg.DATA.username;
					//$("#"+showmessage).text(data);
					//$("#showusername").css("display","block");
					if(inusername.indexOf('@')){
						$("#"+hascode).css("display","none");
					}else{
						$("#"+hascode).css("display","block");
					}
					$("#showusername").css("display","none");
					
				} else if(return_code == "9999"){
					flag=false;
					//$("#hasnextsetp1").css("display","none");
					$("#"+showmessage).text(data);
					$("#showusername").css("display","block");
				}else if(data.replace(/(^\s*)|(\s*$)/g, "")=="用户名不存在"){
					$("#showusername").text(data);
					$("#showusername").css("display","block");
				}
			},
			error : function(data){
				 try{
					    layerHandler.alert("连接超时，请重试",function(){
							window.location.reload();
						});
				    }catch(e){
					      
				   }

			}
		});
		return flag;
	}
	return flag;
}

//检查添加的变更是否合法
function checkexitchangeuser(obj,nsrsbh,oldname,ctx,showmessage,hascode,type) {
	var inusername = $("#" + obj).val();
	if(inusername == oldname) {
		$("#"+showmessage).text("新登录名不能与原用户名相同");
		$("#"+showmessage).css("display","block");
		$("#"+showmessage).parent().find("#tip_sp_img").hide();
		$("#"+showmessage).parent().find("#tip_sp_img_email").hide();
		$("#" + obj).focus();
		return false;
	}
	var params ={
			username : $.trim(inusername),
			action : "zyry_xx",
			sign : "zyry_xx",
			nsrsbh : nsrsbh
	};
	if (verify_inusername(obj,showmessage,type) == true) {
		$.ajax({
			type : "POST",
			url : ctx + "/setting/user_manage/check_user_changeexist.do",
			dataType : 'json',
			data : params,
			success : function(msg) {
				var return_code = ZRJC.getOperationCode(msg);
				var data = ZRJC.getOperationData(msg);
				if (return_code == "0000") {
					//if(data!=null) {
						//$("#"+showmessage).text("用户名合法");
						//$("#showusername").css("display","block");
						/*if(inusername.indexOf('@')){
							$("#"+hascode).css("display","none");
						}else{
							$("#"+hascode).css("display","block");
						}*/
						$("#"+showmessage).text("");
						$("#"+showmessage).parent().find("#tip_sp_img").show();
						$("#"+showmessage).parent().find("#tip_sp_img_email").show();
						
						
					/*}else{
						$("#"+showmessage).text("用户名不存在");
						$("#"+showmessage).parent().find("#tip_sp_img").hide();
						$("#"+showmessage).parent().find("#tip_sp_img_email").hide();
					}*/
					return true;
				} else if(return_code == "9999"){
					var error_msg = ZRJC.getOperationMsg(msg);
					$("#"+showmessage).text(error_msg);
					$("#"+showmessage).css("display","block");
					$("#"+showmessage).parent().find("#tip_sp_img").hide();
					$("#"+showmessage).parent().find("#tip_sp_img_email").hide();
					$("#" + obj).focus();
					return false;
				}
			},
			error : function(data){
				 try{
					    layerHandler.alert("连接超时，请重试",function(){
							window.location.reload();
						});
				    }catch(e){
					      
				   }

			}
		});
		return true;
	}
};

//修改密码时 判断两次密码是否一致 
var agreementpassword = function(checknewpassword,confirmnewpassword,tip_repwd_confrim,id){
	var checknewpassword = $("#"+checknewpassword).val();
	var confirmnewpassword = $("#"+confirmnewpassword).val();
	if(checknewpassword!=confirmnewpassword){
		
		$("#"+id).css("display","block");
		$("#"+tip_repwd_confrim).show();
		$("#"+tip_repwd_confrim).text("两次输入密码不一致");
		return false;
	}else{
		$("#"+id).css("display","none");
		$("#"+tip_repwd_confrim).text("");
		return true;
	}
	
	
	
};

//原密码
var checkornalpass = function(checkpassword,tip_pwd,id){
	var checkpassword = $("#"+checkpassword).val();
	if(!checkpassword){
		$("#"+id).css("display","block");
		$("#"+tip_pwd).show();
		$("#"+tip_pwd).text("原密码不能为空");
		return false;
	} else if(!(/^[^ ]+$/.test(checkpassword))) {
		$("#"+id).css("display","block");
		$("#"+tip_pwd).show();
		$("#"+tip_pwd).text("密码中请不要包含空格");
		return false;
	} else {
		 $("#"+id).css("display","none");
		$("#"+tip_pwd).text("");
		return true;
	}
	
};

//新密码
var verify_password_check = function (obj,registerPassMsg,id, oldPwdId){
	
	 var pwdValue=$("#"+obj).val();
	 var oldPwd = $("#"+oldPwdId).val(); 
	 //var valpassword = /^(?![a-zA-z]+$)(?!\d+$)(?![!`~@#$%-_=+^&*]+$)[a-zA-Z\d!`~@#$%-_=+^&*]+$/;
	 var valpassword = /^(?:\d+|[a-zA-Z]+)$/;
	 if(!pwdValue){
		 $("#"+id).css("display","block");
		 $("#"+registerPassMsg).text("密码不能为空");
		 return false;
	 } else if(!(/^[^ ]+$/.test(pwdValue))) {
		 $("#"+id).css("display","block");
		 $("#"+registerPassMsg).text("密码中请不要包含空格");
		 return false;
	 }else if(pwdValue.length<8){
		 $("#"+id).css("display","block");
		 //$("#showstrong").css("display","none");
		 $("#"+registerPassMsg).text("密码长度不能小于8位");
		 return false;
	 }else if(pwdValue.length>20){
		 $("#"+id).css("display","block");
		 //$("#showstrong").css("display","none");
		 $("#"+registerPassMsg).text("密码长度不能大于20位");
		 return false;
	 }else if (valpassword.test(pwdValue)) {
		 //$("#showstrong").css("display","none");
		 $("#"+id).css("display","block");
		 $("#" + registerPassMsg).text("请使用数字、大小写字母、特殊字符的任意组合，提高密码强度");
		 return false;
	 }else if (pwdValue == oldPwd) {
		 $("#"+id).css("display","block");
		 //$("#showstrong").css("display","none");
		 $("#"+registerPassMsg).text("新密码与原密码一致");
		 return false;
	 }else{
		 $("#"+id).css("display","none");
		 $("#" + registerPassMsg).text(""); 
		 //$("#showstrong").css("display","block");
		 $(".code .codetip li").eq(1).show().siblings().hide();
		 $(".updatepsd .pwd").on('keydown',checkCode).on('blur',checkCode);
		 return true;
	 }
};

//校验密码强弱
function checkCode(){
			var l=$("#checknewpassword").val().length;			
			switch(true){
				case l<10:$(".code .codetip li").eq(2).show().siblings().hide();break;
				case l<15:$(".code .codetip li").eq(1).show().siblings().hide();break;
				case l>20:$(".code .codetip li").eq(0).show().siblings().hide();break;
				default:$(".code .codetip li").eq(2).show().siblings().hide();break;
			}

		}
//sendMessage.js
 UI_sendMessage = function(){
	
	var options = null;
	var InterValObj; //timer变量，控制时间
	var count = 60; //间隔函数，1秒执行
	var curCount;//当前剩余秒数
	var btnSendCode ;
	
	options = {
			sendInfo : function(username,btnSendCode1,ornalcode){
		     curCount = count;
		     btnSendCode = btnSendCode1;
			   //设置button效果，开始计时
			     $("#"+btnSendCode).attr("disabled", "disabled");
			     $("#"+btnSendCode).val(curCount + "秒后可重新发送验证码");
			     $("#"+ornalcode).removeAttr("disabled"); 
			     InterValObj = window.setInterval(options.SetRemainTime, 1000); //启动计时器，1秒执行一次
			     //向后台发送处理数据  
			     var senduser = $("#"+username).val();
					var params = {
						senduser:senduser
					 };
					var url = options.getContextPath()+"/checkornalcode.do";
					  var _resultHandler = function(msg){
						 if(ZRJC.isOperationSuccessful(msg)){
						 		 //$("#code").val(msg.code);
							 	 //$("#sessionid").val(msg.sessionid);
								 //$("#"+ornalcode).removeAttr("disabled"); 
							     return true;
							}else{
								var error_msg = ZRJC.getOperationMsg(msg);
								var error_code = ZRJC.getOperationCode(msg);
				                layer.alert(error_msg);
				                window.clearInterval(InterValObj);//停止计时器
				                $("#"+btnSendCode).removeAttr("disabled");//启用按钮
				                $("#"+btnSendCode).val("重新发送验证码");
				                return false;
							}
							
						};
						var  errorHandler = function(data) {
						      try{
								    layerHandler.alert("发送失败，请重试");
								    window.clearInterval(InterValObj);//停止计时器
					                $("#"+btnSendCode).removeAttr("disabled");//启用按钮
					                $("#"+btnSendCode).val("重新发送验证码");
						       }catch(e){
							     
						      }
						
					       };
						ZRJC.asyncCallRemote(url, params, _resultHandler,errorHandler);
		},
		SetRemainTime : function(){
			  if (curCount == 0) {                
	                window.clearInterval(InterValObj);//停止计时器
	                $("#"+btnSendCode).removeAttr("disabled");//启用按钮
	                $("#"+btnSendCode).val("重新发送验证码");
	            }
	            else {
	                curCount--;
	                $("#"+btnSendCode).val(curCount + "秒后可重新发送验证码");
	            }
		},
		getContextPath:function(){
			var contextPath = document.location.pathname;
			var index = contextPath.substr(1).indexOf("/");
			contextPath = contextPath.substr(0, index + 1);
			delete index;
			return contextPath;
		}
	};
	
	return {
		sendInfo : options.sendInfo,
		SetRemainTime : options.SetRemainTime,
		getContextPath: options.getContextPath
	};
}();