$(document).ready(function() {
	$("#dlyhlogin").addClass("on").siblings().removeClass("on");
	$("#dllogin_mode").val("40");
	$("#dlyhtab li").click(function(){
		var _id = this.id;
   		if(_id=='dlyhlogin'){
   			$("#dllogin_mode").val("40");
   			$(".dlyh_class").css("display","block");
   			$(".dlyh_caclass").css("display","none");
   			$(this).addClass("on").siblings().removeClass("on");
   		}else if(_id=='dlCalogin'){
   			$("#dllogin_mode").val("41");
   			$(".dlyh_class").css("display","none");
   			$(".dlyh_caclass").css("display","block");
   			$(this).addClass("on").siblings().removeClass("on");
   		}
	});
	$("#dlyh_username").keydown(function(e) {
		var keycode = e.which;
		if (keycode == 13&&lock) {
			var username = $("#dlyh_username").val();
			if (username == null || username == '') {
				layerHandler.alert("请输入登录帐号！");
				return;
			}
			$("#dlyh_password").focus();
			return false;
		}
	});
	$("#dlyh_password").keydown(function(e) {
		var keycode = e.which;
		if (keycode == 13&&lock) {
			var password = $("#dlyh_password").val();
			if (password == null || password == '') {
				layerHandler.alert("请输入密码！");
				return;
			}
			return false;
		}
	});
	
	$("#ssryxxContinue").click(showSmcjInfo);
	$("#dlyhqyxxContinue").click(showDlyhqyInfo);
	$("#dlyhLoginContinue").click(dlyhLoginContinue);
});
function qyPreLogin(params, djxh){
	$.ajax({
		url:_DZSWJ_URL+'/sso/dlyh/qyPreLogin',
		type:'post',
		data:params,
		async:true,
		dataType:"json",
		success:function(json){
			var code = json.RESULT;
			if(code=="0000"){
				$("#djxh").val(djxh);
				$("#password").val(params['password']);
				$("#loginmode").val(params['loginmode']);
				$("#username").val(params['username']);
				$("#formid").submit();
			} else {
				getCode();
				layerHandler.alert(json.MSG);
				showLoading(false);
			}
		},
		error:function(data) {
			getCode();
			layerHandler.alert("调用后台服务超时，超时信息：" + JSON.stringify(data));
			showLoading(false);
		}
	})
	
}
function dlyhLoginContinue() {
	var nsrsbh = $("#dlqy_nsrsbh").val();
	if(!nsrsbh) {
		layerHandler.alert("企业税号为空，请选择需要登录的企业！");
		return;
	}
	var pwd = $("#dlqy_pwd").val();
	if(!pwd) {
		layerHandler.alert("请输入登录密码！");
		return;
	}
	var djxh = $("#dlqy_djxh").val();
	if(!djxh) {
		layerHandler.alert("企业登记信息丢失，请联系电子税务局服务人员！");
		return;
	}
	var loginmode = $("#dllogin_mode").val();
	var params = {};
	params['username'] = nsrsbh;
	params['djxh'] = djxh;
	var encryptPwd = sha256_digest(pwd + "{" + nsrsbh + "}");
	params['password'] = encryptPwd;
	params['jdmm'] = mmqdjy(pwd);
	params['loginmode'] = loginmode;
	showLoading(true);
	debugger
	$.ajax({
		url:_DZSWJ_URL+'/sso/dlyh/qyLogin',
		type:'post',
		data:params,
		async:true,
		dataType:"json",
		success:function(json){
			debugger
			var code = json.RESULT;
			if(code=="0000"){
				$("#djxh").val(djxh);
				$("#password").val(encryptPwd);
				$("#loginmode").val(loginmode);
				$("#username").val(nsrsbh);
				$("#formid").submit();
			} else if(code == "0001") {
				var newdlm = json.DATA;
				var newPwd = sha256_digest(pwd + "{" + newdlm + "}");
				params['password'] = newPwd;
				qyPreLogin(params, djxh);
			} else {
				getCode();
				layerHandler.alert(json.MSG);
				showLoading(false);
			}
		},
		error:function(data) {
			debugger
			getCode();
			layerHandler.alert("调用后台服务超时，超时信息：" + JSON.stringify(data));
			showLoading(false);
		}
	})
}
function showSmcjInfo() {
	var checked_radio = $("#ssryxx_tbody input[name='ssdlryRadio']:checked");
	var nsrsbh = checked_radio.val();
	if(!nsrsbh) {
		layerHandler.alert("请选择涉税专业服务人员");
		return;
	}
	//var rowdataStr = checked_radio.attr("rowdata");
	//var userInfo = JSON.parse(rowdataStr);
	var zjhm = checked_radio.attr("zjhm");
	var xm = checked_radio.attr("xm");
	var params = {zjhm:zjhm,xm:xm,nsrsbh:nsrsbh};
	showLoading(true);
	$.ajax({
		url:_DZSWJ_URL+'/sso/dlyh/querySmcjInfo',
		type:'post',
		data:params,
		async:true,
		dataType:"json",
		success:function(json){
			var code = json.RESULT;
			if(code == "0000"){
				var qyxxList = json.DATA;
				showLoading(false);
				if(qyxxList) {
					showDlyhqyxxTable(qyxxList);
				} else {
					getCode();
					layerHandler.alert("未查询到该代理人员实名制绑定的委托企业。");
				}
			}else{
				getCode();
				layerHandler.alert(json.MSG);
				showLoading(false);
			}
		},
		error:function(data) {
			getCode();
			layerHandler.alert("调用后台服务超时，超时信息："+JSON.stringify(data));
			showLoading(false);
		}
	});
}
function showDlyhqyInfo() {
	var checked_radio = $("#dlyhqyxx_table input[name='dlyhqyRadio']:checked");
	var nsrsbh = checked_radio.val();
	if (nsrsbh == undefined || nsrsbh == "") {
		layerHandler.alert("请选择委托企业!");
		return;
	}
	/*var rowdataStr = checked_radio.attr("rowdata");
	var userInfo = JSON.parse(rowdataStr);*/
	var djxh = checked_radio.attr("djxh");
	$("#dlqy_nsrsbh").val(nsrsbh);
	$("#dlqy_djxh").val(djxh);
	$("#dlqy_pwd").val('');
	$.layer({
	    type: 1,
	    area: ["auto", "auto"],
	  	title: false,	
	    bgcolor: "#fff",
	    shade:false,
	    border:[0],
	    move:'.moveempty',
	    fadeIn:200,
	    page: {
	    	dom: ".page7"
	    },
	    end:function(){
			getCode();
		}
	});
}

function dlyhlogin(){
	$("#formid").attr("action",_DZSWJ_URL+'/sso/login');
	var params = {};
	var loginmode = $("#dllogin_mode").val();
	if (loginmode == "40") {
		var dlyh_username = $("#dlyh_username").val().replace(/^\s+|\s+$/g,"")
		var dlyh_password = $("#dlyh_password").val();
		if (!dlyh_username) {
			layerHandler.alert("请输入登录帐号");
			return;
		} else if (!dlyh_password) {
			layerHandler.alert("请输入密码");
			return;
		} else if (captchcheck=="1" && (nevalidate == undefined || nevalidate == "")) {
			layerHandler.alert("请先完成验证码确认");
			return;
		}
		params['loginmode'] = loginmode;
		params['username'] = dlyh_username;
		params['password'] = sha256_digest(dlyh_password + "{" + dlyh_username + "}");
		//params['dsmm'] = $.md5(_pass);
		//params['jdmm'] = mmqdjy(_pass);
	} else {
		//TODO
		if (captchcheck=="1" && (nevalidate == undefined || nevalidate == "")) {
			layerHandler.alert("请先完成验证码确认");
			return;
		}
		document.getElementById('div_calogin').innerHTML = '<OBJECT id="zjcaObj" classid="CLSID:3C474273-7F8B-4690-8C34-855C4528658D" style="display:none"></OBJECT>';
		var obj = CASigner.cacheck(zjcaObj,_ca_login_time)
		if (obj == null||obj["signature"]==null) {
			return;
		}
		var ca_mode = obj["loginmode"];
		if(ca_mode && ca_mode.length == 2) {
			loginmode = "4" + ca_mode.substr(1,2);
		}
		$("#dllogin_mode").val(ca_mode);
		params['loginmode'] = obj["loginmode"];
		params['causername'] = obj["causername"];
		params['cacert'] = obj["cacert"];
		params['signature'] = obj["signature"];
	}
	params['nevalidate'] = nevalidate;
	showLoading(true);
	$.ajax({
		url:_DZSWJ_URL+'/sso/dlyh/jyLogin',
		type:'post',
		data:params,
		async:true,
		dataType:"json",
		success:function(json){
			var code = json.RESULT;
			if(code == "0000"){
				var ssfwryList = json.DATA;
				showLoading(false);
				if(ssfwryList) {
					showSsdlry(ssfwryList);
				} else {
					getCode();
					layerHandler.alert("登录失败！未查询到有效的涉税服务机构与人员信息。");
				}
			}else if(code=="1000"){
				var dlm = json.DATA;
				params['password'] = sha256_digest(dlyh_password + "{" + dlm + "}");
				$.ajax({
					url:_DZSWJ_URL+'/sso/dlyh/preLogin',
					type:'post',
					data:params,
					async:true,
					dataType:"json",
					success:function(json) {
						showLoading(false);
						var code = json.RESULT;
						var msg = json.MSG;
						if(code=="0000"){
							var ssfwryList = json.DATA;
							showSsdlry(ssfwryList);
						}else{
							getCode();
							layerHandler.alert(msg);
						}
					},
					error:function(data) {
						getCode();
						layerHandler.alert("调用后台服务超时，超时信息："+JSON.stringify(data));
						showLoading(false);
					}
				});
			}else{
				getCode();
				layerHandler.alert(json.MSG);
				showLoading(false);
			}
		},
		error:function(data) {
			getCode();
			layerHandler.alert("调用后台服务超时，超时信息："+JSON.stringify(data));
			showLoading(false);
		}
	});
}

function showSsdlry(userInfoList) {
	loadSsdlryTable(userInfoList);
	$.layer({
	    type: 1,
	    area: ["auto", "auto"],
	  	title: false,	
	    bgcolor: "#fff",
	    shade:false,
	    border:[0],
	    move:'.moveempty',
	    fadeIn:200,
	    page: {
	    	dom: ".page5"
	    },
	    end:function(){
			getCode();
		}
	});
}
function showDlyhqyxxTable(userInfoList) {
	loadDlyhqyxxTable(userInfoList);
	$.layer({
	    type: 1,
	    area: ["auto", "auto"],
	  	title: false,	
	    bgcolor: "#fff",
	    shade:false,
	    border:[0],
	    move:'.moveempty',
	    fadeIn:200,
	    page: {
	    	dom: ".page6"
	    },
	    end:function(){
			getCode();
		}
	});
}
