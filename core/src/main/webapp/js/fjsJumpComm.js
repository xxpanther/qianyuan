function zfslhsbJump(mess,btnName,width,heigth,tzClick){
	layerHandler.confirmZfslhsb(mess,"提示信息",btnName,width,heigth,tzClick,noSbTs); 
}
function noSbTs(){
	
}
function checkIsxfssb(){
	var sssq_q = $("#sssq_q").val();
	var sssq_z = $("#sssq_z").val();
	//点击报表Lists校验是否初始化
	$.etaxAjax("sbInitAction.action?sign=issftzsb", {
		"sssq_q" :sssq_q,
		"sssq_z" : sssq_z,
		"jsbz": "xfs"
	}, function(data) {
		debugger;
		var istosbbz = data["istosbbz"];
		if(istosbbz == "1"){
			//跳转消费税申报
			zfslhsbJump("为便利申报,您当前存在消费税税种认定且当期未申报,是否跳转消费税申报?",'消费税申报',"430px","190px",xfssbJump);
		}else{
			//跳转附加税 检索是否存在附加税税种认定
			checkIsfjssb();
		}
	});
}
function checkIsfjssb(){
	var sssq_q = $("#sssq_q").val();
	var sssq_z = $("#sssq_z").val();
	//点击报表Lists校验是否初始化
	$.etaxAjax("sbInitAction.action?sign=issftzsb", {
		"sssq_q" :sssq_q,
		"sssq_z" : sssq_z,
		"jsbz": "fjs"
	}, function(data) {
		debugger;
		var istosbbz = data["istosbbz"];
		if(istosbbz == "1"){
			//跳转附加税申报
			zfslhsbJump("为便利申报,您当前存在附加税税种认定且当期未申报,是否跳转附加税申报?",'附加税申报',"430px","190px",fjssbJump);
		}else{
			//跳转文化事业建设费  检索是否存在文化事业建设费申报
			checkIswhsyjsfsb();
		}
	});
}
function checkIswhsyjsfsb(){
	var sssq_q = $("#sssq_q").val();
	var sssq_z = $("#sssq_z").val();
	//点击报表Lists校验是否初始化
	$.etaxAjax("sbInitAction.action?sign=issftzsb", {
		"sssq_q" :sssq_q,
		"sssq_z" : sssq_z,
		"jsbz": "whsyjsf"
	}, function(data) {
		debugger;
		var istosbbz = data["istosbbz"];
		if(istosbbz == "1"){
			//跳转文化事业建设费申报
			zfslhsbJump("为便利申报,您当前存在文化事业建设费税种认定且当期未申报,是否跳文化事业建设费申报?",'文化事业建设费申报',"430px","190px",whsyjsfsbJump);
		}else{
			//如果没有文化事业建设费申报或者已经申报 则跳转税款缴纳
			zfslhsbJump("为便利申报,是否跳转税费缴纳（含申报及更正） ?",'税费缴纳',"330px","160px",sfjnJump);
		}
	});
}
//消费税申报
function xfssbJump(){
 	window.open(url_sb('030121110'));	
}
//文化事业建设费申报
function whsyjsfsbJump(){
 	window.open(url_sb('030121615'));	
}
//附加税申报
function fjssbJump(){
	 window.open(url_sb('030121310'));	
}
//税费缴纳
function sfjnJump(){
	window.open(url_sb('030122010'));
}
function url_sb(app_bh){
	var host = window.location.host.split(":")[0];
	var url = "";
	var sssq_q = $("#sssq_q").val();
	var sssq_z = $("#sssq_z").val();
	 var goUtl = "&sssq_q="+sssq_q + "&sssq_z="+ sssq_z + "&yrdbz=must";
	if(host.indexOf("etax")<0){
		//测试环境
		url="http://77.12.56.120/portal/include_sb.do?app_bh="+app_bh+"" + goUtl;
	}else{
		url="https://etax.jiangsu.chinatax.gov.cn/portal/include_sb.do?app_bh="+app_bh+"" + goUtl;
	}
	return url;
}