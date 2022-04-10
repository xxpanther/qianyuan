$(function(){
	$("#username_msg").change(function(){
		clearLoginVal(0);
	})
	$("#password_msg").change(function(){
		clearLoginVal(1);
	})
	$("select#sflx_sel").change(changeSflx);
	$("select#ry_sel").change(changeRylx);
	$("#send_msg_btn").click(sendMsgSyz);
	$("#login_msg_btn").click(loginByYzm)
});
function changeRylx(){
	clearLoginVal(3);
	var ry = $("#ry_sel option:selected").val();
	if(!ry) {
		return;
	}
	var selRy = $("#ry_sel option:selected");
	var sfzh = selRy.attr("sfzh");
	if(!sfzh){
		layerHandler.alert("该人员身份证件号码不存在，请进行税务登记变更！");
		return;
	}
	if(selRy.attr("bz") == 'N_SZ'){
		layerHandler.alert("您尚未完成实名采集，请尽快关注“苏州税务”微信公众号或者使用“苏州税务实名认证”微信小程序进行采集。");
		return;
	} else if(selRy.attr("bz") == 'N'){
		layerHandler.alert("您尚未完成实名采集，请尽快关注“江苏税务”微信公众号或者使用“江苏税务实名认证”微信小程序进行采集。");
		return;
	}
 	var sjhm = selRy.attr("sjhm");
	if(!sjhm){
		layerHandler.alert("该人员手机号码不存在，请进行税务登记变更！");
		return;
	}
	
	var tel = selRy.attr("tel");
	$("#sjhm_msg").prev().hide();
	$("#sjhm_msg").val(tel);
	$("#sjhm_msg_encrypt").val(selRy.attr("sjhm"));
	showLoginDialog(tel);
}

function changeSflx(){
	clearLoginVal(2);
	var sflx = $("#sflx_sel option:selected").val();
	if(!sflx) {
		return;
	}
	var _username = $("#username_msg").val().replace(/^\s+|\s+$/g,"");
	if(!_username) {
		$("#sflx_sel").val("");
		layerHandler.alert("请输入登录帐号！");
		return;
	}
	var _pass = $("#password_msg").val();
	if(!_pass) {
		$("#sflx_sel").val("");
		layerHandler.alert("请输入密码！");
		return;
	}
	if(captchcheck == "1" && (nevalidate == undefined || nevalidate == "")) {
		layerHandler.alert("请先完成验证码确认！");
		return;
	}
	var params = {};
	params['password'] = sha256_digest(_pass + "{" + _username + "}");
	params['jdmm'] = mmqdjy(_pass);
	params['username'] = _username;
	params['nevalidate'] = nevalidate;
	params['loginmode'] = '05';
	params['sflx'] = sflx;
	showLoading(true);
	$.ajax({
		url:_DZSWJ_URL+'/sso/swryHandler?method=chooseUser',
		type:'post',
		data:params,
		async:true,
		dataType:"json",
		success:function(json) {
			var code = json.CODE;
			if(code == "0000") {
				var dlm = json.DLM;
				if(dlm){
					$("#username").val(dlm);
					params['password'] = sha256_digest(_pass + "{" + dlm + "}");
					retryChooseUser(params);
				} else {
					$("#username").val(_username);
					var data = json.DATA;
					var ryxxList = JSON.parse(data);
					loadRylxSel(ryxxList);
					showLoading(false);
				}
			} else {
				getCode();
				layerHandler.alert(json.MESS);
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
function retryChooseUser(params) {
	$.ajax({
		url:_DZSWJ_URL+'/sso/swryHandler?method=retryChooseUser',
		type:'post',
		data:params,
		async:true,
		dataType:"json",
		success:function(json) {
			var code = json.CODE;
			if(code == "0000") {
				var data = json.DATA;
				var ryxxList = JSON.parse(data);
				loadRylxSel(ryxxList);
				showLoading(false);
			} else {
				getCode();
				layerHandler.alert(json.MESS);
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
function loadRylxSel(ryxxList) {
	clearRylxSel();
	if(ryxxList) {
		var len = ryxxList.length;
		for(var i = 0; i < len; i++) {
			var ryxxMap = ryxxList[i];
			if(ryxxMap) {
				var xm = ryxxMap.xm?ryxxMap.xm:"";
				var sjhm = ryxxMap.sjhm?ryxxMap.sjhm:"";
				var tel = ryxxMap.tel?ryxxMap.tel:"";
				var bz = ryxxMap.bz;
				var rybz = ryxxMap.rybz?ryxxMap.rybz:"";
				if(xm) {
					$("#ry_sel").append("<option value='" + xm + "' sjhm='" + sjhm + "' tel='"+tel+"' rybz='"+rybz+"' bz='"+bz+"' sfzh='"+ryxxMap.sfzh+"'>" + xm + "</option>");
				}
			}
		}
	}
}
var pause = false;
function clearTime(){
	pause=true;
}
var secount=120;
function showTime(obj){
	if(secount==0 || pause){
		obj.removeAttr("disabled");
		obj.html("获取验证码");
		obj.removeClass("yzm_btn_disable");
		secount=120;
		pause=false;
		return;
	}
	obj.attr("disabled", true);
	obj.addClass("yzm_btn_disable");
	obj.html(secount);
	secount--;
	setTimeout(function(){
		showTime(obj)
	},1000)
}
function diableBtn(id){
	$("#"+id).attr("diabled", true);
	$("#"+id).addClass("yzm_btn_disable");
}
function enableBtn(id){
	$("#"+id).attr("diabled", false);
	$("#"+id).removeClass("yzm_btn_disable");	
}
function sendMsgSyz(){
	diableBtn("send_msg_btn");
	var dlm = $("#username_msg").val().replace(/^\s+|\s+$/g,"");
	if (!dlm) {
		layerHandler.alert("请输入登录帐号");
		enableBtn("send_msg_btn");
		return;
	}
	
	var sjhm = $("#sjhm_msg_encrypt").val();
	if(!sjhm) {
		layerHandler.alert("手机号码为空");
		enableBtn("send_msg_btn");
		return;
	}
	if (captchcheck=="1" && (nevalidate == undefined || nevalidate == "")) {
		layerHandler.alert("请先完成验证码确认");
		enableBtn("send_msg_btn");
		return;
	}
	showLoading(true);
	var params = {};
	params['loginmode'] = "05";
	params['username'] = dlm;
	params['sjhm'] = sjhm;
	params['nevalidate'] = nevalidate;
	$.ajax({
		url:_DZSWJ_URL+'/sso/swryHandler?method=sendMsgSyz',
		type:'post',
		data:params,
		async:true,
		dataType:"json",
		success:function(json) {
			showLoading(false);
			var code = json.CODE;
			if("0000" == code) {
				showTime($("#send_msg_btn"));
				layerHandler.alert("验证码发送成功！");
			} else if("9991" == code){
				getCode();
				clearLoginVal(0);
				layerHandler.alert(json.MESS);
			} else {
				enableBtn("send_msg_btn");
				layerHandler.alert(json.MESS);
			}
		},
		error:function(data) {
			getCode();
			enableBtn("send_msg_btn");
			layerHandler.alert("调用后台服务失败，失败信息："+JSON.stringify(data));
			showLoading(false);
		}
	})
}

function loginByYzm(){
	diableBtn("login_msg_btn");
	if (captchcheck=="1" && (nevalidate == undefined || nevalidate == "")) {
		layerHandler.alert("请先完成验证码确认");
		enableBtn("login_msg_btn");
		return;
	}
	var yzm = $("#yzm_msg").val().replace(/^\s+|\s+$/g,"");
	if(!yzm || !/^\d{6}$/.test(yzm)) {
		layerHandler.alert("请输入有效的短信验证码！");
		enableBtn("send_msg_btn");
		return;
	}
	
	var sjhm = $("#sjhm_msg_encrypt").val();
	if(!sjhm) {
		layerHandler.alert("手机号码为空!");
		enableBtn("login_msg_btn");
		return;
	}
	var sflx = $("#sflx_sel option:selected").val();
	if(!sflx) {
		layerHandler.alert("请先选择身份类型!");
		return;
	}
	var xm = $("#ry_sel option:selected").val();
	if(!xm) {
		layerHandler.alert("请先选择人员!");
		return;
	}
	showLoading(true);
	var params = {};
	params['loginmode'] = "05";
	params['sjhm'] = sjhm;
	params['code'] = yzm;
	params['rylx'] = sflx;
	params['xm'] = xm;
	params['nevalidate'] = nevalidate;
	$.ajax({
		url:_DZSWJ_URL+'/sso/swryHandler?method=loginWithYzm',
		type:'post',
		data:params,
		async:true,
		dataType:"json",
		success:function(json) {
			showLoading(false);
			var code = json.CODE;
			if("0000" == code) {
				var mess = json.MESS;
				var txcode = json.TSCODE;
				$("#loginmode").val("05");
				logintsxx(txcode, mess);
			} else if("9991" == code){
				getCode();
				clearLoginVal(0);
				layerHandler.alert(json.MESS);
			} else {
				enableBtn("login_msg_btn");
				layerHandler.alert(json.MESS);
			}
		},
		error:function(data) {
			getCode();
			enableBtn("login_msg_btn");
			layerHandler.alert("调用后台服务失败，失败信息："+JSON.stringify(data));
			showLoading(false);
		}
	})
}


function loginCheckSyz(){
	showLoading(true);
	$.ajax({
		url:_DZSWJ_URL+'/sso/swryHandler?method=checkloginSyz',
		type:'post',
		async:true,
		dataType:"json",
		success:function(json) {
			var code = json.CODE;
			var mess = json.MESS;
			if(code=="0000"){
				$("#password").val($("#password_msg"));
				var messobj = JSON.parse(mess);
				if(messobj.length == 1){
					debugger
					var djxh = messobj[0].djxh;
					$("#djxh").val((djxh=='undefined'||djxh=="")?"":djxh);
					$("#password").val(sha256_digest($("#password_msg").val() + "{" + $("#username").val() + "}"));
					$("#formid").submit();
				}else if(messobj.length>1){
					showLoading(false);
					loadTable(messobj);
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
					    	dom: ".page3"
					    },
					    end:function(){
		   					getCode();
		   				}
					});
				}else{
					layerHandler.alert("纳税人登记信息为空，请联系税务机关管理人员！");
					showLoading(false);
				}
			}else{
				clearLoginVal(0);
				getCode();
				layerHandler.alert(mess);
				showLoading(false);
			}
		},
		error:function(data) {
			clearLoginVal(0);
			getCode();
			layerHandler.alert("调用后台服务超时，超时信息："+JSON.stringify(data));
			showLoading(false);
		}
	});
}

function clearLoginVal(type){
	if(type == 0){
		$("#password_msg").val('');
	} 
	if(type <= 1){
		$("#sflx_sel").val('');
	}
	if(type <= 2){
		clearRylxSel();
	}
	
	$("#sjhm_msg").val('');
	$("#sjhm_msg_encrypt").val('');
	$("#yzm_msg").val('');
}
function clearRylxSel(){
	$("#ry_sel").empty();
	$("#ry_sel").append("<option value=''>请选择人员</option>")
}

function showLoginDialog(sjhm){
	$("#sjhm_msg2").val(sjhm);
	$("#sjhm_msg2").prev().hide();
	$("#yzm_msg").val('');
	$('.login_qrcode_yzm').show();
	$(".qr_yzm").hide();
	$(".msg_yzm").show();
	$("#loginmode").val("05");
}

function checkTel(phone) {
	return (/^[1][3-9][0-9]{9}$/.test(phone));
}