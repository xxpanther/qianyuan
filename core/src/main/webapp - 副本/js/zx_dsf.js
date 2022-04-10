function loadCzzx(nsrsbh, nsrmc, appname) {
	$("#czzx_other").click(function() {
		window.open("https://www.nsrfww.com/index.php?act=xiaoneng&nsrsbh=" + nsrsbh + "&nsrmc=" + nsrmc + "&app_key=" + appname);
	});
	//$("#czzx_dsf").css("display","block");
}

function loadZxzx(nsrsbh, nsrmc) {
	$("#czzx_main").click(function() {
		window.open("https://www.nsrfww.com/index.php?act=xiaoneng&nsrsbh=" + nsrsbh + "&nsrmc=" + nsrmc);
	});
	//$("#zxzx_dsf").css("display","block");
}