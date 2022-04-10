/* $("[href]").each(function() {
	$(this).attr("href", $(this).attr("href").replace(/\/main\//, ""))
})
$("[src]").each(function() {
	$(this).attr("src", $(this).attr("src").replace(/\/main\//, ""))
}) */
function getHtmlData(){
	var url = window.location.href;
	var str = url.split("#")[0].split("?")[1];
	var data = {};
	if(str){
		var arr = str.split("&");
		for(var i = 0; i < arr.length; i++){
			var arr1 = arr[i].split("=");
			data[arr1[0]] = arr1[1]||"";
		}
	}
	return data;
}
var showLogin = getHtmlData().showLogin;
if(showLogin == "1"){
	$(".loginshow").show();
}
var islogin = false;
addHref(".tzgg", _DZSWJ_URL + "/jx/tzgg/", false);
addHref(".service", _DZSWJ_URL + "/jx/index.html", false);
addHref(".czzx", "https://www.nsrfww.com/index.php?act=xiaoneng", false);
addHref(".hjjc", _DZSWJ_URL + "/sso/static/check.html?v=1", false);
addHref(".csj_index", "https://etax.shanghai.chinatax.gov.cn/wszx-web/bszm/apps/views/beforeLogin/csj/csj.html", false);
addHref(".download","http://jiangsu.chinatax.gov.cn/col/col15956/index.html", false);
addHref(".helper","https://www.kancloud.cn/jsswdzswj/dzswjczgc/843001", false);
addHref(".go_login0", _DZSWJ_URL + "/portal/index.do?tab=wdxx", true);
addHref(".go_login1", _DZSWJ_URL + "/portal/index.do?tab=wybs", true);
addHref(".go_login2", _DZSWJ_URL + "/portal/index.do?tab=wycx", true);
addHref(".go_login3", _DZSWJ_URL + "/portal/index.do?tab=hdzx", true);
addHref(".go_portal", _DZSWJ_URL + "/portal/index.do", true);
function addHref(selector, url, flag) {
	var linkEle = document.querySelectorAll(selector);
	for ( var i = 0; i < linkEle.length; i++) {
		if (flag) {
			linkEle[i].onclick = function() {
				isLogin();
				if(islogin){
					//登录成功，url为null并且没有刷新界面时即刷新当前登录页面
					if(url==null){
						if(_nsrmc == null || _nsrmc == ''){
							window.location.href = _DZSWJ_URL+'/sso/login';
						}
					}else{
						window.location.href = url;
					}
				} else {
					if(url==null){
						$("#redirectUrl").val("");
					}else{
						$("#redirectUrl").val(encodeURI(url));
					}
					$(".loginshow").show();
				}
			}
		} else {
			linkEle[i].onclick = function() {
				window.open(url);
			}
		}
		linkEle[i].style.cursor = "pointer";
	}
}
function isLogin(){
	var params = {};
	params['ca_login_time'] = _ca_login_time;
	$.ajax({
		url : _DZSWJ_URL+'/sso/swryHandler?method=isLogin',
		type : 'post',
		dataType : 'json',
		data:params,
		async:false,
		cache : false,
		timeout : 10000,
		success : function(data) {
			if (data && data.CODE && data.CODE=='0000') {
				islogin = true;
			} else {
				document.querySelectorAll(".login")[0].innerHTML = '<div class="go_login"><img src="'+_DZSWJ_URL+'/sso/static/img/login.png" ><p>登录</p></div>';
				addHref(".go_login", _DZSWJ_URL + "/portal/index.do", true);
				islogin = false;
			}
		},
		error : function() {
			document.querySelectorAll(".login")[0].innerHTML = '<div class="go_login"><img src="'+_DZSWJ_URL+'/sso/static/img/login.png" ><p>登录</p></div>';
			addHref(".go_login", _DZSWJ_URL + "/portal/index.do", true);
			islogin = false;
		}
	});
}
function getLoginInfo() {
	if(_nsrmc == null || _nsrmc == ''){
		document.querySelectorAll(".login")[0].innerHTML = '<div class="go_login"><img src="'+_DZSWJ_URL+'/sso/static/img/login.png" ><p>登录</p></div>';
		addHref(".go_login", _DZSWJ_URL + "/portal/index.do", true);
		islogin = false;
	}else{
		document.querySelectorAll(".login")[0].innerHTML = "<p><span class='go_login'>您好，" + _nsrmc
			+ "</span><span> | </span><span class='go_logout'>退出</span></p>";
		addHref(".go_logout", _DZSWJ_URL + "/sso/logout", true);
		addHref(".go_login", _DZSWJ_URL + "/portal/index.do", true);
		islogin = true;
	}
}
$(function() {
	getLoginInfo();
	/*if(!(localStorage.getItem("notice") == "1")){
		localStorage.setItem("notice","1")*/
		if(_nsrmc==null||_nsrmc==''){
			var isShowWxts = true;
			if(isShowWxts){
				$(".pageWxtsShow").show();
				$(".pageWxts iframe").attr("src",_DZSWJ_URL+"/sso/static/wxts.html?v=1");
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
						dom: ".pageWxts"
					},
					end:function(){
					}
				});
				$(".xubox_close").click(function(){
					$(".pageWxtsShow").hide();
				})
			}
		}
	/*}*/
});
$(".close_logindiv").click(function(){
	$(".loginshow").hide();
})