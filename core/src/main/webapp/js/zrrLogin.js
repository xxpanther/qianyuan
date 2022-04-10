$(document).ready(function() {
	$("#sjhmlogin").addClass("on").siblings().removeClass("on");
	$("#zrrtab li").click(function(){
		var _id = this.id;
		if(_id=='sjhmlogin'){
			$(".sjhmclass").css("display","block");
			$(".zjhmclass").css("display","none");
			$(this).addClass("on").siblings().removeClass("on");
		}else if(_id=='zjhmlogin'){
			$(".sjhmclass").css("display","none");
			$(".zjhmclass").css("display","block");
			$(this).addClass("on").siblings().removeClass("on");
		}
	});
	$("#zrrsjhm").keydown(function(e) {
		var keycode = e.which;
		if (keycode == 13&&lock) {
			var username = $("#zrrsjhm").val();
			if (username == null || username == '') {
				layerHandler.alert("请输入手机号码！");
				return;
			}
			$("#zrrmm").focus();
			return false;
		}
	});
	$("#zrrmm").keydown(function(e) {
		var keycode = e.which;
		if (keycode == 13&&lock) {
			var password = $("#zrrmm").val();
			if (password == null || password == '') {
				layerHandler.alert("请输入密码！");
				return;
			}
			return false;
		}
	});
	$("#zrrzjhm").keydown(function(e) {
		var keycode = e.which;
		if (keycode == 13&&lock) {
			var username = $("#zrrzjhm").val();
			if (username == null || username == '') {
				layerHandler.alert("请输入证件号码！");
				return;
			}
			$("#zrrzjmm").focus();
			return false;
		}
	});
	$("#zrrzjmm").keydown(function(e) {
		var keycode = e.which;
		if (keycode == 13&&lock) {
			var password = $("#zrrzjmm").val();
			if (password == null || password == '') {
				layerHandler.alert("请输入密码！");
				return;
			}
			return false;
		}
	});
});

function zrrzjhmlogin(params){
	var redirectUrl = $("#redirectUrl").val();
	var service = getHtmlData().service;
	if(redirectUrl != undefined && redirectUrl != ""){
		params['service'] = redirectUrl;
	}else if(service != undefined && service != ""){
		params['service'] = service;
	}
	params['zrrmm'] = sha256_digest(params['zrrmm'] + "{" + params['jmdlm'] + "}");
	$.ajax({
		url:_DZSWJ_URL+'/sso/zrr/login',
		type:'post',
		data:params,
		async:true,
		dataType:"json",
		success:function(json) {
			var code = json.CODE;
			if(code=="0000"){
				if(json.MESS){
					window.location.href = json.MESS;
				}else{
					window.location.href = _DZSWJ_URL+"/portal/index.do";
				}
			}else{
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

function zrrlogin(){
	$("#formid").attr("action",_DZSWJ_URL+'/sso/zrr/login');
	var params = {};
	if ($(".sjhmclass").css("display")=='block') {
		$("#zrrsjhm").val($("#zrrsjhm").val().replace(/^\s+|\s+$/g,""));
		var _zrrsjhm = $("#zrrsjhm").val();
		var _zrrmm = $("#zrrmm").val();
		if (_zrrsjhm == undefined || _zrrsjhm == "") {
			layerHandler.alert("请输入手机号码");
			return;
		} else if (_zrrmm == undefined || _zrrmm == "") {
			layerHandler.alert("请输入密码");
			return;
		} else if (captchcheck=="1" && (nevalidate == undefined || nevalidate == "")) {
			layerHandler.alert("请先完成验证码确认");
			return;
		}
		params['mode'] = 'sjhm';
		params['zrrsjhm'] = _zrrsjhm;
		params['nevalidate'] = nevalidate;
		showLoading(true);
		$.ajax({
			url:_DZSWJ_URL+'/sso/zrr/login',
			type:'post',
			data:params,
			async:true,
			dataType:"json",
			success:function(json) {
				var code = json.CODE;
				if(code=="0000"){
					params['mode'] = 'sjhm2';
					params['jmdlm'] = json.DLM;
					params['zrrmm'] = _zrrmm;
					zrrzjhmlogin(params);
				}else{
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
	} else {
		$("#zrrzjhm").val($("#zrrzjhm").val().replace(/^\s+|\s+$/g,""));
		var _zrrzjhm = $("#zrrzjhm").val();
		var _zrrzjmm = $("#zrrzjmm").val();
		if (_zrrzjhm == undefined || _zrrzjhm == "") {
			layerHandler.alert("请输入证件号码");
			return;
		} else if (_zrrzjmm == undefined || _zrrzjmm == "") {
			layerHandler.alert("请输入密码");
			return;
		} else if (captchcheck=="1" && (nevalidate == undefined || nevalidate == "")) {
			layerHandler.alert("请先完成验证码确认");
			return;
		}
		params['mode'] = 'zjhm';
		params['zrrzjlx'] = $("#zrrzjlx").val();
		params['dlm'] = _zrrzjhm;
		params['jmdlm'] = sha256_digest(_zrrzjhm);
		params['zrrmm'] = _zrrzjmm;
		params['nevalidate'] = nevalidate;
		showLoading(true);
		zrrzjhmlogin(params);
	}
}
