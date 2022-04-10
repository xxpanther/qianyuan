(function () {
var _JsgxcaBase = function(){
}
_JsgxcaBase.prototype.showDebugInfo = 0; //是否显示调试信息 0：不显示 1：显示
_JsgxcaBase.prototype.isGxca = false; //是否已安装国信CA助手并成功加载
_JsgxcaBase.prototype.caIndex = 0;
_JsgxcaBase.prototype.gxcaPorts = ['20194','42000','42001','42002','42003'];

/*判断是否IE浏览器
 *@method isIE
 *@for jsgxca.base.js
 *@param 无
 *@return {boolean} 是否IE浏览器
*/
_JsgxcaBase.prototype.isIE = function()  {
	var isIEof11 = JsgxcaBase.isIE11();

	return ((navigator.appName.indexOf("Microsoft Internet Explorer") != -1 && document.all) || isIEof11);
}

/*判断是否IE11浏览器
 *@method isIE11
 *@for jsgxca.base.js
 *@param 无
 *@return {boolean} 是否IE11浏览器
*/
_JsgxcaBase.prototype.isIE11 = function()  {
	var trident = navigator.userAgent.split(";")[2];
	var trident64 = navigator.userAgent.split(";")[3];
	if (trident == null && trident64 == null) {
		//alert("trident is null");
		return false;
	}
	var isx86 = false;
	var isx64 = false;
	if (trident != null) {
		isx86 = navigator.userAgent.split(";")[2].toLowerCase().indexOf("trident") == "-1" ? false : true;
	}
	if (trident64 != null) {
		isx64 = navigator.userAgent.split(";")[3].toLowerCase().indexOf("trident") == "-1" ? false : true;
	}
	return isx86 || isx64;
}

_JsgxcaBase.prototype.init = function()  {
	if (JsgxcaBase.isIE()) {
		//判断为IE浏览器,加载国信控件
		if (typeof (gxcaSign) != 'object') {
			document.write('<object classid="CLSID:438165E9-3044-4F18-887C-A39135933215" id="gxcaSign">');
			document.write('</object>');
			gxcaSign.Debug_ = JsgxcaBase.showDebugInfo;
			$("#gxcaSign").hide();
		}
		if (typeof (gxcaVerify) != 'object') {
			document.write('<object classid="CLSID:89649286-8C66-49FF-8BFC-2EC61E0476AB" id="gxcaVerify">');
			document.write('</object>');
			gxcaVerify.Debug_ = JsgxcaBase.showDebugInfo;
			$("#gxcaVerify").hide();
		}
		if (typeof (gxcaCrypt) != 'object') {
			document.write('<object classid="CLSID:4211CB88-6C1F-4F7F-A9EA-375DB18D34C4" id="gxcaCrypt">');
			document.write('</object>');
			gxcaCrypt.Debug_ = JsgxcaBase.showDebugInfo;
			$("#gxcaCrypt").hide();
		}
		if (typeof (gxcaCert) != 'object') {
			document.write('<object classid="CLSID:CDA91627-B66A-4F69-A3B6-94612F6D9A96" id="gxcaCert">');
			document.write('</object>');
			gxcaCert.Debug_ = JsgxcaBase.showDebugInfo;
			$("#gxcaCert").hide();
		}
	}
	if(!JsgxcaBase.isIE()){
		JsgxcaBase.getGxcaPort();
	}
}
_JsgxcaBase.prototype.isExistGxca = function()  {
	if ((document.all.gxcaSign == undefined || document.all.gxcaSign.object == null)
			&& (document.all.gxcaVerify == undefined || document.all.gxcaVerify.object == null)
			&& (document.all.gxcaCrypt == undefined || document.all.gxcaCrypt.object == null)
			&& (document.all.gxcaCert == undefined || document.all.gxcaCert.object == null)) {
			//国信websocket接口不存在或者状态异常,并且国信控件没有在页面加载
		return false;
	}else{
		return true;
	}
}

/*判断证书颁发者是否是国信CA
*@method isGxcaCert
*@for jsgxca.base.js
*@param issuer 证书颁发者
*@return {boolean} 证书颁发者是否是国信CA
*/
_JsgxcaBase.prototype.isGxcaCert = function(issuer) {
	var ret = false;
	if (issuer.indexOf("GXCA RSA TEST") > -1 || issuer.indexOf("GXCA SM2 TEST") > -1
		|| issuer.indexOf("GXCA_CA_SM2") > -1 || issuer.indexOf("GXCA_CA_RSA") > -1
		|| issuer.indexOf("JSGXCA_SM2") > -1 || issuer.indexOf("JSGXCA_RSA") > -1
		|| issuer.indexOf("GXCA_RSA") > -1) {
		ret = true;
	}
	return ret;
}

//jsca接口函数begin
_JsgxcaBase.prototype.getGxcaPort = function(){
	JsgxcaBase.isGxca = false;
	sessionStorage.removeItem("gxcaPort");
	JsgxcaBase.loopCaPort();
	var hport = setInterval(function(){
		if(JsgxcaBase.getGxcaPortBySession()){
			JsgxcaBase.isGxca = true;
			clearInterval(hport);
		}else if(JsgxcaBase.caIndex >= 5){
			JsgxcaBase.isGxca = false;
			clearInterval(hport);
		}
	},1000);
}
_JsgxcaBase.prototype.loopCaPort = function(){
	if(JsgxcaBase.caIndex >= JsgxcaBase.gxcaPorts.length) {
		return false;
	}
	var url = 'http://127.0.0.1:' + JsgxcaBase.gxcaPorts[JsgxcaBase.caIndex] + "/caclient"
	JsgxcaBase.checkPort(url).then(function(data){
		//alert(JSON.stringify(data));
		//console.log("[loopCaPort]data.code = "+data.code);
		if(data.code == "success"){
			//console.log("gxcaPorts[caIndex] = "+JsgxcaBase.gxcaPorts[JsgxcaBase.caIndex]);
			JsgxcaBase.saveGxcaPortBySession(JsgxcaBase.gxcaPorts[JsgxcaBase.caIndex]);
		}else{
			JsgxcaBase.caIndex++;
			JsgxcaBase.loopCaPort();
		}
	});
}
_JsgxcaBase.prototype.saveGxcaPortBySession = function(caPort){
	sessionStorage.setItem("gxcaPort", caPort);
}
_JsgxcaBase.prototype.getGxcaPortBySession = function(){
	return sessionStorage.getItem("gxcaPort");
}
_JsgxcaBase.prototype.checkPort = function(url){
	var dtd = $.Deferred();
	$.ajax({
		type : "post",
		dataType:'json',
		url: url,
		data: JSON.stringify({"url":"SOF_GetVersion"}),
		cache: false
	}).then(function(data){
		if(data.resultCode == "0"){
			dtd.resolve({code:"success"});
		}else{
			dtd.resolve({code:"fail"});
		}        	    	
	}, function(){
		dtd.resolve({code:"fail"});
	});
	return dtd.promise()
}      
//jsca接口end

//gxca控件接口begin

_JsgxcaBase.prototype.errMsgEnmu = {
	"0xE0000013" : "证书格式错误",
	"0xE0000014" : "内存不足",
	"0xE0000015" : "打开文件失败",
	"0xE0000016" : "文件格式错误",
	"0xE0000017" : "密钥不存在",
	"0xE0000018" : "未设置服务器",
	"0xE0000019" : "未设置加密文件保存路径",
	"0xE0000020" : "参数类型错误",
	"0xE0000022" : "无效的PIN码",
	"0xE0000024" : "Hash 没有初始化",
	"0xE0000025" : "摘要错误",
	"0xE0000026" : "加载国密库失败",
	"0xE0000027" : "设备不存在",
	"0xE0000028" : "应用未打开",
	"0xE0000029" : "容器未打开",
	"0xE0000030" : "base64编解码错误",
	"0xE0000031" : "证书项不存在",
	"0xE0000032" : "签名失败",
	"0x8010006E" : "用户取消操作",
	"0xE0000034" : "设备未连接",
	"0xE0000035" : "PKCS7签名失败",
	"0xE0000036" : "验签失败",
	"0xE0000037" : "P7数据错误",
	"0xE0000038" : "未设置sessionkey",
	"0xE0000039" : "加密失败",
	"0xE0000040" : "解密失败",
	"0xE0000041" : "获取证书失败",
	"0xE0000042" : "申请内存失败",
	"0xE0000043" : "文件不存在",
	"0xE0000044" : "写文件失败",
	"0xE0000045" : "网络未连接",
	"0xE0010000" : "没有证书",
	"0xE0F000C8" : "成功",
	"0xE000FFFF" : "未使用",
	"0xE0010000" : "没有证书",
	"0xE0010001" : "指纹长度错误",
	"0xE0010002" : "指纹错误,给定的值不是一个指纹",
	"0xE0010004" : "给定的OID项不存在",
	"0xE0010005" : "不是国信CA的证书",
	"0xE0010006" : "不是加密证书",
	"0xCDCDCDCD" : "1 如未下载证书助手，请下载并安装\n2 如已下载，请检测并修复 \n3 如仍未解决请尝试重启电脑或联系客服"
}
_JsgxcaBase.prototype.getGxcaErrMsg = function(code) {
	var err = new Error();
	if(code < -999){
		//控件数字长度溢出返回负值处理
		code = 4294967296+code;
	}
	err.name = "0x" + parseInt(code).toString(16).toUpperCase();
	err.message = JsgxcaBase.errMsgEnmu[err.name];
	if (err.message == null || err.message == undefined || err.message == "") {
		err.message = "错误码[" + err.name + "]\n1 如未下载证书助手，请下载并安装\n2 如已下载，请检测并修复 \n3 如仍未解决请联系客服";
	}
	return err;
}
window.JsgxcaBase = new _JsgxcaBase();
JsgxcaBase.init();
})();