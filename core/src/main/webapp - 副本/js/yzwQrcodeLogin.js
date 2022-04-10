$(function(){
	$("#qr_refresh").click(getQrcode)
});
function getQrcode(){
	hideQrcode();
	if(captchcheck == "1" && (nevalidate == undefined || nevalidate == "")) {
		layerHandler.alert("请先完成验证码确认！");
		return;
	}
	var sflx = $("#sflx_sel option:selected").val();
	if(!sflx) {
		layerHandler.alert("请选择身份类型！");
		return;
	}
	var xm = $("#ry_sel option:selected").val();
	if(!xm) {
		layerHandler.alert("请选择人员！");
		return;
	}
	var selRy = $("#ry_sel option:selected");
	var rybz = selRy.attr("rybz");
	if(!rybz) {
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
	}
	showLoading(true);
	var params = {
		rybz: rybz,
		xm: xm,
		sflx: sflx
	};
	qr_count = 240;
	$.ajax({
		url:_DZSWJ_URL+'/sso/swryHandler?method=getQrcode',
		type:'post',
		data:params,
		async:true,
		dataType:"json",
		success:function(json) {
			showLoading(false);
			var code = json.CODE;
			if("0000" == code) {
				var ewm = json.DATA;
				$("#qrcode").attr("src", "data:image/png;base64," + ewm);
				$(".qrcode_valid").show();
				$(".qrcode_invalid").hide();
				$("#qrcode_token").val(json.TOKEN);
				queryQrStatus();
			} else {
				layerHandler.alert(json.MESS);
			}
		},
		error:function(data) {
			getCode();
			layerHandler.alert("调用后台服务失败，失败信息："+JSON.stringify(data));
			showLoading(false);
		}
	})
}

function processQrStatus() {
	var token = $("#qrcode_token").val();
	if(!token) {
		showQrType("invalid","二维码已失效");
		clearInterval(timer_qr);
		return;
	}
	var params = {token:token};
	$.ajax({
		url:_DZSWJ_URL+'/sso/swryHandler?method=processQrcodeStatus',
		type:'post',
		data:params,
		async:true,
		dataType:"json",
		success:function(json) {
			var code = json.CODE;
			if("0000" == code) {
				var zt = json.DATA;
				if(zt == "101") {
					showQrType("besure","扫码成功，请在手机上确认");
					qr_count = 240;
				} else if(zt == "102") {
					$("#loginmode").val("06");
					showQrType("besure","认证成功");
					var mess = json.MESS;
					var txcode = json.TSCODE;
					logintsxx(txcode, mess);
					clearInterval(timer_qr);
					logintsxx(txcode, mess);
				} else if(zt == "103"){
					layerHandler.alert("扫码认证失败！");
					showQrType("invalid","扫码认证失败");
					clearInterval(timer_qr);
				}
			} else if("9993" == code){
				showQrType("invalid","二维码已失效");
				clearInterval(timer_qr);
			} else if("9992" == code){
				getCode();
				$(".login_qrcode_yzm").hide();
				clearInterval(timer_qr);
				showQrType("valid");
				layerHandler.alert("验证码检验不通过，请重新验证！");
			} else {//发生各种异常
				clearInterval(timer_qr);
				showQrType("invalid","二维码获取异常");
				layerHandler.alert("二维码获取异常，请手动刷新");
			}
		},
		error:function(data) {
			getCode();
			layerHandler.alert("调用后台服务失败，失败信息："+JSON.stringify(data));
		}
	})
}


var qr_count=240,timer_qr;
function queryQrStatus(){
	timer_qr = setInterval(function(){
		qr_count-=2;
		processQrStatus();
		if(qr_count <= 0){
			showQrType("invalid","二维码已失效");
			clearInterval(timer_qr);
		}
	},2000)
}
function showQrType(type,text){
	if(type){
		$(".qrcode_besure").hide();
		$(".qrcode_valid").hide();
		$(".qrcode_invalid").hide();
		if(text){
			$(".qrcode_"+type).find(".qrtit").html(text);
		}
		$(".qrcode_"+type).show();
	} 
}
function hideQrcode() {
	$(".qrcode_besure").hide();
	$(".qrcode_valid").hide();
	$(".qrcode_invalid").hide();
}

