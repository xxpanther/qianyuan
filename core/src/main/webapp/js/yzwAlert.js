
function showDlyhPwdLogin() {
	$("#gdstab_tab li").removeClass("active_user");
	$(".usertab").hide();
	$("#gdstab_tab li[tab='dlyhPage']").addClass("active_user");
	$(".dlyhtab").show();
	$("#dllogin_mode").val("40");
	$(".dlyh_class").css("display","block");
	$(".dlyh_caclass").css("display","none");
	$(".dlyhPage").show();
	$("#dlyhlogin").addClass("on").siblings().removeClass("on");
}

function showDlyhCALogin() {
	$("#gdstab_tab li").removeClass("active_user");
	$(".usertab").hide();
	$("#gdstab_tab li[tab='dlyhPage']").addClass("active_user");
	$(".dlyhtab").show();
	$("#dllogin_mode").val("41");
	$(".dlyh_class").css("display","none");
	$(".dlyh_caclass").css("display","block");
	$(".dlyhPage").show();
	$("#dlCalogin").addClass("on").siblings().removeClass("on");
}
function showNormalCALogin(){
	$("#loginmode").val("01");
	$(".yhmmsgclass").css("display","none");
	$(".yhmclass").css("display","none");
	$(".caclass").css("display","block");
	$("#CAlogin").addClass("on").siblings().removeClass("on");
}
function showNormalPwdLogin(){
	/*$('.login_btn').hide();
	$("#loginmode").val("05");
	$(".yhmmsgclass").css("display","block");
	$(".yhmclass").css("display","none");
	$(".caclass").css("display","none");
	$("#UserloginMsg").addClass("on").siblings().removeClass("on");*/
	$("#loginmode").val("00");
	$(".yhmmsgclass").css("display","none");
	$(".yhmclass").css("display","block");
	$(".caclass").css("display","none");
	$("#Userlogin").addClass("on").siblings().removeClass("on");
}


_returnloginmode = "40";
if(_returnloginmode!=""&&_returnloginmode!="00" && _returnloginmode.substr(0,1) != "4"){
	showNormalCALogin();
}else{
	showNormalPwdLogin();
}
/*if(_returnloginmode!=""&&_returnloginmode!="00"){
	var return_mode_prefix = _returnloginmode.substr(0,1);
	if(return_mode_prefix == "0"){
		showNormalCALogin();
	}else if(return_mode_prefix == "4"){
		$("#loginmode").val("00");
		if(_returnloginmode == "40"){
			showDlyhPwdLogin();
		}else{
			showDlyhCALogin();
		}
	} else {
		showNormalPwdLogin();
	}
}else{
	showNormalPwdLogin();
}*/

//placeholder
$(".login_input").find(".placeholder").click(function(){
	$(this).siblings("input").focus();
})
$(".login_input").find("input").focus(function(){
	if($(this).val()){
		$(this).siblings(".placeholder").hide();
	} else {
		$(this).siblings(".placeholder").show();
	}
})
$(".login_input").find("input").blur(function(){
	if($(this).val()){
		$(this).siblings(".placeholder").hide();
	} else {
		$(this).siblings(".placeholder").show();
	}
})
$(".login_input").find("input").change(function(){
	if($(this).val()){
		$(this).siblings(".placeholder").hide();
	} else {
		$(this).siblings(".placeholder").show();
	}
})
$(".login_input").find("input").keydown(function(){
	if($(this).val()){
		$(this).siblings(".placeholder").hide();
	} else {
		$(this).siblings(".placeholder").show();
	}
})
$(".login_input").find("input").keyup(function(){
	if($(this).val()){
		$(this).siblings(".placeholder").hide();
	} else {
		$(this).siblings(".placeholder").show();
	}
})

$(".login_input input").each(function(i){
	if($(this).val()){
		$(this).siblings(".placeholder").hide();
	} else {
		$(this).siblings(".placeholder").show();
	}
});

if(captchcheck=="1" ){
	// 验证码组件初始化
     initNECaptcha({
         captchaId: '1a623022803d4cbc86fa157ec267bb36',
         element: '#captcha_div',
         mode: 'float',
         width: '310px',
         onVerify: function(err, ret){
           if(!err){
        	   nevalidate = ret['validate'];
           }
         }
     }, function (instance) {
    	 neinstance = instance;
     }, function (err) {
    	 layerHandler.alert("验证码服务加载失败，请刷新页面后重试。");
     })
}

$(document).ready(function() {
	$("#yjxf_download").attr('href',_DZSWJ_URL+'/r/cms/software/jsdzswj_yjxf.rar');
	$("#yjxf_download2").attr('href',_DZSWJ_URL+'/r/cms/software/jsdzswj_yjxf.rar');
	$("#zjcaqd_download").attr('href',_DZSWJ_URL+'/r/cms/software/jsdzswj_zjca.rar');
	$("#yjxf_download").attr('download',_DZSWJ_URL+'一键修复工具.rar');
	$("#yjxf_download2").attr('download',_DZSWJ_URL+'一键修复工具.rar');
	$("#zjcaqd_download").attr('download',_DZSWJ_URL+'总局CA驱动.rar');
});