var lock = true;
var nevalidate;
var neinstance;
var layer_index;
window.onload = function() {
	if (document.readyState == "complete") {
		if ($("#username").val() == "") {
			$("#username").focus();
		} else {
			$("#password").focus();
		}
	}
};
$(document).ready(function() {
	$("#username").keydown(function(e) {
		var keycode = e.which;
		if (keycode == 13&&lock) {
			var username = $("#username").val();
			if (username == null || username == '') {
				layerHandler.alert("请输入登录帐号！");
				return;
			}
			$("#password").focus();
			return false;
		}
	});
	$("#password").keydown(function(e) {
		var keycode = e.which;
		if (keycode == 13&&lock) {
			var password = $("#password").val();
			if (password == null || password == '') {
				layerHandler.alert("请输入密码！");
				return;
			}
			return false;
		}
	});
	$("#tab li").click(function(){
		var _id = this.id;
		if(_id=='UserloginMsg') {
			$('.login_btn').hide();
			$("#loginmode").val("05");
   			$(".yhmmsgclass").css("display","block");
   			$(".yhmclass").css("display","none");
   			$(".caclass").css("display","none");
   			clearLoginVal(1);
   			$(this).addClass("on").siblings().removeClass("on");
		}else if(_id=='Userlogin'){
			showCommonDialog(".page10");
   			$("#loginmode").val("00");
   			$(".yhmclass").css("display","block");
   			$(".yhmmsgclass").css("display","none");
   			$(".caclass").css("display","none");
   			$('.login_btn').show();
   			$("#username").val("");
   			$("#password").val("");
   			$(this).addClass("on").siblings().removeClass("on");
   		}else if(_id=='CAlogin'){
   			$("#loginmode").val("01");
   			$(".yhmmsgclass").css("display","none");
   			$(".yhmclass").css("display","none");
   			$(".caclass").css("display","block");
   			$('.login_btn').show();
   			$(this).addClass("on").siblings().removeClass("on");
   		}
	});
	$("#gdstab_tab li").click(function(){
		$("#gdstab_tab li").removeClass("active_user");
		$(".usertab").hide();
		$(this).addClass("active_user");
		$("."+$(this).attr("tab")).show();
		if($(this).attr('tab') == 'qyPage' && $("#UserloginMsg").hasClass("on")){
			$('.login_btn').hide()
		} else {
			$('.login_btn').show();
		}
	});
	$("#backHome").click(function(){
		window.location.href="http://etax.jiangsu.chinatax.gov.cn";
	});
	$("#continueLogin").click(function(){
		layer.closeAll();
		logincheck();
	});
	$("#nsrxxContinue").click(function(){
		var djxhs = $("#nsrxxtbody input[name='nsrxxradio']:checked").val();
		if (djxhs == undefined || djxhs == "") {
			layerHandler.alert("请选择需要登录的企业");
			return;
		}
		var djxharr = djxhs.split(",");
		$("#djxh").val((djxharr[0]=='undefined'||djxharr[0]=="")?"":djxharr[0]);
		$("#dsdjxh").val((djxharr[1]=='undefined'||djxharr[1]=="")?"":djxharr[1]);
		$("#password").val(sha256_digest($("#password").val() + "{" + $("#username").val() + "}"));
		layer.closeAll();
		showLoading(true);
		$("#formid").submit();
	});
	if(_returncode!=""&&_returncode!="0000"){
		layerHandler.alert(_returnmess);
	}
});

function onclickCheckBox(){
    if($("#check").attr('checked')){
    	$("#check").attr('checked',true);
    	ZRUtil.setCookie("gsName","true");
    }else{
      	$("#check").attr('checked',false);
      	ZRUtil.setCookie("gsName","false");
    }
}
//$(".t1").show();
function showLoginDialog(){
	$('.login_qrcode_yzm').show();
}


function mmqdjy(str){
	var unreg=/^(\d+|[a-zA-Z]+)$/;
    if(unreg.test(str)){
        return "1";
    }
    if(str.length < 8){
        return "1"; 
    }else{
    	return "0";
    }
}

$(function(){
	$(".btn_submit").click(function(){
		if ($(".zrrPage").css("display")=='block') {
			zrrlogin();
			return;
		} else if($(".dlyhPage").css("display")=='block') {
			dlyhlogin();
			return;
		}
		$("#formid").attr("action",_DZSWJ_URL+'/sso/login');
		var params = {};
		var loginmode = $("#loginmode").val();
		var _pass = "";
		if (loginmode == "00") {
			$("#username").val($("#username").val().replace(/^\s+|\s+$/g,""));
			var _username = $("#username").val();
			_pass = $("#password").val();
			if (_username == undefined || _username == "") {
				layerHandler.alert("请输入登录帐号");
				return;
			} else if (_pass == undefined || _pass == "") {
				layerHandler.alert("请输入密码");
				return;
			} else if (captchcheck=="1" && (nevalidate == undefined || nevalidate == "")) {
				layerHandler.alert("请先完成验证码确认");
				return;
			}
			params['loginmode'] = loginmode;
			params['username'] = _username;
			params['password'] = sha256_digest(_pass + "{" + _username + "}");
			params['dsmm'] = $.md5(_pass);
			params['jdmm'] = mmqdjy(_pass);
		} else {
			if (captchcheck=="1" && (nevalidate == undefined || nevalidate == "")) {
				layerHandler.alert("请先完成验证码确认");
				return;
			}
			document.getElementById('div_calogin').innerHTML = '<OBJECT id="zjcaObj" classid="CLSID:3C474273-7F8B-4690-8C34-855C4528658D" style="display:none"></OBJECT>';
			var obj = CASigner.cacheck(zjcaObj,_ca_login_time)
			if (obj == null||obj["signature"]==null) {
				return;
			}
			/*_pass = $("#password_ca").val();
			if(_pass == undefined || _pass == ""){
				layerHandler.alert("请输入密码");
				return;
			}*/
			$("#loginmode").val(obj["loginmode"]);
			params['loginmode'] = obj["loginmode"];
			var causername = obj["causername"];
			params['causername'] = causername;
			params['cacert'] = obj["cacert"];
			params['signature'] = obj["signature"];
			//params['password'] = sha256_digest(_pass + "{" + causername + "}");
		}
		params['nevalidate'] = nevalidate;
		showLoading(true);
		$.ajax({
			url:_DZSWJ_URL+'/sso/swryHandler?method=yjLogin',
			type:'post',
			data:params,
			async:true,
			dataType:"json",
			success:function(json) {
				var code = json.CODE;
				var mess = json.MESS;
				if(code=="0000"){
					var dlm = json.DLM;
					if(dlm == undefined || dlm == ""){
						var txcode = json.TSCODE;
						logintsxx(txcode,mess);
					}else{
						params['password'] = sha256_digest(_pass + "{" + dlm + "}");
						$.ajax({
							url:_DZSWJ_URL+'/sso/swryHandler?method=preLogin',
							type:'post',
							data:params,
							async:true,
							dataType:"json",
							success:function(json) {
								var code = json.CODE;
								var mess = json.MESS;
								if(code=="0000"){
									var mess = json.MESS;
									var txcode = json.TSCODE;
									logintsxx(txcode,mess);
								}else{
									getCode();
									layerHandler.alert(mess);
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
				}else{
					getCode();
					layerHandler.alert(mess);
					showLoading(false);
				}
			},
			error:function(data) {
				getCode();
				layerHandler.alert("调用后台服务超时，超时信息："+JSON.stringify(data));
				showLoading(false);
			}
		});
		
	});
});
function logintsxx(code,mess){
	debugger
	if(code=="0"){
		showLoading(false);
		$("#continueLogin").hide();
		$("#displayInfo").hide();
		$(".page2 .message").html(mess);
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
		    	dom: ".page2"
		    },
			end:function(){
				getCode();
			}
		});
	}else if(code=="1"){
		if(ZRUtil.getCookies("gsName")=="true"){
			logincheck();
			return;
		}
		showLoading(false);
		$("#continueLogin").show();
		$("#displayInfo").show();
		$(".page2 .message").html(mess);
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
		    	dom: ".page2"
		    },
			end:function(){
				getCode();
			}
		});
	}else{
		logincheck();
	}
}

function logincheck(){
	var loginmode = $("#loginmode").val();
	if("05" == loginmode || "06" == loginmode){
		loginCheckSyz();
		return;
	}
	showLoading(true);
	$.ajax({
		url:_DZSWJ_URL+'/sso/swryHandler?method=checklogin',
		type:'post',
		async:true,
		dataType:"json",
		success:function(json) {
			var code = json.CODE;
			var mess = json.MESS;
			if(code=="0000"){
				var messobj = JSON.parse(mess);
				if(messobj.length==1){
					var djxh = messobj[0].djxh;
					var dsdjxh = messobj[0].dsdjxh;
					$("#djxh").val((djxh=='undefined'||djxh=="")?"":djxh);
					$("#dsdjxh").val((dsdjxh=='undefined'||dsdjxh=="")?"":dsdjxh);
					$("#password").val(sha256_digest($("#password").val() + "{" + $("#username").val() + "}"));
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
					layerHandler.alert("纳税人登记信息为空");
					showLoading(false);
				}
			}else{
				$("#password").val("");
				getCode();
				layerHandler.alert(mess);
				showLoading(false);
			}
		},
		error:function(data) {
			$("#password").val("");
			getCode();
			layerHandler.alert("调用后台服务超时，超时信息："+JSON.stringify(data));
			showLoading(false);
		}
	});
}

function getCode(){
	if(captchcheck=="1"){
		nevalidate='';
		neinstance.refresh();
	}
}

function showLoading(flag){
	if(flag){
		lock = false;
		$("#loading").show();
		layer_index = layer.load();
		$(".close_logindiv").hide();
		$(".btn_submit").val("登录中...");
		$(".login_msg_btn").val("登录中...");
	}else{
		lock = true;
		$("#loading").hide();
		layer.close(layer_index);
		$(".close_logindiv").show();
		$(".btn_submit").val("登  录");
		$(".login_msg_btn").val("登  录");
	}
}
function showCommonDialog(id) {
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
	    	dom: id
	    },
	    end:function(){
				getCode();
			}
	});
}
function checkTel(phone) {
	return (/^[1][3-9][0-9]{9}$/.test(phone));
}